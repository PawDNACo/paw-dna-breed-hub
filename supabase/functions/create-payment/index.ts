import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { rateLimitMiddleware } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
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
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    console.log('Authenticated user:', user.id);

    // Rate limiting: 10 payment creation attempts per 5 minutes per user
    const rateLimitResponse = rateLimitMiddleware(
      user.id,
      { maxRequests: 10, windowMs: 5 * 60 * 1000, keyPrefix: "create-payment" },
      corsHeaders
    );
    if (rateLimitResponse) return rateLimitResponse;

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { type, amount, description, metadata, paymentMethodTypes } = await req.json();

    // Input validation
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }
    if (amount > 1000000) {
      throw new Error("Amount exceeds maximum allowed");
    }

    console.log('Creating payment:', { type, amount, description, metadata });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description,
      metadata: metadata || {},
      payment_method_types: paymentMethodTypes || ['card'],
      automatic_payment_methods: paymentMethodTypes ? undefined : {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    // Audit log: Payment creation
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await serviceClient.from('security_audit_log').insert({
      user_id: user.id,
      action: 'payment_created',
      table_name: 'payment_intents',
      details: {
        payment_intent_id: paymentIntent.id,
        amount: amount,
        type: type,
        description: description
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
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
