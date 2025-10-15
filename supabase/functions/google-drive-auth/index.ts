import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { action, code, redirectUri, fileId } = await req.json();

    const clientId = Deno.env.get('GOOGLE_DRIVE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_DRIVE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Google Drive credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Google Drive integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return client ID for OAuth initialization (public, safe to expose)
    if (action === 'get-client-id') {
      return new Response(
        JSON.stringify({ clientId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange authorization code for access token
    if (action === 'exchange-code') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          auth: {
            persistSession: false,
          },
        }
      );

      // Verify authentication
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

      if (userError || !user) {
        console.error('Authentication error:', userError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }), 
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Authorization code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Exchanging authorization code for access token...');

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to exchange authorization code', details: errorText }),
          { status: tokenResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log('Access token obtained');

      // Return access token (will be used to fetch file in next request)
      return new Response(
        JSON.stringify({
          accessToken,
          expiresIn: tokenData.expires_in,
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get file metadata from Google Drive
    if (action === 'get-file-metadata') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          auth: {
            persistSession: false,
          },
        }
      );

      // Verify authentication
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

      if (userError || !user) {
        console.error('Authentication error:', userError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }), 
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { accessToken } = await req.json();

      if (!accessToken || !fileId) {
        return new Response(
          JSON.stringify({ error: 'Access token and file ID are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Fetching file metadata from Google Drive...');

      // Get file metadata
      const metadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!metadataResponse.ok) {
        const errorText = await metadataResponse.text();
        console.error('Failed to fetch file metadata:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch file metadata', details: errorText }),
          { status: metadataResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const metadata = await metadataResponse.json();

      console.log('File metadata fetched successfully:', metadata.name);

      // Return file metadata
      return new Response(
        JSON.stringify({
          file: {
            id: metadata.id,
            name: metadata.name,
            mimeType: metadata.mimeType,
            size: metadata.size,
          }
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in google-drive-auth function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
