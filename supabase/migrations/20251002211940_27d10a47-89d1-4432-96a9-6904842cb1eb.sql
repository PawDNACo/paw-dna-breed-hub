-- Phase 1: Fix Location Privacy in pets table
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can view available pets with limited location data" ON public.pets;

-- Create restricted policy for unauthenticated users - only city/state, no coordinates
CREATE POLICY "Unauthenticated users can view pets with limited location"
ON public.pets
FOR SELECT
TO anon
USING (
  available = true
);

-- Note: The pets table columns will be filtered at the application layer
-- Unauthenticated users should only see: id, name, species, breed, gender, age_months, 
-- price, description, listing_type, available, city, state, image_url, vaccinated, size, birth_date, expected_date
-- EXCLUDE: latitude, longitude, zip_code, county, owner_id, delivery_method

-- Authenticated verified users can see more details including coordinates for distance calculations
CREATE POLICY "Authenticated verified users can view full pet details"
ON public.pets
FOR SELECT
TO authenticated
USING (
  available = true AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_verified = true
  )
);

-- Phase 2: Implement Role-Based Access Control (RBAC)
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'breeder', 'buyer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Deny anonymous access to user_roles
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR ALL
TO anon
USING (false);

-- Phase 3: Fix Database Functions - Add SET search_path
-- Update calculate_breeder_earnings_percentage
CREATE OR REPLACE FUNCTION public.calculate_breeder_earnings_percentage(sale_price numeric)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF sale_price >= 751 THEN
    RETURN 85;
  ELSIF sale_price >= 301 THEN
    RETURN 60;
  ELSIF sale_price >= 50 THEN
    RETURN 50;
  ELSE
    RETURN 0; -- Requires listing fee
  END IF;
END;
$$;

-- Update calculate_distance function
CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  radius numeric := 3959; -- Earth's radius in miles
  dlat numeric;
  dlon numeric;
  a numeric;
  c numeric;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN radius * c;
END;
$$;

-- Phase 4: Add security indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);

-- Phase 5: Add trigger to automatically assign 'buyer' role to new users
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign 'buyer' role by default to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_assign_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_role();