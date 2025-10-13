import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Verify admin role using has_role function
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      console.log(`Unauthorized freeze attempt by user ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const { reportedUserId, reportReason } = await req.json();

    if (!reportedUserId) {
      throw new Error("Reported user ID is required");
    }

    // Rate limiting: 10 freeze actions per hour per admin
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResponse = rateLimitMiddleware(
      `admin-${user.id}`,
      { maxRequests: 10, windowMs: 60 * 60 * 1000, keyPrefix: "freeze-account" },
      corsHeaders
    );
    if (rateLimitResponse) return rateLimitResponse;

    console.log(`Freezing account for user: ${reportedUserId}`);
    console.log(`Reason: ${reportReason}`);

    // Log security event for account freeze with admin info
    await supabaseClient
      .from("security_audit_log")
      .insert({
        user_id: reportedUserId,
        action: "account_frozen",
        table_name: "profiles",
        ip_address: clientIp,
        details: {
          reason: reportReason,
          frozen_by_admin: user.id,
          admin_email: user.email,
          timestamp: new Date().toISOString()
        }
      });

    // Freeze the reported user's account
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({
        account_status: "frozen",
        frozen_at: new Date().toISOString(),
        frozen_reason: `Account frozen due to report: ${reportReason}`,
      })
      .eq("id", reportedUserId);

    if (profileError) {
      console.error("Error freezing account:", profileError);
      throw profileError;
    }

    // Get current breeder earnings (if any)
    const { data: sales, error: salesError } = await supabaseClient
      .from("sales")
      .select("breeder_earnings")
      .eq("breeder_id", reportedUserId)
      .eq("payout_status", "pending");

    if (salesError) {
      console.error("Error fetching sales:", salesError);
    }

    // Calculate total frozen funds
    const totalFunds = sales?.reduce((sum, sale) => sum + (sale.breeder_earnings || 0), 0) || 0;

    // Create frozen funds record if there are any pending earnings
    if (totalFunds > 0) {
      const { error: fundsError } = await supabaseClient
        .from("frozen_funds")
        .insert({
          user_id: reportedUserId,
          amount: totalFunds,
          frozen_at: new Date().toISOString(),
          release_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: "frozen",
        });

      if (fundsError) {
        console.error("Error creating frozen funds record:", fundsError);
      }
    }

    console.log(`Account frozen successfully. Frozen funds: $${totalFunds}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account has been frozen and funds are on hold",
        frozenFunds: totalFunds,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in freeze-reported-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
