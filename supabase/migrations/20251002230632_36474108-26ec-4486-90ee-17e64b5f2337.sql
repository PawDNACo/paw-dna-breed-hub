-- Fix RLS Enabled No Policy warning for identity_verification_sessions
-- This table should ONLY be accessible by service role (edge functions), never by users
-- Adding explicit deny policy to make this security model clear

CREATE POLICY "identity_verification_sessions_deny_all_user_access"
  ON public.identity_verification_sessions
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.identity_verification_sessions IS 
'Secure storage for Stripe identity verification tokens. Only accessible by service role via edge functions. All user access explicitly denied by RLS policy.';