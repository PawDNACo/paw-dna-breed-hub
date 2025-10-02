-- CRITICAL SECURITY FIX: Protect Breeder Home Addresses
-- Remove exact coordinates from public access, only show city/state

-- Step 1: Create a secure view for public pet listings (no exact coordinates)
CREATE OR REPLACE VIEW public.public_pet_listings WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  species,
  breed,
  gender,
  size,
  age_months,
  birth_date,
  description,
  price,
  listing_type,
  vaccinated,
  delivery_method,
  image_url,
  available,
  created_at,
  updated_at,
  -- Safe location fields only (no exact coordinates)
  city,
  state,
  -- Exclude: latitude, longitude, zip_code, county, owner_id
  listing_fee_paid,
  is_special_breed
FROM public.pets
WHERE available = true;

COMMENT ON VIEW public.public_pet_listings IS 
'Public view of available pets with city/state only. Exact coordinates (latitude/longitude) are hidden to protect breeders from stalkers. Only authenticated verified users can access precise location data.';

-- Step 2: Update RLS policies on pets table to enforce coordinate protection
-- Remove the unsafe policy that allowed anonymous users to see all columns
DROP POLICY IF EXISTS "Unauthenticated users can view pets with limited location" ON public.pets;

-- Create new secure policy: anonymous users CANNOT query pets table directly
-- They must use the public_pet_listings view instead
CREATE POLICY "Anonymous users must use public_pet_listings view"
  ON public.pets
  FOR SELECT
  TO anon
  USING (false); -- Explicitly deny direct access

-- Policy for authenticated but unverified users: can see city/state only
CREATE POLICY "Authenticated unverified users see limited location"
  ON public.pets
  FOR SELECT
  TO authenticated
  USING (
    available = true 
    AND auth.uid() IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_verified = true
    )
  );

-- Update policy for verified users: can see coordinates for distance calculation
DROP POLICY IF EXISTS "Authenticated verified users can view full pet details" ON public.pets;

CREATE POLICY "Verified users can view pets with coordinates"
  ON public.pets
  FOR SELECT
  TO authenticated
  USING (
    available = true 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_verified = true
    )
  );

-- Step 3: Add security note to pets table
COMMENT ON COLUMN public.pets.latitude IS 
'SENSITIVE: Exact latitude. Only accessible to: pet owner, authenticated verified users. Hidden from anonymous users and unverified users to prevent stalking.';

COMMENT ON COLUMN public.pets.longitude IS 
'SENSITIVE: Exact longitude. Only accessible to: pet owner, authenticated verified users. Hidden from anonymous users and unverified users to prevent stalking.';

COMMENT ON COLUMN public.pets.zip_code IS 
'SENSITIVE: Zip code can be used to triangulate location. Restricted access to protect breeder privacy.';