import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[ASSIGN-ROLE] Function started');

    // SECURITY: Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[ASSIGN-ROLE] Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Initialize authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[ASSIGN-ROLE] Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    console.log('[ASSIGN-ROLE] Authenticated user:', user.id);

    // Use service role client for admin checks
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // SECURITY: Verify user has admin role using has_role function
    const { data: isAdmin, error: roleCheckError } = await serviceClient
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleCheckError) {
      console.error('[ASSIGN-ROLE] Error checking admin role:', roleCheckError);
      throw new Error('Failed to verify admin status');
    }

    if (!isAdmin) {
      console.warn('[ASSIGN-ROLE] Unauthorized attempt by user:', user.id);
      
      // Audit log: Unauthorized role assignment attempt
      await serviceClient.from('security_audit_log').insert({
        user_id: user.id,
        action: 'unauthorized_role_assignment_attempt',
        table_name: 'user_roles',
        details: {
          reason: 'User is not an admin'
        },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      });

      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      );
    }

    const { targetUserId, role } = await req.json();

    // Validate input
    if (!targetUserId || !role) {
      throw new Error('Missing required parameters: targetUserId and role');
    }

    const validRoles = ['admin', 'breeder', 'buyer'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    console.log('[ASSIGN-ROLE] Assigning role:', { targetUserId, role, assignedBy: user.id });

    // Verify target user exists
    const { data: targetUser, error: userError } = await serviceClient
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', targetUserId)
      .single();

    if (userError || !targetUser) {
      throw new Error('Target user not found');
    }

    // Check if role already exists
    const { data: existingRole } = await serviceClient
      .from('user_roles')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('role', role)
      .maybeSingle();

    if (existingRole) {
      throw new Error(`User already has the ${role} role`);
    }

    // Insert role
    const { error: insertError } = await serviceClient
      .from('user_roles')
      .insert({
        user_id: targetUserId,
        role: role
      });

    if (insertError) {
      console.error('[ASSIGN-ROLE] Error inserting role:', insertError);
      throw new Error(`Failed to assign role: ${insertError.message}`);
    }

    // Audit log: Successful role assignment
    await serviceClient.from('security_audit_log').insert({
      user_id: user.id,
      action: 'role_assigned',
      table_name: 'user_roles',
      details: {
        target_user_id: targetUserId,
        target_user_email: targetUser.email,
        target_user_name: targetUser.full_name,
        role: role,
        assigned_by: user.id
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    });

    console.log('[ASSIGN-ROLE] Role assigned successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Role ${role} assigned to user ${targetUser.full_name || targetUser.email}`,
        targetUserId,
        role
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[ASSIGN-ROLE] Error:', error);
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
