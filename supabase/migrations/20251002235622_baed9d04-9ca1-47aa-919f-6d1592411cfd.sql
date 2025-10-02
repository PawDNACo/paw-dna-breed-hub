-- Update handle_new_user trigger to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Capture social provider if available from app_metadata
  INSERT INTO public.profiles (id, email, full_name, username, social_provider)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'username',
    CASE 
      WHEN new.app_metadata->>'provider' = 'google' THEN 'google'
      WHEN new.app_metadata->>'provider' = 'facebook' THEN 'facebook'
      ELSE NULL
    END
  );
  RETURN new;
END;
$function$;