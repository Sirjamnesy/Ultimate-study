import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * True for a real, non-anonymous account with app_metadata.is_admin === true —
 * the same check used in proxy.ts, progress-provider.tsx, auth/callback/page.tsx
 * and api/verify-payment.
 */
export function isAdminUser(user: User | null | undefined): boolean {
  return !!user && !user.is_anonymous && user.app_metadata?.is_admin === true;
}

/**
 * Returns the current user if they're an admin, otherwise null. Callers decide
 * how to respond (redirect vs 403 JSON).
 */
export async function getAdminUser(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return isAdminUser(user) ? user : null;
}
