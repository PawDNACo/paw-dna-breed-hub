-- Add gender and size fields to buyer_requests table
ALTER TABLE public.buyer_requests 
ADD COLUMN IF NOT EXISTS gender text[],
ADD COLUMN IF NOT EXISTS size text[];

-- Add comment explaining the fields
COMMENT ON COLUMN public.buyer_requests.gender IS 'Array of preferred genders: male, female, or both';
COMMENT ON COLUMN public.buyer_requests.size IS 'Array of preferred sizes: small, medium, large';