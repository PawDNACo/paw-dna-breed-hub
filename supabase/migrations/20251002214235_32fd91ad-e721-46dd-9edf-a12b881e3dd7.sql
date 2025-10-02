-- Fix username column to be nullable initially (set during signup)
-- Users must set username during signup, but profile is created by trigger first

ALTER TABLE public.profiles
ALTER COLUMN username DROP NOT NULL;