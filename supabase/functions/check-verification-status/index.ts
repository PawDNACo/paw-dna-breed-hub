import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) throw new Error("User not authenticated");

    // Get profile with verification info
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_identity_session_id, is_verified")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    if (!profile.stripe_identity_session_id) {
      return new Response(
        JSON.stringify({ verified: false, status: "not_started" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Check verification status with Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.identity.verificationSessions.retrieve(
      profile.stripe_identity_session_id
    );

    console.log("Verification status:", session.status);

    // Update profile if verified
    if (session.status === "verified" && !profile.is_verified) {
      await supabaseClient
        .from("profiles")
        .update({
          is_verified: true,
          verification_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      console.log(`User ${user.id} verified successfully`);
    }

    return new Response(
      JSON.stringify({
        verified: session.status === "verified",
        status: session.status,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error checking verification status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
