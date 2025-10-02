-- Add username support to profiles table

-- 1. Add username column (unique, required)
ALTER TABLE public.profiles
ADD COLUMN username text UNIQUE;

-- 2. Add check constraint for username format (alphanumeric, underscore, hyphen, 3-20 chars)
ALTER TABLE public.profiles
ADD CONSTRAINT username_format CHECK (
  username ~* '^[a-z0-9_-]{3,20}$'
);

-- 3. Add comment for documentation
COMMENT ON COLUMN public.profiles.username IS 
  'REQUIRED: Unique username for login. Alphanumeric, underscore, hyphen only. 3-20 characters.';

-- 4. Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- 5. Create function to check if username exists
CREATE OR REPLACE FUNCTION public.username_exists(_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE LOWER(username) = LOWER(_username)
  );
$$;

-- 6. Create function to get email from username (for login)
CREATE OR REPLACE FUNCTION public.get_email_from_username(_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email
  FROM public.profiles
  WHERE LOWER(username) = LOWER(_username)
  LIMIT 1;
$$;