"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/shared/progress-provider";
import type { PaystackCurrency } from "@/lib/paystack";

export function BuyButton({
  slug,
  currency,
  owned,
}: {
  slug: string;
  currency: PaystackCurrency;
  owned: boolean;
}) {
  const router = useRouter();
  const { isAnonymous, user } = useProgress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (owned) {
    return (
      <Link href={`/library/${slug}`}>
        <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white h-11">
          Open in Library
        </Button>
      </Link>
    );
  }

  async function handleBuy() {
    if (isAnonymous || !user) {
      router.push("/signup");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      const json = await res.json();

      if (json.alreadyOwned) {
        router.refresh();
        return;
      }

      if (!res.ok || !json.authorization_url) {
        setError(json.error ?? "Could not start checkout. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = json.authorization_url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white h-11 gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Redirecting…" : "Buy now"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
