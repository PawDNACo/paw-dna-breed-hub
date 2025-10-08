import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    console.log("Checking for trial reminders...");

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get all active trial subscriptions
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from("subscriptions")
      .select(`
        id,
        user_id,
        trial_end,
        subscription_type
      `)
      .eq("is_trial", true)
      .eq("status", "active")
      .not("trial_end", "is", null);

    if (subsError) {
      console.error("Error fetching subscriptions:", subsError);
      throw subsError;
    }

    console.log(`Found ${subscriptions?.length || 0} active trial subscriptions`);

    const remindersToSend = [];

    for (const subscription of subscriptions || []) {
      const trialEnd = new Date(subscription.trial_end);
      const hoursDiff = (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Check if we need to send any reminders
      let reminderType = null;

      if (hoursDiff <= 1 && hoursDiff > 0) {
        reminderType = "day_of";
      } else if (hoursDiff <= 24 && hoursDiff > 23) {
        reminderType = "24_hours";
      } else if (hoursDiff <= 48 && hoursDiff > 47) {
        reminderType = "48_hours";
      }

      if (reminderType) {
        // Check if reminder already sent
        const { data: existingReminder } = await supabaseClient
          .from("trial_reminders")
          .select("id")
          .eq("subscription_id", subscription.id)
          .eq("reminder_type", reminderType)
          .single();

        if (!existingReminder) {
          // Get user profile for email
          const { data: profile } = await supabaseClient
            .from("profiles")
            .select("email, full_name")
            .eq("id", subscription.user_id)
            .single();

          if (profile?.email) {
            remindersToSend.push({
              subscriptionId: subscription.id,
              userId: subscription.user_id,
              reminderType: reminderType,
              userEmail: profile.email,
              userName: profile.full_name,
            });
          }
        }
      }
    }

    console.log(`Sending ${remindersToSend.length} reminders`);

    // Send all reminders
    const results = await Promise.all(
      remindersToSend.map(async (reminder) => {
        try {
          const response = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-trial-reminder`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
              },
              body: JSON.stringify(reminder),
            }
          );
          
          const result = await response.json();
          return { success: response.ok, reminder, result };
        } catch (error) {
          console.error("Error sending reminder:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { success: false, reminder, error: errorMessage };
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        checked: subscriptions?.length || 0,
        reminders_sent: results.filter((r) => r.success).length,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error checking trial reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});