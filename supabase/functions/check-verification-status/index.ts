import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.pawdna.org",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) throw new Error("User not authenticated");

    // Use service role to access secure identity_verification_sessions table
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get verification session from secure table
    const { data: verificationSession, error: sessionError } = await supabaseAdmin
      .from("identity_verification_sessions")
      .select("stripe_session_id, verification_token, expires_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sessionError || !verificationSession?.stripe_session_id) {
      console.log("No verification session found for user");
      return new Response(
        JSON.stringify({ 
          verified: false,
          status: "not_started",
          message: "No verification session found" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Check if session is expired
    if (new Date(verificationSession.expires_at) < new Date()) {
      console.log("Verification session expired");
      return new Response(
        JSON.stringify({ 
          verified: false,
          status: "expired",
          message: "Verification session expired" 
        }),
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

    console.log(`Checking verification status for session: ${verificationSession.stripe_session_id}`);

    const stripeSession = await stripe.identity.verificationSessions.retrieve(
      verificationSession.stripe_session_id
    );

    console.log(`Verification status: ${stripeSession.status}`);

    // Get current profile status (only non-sensitive fields)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .single();

    // Update profile if verified
    if (stripeSession.status === "verified" && !profile?.is_verified) {
      // Log security event for verification completion
      await supabaseAdmin
        .from("security_audit_log")
        .insert({
          user_id: user.id,
          action: "identity_verification_completed",
          table_name: "profiles",
          details: {
            verification_type: "stripe_identity",
            session_id: verificationSession.stripe_session_id,
            timestamp: new Date().toISOString()
          }
        });

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          is_verified: true,
          verification_status: "verified",
          verification_completed_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
      } else {
        console.log(`User ${user.id} verified successfully`);
      }
    }

    return new Response(
      JSON.stringify({
        verified: stripeSession.status === "verified",
        status: stripeSession.status,
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
