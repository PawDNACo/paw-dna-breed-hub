# PawDNA - Pet Breeding Marketplace

A comprehensive pet breeding marketplace connecting responsible breeders with loving pet owners.

## Project Info

**URL**: https://lovable.dev/projects/b0c50632-8ae4-4cb2-85f2-a7512b4e4743

## Features

- **Verified Users**: Stripe Identity verification for all users
- **Secure Transactions**: Stripe-powered payment processing
- **Role-Based Access**: Admin, Breeder, and Buyer roles
- **Pet Listings**: Browse and list dogs and cats
- **Messaging System**: Secure communication between buyers and breeders
- **Trust & Safety**: RLS policies, rate limiting, and comprehensive security

## Developer Dashboard

### Accessing the Developer Dashboard

1. **Sign up/Login**: Create an account at `/auth`
2. **Get Admin Access**: Have an admin assign you the "admin" role in the database
3. **Access Dashboard**: Navigate to `/developer` to access the full-stack management interface

### Dashboard Features

#### Overview Tab
- Real-time statistics (users, pets, verified accounts)
- Quick links to admin and backend tools

#### Users Tab
- View all registered users
- Assign roles (admin, breeder, buyer)
- View verification status
- Monitor account status

#### Database Tab
- Direct access to backend dashboard
- View database structure
- Monitor recent pet listings
- Toggle pet availability

#### Security Tab
- View security configurations
- RLS status
- Rate limiting info
- Identity verification status

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b0c50632-8ae4-4cb2-85f2-a7512b4e4743) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Payments**: Stripe
- **Identity**: Stripe Identity
- **Hosting**: Lovable Cloud

## Database Schema

Key tables:
- `profiles`: User profiles with verification status
- `user_roles`: Role-based access control (admin, breeder, buyer)
- `pets`: Pet listings
- `conversations`: Message threads
- `messages`: Direct messages
- `sales`: Transaction records
- `frozen_funds`: Security holds
- `user_reports`: Trust & safety reports

## Security Features

1. **Row Level Security (RLS)** - All tables protected with RLS policies
2. **Identity Verification** - Stripe Identity integration required for listing/purchasing
3. **Rate Limiting** - Edge function rate limits on sensitive operations
4. **Screenshot Prevention** - Privacy protection for sensitive data
5. **Input Validation** - Zod schemas for all user inputs

## Making Changes

### Frontend Changes
1. Edit components in `/src/components`
2. Pages in `/src/pages`
3. Styles in `/src/index.css` and `tailwind.config.ts`

### Backend Changes
1. **Database migrations**: Use the Lovable Cloud migration tool
2. **Edge functions**: Create in `/supabase/functions`
3. **RLS policies**: Apply via SQL migrations

### Testing
- Sign in with test account
- Access developer dashboard at `/developer`
- Use admin tools for testing

## API Documentation

### Authentication
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    emailRedirectTo: window.location.origin
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Database Queries
```typescript
// Fetch pets
const { data: pets } = await supabase
  .from('pets')
  .select('*')
  .eq('available', true);

// Create pet listing (requires authentication)
const { data, error } = await supabase
  .from('pets')
  .insert({
    name: 'Max',
    species: 'dog',
    breed: 'Labrador',
    price: 1500
  });
```

### Role Management

To assign roles (requires admin access):
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin');
```

Available roles:
- `buyer`: Can purchase pets
- `breeder`: Can list pets
- `admin`: Full system access

## Deployment

Simply open [Lovable](https://lovable.dev/projects/b0c50632-8ae4-4cb2-85f2-a7512b4e4743) and click on Share → Publish.

## Custom Domain

You can connect a custom domain by navigating to Project > Settings > Domains and clicking Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Support

- Documentation: [Lovable Docs](https://docs.lovable.dev)
- Developer Dashboard: `/developer` (admin access required)
- Backend Dashboard: Access via navigation bar when logged in

## License

Proprietary - All rights reserved
