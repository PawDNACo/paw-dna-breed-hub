-- Enable realtime for buyer_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE public.buyer_requests;

-- Enable realtime for pets table
ALTER PUBLICATION supabase_realtime ADD TABLE public.pets;