-- =========================================================================
-- SECURITY FIX: Secure conversation_partner_profiles View
-- =========================================================================
-- Issue: View needs security_invoker to respect RLS policies
-- Solution: Recreate view with security_invoker = true

DROP VIEW IF EXISTS public.conversation_partner_profiles;

CREATE VIEW public.conversation_partner_profiles
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.full_name,
  p.city,
  p.state,
  p.is_verified,
  p.verification_status
FROM public.profiles p
WHERE 
  -- Only show profiles of users with active approved conversations
  (EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.status = 'approved'
      AND (
        (c.buyer_id = auth.uid() AND c.breeder_id = p.id) OR
        (c.breeder_id = auth.uid() AND c.buyer_id = p.id)
      )
  ))
  OR
  -- Or users involved in completed sales transactions
  (EXISTS (
    SELECT 1
    FROM public.sales s
    WHERE 
      (s.buyer_id = auth.uid() AND s.breeder_id = p.id) OR
      (s.breeder_id = auth.uid() AND s.buyer_id = p.id)
  ));

-- Add security documentation
COMMENT ON VIEW public.conversation_partner_profiles IS 
  'SECURITY: Secure view using security_invoker = true. Automatically filters profiles to only show users with whom the current user has an approved conversation or completed transaction. No additional RLS policies needed - security enforced through WHERE clause using auth.uid(). Safe for use in chat interfaces and transaction displays.';

-- Views don't support RLS policies directly - they inherit security from:
-- 1. security_invoker = true (uses querying user's permissions)
-- 2. WHERE clause filtering (only shows authorized relationships)
-- 3. Underlying table RLS policies (profiles table is protected)

-- This is the correct security pattern for relationship-based views