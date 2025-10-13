import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.pawdna.org',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      throw new Error('Authentication required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      throw new Error('Invalid authentication');
    }

    console.log('Authenticated user:', user.id);

    // Check for existing active subscription
    const { data: existingSub } = await supabaseClient
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (existingSub) {
      throw new Error('User already has an active subscription');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { priceId, customerId, subscriptionType } = await req.json();
    const userId = user.id; // Use authenticated user ID

    console.log('Creating subscription:', { priceId, customerId, subscriptionType, userId });

    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        metadata: { userId },
      });
    }

    // Create subscription with 7-day trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 7,
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    // Calculate trial period
    const trialStart = new Date();
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 7);

    // Store subscription in database
    const { data: subscriptionData, error: dbError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: userId,
        subscription_type: subscriptionType,
        status: 'active',
        started_at: trialStart.toISOString(),
        is_trial: true,
        trial_start: trialStart.toISOString(),
        trial_end: trialEnd.toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error storing subscription:', dbError);
    }

    console.log('Subscription created:', subscription.id);

    // Audit log: Subscription creation
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await serviceClient.from('security_audit_log').insert({
      user_id: userId,
      action: 'subscription_created',
      table_name: 'subscriptions',
      details: {
        subscription_id: subscription.id,
        subscription_type: subscriptionType,
        price_id: priceId,
        customer_id: customer.id,
        trial_days: 7
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
