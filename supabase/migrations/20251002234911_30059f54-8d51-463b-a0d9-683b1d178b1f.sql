-- Add email column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- Add constraint for email format
ALTER TABLE public.profiles
ADD CONSTRAINT email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Make email column NOT NULL since it's required during signup
ALTER TABLE public.profiles
ALTER COLUMN email SET NOT NULL;

-- Add comment for security
COMMENT ON COLUMN public.profiles.email IS 
  'SECURITY: User email address. Protected by RLS policies. Populated from auth.users during signup.';

-- Add INSERT policy to allow new user profiles to be created
CREATE POLICY "Allow profile creation during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);
