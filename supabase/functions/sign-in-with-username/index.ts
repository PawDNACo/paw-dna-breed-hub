import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      throw new Error("Username/email and password are required");
    }

    console.log('Sign in attempt with identifier:', identifier);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let email = identifier;

    // Check if identifier is an email (contains @)
    if (!identifier.includes('@')) {
      // It's a username, look up the email
      console.log('Identifier is username, looking up email...');
      
      const { data: emailData, error: emailError } = await supabaseClient.rpc(
        'get_email_from_username',
        { _username: identifier }
      );

      if (emailError) {
        console.error('Error looking up email:', emailError);
        throw new Error("Invalid username or password");
      }

      if (!emailData) {
        console.log('Username not found');
        throw new Error("Invalid username or password");
      }

      email = emailData;
      console.log('Found email for username');
    }

    // Sign in with email and password
    console.log('Attempting sign in with email...');
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error("Invalid username/email or password");
    }

    console.log('Sign in successful');

    return new Response(
      JSON.stringify({
        success: true,
        session: data.session,
        user: data.user,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in sign-in-with-username:', error);
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
