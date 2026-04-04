import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Cookie-based browser client via @supabase/ssr.
// Storing the session in cookies (not localStorage) means the proxy
// (createServerClient) can read and validate the same session server-side.
// flowType:'pkce' is the default — requires Supabase project Auth settings
// to also be set to PKCE (Authentication → Settings → Auth flow type → PKCE).
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
