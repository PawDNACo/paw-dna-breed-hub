import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API = 'https://api-m.paypal.com';

async function getPayPalAccessToken() {
  const auth = btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_CLIENT_SECRET')}`);
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { subscriptionType } = await req.json();
    
    // Map subscription types to PayPal plan IDs (you'll need to create these in PayPal dashboard)
    const planIdMap: { [key: string]: string } = {
      'breeder_basic': Deno.env.get('PAYPAL_BREEDER_BASIC_PLAN_ID') || '',
      'breeder_premium': Deno.env.get('PAYPAL_BREEDER_PREMIUM_PLAN_ID') || '',
      'buyer_basic': Deno.env.get('PAYPAL_BUYER_BASIC_PLAN_ID') || '',
      'rehoming': Deno.env.get('PAYPAL_REHOMING_PLAN_ID') || '',
    };

    const planId = planIdMap[subscriptionType];
    if (!planId) {
      throw new Error('Invalid subscription type');
    }

    const accessToken = await getPayPalAccessToken();

    const subscriptionResponse = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          return_url: `${req.headers.get('origin')}/subscription-success`,
          cancel_url: `${req.headers.get('origin')}/subscription-canceled`,
        }
      }),
    });

    const subscriptionData = await subscriptionResponse.json();

    // Audit log
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await serviceClient.from('security_audit_log').insert({
      user_id: user.id,
      action: 'paypal_subscription_created',
      table_name: 'subscriptions',
      details: {
        subscription_id: subscriptionData.id,
        subscription_type: subscriptionType,
        provider: 'paypal'
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return new Response(
      JSON.stringify({ subscriptionId: subscriptionData.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('PayPal subscription creation error:', error);
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
