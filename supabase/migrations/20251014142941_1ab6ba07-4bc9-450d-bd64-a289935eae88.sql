-- Create lost_pets table for public lost and found listings
CREATE TABLE public.lost_pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pet_name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  description TEXT NOT NULL,
  last_seen_location TEXT NOT NULL,
  last_seen_date DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'lost',
  city TEXT,
  state TEXT,
  zip_code TEXT
);

-- Enable RLS
ALTER TABLE public.lost_pets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view lost pets
CREATE POLICY "Anyone can view lost pets"
  ON public.lost_pets
  FOR SELECT
  USING (true);

-- Allow anyone to create lost pet listings (no auth required)
CREATE POLICY "Anyone can create lost pet listings"
  ON public.lost_pets
  FOR INSERT
  WITH CHECK (true);

-- Create index for searching
CREATE INDEX idx_lost_pets_status ON public.lost_pets(status);
CREATE INDEX idx_lost_pets_location ON public.lost_pets(city, state);
CREATE INDEX idx_lost_pets_species ON public.lost_pets(species);

-- Create trigger for updated_at
CREATE TRIGGER update_lost_pets_updated_at
  BEFORE UPDATE ON public.lost_pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();