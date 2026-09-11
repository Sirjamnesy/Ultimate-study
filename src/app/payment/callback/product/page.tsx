"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/shared/confetti";
import { supabase } from "@/lib/supabase/client";

type State = "verifying" | "success" | "failed";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("verifying");
  const [showConfetti, setShowConfetti] = useState(false);
  const attempts = useRef(0);
  const MAX_ATTEMPTS = 6;

  const slug = searchParams.get("slug");

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");

    if (!reference || !slug) {
      setState("failed");
      return;
    }

    async function verify() {
      const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug!)
        .single();

      if (!product) {
        setState("failed");
        return;
      }

      const res = await fetch(
        `/api/verify-payment?reference=${encodeURIComponent(reference!)}&productId=${encodeURIComponent(product.id)}`
      );
      const json = await res.json();

      if (json.verified) {
        setState("success");
        setShowConfetti(true);
        return;
      }

      attempts.current += 1;
      if (attempts.current >= MAX_ATTEMPTS) {
        setState("failed");
        return;
      }

      setTimeout(verify, 2000);
    }

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen notebook-bg flex items-center justify-center px-4">
      <Confetti trigger={showConfetti} message="Payment confirmed!" />

      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          {state === "verifying" && (
            <>
              <Loader2 className="h-12 w-12 text-violet-400 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-bold font-sketch mb-2">Confirming your payment…</h1>
              <p className="text-sm text-muted-foreground">This usually takes just a moment.</p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-9 w-9 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold font-sketch mb-2">It&apos;s yours! 🎉</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Payment confirmed. It&apos;s in your library now.
              </p>
              <Button
                onClick={() => router.push(slug ? `/library/${slug}` : "/library")}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2"
              >
                <Zap className="h-4 w-4" />
                Start Reading
              </Button>
            </>
          )}

          {state === "failed" && (
            <>
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-9 w-9 text-red-400" />
              </div>
              <h1 className="text-xl font-bold font-sketch mb-2">Payment not confirmed</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We couldn&apos;t verify your payment yet. If you were charged, contact support — your access will be granted manually.
              </p>
              <div className="space-y-3">
                {slug && (
                  <Button
                    onClick={() => router.push(`/products/${slug}`)}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Try Again
                  </Button>
                )}
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">
                    Go Home
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductPaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen notebook-bg flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
