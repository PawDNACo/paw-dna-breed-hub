-- CRITICAL SECURITY FIX: Protect customer PII, identity data, and transaction data (CORRECTED)

-- 1. CUSTOMER PERSONAL INFORMATION PROTECTION
-- Mark all sensitive PII columns with security comments
COMMENT ON COLUMN public.profiles.email IS 
  'CRITICAL PII: Email address - NEVER expose to other users';
COMMENT ON COLUMN public.profiles.full_name IS 
  'SENSITIVE PII: Full legal name - Only expose to authorized parties';

-- 2. TRANSACTION DATA PROTECTION
-- Drop existing policies first
DROP POLICY IF EXISTS "Authenticated users can create sales" ON public.sales;
DROP POLICY IF EXISTS "Deny anonymous access to sales" ON public.sales;

-- Only allow system/edge functions to create sales records
CREATE POLICY "Only authorized functions can create sales"
ON public.sales
FOR INSERT
WITH CHECK (false); -- No direct inserts allowed from client

CREATE POLICY "Deny anon access to sales"
ON public.sales
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Add audit logging for sales access
CREATE TABLE IF NOT EXISTS public.sales_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  sale_id uuid REFERENCES public.sales(id),
  access_type text NOT NULL,
  accessed_at timestamp with time zone DEFAULT now(),
  ip_address inet
);

ALTER TABLE public.sales_access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own sales access logs" ON public.sales_access_log;

CREATE POLICY "Users can view their own sales access logs"
ON public.sales_access_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sales_access_log_user ON public.sales_access_log(user_id, accessed_at DESC);

-- 3. SECURE MESSAGES TABLE
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Only message participants can view messages" ON public.messages;

CREATE POLICY "Only message participants can view messages"
ON public.messages
FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id
);

DROP POLICY IF EXISTS "Users can send messages in approved conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can only send messages in verified conversations" ON public.messages;

CREATE POLICY "Users can only send messages in verified conversations"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = messages.conversation_id
      AND conversations.status = 'approved'
      AND (
        (conversations.buyer_id = auth.uid() AND conversations.breeder_id = messages.recipient_id) OR
        (conversations.breeder_id = auth.uid() AND conversations.buyer_id = messages.recipient_id)
      )
  )
);

-- 4. CREATE SECURE TRANSACTION VIEW
DROP VIEW IF EXISTS public.my_transactions CASCADE;

CREATE VIEW public.my_transactions
WITH (security_invoker=true) AS
SELECT 
  s.id,
  s.sale_date,
  s.sale_price,
  s.platform_fee,
  s.breeder_earnings,
  s.payout_status,
  s.payout_date,
  s.funds_available_date,
  p.name as pet_name,
  p.species,
  p.breed,
  CASE 
    WHEN s.buyer_id = auth.uid() THEN 'purchase'
    WHEN s.breeder_id = auth.uid() THEN 'sale'
    ELSE NULL
  END as transaction_type,
  CASE 
    WHEN s.buyer_id = auth.uid() THEN s.breeder_id
    WHEN s.breeder_id = auth.uid() THEN s.buyer_id
    ELSE NULL
  END as other_party_id
FROM public.sales s
JOIN public.pets p ON s.pet_id = p.id
WHERE auth.uid() = s.buyer_id OR auth.uid() = s.breeder_id;

GRANT SELECT ON public.my_transactions TO authenticated;

-- 5. PROTECT FROZEN FUNDS
DROP POLICY IF EXISTS "Users can view their own frozen funds" ON public.frozen_funds;
DROP POLICY IF EXISTS "Users can only view their own frozen funds" ON public.frozen_funds;
DROP POLICY IF EXISTS "No direct frozen funds modifications" ON public.frozen_funds;
DROP POLICY IF EXISTS "Deny anonymous access to frozen_funds" ON public.frozen_funds;

CREATE POLICY "Users can only view their own frozen funds"
ON public.frozen_funds
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "No direct frozen funds modifications"
ON public.frozen_funds
FOR UPDATE
USING (false)
WITH CHECK (false);

CREATE POLICY "No direct frozen funds deletes"
ON public.frozen_funds
FOR DELETE
USING (false);

CREATE POLICY "Deny anon access to frozen_funds"
ON public.frozen_funds
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 6. PROTECT SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can only view their own subscription data" ON public.subscriptions;
DROP POLICY IF EXISTS "Deny anonymous access to subscriptions" ON public.subscriptions;

CREATE POLICY "Users can only view their own subscription data"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Deny anon access to subscriptions"
ON public.subscriptions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 7. PROTECT VERIFICATION REQUESTS
DROP POLICY IF EXISTS "Users can view their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Users can only view their own verification requests" ON public.verification_requests;
DROP POLICY IF EXISTS "Deny anonymous access to verification_requests" ON public.verification_requests;

CREATE POLICY "Users can only view their own verification requests"
ON public.verification_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Deny anon access to verification_requests"
ON public.verification_requests
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 8. PROTECT BANKING CHANGE REQUESTS
DROP POLICY IF EXISTS "Users can view their own banking change requests" ON public.banking_change_requests;
DROP POLICY IF EXISTS "Users can only view their own banking requests" ON public.banking_change_requests;
DROP POLICY IF EXISTS "Deny anonymous access to banking_change_requests" ON public.banking_change_requests;

CREATE POLICY "Users can only view their own banking requests"
ON public.banking_change_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Deny anon access to banking_change_requests"
ON public.banking_change_requests
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 9. TRANSACTION ACCESS VALIDATION FUNCTION
CREATE OR REPLACE FUNCTION public.can_access_transaction(_sale_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sales
    WHERE id = _sale_id
      AND (_user_id = buyer_id OR _user_id = breeder_id)
  );
$$;

COMMENT ON FUNCTION public.can_access_transaction IS 
  'SECURITY: Validates if a user is authorized to access a specific transaction';

-- 10. SECURITY DOCUMENTATION
COMMENT ON TABLE public.profiles IS 
  'CRITICAL SECURITY: Never store credit card, bank account, or payment method data. Never expose emails, payment tokens, or precise locations to other users.';

COMMENT ON TABLE public.sales IS 
  'CRITICAL SECURITY: Transaction data restricted to participants only. No anonymous access. Sales creation only via authorized edge functions.';

COMMENT ON TABLE public.user_reports IS 
  'SECURITY: Only admins and report creators can access. Contains sensitive user behavior data.';

COMMENT ON SCHEMA public IS 
  'SECURITY NOTICE: All tables with user data must have RLS enabled. All sensitive columns must be explicitly protected. Never expose PII to unauthorized users.';