import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { rateLimitMiddleware } from "../_shared/rateLimiter.ts";

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
    const authToken = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(authToken);

    if (!user?.email) throw new Error("User not authenticated");

    // Rate limiting: 3 verification attempts per hour per user
    const rateLimitResponse = rateLimitMiddleware(
      user.id,
      { maxRequests: 3, windowMs: 60 * 60 * 1000, keyPrefix: "identity-verify" },
      corsHeaders
    );
    if (rateLimitResponse) return rateLimitResponse;

    const { userType } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    console.log(`Creating Stripe Identity verification session for user: ${user.id}`);

    // Create verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: {
        user_id: user.id,
        user_type: userType,
        // SECURITY: Do not include email in metadata - it's stored server-side
      },
      options: {
        document: {
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
      return_url: `${req.headers.get("origin")}/verification-complete`,
    });

    console.log("Verification session created:", verificationSession.id);

    // SECURITY: Store session ID and token SERVER-SIDE ONLY in secure table
    // Create a secure verification token
    const token = `vt_${crypto.randomUUID()}`;
    
    // Use service role client to bypass RLS for storing sensitive data
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Store in secure identity_verification_sessions table (only service role can access)
    const { error: insertError } = await supabaseAdmin
      .from("identity_verification_sessions")
      .insert({
        user_id: user.id,
        stripe_session_id: verificationSession.id,
        verification_token: token,
        verification_type: userType,
      });

    if (insertError) {
      console.error("Error storing verification session:", insertError);
      throw new Error("Failed to store verification details");
    }
    
    // Update profiles table with verification type only (no tokens)
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ verification_type: userType })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile verification type:", updateError);
      // Non-fatal, continue
    }

    console.log("Successfully created verification session and stored token server-side");

    // SECURITY: Only return redirect URL to client, never tokens or session IDs
    return new Response(
      JSON.stringify({
        url: verificationSession.url,
        // sessionId and token are intentionally omitted for security
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error creating verification session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
