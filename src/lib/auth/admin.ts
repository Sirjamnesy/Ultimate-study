import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Returns the current user if they're a real, non-anonymous account with
 * app_metadata.is_admin === true — the same check already used in proxy.ts,
 * progress-provider.tsx, auth/callback/page.tsx, and api/verify-payment.
 * Returns null otherwise. Callers decide how to respond (redirect vs 403 JSON).
 */
export async function getAdminUser(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous || user.app_metadata?.is_admin !== true) {
    return null;
  }

  return user;
}
