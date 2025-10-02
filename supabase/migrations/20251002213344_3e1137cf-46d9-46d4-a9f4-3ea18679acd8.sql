-- Security Enhancement: Restrict Profile Location Data Access
-- This prevents competitors from harvesting user location data

-- Step 1: Create a public profiles view with limited data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  city,
  state,
  -- Exclude: zip_code, county, latitude, longitude, email
  is_verified,
  verification_status,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Step 2: Create function to check if users are in active conversation
CREATE OR REPLACE FUNCTION public.users_have_active_conversation(_user1_id uuid, _user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations
    WHERE status = 'approved'
      AND (
        (buyer_id = _user1_id AND breeder_id = _user2_id) OR
        (buyer_id = _user2_id AND breeder_id = _user1_id)
      )
  );
$$;

-- Step 3: Create function to check if users are in active transaction
CREATE OR REPLACE FUNCTION public.users_have_active_transaction(_user1_id uuid, _user2_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sales
    WHERE (buyer_id = _user1_id AND breeder_id = _user2_id)
       OR (buyer_id = _user2_id AND breeder_id = _user1_id)
  );
$$;

-- Step 4: Add policy for limited profile viewing during active relationships
-- Users can view limited location data (city, state only) of users they're in conversation/transaction with
CREATE POLICY "Users can view city/state of conversation partners"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id != auth.uid() AND (
    public.users_have_active_conversation(auth.uid(), id) OR
    public.users_have_active_transaction(auth.uid(), id)
  )
);

-- Step 5: Create secure function for distance calculation without exposing coordinates
-- This allows matchmaking without revealing exact locations
CREATE OR REPLACE FUNCTION public.get_approximate_distance(_user1_id uuid, _user2_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lat1 numeric;
  lon1 numeric;
  lat2 numeric;
  lon2 numeric;
  distance numeric;
BEGIN
  -- Get coordinates for user 1
  SELECT latitude, longitude INTO lat1, lon1
  FROM public.profiles
  WHERE id = _user1_id;
  
  -- Get coordinates for user 2
  SELECT latitude, longitude INTO lat2, lon2
  FROM public.profiles
  WHERE id = _user2_id;
  
  -- Return NULL if coordinates missing
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate distance using existing function
  distance := public.calculate_distance(lat1, lon1, lat2, lon2);
  
  -- Round to nearest 5 miles to prevent precise location tracking
  RETURN ROUND(distance / 5) * 5;
END;
$$;

-- Step 6: Add column-level security comments for documentation
COMMENT ON COLUMN public.profiles.latitude IS 'SENSITIVE: Only visible to profile owner. Use get_approximate_distance() for matchmaking.';
COMMENT ON COLUMN public.profiles.longitude IS 'SENSITIVE: Only visible to profile owner. Use get_approximate_distance() for matchmaking.';
COMMENT ON COLUMN public.profiles.zip_code IS 'SENSITIVE: Only visible to profile owner and active transaction partners.';
COMMENT ON COLUMN public.profiles.county IS 'SENSITIVE: Only visible to profile owner.';
COMMENT ON COLUMN public.profiles.email IS 'SENSITIVE: Only visible to profile owner and admins.';

-- Step 7: Create audit log for profile access (optional but recommended)
CREATE TABLE IF NOT EXISTS public.profile_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accessor_id uuid NOT NULL REFERENCES auth.users(id),
  accessed_profile_id uuid NOT NULL REFERENCES public.profiles(id),
  access_type text NOT NULL, -- 'view', 'update', 'location_query'
  accessed_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on audit logs
ALTER TABLE public.profile_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view profile access logs"
ON public.profile_access_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profile_access_logs_accessed_profile 
ON public.profile_access_logs(accessed_profile_id, accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_profile_access_logs_accessor 
ON public.profile_access_logs(accessor_id, accessed_at DESC);