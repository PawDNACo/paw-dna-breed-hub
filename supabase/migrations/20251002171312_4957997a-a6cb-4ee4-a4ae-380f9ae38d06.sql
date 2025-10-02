-- Create care_packages table for breeders to customize
CREATE TABLE IF NOT EXISTS public.care_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  breeder_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  base_price numeric NOT NULL DEFAULT 149.00,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create accessories table for breeders to add customizable items
CREATE TABLE IF NOT EXISTS public.accessories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  breeder_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.care_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;

-- RLS policies for care_packages
CREATE POLICY "Breeders can manage their own care packages"
ON public.care_packages
FOR ALL
USING (auth.uid() = breeder_id);

CREATE POLICY "Anyone can view active care packages"
ON public.care_packages
FOR SELECT
USING (active = true);

-- RLS policies for accessories
CREATE POLICY "Breeders can manage their own accessories"
ON public.accessories
FOR ALL
USING (auth.uid() = breeder_id);

CREATE POLICY "Anyone can view active accessories"
ON public.accessories
FOR SELECT
USING (active = true);

-- Add triggers for updated_at
CREATE TRIGGER update_care_packages_updated_at
BEFORE UPDATE ON public.care_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at
BEFORE UPDATE ON public.accessories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();