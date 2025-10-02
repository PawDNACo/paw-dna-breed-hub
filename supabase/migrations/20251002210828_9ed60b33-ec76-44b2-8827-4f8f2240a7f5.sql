-- Add verification and authentication fields to profiles
ALTER TABLE public.profiles
ADD COLUMN is_verified BOOLEAN DEFAULT false,
ADD COLUMN verification_type TEXT,
ADD COLUMN stripe_identity_session_id TEXT,
ADD COLUMN stripe_identity_verification_token TEXT,
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN verification_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN social_provider TEXT;

-- Update pets table with new listing requirements
ALTER TABLE public.pets
ADD COLUMN parent_images JSONB DEFAULT '[]',
ADD COLUMN birth_date DATE,
ADD COLUMN expected_date DATE,
ADD COLUMN is_special_breed BOOLEAN DEFAULT false,
ADD COLUMN delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery', 'both')),
ADD COLUMN listing_fee_paid BOOLEAN DEFAULT false,
ADD COLUMN listing_fee_amount NUMERIC DEFAULT 0,
ADD COLUMN breeder_earnings_percentage NUMERIC DEFAULT 50;

-- Create messages table for secure communication
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  message_content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  breeder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(buyer_id, pet_id)
);

-- Create pet images table
CREATE TABLE public.pet_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_parent_image BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create breed pricing table for special breeds
CREATE TABLE public.breed_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_name TEXT NOT NULL UNIQUE,
  is_special_breed BOOLEAN DEFAULT false,
  min_price NUMERIC NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breed_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages in approved conversations"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND status = 'approved'
      AND (buyer_id = auth.uid() OR breeder_id = auth.uid())
    )
  );

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = breeder_id);

CREATE POLICY "Buyers can create conversation requests"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Breeders can update conversation status"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = breeder_id);

-- RLS Policies for pet_images
CREATE POLICY "Anyone can view pet images"
  ON public.pet_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Pet owners can manage their pet images"
  ON public.pet_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE id = pet_id AND owner_id = auth.uid()
    )
  );

-- RLS Policies for breed_pricing
CREATE POLICY "Anyone can view breed pricing"
  ON public.breed_pricing
  FOR SELECT
  TO authenticated
  USING (true);

-- Deny anonymous access
CREATE POLICY "Deny anonymous access to messages"
  ON public.messages FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to conversations"
  ON public.conversations FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to pet_images"
  ON public.pet_images FOR ALL TO anon USING (false);

CREATE POLICY "Deny anonymous access to breed_pricing"
  ON public.breed_pricing FOR ALL TO anon USING (false);

-- Function to calculate breeder earnings based on price
CREATE OR REPLACE FUNCTION calculate_breeder_earnings_percentage(sale_price NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
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

-- Insert common special breeds
INSERT INTO public.breed_pricing (breed_name, is_special_breed, min_price) VALUES
  ('French Bulldog', true, 2000),
  ('English Bulldog', true, 2500),
  ('Cavalier King Charles Spaniel', true, 1800),
  ('Samoyed', true, 1500),
  ('Chow Chow', true, 1200),
  ('Tibetan Mastiff', true, 3000),
  ('Rottweiler', true, 1000),
  ('Akita', true, 1200),
  ('Persian Cat', true, 800),
  ('Bengal Cat', true, 1500),
  ('Savannah Cat', true, 2000),
  ('Scottish Fold', true, 1000),
  ('Ragdoll', true, 900),
  ('Sphynx', true, 1500)
ON CONFLICT (breed_name) DO NOTHING;

-- Triggers for updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_breed_pricing_updated_at
  BEFORE UPDATE ON public.breed_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();