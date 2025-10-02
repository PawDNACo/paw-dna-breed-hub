import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

    const { reportedUserId, reportReason } = await req.json();

    if (!reportedUserId) {
      throw new Error("Reported user ID is required");
    }

    console.log(`Freezing account for user: ${reportedUserId}`);
    console.log(`Reason: ${reportReason}`);

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
