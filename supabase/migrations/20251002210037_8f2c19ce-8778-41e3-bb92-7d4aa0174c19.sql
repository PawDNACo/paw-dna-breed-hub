-- Fix buyer_requests table RLS to protect buyer location data
-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own buyer requests" ON public.buyer_requests;
DROP POLICY IF EXISTS "Users can view active buyer requests in their region" ON public.buyer_requests;

-- Allow users to manage only their own buyer requests
CREATE POLICY "Users can manage their own buyer requests"
  ON public.buyer_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Explicitly deny all anonymous/public access to buyer requests
CREATE POLICY "Deny anonymous access to buyer requests"
  ON public.buyer_requests
  FOR ALL
  TO anon
  USING (false);