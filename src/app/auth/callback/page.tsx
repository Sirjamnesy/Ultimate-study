"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      function hasPaid(appMeta: Record<string, unknown>) {
        return appMeta?.has_paid === true || appMeta?.is_admin === true;
      }
      function go(paid: boolean) {
        router.replace(paid ? "/" : "/checkout");
      }

      // 1. Implicit flow — tokens are in the hash fragment (#access_token=...&refresh_token=...)
      const hash = window.location.hash.slice(1);
      if (hash) {
        const p = new URLSearchParams(hash);
        const accessToken = p.get("access_token");
        const refreshToken = p.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error && data.session) {
            go(hasPaid(data.session.user.app_metadata));
            return;
          }
        }
      }

      // 2. PKCE flow — code is in the query string (?code=...)
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session) {
          go(hasPaid(data.session.user.app_metadata));
          return;
        }
      }

      // 3. Session already exists (e.g. user came back to this page)
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        go(hasPaid(session.user.app_metadata));
        return;
      }

      // Nothing worked
      router.replace("/login?error=oauth_failed");
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen notebook-bg flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto" />
        <p className="text-sm text-muted-foreground font-sketch">Completing sign in…</p>
      </div>
    </div>
  );
}
