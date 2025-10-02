-- =========================================================================
-- Create Contact Submissions Table
-- =========================================================================
-- Table to store contact form submissions securely

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  ip_address inet,
  user_agent text,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add constraints for data integrity
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT contact_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT contact_subject_length CHECK (char_length(subject) <= 200),
  ADD CONSTRAINT contact_message_length CHECK (char_length(message) <= 2000);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policy: Only admins can update status/notes
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policy: Block all direct inserts (edge function only)
CREATE POLICY "No direct inserts on contact submissions"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- RLS Policy: Block anonymous access completely
CREATE POLICY "No anonymous access to contact submissions"
ON public.contact_submissions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Create index for faster admin queries
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add security comments
COMMENT ON TABLE public.contact_submissions IS 
  'SECURITY: Stores contact form submissions. Direct inserts blocked - use submit-contact edge function only. Only admins can view and manage submissions. Rate limited to 5 per 15 minutes per IP.';

COMMENT ON COLUMN public.contact_submissions.email IS 
  'SECURITY: Validated email address. Server-side validation ensures format and length constraints.';

COMMENT ON COLUMN public.contact_submissions.message IS 
  'SECURITY: User message. Validated for length and checked for SQL injection and XSS patterns.';

COMMENT ON COLUMN public.contact_submissions.ip_address IS 
  'SECURITY: Client IP address for rate limiting and abuse prevention. Never exposed to users.';

-- Log security event
INSERT INTO public.security_audit_log (action, table_name, details)
VALUES ('CREATE_TABLE', 'contact_submissions', '{"security_level": "high", "rate_limited": true, "admin_only": true}');