-- SECURITY FIX: Secure views using SECURITY DEFINER functions
-- Views cannot have RLS, so we create functions that implement access control

-- Function to get user's own transactions
CREATE OR REPLACE FUNCTION get_my_transactions()
RETURNS TABLE (
  id uuid,
  sale_date timestamp with time zone,
  species text,
  transaction_type text,
  pet_name text,
  breeder_earnings numeric,
  platform_fee numeric,
  sale_price numeric,
  payout_status text,
  breed text,
  other_party_id uuid,
  funds_available_date timestamp with time zone,
  payout_date timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.sale_date,
    p.species,
    CASE 
      WHEN s.buyer_id = auth.uid() THEN 'purchase'
      WHEN s.breeder_id = auth.uid() THEN 'sale'
      ELSE NULL
    END as transaction_type,
    p.name as pet_name,
    s.breeder_earnings,
    s.platform_fee,
    s.sale_price,
    s.payout_status,
    p.breed,
    CASE 
      WHEN s.buyer_id = auth.uid() THEN s.breeder_id
      WHEN s.breeder_id = auth.uid() THEN s.buyer_id
      ELSE NULL
    END as other_party_id,
    s.funds_available_date,
    s.payout_date
  FROM sales s
  JOIN pets p ON p.id = s.pet_id
  WHERE auth.uid() IS NOT NULL
    AND (s.buyer_id = auth.uid() OR s.breeder_id = auth.uid())
  ORDER BY s.sale_date DESC;
$$;

-- Function to get public profiles with proper access control
CREATE OR REPLACE FUNCTION get_public_profile(_profile_id uuid)
RETURNS TABLE (
  id uuid,
  created_at timestamp with time zone,
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
  SELECT 
    p.id,
    p.created_at,
    p.full_name,
    p.city,
    p.state,
    p.is_verified,
    p.verification_status
  FROM profiles p
  WHERE p.id = _profile_id
    AND auth.uid() IS NOT NULL
    AND (
      -- User can view their own profile
      p.id = auth.uid()
      OR
      -- User has an active conversation with this profile owner
      users_have_active_conversation(auth.uid(), p.id)
      OR
      -- User has an active transaction with this profile owner
      users_have_active_transaction(auth.uid(), p.id)
    );
$$;

-- Add comment explaining the security model
COMMENT ON FUNCTION get_my_transactions() IS 'Securely retrieves transactions for the authenticated user. Access control enforced via SECURITY DEFINER.';
COMMENT ON FUNCTION get_public_profile(uuid) IS 'Securely retrieves public profile data with relationship-based access control.';