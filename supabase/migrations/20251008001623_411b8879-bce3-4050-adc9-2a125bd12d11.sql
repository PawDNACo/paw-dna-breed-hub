-- SECURITY FIX: Enable RLS on conversation_partner_profiles view
-- This view exposes user profile data but only to conversation/transaction participants
-- Without RLS enabled, the view structure itself is exposed to public queries

-- Enable RLS on the view
ALTER VIEW public.conversation_partner_profiles SET (security_invoker = on);

-- Since views can't have traditional RLS policies, we'll recreate it with proper security
-- The view already has auth.uid() checks, but we need to ensure it can't be queried anonymously

-- Drop and recreate with explicit security
DROP VIEW IF EXISTS public.conversation_partner_profiles CASCADE;

CREATE VIEW public.conversation_partner_profiles 
WITH (security_invoker = on)
AS
SELECT 
  p.id,
  p.full_name,
  p.city,
  p.state,
  p.is_verified,
  p.verification_status
FROM profiles p
WHERE 
  -- Only show profiles to authenticated users who have conversations or transactions
  auth.uid() IS NOT NULL
  AND (
    -- User has approved conversation with this profile
    EXISTS (
      SELECT 1 
      FROM conversations c
      WHERE c.status = 'approved'
        AND (
          (c.buyer_id = auth.uid() AND c.breeder_id = p.id)
          OR
          (c.breeder_id = auth.uid() AND c.buyer_id = p.id)
        )
    )
    OR
    -- User has transaction with this profile
    EXISTS (
      SELECT 1 
      FROM sales s
      WHERE (
        (s.buyer_id = auth.uid() AND s.breeder_id = p.id)
        OR
        (s.breeder_id = auth.uid() AND s.buyer_id = p.id)
      )
    )
  );

-- Grant access only to authenticated users
REVOKE ALL ON public.conversation_partner_profiles FROM anon;
REVOKE ALL ON public.conversation_partner_profiles FROM public;
GRANT SELECT ON public.conversation_partner_profiles TO authenticated;

-- Add security comment
COMMENT ON VIEW public.conversation_partner_profiles IS 
  'Secure view that shows limited profile information (name, location, verification status) 
   only to authenticated users who have active conversations or transactions with that profile. 
   CRITICAL: auth.uid() check prevents anonymous access. Do not remove this check.';

-- Add audit logging for conversation partner profile access
CREATE OR REPLACE FUNCTION log_conversation_partner_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when users access conversation partner profiles
  INSERT INTO public.profile_access_logs (
    accessor_id,
    accessed_profile_id,
    access_type
  ) VALUES (
    auth.uid(),
    NEW.id,
    'conversation_partner_view'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Note: Triggers on views require INSTEAD OF triggers, but for audit logging
-- we'll rely on application-level logging when querying this view

-- Create helper function to safely query conversation partner profiles
CREATE OR REPLACE FUNCTION get_conversation_partner_profile(_partner_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  city text,
  state text,
  is_verified boolean,
  verification_status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Log the access
  INSERT INTO public.profile_access_logs (
    accessor_id,
    accessed_profile_id,
    access_type
  ) VALUES (
    auth.uid(),
    _partner_id,
    'conversation_partner_function'
  );
  
  -- Return profile data only if user has active conversation or transaction
  SELECT 
    p.id,
    p.full_name,
    p.city,
    p.state,
    p.is_verified,
    p.verification_status
  FROM profiles p
  WHERE p.id = _partner_id
    AND auth.uid() IS NOT NULL
    AND (
      users_have_active_conversation(auth.uid(), _partner_id)
      OR
      users_have_active_transaction(auth.uid(), _partner_id)
    );
$$;