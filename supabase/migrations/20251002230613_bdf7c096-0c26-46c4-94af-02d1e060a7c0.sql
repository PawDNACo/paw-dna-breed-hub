-- Fix Security Definer View Issue
-- Replace security_barrier with security_invoker for public_profiles view

DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles WITH (security_invoker = true) AS
SELECT 
  id,
  full_name,
  city,
  state,
  verification_status,
  is_verified,
  created_at
FROM public.profiles;

-- Add comment explaining the security model
COMMENT ON VIEW public.public_profiles IS 
'Public profile view with security_invoker=true. This view executes with the permissions of the querying user, ensuring RLS policies on the profiles table are properly enforced.';