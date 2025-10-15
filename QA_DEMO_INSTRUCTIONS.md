# QA Demo Site Instructions

## Demo Data Added

The following demo data has been added to the database for QA testing:

### Waitlist Entries
10 demo waitlist signups have been added with various interest combinations:
- Breeders
- Buyers  
- Rehomers
- Just browsing

These can be viewed in the Admin Dashboard under the "Waitlist" tab.

## QA Test Account Setup

To create QA test accounts, please follow these steps:

### Creating QA Accounts

1. **QA Admin Account**
   - Go to the signup page: `/login`
   - Create an account with:
     - Email: `qa.admin@pawdna.test`
     - Password: `QATest2025!`
     - Full name: `QA Admin User`
   - After signup, you'll need to manually assign admin role via database:
     ```sql
     SELECT assign_admin_by_email('qa.admin@pawdna.test');
     ```

2. **QA Breeder Account**
   - Email: `qa.breeder@pawdna.test`
   - Password: `QATest2025!`
   - Full name: `QA Breeder User`
   - Assign breeder role after creation

3. **QA Buyer Account**
   - Email: `qa.buyer@pawdna.test`
   - Password: `QATest2025!`
   - Full name: `QA Buyer User`
   - Assign buyer role after creation

4. **QA Rehomer Account**
   - Email: `qa.rehomer@pawdna.test`
   - Password: `QATest2025!`
   - Full name: `QA Rehomer User`
   - Assign rehomer role after creation

## Demo Pet Listings

To add demo pet listings, use the following SQL:

```sql
-- Insert demo pets (requires a valid owner_id from profiles table)
-- You'll need to replace <OWNER_ID> with actual user IDs after creating accounts

INSERT INTO public.pets (
  name, species, breed, gender, age_months, price, 
  description, available, listing_type, owner_id,
  city, state, zip_code, vaccinated, size
) VALUES
-- Golden Retriever Puppy
('Buddy', 'Dog', 'Golden Retriever', 'Male', 3, 1200.00,
 'Adorable golden retriever puppy, very playful and friendly. Up to date on all vaccinations.',
 true, 'sale', '<BREEDER_USER_ID>', 'Austin', 'TX', '78701', true, 'Medium'),

-- Persian Cat
('Fluffy', 'Cat', 'Persian', 'Female', 6, 800.00,
 'Beautiful Persian cat with long silky fur. Very gentle and loving temperament.',
 true, 'sale', '<BREEDER_USER_ID>', 'Los Angeles', 'CA', '90001', true, 'Small'),

-- Labrador Puppy
('Max', 'Dog', 'Labrador Retriever', 'Male', 2, 1000.00,
 'Energetic lab puppy looking for an active family. Great with kids!',
 true, 'sale', '<BREEDER_USER_ID>', 'Miami', 'FL', '33101', true, 'Large'),

-- Rehoming Adult Dog
('Luna', 'Dog', 'Mixed Breed', 'Female', 24, 150.00,
 'Sweet 2-year-old dog needs a new home due to owner relocation. House trained and friendly.',
 true, 'rehome', '<REHOMER_USER_ID>', 'Seattle', 'WA', '98101', true, 'Medium');
```

## Testing Scenarios

### For QA Team:

1. **Waitlist Testing**
   - Login as admin account
   - Navigate to Admin Dashboard
   - Check Waitlist tab to see demo entries
   - Verify all interest types display correctly

2. **Breeder Workflow**
   - Login as breeder account
   - Create new pet listings
   - Manage existing listings
   - Test care package creation

3. **Buyer Workflow**
   - Login as buyer account
   - Browse pet listings
   - Create buyer requests
   - Test swipe/match feature

4. **Messaging System**
   - Test conversations between different account types
   - Verify message permissions and privacy

5. **Verification Testing**
   - Test identity verification flow
   - Check verification status display

## Important Notes

- All demo accounts use password: `QATest2025!`
- Demo data is for testing purposes only
- Emails use `.test` domain to prevent actual email sends
- Remember to clean up demo data after testing if needed

## Cleanup Script

To remove all demo data after QA testing:

```sql
-- Remove demo waitlist entries
DELETE FROM public.waitlist WHERE email LIKE '%@example.com';

-- Remove demo pets
DELETE FROM public.pets WHERE description LIKE '%demo%' OR description LIKE '%QA%';

-- Remove QA accounts (be careful with this!)
DELETE FROM auth.users WHERE email LIKE 'qa.%@pawdna.test';
```
