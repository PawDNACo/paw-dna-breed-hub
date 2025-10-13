-- Create signup_intents table to prevent role escalation via browser storage
CREATE TABLE public.signup_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  intended_role app_role NOT NULL,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  -- Only allow valid signup roles (exclude 'admin')
  CONSTRAINT valid_signup_roles CHECK (intended_role IN ('buyer', 'breeder', 'browser'))
);

-- Enable RLS
ALTER TABLE public.signup_intents ENABLE ROW LEVEL SECURITY;

-- Users can insert their own signup intent
CREATE POLICY "Users can insert their own signup intent"
  ON public.signup_intents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own signup intent
CREATE POLICY "Users can read their own signup intent"
  ON public.signup_intents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_signup_intents_user_id ON public.signup_intents(user_id);
CREATE INDEX idx_signup_intents_created_at ON public.signup_intents(created_at);