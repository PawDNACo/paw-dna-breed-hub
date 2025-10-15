# QA Demo Site Credentials

## Demo User Accounts

To create QA test accounts, please sign up using the following credentials:

### Test Admin Account
- **Email**: `qa-admin@pawdna.test`
- **Password**: `QATest2025!`
- **Role**: Admin (will need to be assigned via database)

### Test Breeder Account
- **Email**: `qa-breeder@pawdna.test`
- **Password**: `QATest2025!`
- **Role**: Breeder

### Test Buyer Account
- **Email**: `qa-buyer@pawdna.test`
- **Password**: `QATest2025!`
- **Role**: Buyer

### Test Rehomer Account
- **Email**: `qa-rehomer@pawdna.test`
- **Password**: `QATest2025!`
- **Role**: Rehomer

## Setting Up Demo Accounts

1. **Sign up** using the credentials above at `/login`
2. **Complete profile** with demo information
3. **For Admin role assignment**, run this SQL in the database:

```sql
-- After creating the qa-admin@pawdna.test account, assign admin role
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users
SELECT assign_admin_by_email('qa-admin@pawdna.test');
```

## Demo Data Available

### Waitlist Entries
The system now contains 10 demo waitlist entries with various interests:
- Sarah Johnson - breeder, buyer
- Mike Peterson - buyer
- Emily Chen - breeder
- David Rodriguez - rehomer
- Jessica Williams - just browsing
- Robert Taylor - buyer, rehomer
- Amanda Martinez - breeder
- Chris Anderson - just browsing
- Lisa Thompson - buyer, breeder
- Kevin Brown - rehomer, just browsing

### Creating Demo Pet Listings

After signing in as a breeder, you can create demo pet listings with:
- Various breeds (Golden Retriever, Persian Cat, etc.)
- Different price points
- Multiple locations across the US
- Different availability statuses

### Testing Workflows

1. **Breeder Flow**:
   - Sign in as qa-breeder@pawdna.test
   - Create pet listings
   - Manage care packages
   - View breeder dashboard

2. **Buyer Flow**:
   - Sign in as qa-buyer@pawdna.test
   - Browse available pets
   - Save favorites
   - Request conversations with breeders

3. **Admin Flow**:
   - Sign in as qa-admin@pawdna.test
   - View admin dashboard
   - Check waitlist signups
   - Monitor platform statistics

## Important Notes

- All demo accounts use the same password: `QATest2025!`
- Demo data is for testing purposes only
- Do not use these credentials in production
- Regularly clear demo data to maintain database cleanliness
- All demo emails use the `.test` TLD to avoid conflicts with real users

## Additional Demo Data Setup

If you need to populate more demo data:

1. **Pets**: Create via the breeder dashboard or use the Generate Pet Listings tool
2. **Conversations**: Start conversations between test accounts
3. **Subscriptions**: Purchase test subscriptions using Stripe test mode
4. **Transactions**: Complete test purchases between demo accounts

## Resetting Demo Data

To clear demo data:

```sql
-- Delete demo waitlist entries
DELETE FROM public.waitlist WHERE email LIKE '%@example.com';

-- Delete demo user accounts (be careful!)
-- This requires admin access to auth.users table
```
