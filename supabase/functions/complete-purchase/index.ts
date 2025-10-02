import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Use service role key to bypass RLS for sales creation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { paymentIntentId, petId, buyerId, breederId, salePrice, platformFee, breederEarnings } = await req.json();

    console.log('Completing purchase:', { paymentIntentId, petId, buyerId });

    // Mark pet as unavailable
    const { error: petError } = await supabaseClient
      .from('pets')
      .update({ available: false })
      .eq('id', petId);

    if (petError) {
      console.error('Error updating pet:', petError);
      throw new Error('Failed to update pet status');
    }

    // Create sales record with 72-hour hold (using service role to bypass RLS)
    const { error: saleError } = await supabaseClient
      .from('sales')
      .insert({
        pet_id: petId,
        breeder_id: breederId,
        buyer_id: buyerId,
        sale_price: salePrice,
        platform_fee: platformFee,
        breeder_earnings: breederEarnings,
        payout_status: 'pending',
      });

    if (saleError) {
      console.error('Error creating sale record:', saleError);
      throw new Error('Failed to create sale record');
    }

    console.log('Purchase completed successfully');

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
