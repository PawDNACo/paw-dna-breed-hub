-- Fix handle_new_user trigger to use correct metadata field names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Capture social provider if available from raw_app_meta_data
  INSERT INTO public.profiles (id, email, full_name, username, social_provider)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'username',
    CASE 
      WHEN new.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      WHEN new.raw_app_meta_data->>'provider' = 'facebook' THEN 'facebook'
      ELSE NULL
    END
  );
  RETURN new;
END;
$function$;