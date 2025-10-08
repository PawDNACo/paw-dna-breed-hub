# PawDNA Security Guide

**Last Updated: 2025-10-03**  
**Status: ✅ All Critical Security Issues Resolved**

## Overview

PawDNA implements comprehensive security measures to protect user data, prevent fraud, and ensure safe transactions between breeders and buyers.

## 🔒 Recent Security Fixes (2025-10-03)

### Critical Issues Resolved:

1. ✅ **Customer Email & Phone Protection** (2025-10-03)
   - Added comprehensive audit logging for all email/phone access attempts
   - Enhanced `get_email_from_username` function with access logging
   - Implemented "Prevent bulk profile enumeration" RLS policy
   - Added database comments marking email/phone as SENSITIVE PII
   - Updated edge functions to log security events when accessing profiles

2. ✅ **Conversation Partner Profile Security** (2025-10-03)
   - Recreated `conversation_partner_profiles` view with `security_invoker = true`
   - Added explicit `auth.uid() IS NOT NULL` check to prevent anonymous access
   - Revoked ALL permissions from anonymous and public roles
   - Granted SELECT only to authenticated users
   - Created secure `get_conversation_partner_profile()` function with audit logging
   - View now requires both authentication AND active conversation/transaction

3. ✅ **Financial Transaction History Protection** (2025-10-02)
   - Added explicit RLS denial for anonymous users on `sales` table
   - Recreated `my_transactions` view with `security_invoker = true`
   - Strengthened participant-only access validation

4. ✅ **Sales Record Creation Security** (2025-10-02)
   - Confirmed only `complete-purchase` edge function can create sales
   - Service role key bypasses RLS for authorized creation
   - All client-side INSERT attempts blocked: `WITH CHECK (false)`

5. ✅ **Bot Scraping Prevention** (2025-10-02)
   - Strengthened profile RLS with explicit anonymous denial
   - Added system-managed field protection (is_verified, account_status, etc.)
   - Enhanced audit logging for profile access

6. ✅ **PII Exposure Prevention** (2025-10-02)
   - Added database comments marking sensitive fields
   - Implemented UPDATE policy preventing modification of system-managed fields
   - Ensured all views use `security_invoker = true`

## Critical Data Protection

### Payment Verification Tokens

#### Problem
Stripe identity verification tokens (`stripe_identity_verification_token`, `stripe_identity_session_id`) could be stolen and misused to impersonate users or manipulate verification status.

#### Solution
- **RLS Policy**: Only the authenticated user can view their own payment tokens
- **Database Security**: Sensitive columns explicitly marked as "SECURITY CRITICAL"
- **Code Enforcement**: All profile queries use secure views that exclude payment tokens
- **Zero Exposure**: Tokens NEVER returned in any query except user's own profile

```sql
-- Only owner can see payment tokens
COMMENT ON COLUMN profiles.stripe_identity_verification_token IS 
  'SECURITY CRITICAL: Payment verification token. Only visible to profile owner.';
```

### Email Address Privacy

#### Problem
User email addresses could be harvested by spammers, competitors, or used for phishing attacks. Phone numbers could be used for unsolicited contact or harassment.

#### Solution
- **Complete Isolation**: Email addresses and phone numbers NEVER exposed to other users
- **RLS Policy**: Emails/phones only visible to profile owner via "Prevent bulk profile enumeration" policy
- **Secure Views**: `public_profiles` and `conversation_partner_profiles` explicitly exclude email/phone columns
- **Audit Logging**: All access to email/phone fields logged in `email_access_log` table
- **Function Logging**: `get_email_from_username` logs every email lookup attempt
- **No Bulk Access**: Impossible to query multiple user emails or phone numbers

```sql
-- Email & Phone never exposed to other users - Access is logged
COMMENT ON COLUMN profiles.email IS 
  'SENSITIVE PII - Access is logged in email_access_log. Only access via security definer functions or with proper authorization.';
  
COMMENT ON COLUMN profiles.phone IS 
  'SENSITIVE PII - Access is logged. Only access via security definer functions or with proper authorization.';
```

### Location Data Protection

#### Problem
User location data (addresses, GPS coordinates) is highly sensitive. Competitors could harvest this data to:
- Identify and target breeders
- Map user locations
- Steal business opportunities
- Exploit unverified users

#### Solution - Multi-layered Protection System

##### 1. Row Level Security (RLS)
```sql
-- Users can ONLY view their own complete profile
CREATE POLICY "Authenticated users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Dangerous policy REMOVED: No direct access to profiles table by others
-- All external access must use secure views
```

##### 2. Secure Views (with security_invoker=true)
```sql
-- Public profiles: Limited safe data only
CREATE VIEW public_profiles WITH (security_invoker=true) AS
SELECT id, full_name, city, state, is_verified, verification_status, created_at
FROM profiles;
-- ❌ Excluded: email, phone, zip_code, county, GPS coordinates, payment tokens

-- Conversation partner profiles: Requires active relationship AND authentication
CREATE VIEW conversation_partner_profiles WITH (security_invoker=true) AS
SELECT id, full_name, city, state, is_verified, verification_status
FROM profiles p
WHERE 
  -- SECURITY: Require authentication first
  auth.uid() IS NOT NULL
  AND (
    -- Only show profiles with approved conversations
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.status = 'approved'
        AND ((c.buyer_id = auth.uid() AND c.breeder_id = p.id) OR
             (c.breeder_id = auth.uid() AND c.buyer_id = p.id))
    )
    OR
    -- Or completed transactions
    EXISTS (
      SELECT 1 FROM sales s
      WHERE (s.buyer_id = auth.uid() AND s.breeder_id = p.id) OR
            (s.breeder_id = auth.uid() AND s.buyer_id = p.id)
    )
  );

-- CRITICAL SECURITY MEASURES for conversation_partner_profiles:
-- 1. security_invoker = true (uses querying user's permissions)
-- 2. auth.uid() IS NOT NULL check (blocks all anonymous queries)
-- 3. WHERE clause filtering with auth.uid()
-- 4. Anonymous access explicitly REVOKED:
REVOKE ALL ON conversation_partner_profiles FROM anon;
REVOKE ALL ON conversation_partner_profiles FROM public;
GRANT SELECT ON conversation_partner_profiles TO authenticated;

-- 5. Audit logging function available for sensitive operations:
SELECT * FROM get_conversation_partner_profile('user-id');
-- This function logs all access attempts to profile_access_logs
```

##### 3. Approximate Distance Function
```typescript
// Returns distance rounded to nearest 5 miles
const distance = await getApproximateDistance(user1Id, user2Id);
// Example: 23 miles becomes 25 miles (prevents precise location triangulation)
```

##### 4. Secure Partner Location Function
```sql
-- Returns ONLY city/state for active partners
CREATE FUNCTION get_partner_location(_partner_id uuid)
RETURNS TABLE(city text, state text)
-- Automatically verifies active conversation or transaction
```

##### 5. Audit Logging
All profile accesses logged in `profile_access_logs` and `security_audit_log`:
```typescript
security_audit_log {
  user_id: uuid,
  action: string,
  table_name: string,
  details: jsonb,
  ip_address: inet,
  created_at: timestamp
}
```

### Developer Guidelines

#### ✅ DO:
```typescript
// Use public profile view for other users (NEVER query profiles table)
import { getPublicProfile, getConversationPartnerProfile, getPartnerLocation } from '@/lib/profileSecurity';

// For any user
const profile = await getPublicProfile(userId); // Safe: only public fields

// For conversation partners
const partner = await getConversationPartnerProfile(partnerId); // Requires active relationship

// For partner location (city/state only)
const location = await getPartnerLocation(partnerId); // Returns { city, state }

// Use approximate distance for matchmaking
import { getApproximateDistance } from '@/lib/profileSecurity';
const distance = await getApproximateDistance(myId, theirId); // Rounded to 5 miles
```

#### ❌ DON'T:
```typescript
// NEVER query profiles table for other users
const { data } = await supabase
  .from('profiles')
  .select('*')
  .neq('id', myId); // ❌ BLOCKED BY RLS

// NEVER expose sensitive fields
console.log(profile.email); // ❌ NEVER - emails are private
console.log(profile.stripe_identity_verification_token); // ❌ NEVER - payment tokens are private
console.log(`User at ${lat}, ${lng}`); // ❌ NEVER - exact coordinates are private
console.log(profile.zip_code); // ❌ NEVER - zip codes enable location targeting

// NEVER create bulk export APIs
const allUsers = await getAllProfiles(); // ❌ MAJOR SECURITY RISK

// NEVER pass sensitive data to external APIs
sendWhatsApp(`Contact ${user.email}`); // ❌ PRIVACY VIOLATION
```

### Data Classification

**🔴 NEVER EXPOSE (Owner Only)**
- Email addresses
- Payment verification tokens (stripe_identity_verification_token, stripe_identity_session_id)
- GPS coordinates (latitude, longitude)
- Zip codes
- County names
- Phone numbers
- Financial details

**🟡 RESTRICTED (Active Relationships Only)**
- City name
- State name
- Approximate distance (rounded to 5 miles)

**🟢 PUBLIC (Anyone Can See)**
- User ID
- Full name
- Verification status (is_verified, verification_status)
- Account creation date

## Role-Based Access Control (RBAC)

### Roles
- **buyer**: Can purchase pets, request breeding services
- **breeder**: Can list pets, offer breeding services
- **admin**: Full system access, user management

### Implementation
```typescript
// Check roles securely
import { useUserRole } from '@/hooks/useUserRole';
const { isAdmin, isBreeder, requireRole } = useUserRole();

// Require specific role
if (!requireRole('admin', 'manage users')) {
  return; // Blocked
}
```

### Database Functions
```sql
-- Secure role checking (prevents recursion)
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
SECURITY DEFINER
SET search_path = public;
```

## Identity Verification

### Stripe Identity
All users must verify identity before:
- Listing pets (breeders)
- Purchasing pets (buyers)
- Accessing sensitive features

### Process
1. User signs up
2. User requests verification
3. Stripe Identity collects:
   - Government-issued ID
   - Live selfie
   - ID number
4. Verification status stored in profiles table
5. `is_verified` flag controls feature access

### Security Features
- Rate limiting: 3 verification attempts per hour
- Session tokens: Secure, time-limited verification sessions
- Webhook validation: Stripe webhook signature verification

## Rate Limiting

### Edge Functions
```typescript
// Automatic rate limiting on sensitive functions
import { rateLimitMiddleware } from '../_shared/rateLimiter';

// 3 verification attempts per hour
rateLimitMiddleware(userId, {
  maxRequests: 3,
  windowMs: 60 * 60 * 1000,
  keyPrefix: 'identity-verify'
});

// 20 payment attempts per 5 minutes
rateLimitMiddleware(clientIp, {
  maxRequests: 20,
  windowMs: 5 * 60 * 1000,
  keyPrefix: 'create-payment'
});
```

### Limits by Function
- **Identity Verification**: 3/hour per user
- **Payment Creation**: 20 per 5 min per IP
- **Account Freezing**: 10/hour per IP

## Payment & Transaction Security

### Critical Protections

#### Customer Personal Information (PII)

**Email Address Protection:**
- **NEVER exposed**: Email addresses are completely isolated from other users
- **Explicit denial**: Anonymous users cannot access profiles table at all
- **Owner-only access**: Authenticated users can only view their own email
- **Safe views**: `public_profiles` and `conversation_partner_profiles` exclude email field
- **Audit logging**: Email access logged to `email_access_log` table

**System-Managed Field Protection:**
Users **cannot** modify these security-critical fields even on their own profile:
```sql
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND (
    -- These fields MUST remain unchanged
    OLD.is_verified = NEW.is_verified
    AND OLD.verification_status = NEW.verification_status
    AND OLD.account_status = NEW.account_status
    AND OLD.frozen_at = NEW.frozen_at
    AND OLD.frozen_reason = NEW.frozen_reason
  )
);
```

**Location Data Protection:**
- **Full names**: Only visible in authorized transactions
- **GPS coordinates**: Owner-only, never exposed to other users
- **Zip code**: Restricted to conversation/transaction partners only
- **City/State**: Safe public access via secure views
- **Identity verification tokens**: Completely isolated, owner-only access

#### Transaction Data Protection

**CRITICAL**: Transaction and financial data must ONLY be accessible to transaction participants.

##### Multi-Layer Security Implementation:

**1. Database RLS Policies:**
```sql
-- Anonymous users are EXPLICITLY DENIED all access
CREATE POLICY "Anonymous users cannot access sales data"
ON public.sales FOR ALL TO anon
USING (false) WITH CHECK (false);

-- Authenticated users can ONLY view their own transactions
CREATE POLICY "Authenticated non-participants cannot access sales"
ON public.sales FOR SELECT TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = breeder_id);

-- Direct INSERT blocked for ALL users (edge functions only)
CREATE POLICY "Only service role can create sales"
ON public.sales FOR INSERT TO authenticated
WITH CHECK (false);
```

**2. Secure View with security_invoker:**
```sql
-- my_transactions view respects RLS policies
CREATE VIEW public.my_transactions
WITH (security_invoker = true)
AS SELECT 
  s.id, s.sale_date, s.sale_price, s.platform_fee,
  s.breeder_earnings, s.payout_status, s.payout_date,
  CASE 
    WHEN s.buyer_id = auth.uid() THEN 'purchase'
    WHEN s.breeder_id = auth.uid() THEN 'sale'
  END as transaction_type,
  p.name as pet_name, p.species, p.breed
FROM public.sales s
LEFT JOIN public.pets p ON s.pet_id = p.id
WHERE auth.uid() = s.buyer_id OR auth.uid() = s.breeder_id;
```

**3. Edge Function Authorization:**
Only the `complete-purchase` edge function can create sales using service role key:
```typescript
// Uses service role to bypass RLS for authorized creation
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), // ← Bypasses RLS
  { auth: { persistSession: false } }
);

await supabaseClient.from('sales').insert({
  pet_id, breeder_id, buyer_id, sale_price,
  platform_fee, breeder_earnings, payout_status: 'pending'
});
```

**4. Frontend Security Utilities:**
Use `src/lib/transactionSecurity.ts` helpers:
```typescript
import { getMyTransactions, canAccessTransaction } from '@/lib/transactionSecurity';

// ✅ CORRECT: Use secure helper functions
const myTransactions = await getMyTransactions(); // Only returns user's transactions

// ✅ CORRECT: Verify access before showing details
const hasAccess = await canAccessTransaction(saleId);
if (!hasAccess) return <AccessDenied />;

// ❌ NEVER: Query sales table directly
// supabase.from('sales').select('*') // BLOCKED by RLS
```

**Protected Fields:**
- Sales records: Only visible to buyer and breeder participants
- No client-side inserts: Sales creation restricted to authorized edge functions only
- Audit logging: All sales access logged in `sales_access_log` table
- Anonymous users blocked: Zero access to transaction data
- Secure view: `my_transactions` view provides safe access to own transactions only

#### Financial Data Security
- **No payment method storage**: Credit cards, bank accounts stored in Stripe only
- **Frozen funds isolation**: Users can only view their own frozen funds, no modifications allowed
- **Subscription privacy**: Subscription data only visible to subscriber
- **Banking change requests**: Completely private, owner-only access

### Stripe Integration
- PCI-compliant payment processing
- Client-side secret tokens (ephemeral, single-use)
- Server-side verification
- 72-hour hold on breeder payouts
- Payment intents never stored in database

### Transaction Flow Security
1. Buyer initiates purchase (authenticated & verified users only)
2. Edge function creates Stripe payment intent (server-side only)
3. Payment processed through Stripe (PCI compliant)
4. Edge function records sale (bypasses client RLS)
5. Funds held for 72 hours (fraud protection)
6. Breeder payout after hold period (if no disputes)

### Fraud Prevention
- Identity verification required for all transactions
- User reporting system with automatic account freeze
- Account freezing triggers 90-day fund hold
- Frozen funds management (admin-controlled release)
- Transaction audit trails

## Screenshot Prevention

### Web
```typescript
// Keyboard shortcuts blocked
- PrintScreen
- Cmd+Shift+3/4/5 (Mac)
- Win+Shift+S (Windows)
```

### Mobile (Capacitor)
```typescript
// Native screenshot detection
- iOS: FLAG_SECURE equivalent
- Android: WindowManager.LayoutParams.FLAG_SECURE
```

### Limitations
⚠️ Client-side prevention is NOT foolproof:
- Third-party tools can bypass
- Phone cameras can capture screen
- Screen recording software works
- VM/Remote desktop bypass

### Best Practices
- Never display highly sensitive data
- Use watermarks on critical content
- Implement server-side access logging
- Time-limit sensitive data exposure

## Input Validation

### Zod Schemas
```typescript
import { z } from 'zod';

const petListingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  species: z.enum(['dog', 'cat']),
  price: z.number().min(0).max(100000),
  // ... more validation
});
```

### Validation Points
- ✅ Client-side (immediate feedback)
- ✅ Server-side (security enforcement)
- ✅ Database (constraints & triggers)

## Database Security

### Row Level Security (RLS)
Every table has RLS enabled with strict access controls:

```sql
-- All sensitive tables have RLS enabled
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Owner-Only Access Tables
These tables are restricted to owner access only:
- `profiles`: Complete profile data (email, location, payment tokens)
- `frozen_funds`: User's frozen fund balances and release dates
- `subscriptions`: User's subscription status and details
- `verification_requests`: Identity verification submissions
- `banking_change_requests`: Banking information change requests

### Participant-Only Access Tables
These tables restrict access to transaction/conversation participants:
- `sales`: Transaction records (buyer and breeder only)
- `messages`: Conversation messages (sender and recipient only)
- `conversations`: Conversation details (buyer and breeder only)

### Anonymous User Restrictions
Anonymous (unauthenticated) users have ZERO access to:
- All transaction data (`sales`, `frozen_funds`)
- All financial data (`subscriptions`, `banking_change_requests`)
- All verification data (`verification_requests`)
- All conversation data (`conversations`, `messages`)
- All user reports (`user_reports`)
- Profile details beyond public view

### Secure Views (security_invoker=true)
```sql
-- Safe profile views that exclude sensitive data
public_profiles: id, full_name, city, state, is_verified, verification_status
conversation_partner_profiles: Same fields + relationship verification
my_transactions: User's own purchases and sales only

-- ❌ Excluded from ALL public views:
-- Email, payment tokens, GPS coordinates, zip codes, financial details
```

### Security Definer Functions
```sql
CREATE FUNCTION function_name()
SECURITY DEFINER
SET search_path = public
-- Prevents SQL injection and path manipulation
-- Used for: role checking, distance calculation, access validation
```

### Critical Column Protection
All sensitive columns explicitly marked and protected:
```sql
-- Never exposed to other users
COMMENT ON COLUMN profiles.email IS 'CRITICAL PII: Email address - NEVER expose';
COMMENT ON COLUMN profiles.stripe_identity_verification_token IS 'CRITICAL SECURITY: Never expose';
COMMENT ON COLUMN profiles.latitude IS 'CRITICAL PII: Precise location - Owner only';
COMMENT ON COLUMN profiles.longitude IS 'CRITICAL PII: Precise location - Owner only';
```

## Monitoring & Audit

### Comprehensive Audit Logging

#### Profile Access Logs
```typescript
profile_access_logs {
  accessor_id: uuid,
  accessed_profile_id: uuid,
  access_type: string,
  accessed_at: timestamp,
  ip_address: inet,
  user_agent: text
}
```

#### Sales Access Logs
```typescript
sales_access_log {
  user_id: uuid,
  sale_id: uuid,
  access_type: string,
  accessed_at: timestamp,
  ip_address: inet
}
```

#### Security Audit Logs
```typescript
security_audit_log {
  user_id: uuid,
  action: string,
  table_name: string,
  details: jsonb,
  ip_address: inet,
  created_at: timestamp
}
```

#### Two-Factor Authentication Logs
```typescript
two_factor_audit_log {
  user_id: uuid,
  event_type: 'enrolled' | 'unenrolled' | 'verified' | 'failed_verification',
  ip_address: inet,
  user_agent: text,
  created_at: timestamp
}
```

### Admin Dashboard
- View all audit logs (`/developer`)
- Monitor user activity patterns
- Review security alerts and anomalies
- Manage frozen accounts and disputes
- Track authentication events

## Incident Response

### User Reports
1. User reports suspicious activity
2. Account automatically frozen
3. Funds placed on hold (90 days)
4. Admin reviews case
5. Resolution or escalation

### Data Breach
1. Immediately revoke access tokens
2. Force password resets
3. Notify affected users
4. Review audit logs
5. Patch vulnerability
6. Post-mortem analysis

## Compliance

### Data Protection
- ✅ GDPR-compliant data handling
- ✅ User data deletion on request
- ✅ Encrypted data transmission (SSL)
- ✅ Encrypted data storage
- ✅ Regular security audits

### Privacy
- Minimal data collection
- Purpose-limited usage
- Secure data retention
- Transparent privacy policy

## Security Checklist

### Before Deployment
- [ ] All RLS policies enabled
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Identity verification working
- [ ] Payment processing tested
- [ ] Audit logging active
- [ ] SSL certificate valid
- [ ] Environment variables secured
- [ ] Error messages sanitized
- [ ] API keys rotated

### Regular Maintenance
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Security scan quarterly
- [ ] Penetration test annually
- [ ] Review RLS policies quarterly
- [ ] Update rate limits as needed

## Contact

For security concerns or vulnerabilities:
- Email: security@pawdna.org
- Bug Bounty: (Coming soon)
- Response time: 24-48 hours

**Never discuss security vulnerabilities publicly.**
