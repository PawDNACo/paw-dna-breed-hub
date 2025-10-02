-- Fix security definer view warnings by explicitly setting SECURITY INVOKER

-- Recreate public_profiles with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles CASCADE;
CREATE VIEW public.public_profiles
WITH (security_invoker=true) AS
SELECT 
  id,
  full_name,
  city,
  state,
  is_verified,
  verification_status,
  created_at
FROM public.profiles;

-- Recreate conversation_partner_profiles with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.conversation_partner_profiles CASCADE;
CREATE VIEW public.conversation_partner_profiles
WITH (security_invoker=true) AS
SELECT 
  p.id,
  p.full_name,
  p.city,
  p.state,
  p.is_verified,
  p.verification_status
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.conversations c
  WHERE c.status = 'approved'
    AND (
      (c.buyer_id = auth.uid() AND c.breeder_id = p.id) OR
      (c.breeder_id = auth.uid() AND c.buyer_id = p.id)
    )
)
OR EXISTS (
  SELECT 1 FROM public.sales s
  WHERE (s.buyer_id = auth.uid() AND s.breeder_id = p.id) OR
        (s.breeder_id = auth.uid() AND s.buyer_id = p.id)
);

-- Grant permissions
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.conversation_partner_profiles TO authenticated;