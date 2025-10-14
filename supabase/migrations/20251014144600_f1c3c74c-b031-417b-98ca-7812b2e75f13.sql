-- Create storage bucket for lost pet photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lost-pets', 'lost-pets', true);

-- Allow anyone to upload photos to lost-pets bucket
CREATE POLICY "Anyone can upload lost pet photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lost-pets');

-- Allow public access to view lost pet photos
CREATE POLICY "Anyone can view lost pet photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lost-pets');