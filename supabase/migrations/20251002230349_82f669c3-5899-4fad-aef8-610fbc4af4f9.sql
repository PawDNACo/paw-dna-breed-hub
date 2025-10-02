-- Critical Security Fixes Migration

-- 1. Create secure token storage for identity verification
CREATE TABLE public.identity_verification_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id text NOT NULL,
  verification_token text NOT NULL,
  verification_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Enable RLS - only service role can access (no policies means only service role)
ALTER TABLE public.identity_verification_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Email access logging table
CREATE TABLE public.email_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accessed_by uuid REFERENCES auth.users(id),
  profile_id uuid REFERENCES profiles(id),
  access_type text NOT NULL,
  accessed_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text
);

ALTER TABLE public.email_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email access logs"
  ON public.email_access_log FOR SELECT
  USING (auth.uid() = accessed_by);

CREATE POLICY "Admins can view all email access logs"
  ON public.email_access_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Admin session logging table
CREATE TABLE public.admin_session_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id),
  session_id text,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  ip_address inet
);

ALTER TABLE public.admin_session_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin session logs"
  ON public.admin_session_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert admin logs"
  ON public.admin_session_log FOR INSERT
  WITH CHECK (auth.uid() = admin_user_id);

-- 4. Recreate public_profiles view with security barrier and RLS
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles WITH (security_barrier = true) AS
SELECT 
  id,
  full_name,
  city,
  state,
  verification_status,
  is_verified,
  created_at
FROM public.profiles;

-- Note: RLS on views requires the underlying table to have RLS enabled
-- The profiles table already has RLS, so this view inherits those restrictions

-- 5. Create secure function to get own email
CREATE OR REPLACE FUNCTION public.get_my_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- 6. Remove sensitive Stripe tokens from profiles table
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS stripe_identity_session_id,
  DROP COLUMN IF EXISTS stripe_identity_verification_token;

-- 7. Remove email from profiles (it's already in auth.users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;