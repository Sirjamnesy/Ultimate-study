import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Store an email sign-up from the public site. Server-only: uses the
 * service-role client because email_signups has no anon/authenticated policies.
 * Signing up twice to the same list is not an error.
 */
export async function addEmailSignup(email: string, list: string): Promise<boolean> {
  const admin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error } = await admin
    .from("email_signups")
    .upsert({ email, list }, { onConflict: "email,list", ignoreDuplicates: true });
  if (error) console.error("[email-signup]", error.message);
  return !error;
}
