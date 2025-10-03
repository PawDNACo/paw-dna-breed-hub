-- Update the handle_new_user function to include phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Capture social provider and phone if available from raw_user_meta_data
  INSERT INTO public.profiles (id, email, full_name, username, phone, social_provider)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone',
    CASE 
      WHEN new.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      WHEN new.raw_app_meta_data->>'provider' = 'facebook' THEN 'facebook'
      ELSE NULL
    END
  );
  RETURN new;
END;
$function$;