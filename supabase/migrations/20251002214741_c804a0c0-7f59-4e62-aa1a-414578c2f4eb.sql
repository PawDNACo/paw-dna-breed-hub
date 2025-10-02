-- Update handle_new_user trigger to capture social provider info

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Capture social provider if available from app_metadata
  INSERT INTO public.profiles (id, email, full_name, social_provider)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    CASE 
      WHEN new.app_metadata->>'provider' = 'google' THEN 'google'
      WHEN new.app_metadata->>'provider' = 'facebook' THEN 'facebook'
      ELSE NULL
    END
  );
  RETURN new;
END;
$$;