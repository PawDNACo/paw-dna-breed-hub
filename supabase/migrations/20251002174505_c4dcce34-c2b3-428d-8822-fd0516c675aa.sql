-- Create sales table to track pet sales and payout timing
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  breeder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_price NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  breeder_earnings NUMERIC NOT NULL DEFAULT 0,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  funds_available_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '72 hours'),
  payout_status TEXT NOT NULL DEFAULT 'pending',
  payout_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_payout_status CHECK (payout_status IN ('pending', 'available', 'paid', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Breeders can view their own sales
CREATE POLICY "Breeders can view their own sales" 
ON public.sales 
FOR SELECT 
USING (auth.uid() = breeder_id);

-- Buyers can view their own purchases
CREATE POLICY "Buyers can view their purchases" 
ON public.sales 
FOR SELECT 
USING (auth.uid() = buyer_id);

-- Only authenticated users can insert sales (typically through application logic)
CREATE POLICY "Authenticated users can create sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_sales_breeder_id ON public.sales(breeder_id);
CREATE INDEX idx_sales_buyer_id ON public.sales(buyer_id);
CREATE INDEX idx_sales_payout_status ON public.sales(payout_status);
CREATE INDEX idx_sales_funds_available_date ON public.sales(funds_available_date);