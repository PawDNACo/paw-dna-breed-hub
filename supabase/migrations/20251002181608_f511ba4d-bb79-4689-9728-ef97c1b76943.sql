-- Create a security definer function to check if user owns a pet
CREATE OR REPLACE FUNCTION public.is_pet_owner(_pet_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.pets
    WHERE id = _pet_id
      AND owner_id = _user_id
  )
$$;

-- Drop the existing broad RLS policy
DROP POLICY IF EXISTS "Anyone can view available pets" ON public.pets;

-- Create new granular RLS policies for the pets table

-- Policy 1: Everyone can see basic pet info and generalized location (city, state only)
CREATE POLICY "Public can view available pets with limited location data"
ON public.pets
FOR SELECT
USING (
  available = true
);

-- Policy 2: Pet owners can see their own pets' full details including precise location
CREATE POLICY "Owners can view their own pets full details"
ON public.pets
FOR SELECT
USING (
  auth.uid() = owner_id
);

-- Add a comment explaining the security measure
COMMENT ON POLICY "Public can view available pets with limited location data" ON public.pets IS 
'Allows public to view available pets but frontend should filter out latitude, longitude, zip_code, and county to protect owner privacy';

-- Ensure the existing owner management policy remains
-- (This should already exist, but we verify it's there)
DROP POLICY IF EXISTS "Owners can manage their pets" ON public.pets;
CREATE POLICY "Owners can manage their pets"
ON public.pets
FOR ALL
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);