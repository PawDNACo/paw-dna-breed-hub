import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { petId, buyerId } = await req.json();

    console.log('Processing pet purchase:', { petId, buyerId });

    // Get pet details
    const { data: pet, error: petError } = await supabaseClient
      .from('pets')
      .select('*, owner_id')
      .eq('id', petId)
      .single();

    if (petError || !pet) {
      throw new Error('Pet not found');
    }

    if (!pet.available) {
      throw new Error('Pet is no longer available');
    }

    const salePrice = pet.price;
    const platformFee = salePrice * 0.15; // 15% platform fee
    const breederEarnings = salePrice * 0.85; // 85% to breeder

    // Create payment intent for full amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(salePrice * 100), // Convert to cents
      currency: 'usd',
      description: `Purchase of ${pet.name} (${pet.breed})`,
      metadata: {
        petId,
        buyerId,
        breederId: pet.owner_id,
        salePrice: salePrice.toString(),
        platformFee: platformFee.toString(),
        breederEarnings: breederEarnings.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        salePrice,
        platformFee,
        breederEarnings,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
