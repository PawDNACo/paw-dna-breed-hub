import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@14.21.0';

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
      throw new Error('Authentication required');
    }

    // Initialize authenticated Supabase client
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
      throw new Error('Invalid authentication');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { paymentIntentId, petId } = await req.json();

    if (!paymentIntentId || !petId) {
      throw new Error('Missing required parameters');
    }

    console.log('Completing purchase:', { paymentIntentId, petId, userId: user.id });

    // SECURITY: Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment has not succeeded');
    }

    // Extract metadata from payment intent
    const buyerId = paymentIntent.metadata.buyerId;
    const breederId = paymentIntent.metadata.breederId;
    const salePrice = parseFloat(paymentIntent.metadata.salePrice);
    const platformFee = parseFloat(paymentIntent.metadata.platformFee);
    const breederEarnings = parseFloat(paymentIntent.metadata.breederEarnings);

    // SECURITY: Verify authenticated user is the buyer
    if (user.id !== buyerId) {
      console.error('User mismatch:', { authenticated: user.id, buyer: buyerId });
      throw new Error('Unauthorized: User does not match buyer');
    }

    // SECURITY: Verify pet details and breeder match
    const { data: pet, error: petError } = await supabaseClient
      .from('pets')
      .select('id, owner_id, available, price')
      .eq('id', petId)
      .single();

    if (petError || !pet) {
      throw new Error('Pet not found');
    }

    if (!pet.available) {
      throw new Error('Pet is no longer available');
    }

    if (pet.owner_id !== breederId) {
      console.error('Breeder mismatch:', { expected: pet.owner_id, provided: breederId });
      throw new Error('Invalid breeder information');
    }

    // SECURITY: Recalculate fees server-side to prevent manipulation
    const expectedPlatformFee = pet.price * 0.15;
    const expectedBreederEarnings = pet.price * 0.85;

    if (Math.abs(salePrice - pet.price) > 0.01 || 
        Math.abs(platformFee - expectedPlatformFee) > 0.01 ||
        Math.abs(breederEarnings - expectedBreederEarnings) > 0.01) {
      console.error('Price mismatch:', {
        provided: { salePrice, platformFee, breederEarnings },
        expected: { price: pet.price, platformFee: expectedPlatformFee, breederEarnings: expectedBreederEarnings }
      });
      throw new Error('Invalid pricing information');
    }

    // Use service role for the final operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Mark pet as unavailable
    const { error: updateError } = await serviceClient
      .from('pets')
      .update({ available: false })
      .eq('id', petId);

    if (updateError) {
      console.error('Error updating pet:', updateError);
      throw new Error('Failed to update pet status');
    }

    // Create sales record with 72-hour hold (using service role to bypass RLS)
    const { error: saleError } = await serviceClient
      .from('sales')
      .insert({
        pet_id: petId,
        breeder_id: breederId,
        buyer_id: buyerId,
        sale_price: pet.price,
        platform_fee: expectedPlatformFee,
        breeder_earnings: expectedBreederEarnings,
        payout_status: 'pending',
      });

    if (saleError) {
      console.error('Error creating sale record:', saleError);
      throw new Error('Failed to create sale record');
    }

    console.log('Purchase completed successfully for user:', user.id);

    // Audit log: Purchase completion
    await serviceClient.from('security_audit_log').insert({
      user_id: user.id,
      action: 'purchase_completed',
      table_name: 'sales',
      details: {
        payment_intent_id: paymentIntentId,
        pet_id: petId,
        breeder_id: breederId,
        sale_price: pet.price,
        platform_fee: expectedPlatformFee,
        breeder_earnings: expectedBreederEarnings
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Purchase completed. Funds will be available to breeder in 72 hours.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error completing purchase:', error);
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
