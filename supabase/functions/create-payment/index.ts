import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { rateLimitMiddleware } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.pawdna.org',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting: 20 payment creation attempts per 5 minutes per IP
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResponse = rateLimitMiddleware(
      clientIp,
      { maxRequests: 20, windowMs: 5 * 60 * 1000, keyPrefix: "create-payment" },
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
