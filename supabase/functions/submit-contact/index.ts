import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { rateLimitMiddleware } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side validation schema (defense in depth)
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required");
  } else if (data.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.name)) {
    errors.push("Name contains invalid characters");
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email is required");
  } else if (data.email.length > 255) {
    errors.push("Email must be less than 255 characters");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  // Subject validation
  if (!data.subject || data.subject.trim().length === 0) {
    errors.push("Subject is required");
  } else if (data.subject.length > 200) {
    errors.push("Subject must be less than 200 characters");
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push("Message is required");
  } else if (data.message.length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.length > 2000) {
    errors.push("Message must be less than 2000 characters");
  }

  // Check for potential SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b|--|;|\/\*|\*\/)/gi;
  const allFields = `${data.name} ${data.email} ${data.subject} ${data.message}`;
  if (sqlInjectionPattern.test(allFields)) {
    errors.push("Invalid characters detected");
  }

  // Check for XSS patterns
  const xssPattern = /<script|javascript:|onerror=|onload=/gi;
  if (xssPattern.test(allFields)) {
    errors.push("Invalid content detected");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[submit-contact] Request received");

    // Rate limiting: 5 submissions per 15 minutes per IP
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimitMiddleware(clientIp, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
      keyPrefix: "contact-form",
    }, corsHeaders);

    if (rateLimitResult) {
      console.log("[submit-contact] Rate limit exceeded for IP:", clientIp);
      return rateLimitResult;
    }

    // Parse and validate request body
    const formData: ContactFormData = await req.json();
    console.log("[submit-contact] Form data received for:", formData.email);

    // Server-side validation
    const validation = validateContactForm(formData);
    if (!validation.valid) {
      console.log("[submit-contact] Validation failed:", validation.errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize data (trim whitespace)
    const sanitizedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    // Store in database using service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Create contact_submissions table entry
    const { error: dbError } = await supabaseClient
      .from("contact_submissions")
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent") || "unknown",
      });

    if (dbError) {
      console.error("[submit-contact] Database error:", dbError);
      throw new Error("Failed to store contact submission");
    }

    console.log("[submit-contact] Contact submission stored successfully");

    // TODO: Send email notification (requires Resend API key)
    // Uncomment when ready to send emails
    /*
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      // Send email notification to admin
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[submit-contact] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
