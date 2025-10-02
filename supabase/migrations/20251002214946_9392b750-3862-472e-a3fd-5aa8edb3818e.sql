-- Enable 2FA support by updating profiles table
-- Note: Supabase handles MFA in auth schema, but we track status in profiles

COMMENT ON COLUMN public.profiles.two_factor_enabled IS 
  'Indicates if user has enrolled in Two-Factor Authentication (2FA/MFA)';

-- Create audit log for 2FA events
CREATE TABLE IF NOT EXISTS public.two_factor_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('enrolled', 'unenrolled', 'verified', 'failed_verification')),
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.two_factor_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own 2FA audit logs
CREATE POLICY "Users can view their own 2FA logs"
ON public.two_factor_audit_log
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_two_factor_audit_user_id ON public.two_factor_audit_log(user_id, created_at DESC);

COMMENT ON TABLE public.two_factor_audit_log IS 
  'Audit trail for Two-Factor Authentication events for security monitoring';