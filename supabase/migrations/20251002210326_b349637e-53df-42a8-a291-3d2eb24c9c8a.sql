-- Create enum for account status
CREATE TYPE account_status AS ENUM ('active', 'frozen', 'pending_verification', 'permanently_deleted');

-- Create enum for verification type
CREATE TYPE verification_type AS ENUM ('account_recovery', 'banking_change', 'report_investigation');

-- Add account status and verification fields to profiles
ALTER TABLE public.profiles
ADD COLUMN account_status account_status DEFAULT 'active',
ADD COLUMN frozen_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN frozen_reason TEXT,
ADD COLUMN verification_status TEXT DEFAULT 'unverified';

-- Create verification requests table
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type verification_type NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create banking change requests table
CREATE TABLE public.banking_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  verification_request_id UUID REFERENCES public.verification_requests(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user reports table
CREATE TABLE public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reporter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  report_reason TEXT NOT NULL,
  report_details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.profiles(id),
  action_taken TEXT
);

-- Create account frozen funds table
CREATE TABLE public.frozen_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  frozen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  release_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '90 days'),
  status TEXT DEFAULT 'frozen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frozen_funds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_requests
CREATE POLICY "Users can view their own verification requests"
  ON public.verification_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests"
  ON public.verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for banking_change_requests
CREATE POLICY "Users can view their own banking change requests"
  ON public.banking_change_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create banking change requests"
  ON public.banking_change_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_reports
CREATE POLICY "Users can create reports"
  ON public.user_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view reports they created"
  ON public.user_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_user_id);

-- RLS Policies for frozen_funds
CREATE POLICY "Users can view their own frozen funds"
  ON public.frozen_funds
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Deny anonymous access to all new tables
CREATE POLICY "Deny anonymous access to verification_requests"
  ON public.verification_requests FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to banking_change_requests"
  ON public.banking_change_requests FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to user_reports"
  ON public.user_reports FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to frozen_funds"
  ON public.frozen_funds FOR ALL TO anon USING (false);

-- Create function to check banking change limit
CREATE OR REPLACE FUNCTION check_banking_change_limit(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  change_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO change_count
  FROM public.banking_change_requests
  WHERE user_id = _user_id
    AND approved_date IS NOT NULL
    AND approved_date >= (NOW() - INTERVAL '365 days');
  
  RETURN change_count < 2;
END;
$$;

-- Create trigger to update updated_at columns
CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banking_change_requests_updated_at
  BEFORE UPDATE ON public.banking_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();