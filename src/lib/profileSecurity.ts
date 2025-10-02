/**
 * Profile Security Utilities
 * 
 * IMPORTANT: User location data is highly sensitive. Follow these guidelines:
 * 
 * 1. NEVER query profiles for other users except through approved methods
 * 2. Use public_profiles view for general user information
 * 3. Use get_approximate_distance() for distance calculations
 * 4. Only expose precise coordinates within active transactions
 * 
 * Security measures in place:
 * - RLS policies restrict profile access to owners only
 * - Conversation partners can only see city/state
 * - Distance calculations rounded to nearest 5 miles
 * - Audit logs track profile access
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Get public profile information (safe to display)
 * This only includes: id, full_name, city, state, is_verified, verification_status
 */
export async function getPublicProfile(userId: string) {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }

  return data;
}

/**
 * Get approximate distance between two users (rounded to nearest 5 miles)
 * This prevents precise location tracking
 * 
 * @returns Distance in miles (rounded to nearest 5) or null if unavailable
 */
export async function getApproximateDistance(user1Id: string, user2Id: string): Promise<number | null> {
  const { data, error } = await supabase.rpc("get_approximate_distance", {
    _user1_id: user1Id,
    _user2_id: user2Id,
  });

  if (error) {
    console.error("Error calculating distance:", error);
    return null;
  }

  return data;
}

/**
 * Check if two users have an active conversation
 */
export async function usersHaveActiveConversation(user1Id: string, user2Id: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("users_have_active_conversation", {
    _user1_id: user1Id,
    _user2_id: user2Id,
  });

  if (error) {
    console.error("Error checking conversation:", error);
    return false;
  }

  return data || false;
}

/**
 * Check if two users have an active transaction
 */
export async function usersHaveActiveTransaction(user1Id: string, user2Id: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("users_have_active_transaction", {
    _user1_id: user1Id,
    _user2_id: user2Id,
  });

  if (error) {
    console.error("Error checking transaction:", error);
    return false;
  }

  return data || false;
}

/**
 * Get user's own profile (includes all fields)
 * This should only be used for the authenticated user's own profile
 */
export async function getOwnProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching own profile:", error);
    return null;
  }

  return data;
}

/**
 * Security Guidelines for Location Data:
 * 
 * ✅ DO:
 * - Use getPublicProfile() for displaying other users' info
 * - Use getApproximateDistance() for distance calculations
 * - Store exact coordinates only in profiles table (for owner)
 * - Copy coordinates to pets/requests for matchmaking (owner's data)
 * 
 * ❌ DON'T:
 * - Query profiles.latitude or profiles.longitude for other users
 * - Display exact addresses or coordinates to other users
 * - Create APIs that expose bulk profile data
 * - Share zip codes outside of active transactions
 * 
 * 🔒 Security Features:
 * - RLS policies enforce owner-only access to sensitive fields
 * - Conversation partners can view city/state only
 * - Distance rounded to 5-mile increments
 * - Profile access logged for audit purposes
 * - Admins can view audit logs for suspicious activity
 */

export const LOCATION_SECURITY_GUIDELINES = {
  publicFields: ["id", "full_name", "city", "state", "is_verified", "verification_status"],
  sensitiveFields: ["latitude", "longitude", "zip_code", "county", "email"],
  conversationFields: ["city", "state"], // What conversation partners can see
  transactionFields: ["city", "state", "zip_code"], // What transaction partners can see
  
  notes: {
    distanceCalculations: "Use get_approximate_distance() which rounds to 5-mile increments",
    profileQueries: "Always query public_profiles view unless accessing own profile",
    auditLogging: "All profile accesses by other users are logged for security monitoring",
  }
} as const;
