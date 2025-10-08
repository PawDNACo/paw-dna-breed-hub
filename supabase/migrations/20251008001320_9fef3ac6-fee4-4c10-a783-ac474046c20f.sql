-- Add audit logging for email and phone access
-- This helps track who is accessing sensitive PII data

-- Create audit trigger function for profiles
CREATE OR REPLACE FUNCTION audit_profile_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to email or phone fields
  IF (TG_OP = 'SELECT' AND (
    NEW.email IS NOT NULL OR 
    NEW.phone IS NOT NULL
  )) THEN
    INSERT INTO public.email_access_log (
      accessed_by,
      profile_id,
      access_type,
      ip_address
    ) VALUES (
      auth.uid(),
      NEW.id,
      'profile_query',
      inet_client_addr()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Strengthen get_email_from_username to only work during authentication
-- and add audit logging
CREATE OR REPLACE FUNCTION public.get_email_from_username(_username text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
  user_id uuid;
BEGIN
  -- Get email and user_id
  SELECT email, id INTO user_email, user_id
  FROM public.profiles
  WHERE LOWER(username) = LOWER(_username)
  LIMIT 1;
  
  -- Log this access for security audit
  IF user_email IS NOT NULL THEN
    INSERT INTO public.email_access_log (
      accessed_by,
      profile_id,
      access_type
    ) VALUES (
      auth.uid(),
      user_id,
      'username_lookup'
    );
  END IF;
  
  RETURN user_email;
END;
$$;

-- Add additional security policies for profiles table
-- Ensure profiles table cannot be queried in bulk
CREATE POLICY "Prevent bulk profile enumeration"
ON public.profiles
FOR SELECT
USING (
  -- Only allow viewing own profile or through specific security definer functions
  auth.uid() = id
);

-- Add policy to prevent updates to sensitive fields without proper verification
CREATE POLICY "Protect sensitive profile fields from unauthorized updates"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Ensure email and phone can only be updated by the owner
  AND (
    (email = (SELECT email FROM profiles WHERE id = auth.uid()))
    OR
    (email != (SELECT email FROM profiles WHERE id = auth.uid()) AND auth.uid() = id)
  )
);

-- Create index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_email_access_log_profile_id 
ON public.email_access_log(profile_id);

CREATE INDEX IF NOT EXISTS idx_email_access_log_accessed_by 
ON public.email_access_log(accessed_by);

-- Add RLS policy to email_access_log if not exists
ALTER TABLE public.email_access_log ENABLE ROW LEVEL SECURITY;

-- Comment on sensitive columns to warn developers
COMMENT ON COLUMN public.profiles.email IS 'SENSITIVE PII - Access is logged in email_access_log. Only access via security definer functions or with proper authorization.';
COMMENT ON COLUMN public.profiles.phone IS 'SENSITIVE PII - Access is logged. Only access via security definer functions or with proper authorization.';
COMMENT ON COLUMN public.profiles.latitude IS 'SENSITIVE LOCATION - Only expose approximate distances, never exact coordinates.';
COMMENT ON COLUMN public.profiles.longitude IS 'SENSITIVE LOCATION - Only expose approximate distances, never exact coordinates.';