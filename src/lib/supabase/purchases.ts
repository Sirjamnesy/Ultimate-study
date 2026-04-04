import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Service-role client for server-only operations (webhook, invite code redemption).
 * Bypasses RLS — never expose to the client.
 */
function getServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Check if a user has a completed purchase.
 * Used as a server-side fallback when JWT metadata is stale.
 */
export async function hasUserPaid(userId: string): Promise<boolean> {
  const admin = getServiceRoleClient();
  const { data, error } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .limit(1)
    .single();

  return !error && !!data;
}

/**
 * Redeem an invite code for a user.
 * Validates the code, increments used_count atomically, and marks the user as paid.
 * Returns { success: true } or { success: false, error: string }.
 */
export async function redeemInviteCode(
  code: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = getServiceRoleClient();

  // Fetch the code
  const { data: inviteCode, error: fetchError } = await admin
    .from("invite_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .single();

  if (fetchError || !inviteCode) {
    return { success: false, error: "Invalid invite code." };
  }

  if (inviteCode.used_count >= inviteCode.max_uses) {
    return { success: false, error: "This invite code has already been used." };
  }

  // Increment used_count
  const { error: updateError } = await admin
    .from("invite_codes")
    .update({ used_count: inviteCode.used_count + 1 })
    .eq("code", inviteCode.code)
    .eq("used_count", inviteCode.used_count); // optimistic lock

  if (updateError) {
    return { success: false, error: "Code already redeemed. Please try again." };
  }

  // Mark user as paid via the SQL function
  const { error: rpcError } = await admin.rpc("mark_user_paid", {
    target_user_id: userId,
  });

  if (rpcError) {
    console.error("[purchases] mark_user_paid RPC failed:", rpcError.message);
    return { success: false, error: "Could not grant access. Please contact support." };
  }

  return { success: true };
}
