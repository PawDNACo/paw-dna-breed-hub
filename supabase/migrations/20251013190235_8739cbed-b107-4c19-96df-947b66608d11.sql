-- Allow service role (edge functions) to insert security audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.security_audit_log
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also allow authenticated users to insert their own audit logs
CREATE POLICY "Users can insert their own audit logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);