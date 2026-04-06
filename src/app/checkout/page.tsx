"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Globe, Tag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { refreshAuth } = useProgress();
  const [loading, setLoading] = useState<"NGN" | "USD" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  async function handleInviteCode() {
    if (!inviteCode.trim()) return;
    setInviteError(null);
    setInviteLoading(true);
    try {
      const res = await fetch("/api/redeem-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });
      const json = await res.json();
      if (!json.success) {
        setInviteError(json.error ?? "Invalid code. Please check and try again.");
        setInviteLoading(false);
        return;
      }
      await refreshAuth();
      router.push("/");
    } catch {
      setInviteError("Network error. Please try again.");
      setInviteLoading(false);
    }
  }

  async function handleCheckout(currency: "NGN" | "USD") {
    setError(null);
    setLoading(currency);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      const json = await res.json();

      if (json.alreadyPaid) {
        router.push("/");
        return;
      }

      if (!res.ok || !json.authorization_url) {
        setError(json.error ?? "Could not start checkout. Please try again.");
        setLoading(null);
        return;
      }

      // Redirect to Paystack hosted checkout
      window.location.href = json.authorization_url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="sketch-card bg-card p-8 rounded-2xl text-center">
            <div className="h-16 w-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-5 sketch-border-sm rotate-[-2deg]">
              <Zap className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold font-sketch mb-2">One-Time Access</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Full lifetime access — no subscriptions, no renewals. Pay once, learn forever.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* NGN option */}
              <div className="sketch-border-sm rounded-xl p-4 bg-emerald-500/5 border-emerald-500/30">
                <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  🇳🇬 Nigerian
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">₦20,000</div>
                <div className="text-xs text-muted-foreground mt-1">one-time</div>
              </div>

              {/* USD option */}
              <div className="sketch-border-sm rounded-xl p-4 bg-blue-500/5 border-blue-500/30">
                <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <Globe className="h-3 w-3" /> International
                </div>
                <div className="text-2xl font-bold font-mono text-blue-400">$15</div>
                <div className="text-xs text-muted-foreground mt-1">one-time</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleCheckout("NGN")}
                disabled={loading !== null}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2 h-11"
              >
                {loading === "NGN" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {loading === "NGN" ? "Redirecting…" : "Pay ₦20,000 (NGN)"}
              </Button>

              <Button
                onClick={() => handleCheckout("USD")}
                disabled={loading !== null}
                variant="outline"
                className="w-full border-blue-500/40 text-blue-400 hover:bg-blue-500/10 gap-2 h-11"
              >
                {loading === "USD" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {loading === "USD" ? "Redirecting…" : "Pay $15 (USD)"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Invite code */}
            <div className="mt-5 border-t border-border/40 pt-4">
              <button
                onClick={() => { setShowInvite(!showInvite); setInviteError(null); }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                <Tag className="h-3 w-3" />
                Have an invite code?
                <ChevronDown className={`h-3 w-3 transition-transform ${showInvite ? "rotate-180" : ""}`} />
              </button>

              {showInvite && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleInviteCode()}
                    placeholder="INVITE-CODE"
                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-violet-500/40 font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                    disabled={inviteLoading}
                  />
                  <Button
                    onClick={handleInviteCode}
                    disabled={inviteLoading || !inviteCode.trim()}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    {inviteLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}

              {inviteError && (
                <p className="mt-2 text-xs text-red-400">{inviteError}</p>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Secure payment via Paystack. Your progress is already saved — you&apos;ll keep everything after payment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
