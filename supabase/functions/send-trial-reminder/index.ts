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

    const { subscriptionId, userId, reminderType, userEmail, userName } = await req.json();

    console.log("Sending trial reminder:", { subscriptionId, userId, reminderType });

    // Determine reminder message based on type
    let subject = "";
    let message = "";
    
    switch (reminderType) {
      case "48_hours":
        subject = "Your PawDNA Trial Ends in 48 Hours";
        message = `Hi ${userName || "there"},\n\nYour 7-day free trial with PawDNA will end in 48 hours. Your subscription will automatically renew and you'll be charged on ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString()}.\n\nTo avoid being charged, please cancel your subscription before then.\n\nBest regards,\nThe PawDNA Team`;
        break;
      case "24_hours":
        subject = "Your PawDNA Trial Ends in 24 Hours";
        message = `Hi ${userName || "there"},\n\nYour 7-day free trial with PawDNA will end in 24 hours. Your subscription will automatically renew tomorrow and you'll be charged.\n\nTo avoid being charged, please cancel your subscription before then.\n\nBest regards,\nThe PawDNA Team`;
        break;
      case "day_of":
        subject = "Your PawDNA Trial Ends Today - Subscription Will Be Charged";
        message = `Hi ${userName || "there"},\n\nYour 7-day free trial with PawDNA ends today. Your subscription will be charged today.\n\nThank you for choosing PawDNA!\n\nBest regards,\nThe PawDNA Team`;
        break;
      default:
        throw new Error("Invalid reminder type");
    }

    // Send email reminder using Resend API directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "PawDNA <onboarding@resend.dev>",
        to: [userEmail],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${subject}</h2>
            <p style="line-height: 1.6; color: #666;">${message.replace(/\n/g, '<br>')}</p>
            <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
              <p style="margin: 0; color: #333;"><strong>Important:</strong> Please note that subscription fees are non-refundable once charged. You have received this reminder to ensure you have time to manage your subscription.</p>
            </div>
          </div>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    // Log the reminder
    const { error: logError } = await supabaseClient
      .from("trial_reminders")
      .insert({
        subscription_id: subscriptionId,
        user_id: userId,
        reminder_type: reminderType,
        sent_via: "email",
      });

    if (logError) {
      console.error("Error logging reminder:", logError);
    }

    return new Response(
      JSON.stringify({ success: true, emailResult }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending trial reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});