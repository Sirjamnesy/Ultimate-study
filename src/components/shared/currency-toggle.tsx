"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import type { PaystackCurrency } from "@/lib/paystack";

export function CurrencyToggle({ currency }: { currency: PaystackCurrency }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(currency);

  async function setCurrency(next: PaystackCurrency) {
    if (next === optimistic) return;
    setOptimistic(next);
    await fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="inline-flex rounded-full border-2 border-border/60 p-0.5 gap-0.5 bg-card"
      role="group"
      aria-label="Currency"
    >
      {(["NGN", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          disabled={pending}
          onClick={() => setCurrency(c)}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            optimistic === c
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {c === "NGN" ? "🇳🇬 NGN" : "🌍 USD"}
        </button>
      ))}
    </div>
  );
}
