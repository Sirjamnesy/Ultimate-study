"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

/**
 * OAuth callback page — handles both PKCE (code param) and implicit flow (hash fragment).
 * The Supabase JS client automatically processes whichever flow Supabase sends back.
 * We listen for SIGNED_IN then route: paid/admin → /, unpaid → /checkout.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    function redirect(hasPaid: boolean) {
      router.replace(hasPaid ? "/" : "/checkout");
    }

    function checkPaid(appMeta: Record<string, unknown>) {
      return appMeta?.has_paid === true || appMeta?.is_admin === true;
    }

    // Listen for auth state change — fires for both PKCE code exchange and
    // implicit-flow hash fragment processing
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        redirect(checkPaid(session.user.app_metadata));
        subscription.unsubscribe();
      }
    });

    // Also check immediately in case the session is already available
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !session.user.is_anonymous) {
        redirect(checkPaid(session.user.app_metadata));
        subscription.unsubscribe();
      }
    });

    return () => subscription.unsubscribe();
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
