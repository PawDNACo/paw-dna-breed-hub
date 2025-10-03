-- Add buy_pup_kit role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'buy_pup_kit';