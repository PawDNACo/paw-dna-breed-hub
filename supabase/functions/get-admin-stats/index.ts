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
      console.log(`Unauthorized admin stats access attempt by user ${user.id}`);
      
      // Log unauthorized access attempt
      await supabaseClient.from("security_audit_log").insert({
        user_id: user.id,
        action: "unauthorized_admin_stats_access",
        table_name: "admin_stats",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
        details: {
          timestamp: new Date().toISOString()
        }
      });
      
      return new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Log successful admin access
    await supabaseClient.from("admin_session_log").insert({
      admin_user_id: user.id,
      action: "dashboard_stats_access",
      ip_address: req.headers.get("x-forwarded-for") || "unknown",
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

    console.log(`Admin ${user.email} accessing dashboard stats`);

    // Fetch statistics using service role (bypasses RLS)
    const [usersRes, petsRes, subsRes, breedersRes, buyersRes] = await Promise.all([
      supabaseClient.from("profiles").select("id", { count: "exact", head: true }),
      supabaseClient.from("pets").select("id", { count: "exact", head: true }),
      supabaseClient.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabaseClient.from("pets").select("owner_id", { count: "exact", head: true }),
      supabaseClient.from("buyer_requests").select("user_id", { count: "exact", head: true }),
    ]);

    const stats = {
      totalUsers: usersRes.count || 0,
      totalPets: petsRes.count || 0,
      totalSubscriptions: subsRes.count || 0,
      activeBreeders: breedersRes.count || 0,
      activeBuyers: buyersRes.count || 0,
    };

    return new Response(
      JSON.stringify(stats),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in get-admin-stats:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
