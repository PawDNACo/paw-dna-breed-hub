# QA Demo Site - Test Credentials

## Access Requirements
The QA/Demo site is restricted to users with either:
- **QA Role** - Quality assurance testers
- **Developer Role** - Development team members with full access

## Test Account Credentials

### Admin Account
- **Email:** qa-admin@pawdna.test
- **Password:** QATest2025!
- **Roles:** admin, breeder, buyer, developer
- **Access:** Full system access including admin dashboard and QA/Demo site

### QA Tester Account
- **Email:** qa-tester@pawdna.test
- **Password:** QATest2025!
- **Roles:** qa
- **Access:** QA/Demo site access for testing

### Breeder Account
- **Email:** qa-breeder@pawdna.test
- **Password:** QATest2025!
- **Roles:** breeder
- **Features:** Can list pets, manage care packages, view breeder dashboard

### Buyer Account
- **Email:** qa-buyer@pawdna.test
- **Password:** QATest2025!
- **Roles:** buyer
- **Features:** Can browse pets, create buyer requests, manage favorites

### Rehomer Account
- **Email:** qa-rehomer@pawdna.test
- **Password:** QATest2025!
- **Roles:** buyer (rehomers use buyer role with rehoming subscription)
- **Features:** Can list pets for rehoming, manage subscriptions

## Setting Up Demo Accounts

1. **Sign up** using the credentials above at `/login`
2. **Complete profile** with demo information
3. **Assign roles** using the SQL commands below

## Assigning Roles

### Assign QA Role
To assign the QA role to a user, run this SQL in the backend:

```sql
-- Replace 'qa-tester@pawdna.test' with the actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'qa'
FROM public.profiles
WHERE email = 'qa-tester@pawdna.test'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Assign Developer Role
To assign the developer role to a user, run this SQL in the backend:

```sql
-- Replace email with the actual developer email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'developer'
FROM public.profiles
WHERE email = 'qa-admin@pawdna.test'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Assign Admin Role (includes admin, breeder, buyer)
```sql
-- This function assigns admin, breeder, and buyer roles
SELECT assign_admin_by_email('qa-admin@pawdna.test');
```

### Assign Breeder Role
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'breeder'
FROM public.profiles
WHERE email = 'qa-breeder@pawdna.test'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Assign Buyer Role
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'buyer'
FROM public.profiles
WHERE email = 'qa-buyer@pawdna.test'
ON CONFLICT (user_id, role) DO NOTHING;
```

## Demo Data Available

### Pet Listings
- Sample pets available in Browse section
- Various species: Dogs, Cats
- Different price ranges and locations
- Mix of available, pending, and sold status

### Conversations
- Sample conversations between buyers and breeders
- Different conversation states (pending, approved, completed)

### Transactions
- Sample sales records
- Payout tracking examples
- Transaction history

## Testing Workflows

### QA Testing Workflow
1. Login with QA credentials (qa-tester@pawdna.test)
2. Access QA/Demo site from footer (Developer > QA/Demo)
3. View demo data for all user types
4. Test workflows without affecting production data
5. Report issues found during testing

### Developer Testing Workflow
1. Login with developer/admin credentials (qa-admin@pawdna.test)
2. Full unrestricted access to QA/Demo site
3. Can view and test all features
4. Can modify demo data for testing scenarios
5. Access to developer dashboard for additional tools

### Breeder Testing Workflow
1. Sign in as qa-breeder@pawdna.test
2. Create pet listings
3. Manage care packages
4. View breeder dashboard

### Buyer Testing Workflow
1. Sign in as qa-buyer@pawdna.test
2. Browse available pets
3. Save favorites
4. Request conversations with breeders

### Admin Testing Workflow
1. Sign in as qa-admin@pawdna.test
2. View admin dashboard
3. Access QA/Demo site
4. Monitor platform statistics

## Important Notes
- All test accounts use the password: **QATest2025!**
- QA and Developer roles have access to the QA/Demo site
- Demo data is for testing purposes only
- Do not use these credentials in production
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
-- Delete demo pet listings created by test accounts
DELETE FROM public.pets WHERE owner_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@pawdna.test'
);

-- Clear demo conversations
DELETE FROM public.conversations WHERE buyer_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@pawdna.test'
);
```
