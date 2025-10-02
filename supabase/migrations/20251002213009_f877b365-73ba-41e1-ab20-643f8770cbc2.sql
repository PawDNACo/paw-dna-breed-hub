-- Create admin user helper function (temporary, for initial setup)
-- This will be used to assign admin role to the specified email after signup

-- First, let's create a function to easily assign admin role by email
CREATE OR REPLACE FUNCTION public.assign_admin_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Get user ID from profiles by email
  SELECT id INTO _user_id
  FROM public.profiles
  WHERE email = _email
  LIMIT 1;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', _email;
  END IF;
  
  -- Assign admin role (insert if not exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Also assign breeder and buyer roles for full access
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'breeder')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'buyer')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user: %', _email;
END;
$$;

-- Note: The user needs to sign up first at /auth with these credentials:
-- Email: bellarose92@pawdna.com
-- Password: PawDNA#2025!Secure$Admin
-- Name: Chelsey Morgan
--
-- After signup, run this to assign admin role:
-- SELECT assign_admin_by_email('bellarose92@pawdna.com');