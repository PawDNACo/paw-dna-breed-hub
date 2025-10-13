-- Create match preferences table for DNA-based matching
CREATE TABLE public.match_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  breed_preferences text[],
  personality_traits text[],
  lifestyle_compatibility jsonb,
  genetic_health_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create swipes table to track swipe actions
CREATE TABLE public.swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  swiped_id uuid NOT NULL, -- can be user_id or pet_id
  swiped_type text NOT NULL CHECK (swiped_type IN ('user', 'pet')),
  swipe_direction text NOT NULL CHECK (swipe_direction IN ('left', 'right', 'super')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(swiper_id, swiped_id, swiped_type)
);

-- Create matches table for mutual right swipes
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
  match_type text NOT NULL CHECK (match_type IN ('user_user', 'user_pet')),
  matched_at timestamp with time zone DEFAULT now(),
  notification_sent boolean DEFAULT false,
  CHECK (
    (match_type = 'user_user' AND user2_id IS NOT NULL AND pet_id IS NULL) OR
    (match_type = 'user_pet' AND pet_id IS NOT NULL)
  )
);

-- Create favorites table
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  favorited_id uuid NOT NULL,
  favorited_type text NOT NULL CHECK (favorited_type IN ('user', 'pet')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, favorited_id, favorited_type)
);

-- Enable RLS
ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for match_preferences
CREATE POLICY "Users can manage their own preferences"
ON public.match_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for swipes
CREATE POLICY "Users can view their own swipes"
ON public.swipes
FOR SELECT
USING (auth.uid() = swiper_id);

CREATE POLICY "Users can create their own swipes"
ON public.swipes
FOR INSERT
WITH CHECK (auth.uid() = swiper_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
ON public.matches
FOR SELECT
USING (
  auth.uid() = user1_id OR 
  auth.uid() = user2_id OR
  (match_type = 'user_pet' AND EXISTS (
    SELECT 1 FROM pets WHERE pets.id = matches.pet_id AND pets.owner_id = auth.uid()
  ))
);

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites"
ON public.favorites
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_id, swiped_type);
CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_matches_pet ON public.matches(pet_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_match_preferences_updated_at
BEFORE UPDATE ON public.match_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();