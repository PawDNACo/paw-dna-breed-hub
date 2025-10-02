-- Add location fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Add location fields to pets table
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Create buyer_requests table for buyers to post breed requests
CREATE TABLE IF NOT EXISTS public.buyer_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  species text NOT NULL,
  breed text NOT NULL,
  description text,
  max_price numeric,
  zip_code text,
  city text,
  state text,
  county text,
  latitude numeric,
  longitude numeric,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on buyer_requests
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for buyer_requests
CREATE POLICY "Users can view active buyer requests in their region"
ON public.buyer_requests
FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can manage their own buyer requests"
ON public.buyer_requests
FOR ALL
USING (auth.uid() = user_id);

-- Add trigger for updating updated_at
CREATE TRIGGER update_buyer_requests_updated_at
BEFORE UPDATE ON public.buyer_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate distance between two points (in miles)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 numeric,
  lon1 numeric,
  lat2 numeric,
  lon2 numeric
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
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