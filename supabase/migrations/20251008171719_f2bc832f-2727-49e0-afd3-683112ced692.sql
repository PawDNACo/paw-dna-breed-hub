-- Add trial tracking fields to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS trial_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false;

-- Create table to track trial reminders
CREATE TABLE IF NOT EXISTS public.trial_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('24_hours', '48_hours', 'day_of')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_via TEXT NOT NULL CHECK (sent_via IN ('email', 'sms', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on trial_reminders
ALTER TABLE public.trial_reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own trial reminders
CREATE POLICY "Users can view their own trial reminders"
ON public.trial_reminders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Deny direct modifications
CREATE POLICY "Deny direct modifications to trial_reminders"
ON public.trial_reminders
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_trial_reminders_subscription 
ON public.trial_reminders(subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_end 
ON public.subscriptions(trial_end) 
WHERE is_trial = true AND status = 'active';