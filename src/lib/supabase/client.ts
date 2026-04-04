import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Cookie-based browser client via @supabase/ssr so the proxy
// (createServerClient) can read the same session server-side.
//
// flowType:'implicit' matches the Supabase project's auth setting —
// OAuth redirects return #access_token=... hash tokens which
// detectSessionInUrl:true processes automatically on getSession().
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "implicit",
    },
  }
);
