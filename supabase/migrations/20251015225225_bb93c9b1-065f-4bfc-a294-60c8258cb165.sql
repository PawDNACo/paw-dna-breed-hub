-- Update profile to verified status
UPDATE profiles 
SET is_verified = true, 
    verification_status = 'verified',
    verification_type = 'breeder',
    verification_completed_at = NOW()
WHERE id = '1978451a-f65d-4926-b0db-6ee85d62d738';