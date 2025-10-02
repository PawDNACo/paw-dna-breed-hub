/**
 * Transaction Security Utilities
 * 
 * CRITICAL SECURITY: Transaction data must ONLY be accessible to participants
 * 
 * Security Guidelines:
 * 1. NEVER query sales table directly from frontend - use my_transactions view
 * 2. ALWAYS verify user is participant before showing transaction details
 * 3. NEVER expose other party's financial details or payment methods
 * 4. ALL sales creation must go through authorized edge functions only
 * 
 * Protected Data:
 * - Sale amounts and fees
 * - Payment intent IDs
 * - Payout schedules and status
 * - Participant financial details
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Get user's own transactions (purchases and sales)
 * SECURITY: Uses my_transactions view which automatically filters to current user
 */
export async function getMyTransactions() {
  const { data, error } = await supabase
    .from("my_transactions")
    .select("*")
    .order("sale_date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }

  return data;
}

/**
 * Check if user can access a specific transaction
 * SECURITY: Validates user is buyer or breeder of the transaction
 */
export async function canAccessTransaction(saleId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase.rpc("can_access_transaction", {
    _sale_id: saleId,
    _user_id: user.id,
  });

  if (error) {
    console.error("Error checking transaction access:", error);
    return false;
  }

  return data || false;
}

/**
 * Get a single transaction (if user is participant)
 * SECURITY: Automatically filtered by my_transactions view
 */
export async function getTransaction(saleId: string) {
  const { data, error } = await supabase
    .from("my_transactions")
    .select("*")
    .eq("id", saleId)
    .single();

  if (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }

  return data;
}

/**
 * Security Guidelines for Transaction Data
 */
export const TRANSACTION_SECURITY_GUIDELINES = {
  protectedData: [
    "Payment method details (stored in Stripe only)",
    "Full financial breakdown",
    "Payout schedules and amounts",
    "Platform fee calculations",
    "Other party's personal details",
  ],
  
  allowedAccess: [
    "Own purchases (as buyer)",
    "Own sales (as breeder)",
    "Transaction status and dates",
    "Pet information related to transaction",
    "Public profile of other party (city/state only)",
  ],
  
  blockedActions: [
    "Creating sales records from client (edge functions only)",
    "Modifying frozen funds",
    "Accessing other users' transactions",
    "Viewing transaction details without participation",
    "Anonymous access to any financial data",
  ],
  
  notes: {
    salesCreation: "Sales can ONLY be created via complete-purchase edge function",
    transactionView: "Always use my_transactions view, never query sales table directly",
    participantValidation: "Use can_access_transaction() to verify access rights",
    auditLogging: "All transaction access is logged in sales_access_log",
    anonymousUsers: "Anonymous users have ZERO access to financial/transaction data",
  }
} as const;
