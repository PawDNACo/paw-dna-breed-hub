-- Add phone field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text;

-- Add constraint for phone format (optional, basic validation)
ALTER TABLE public.profiles
ADD CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$');

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Add comment for security
COMMENT ON COLUMN public.profiles.phone IS 
  'SECURITY: User phone number for account recovery. Protected by RLS policies.';
