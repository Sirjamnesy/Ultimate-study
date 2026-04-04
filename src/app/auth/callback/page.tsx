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

      // createBrowserClient has detectSessionInUrl:true — calling getSession()
      // automatically processes both PKCE (?code=...) and implicit (#access_token=...)
      // tokens from the current URL and stores the resulting session in cookies.
      const { data: { session } } = await supabase.auth.getSession();

      if (session && !session.user.is_anonymous) {
        go(hasPaid(session.user.app_metadata));
        return;
      }

      // Fallback: listen for the SIGNED_IN event in case getSession() resolved
      // before the async URL processing completed.
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            go(hasPaid(session.user.app_metadata));
            subscription.unsubscribe();
          }
        }
      );

      // 10 s safety net — if nothing fires, send back to login
      const timer = setTimeout(() => {
        subscription.unsubscribe();
        router.replace("/login?error=timeout");
      }, 10_000);

      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
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
