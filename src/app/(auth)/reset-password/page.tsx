"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { updatePassword } from "@/lib/auth/helpers";

type PageState = "loading" | "ready" | "success" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Register listener FIRST — PASSWORD_RECOVERY may fire synchronously
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("ready");
      }
    });

    // getSession() with detectSessionInUrl:true processes the #access_token hash
    // and triggers the PASSWORD_RECOVERY event above
    supabase.auth.getSession();

    // Safety net: if no recovery event after 8s, the link is invalid/expired
    const timeout = setTimeout(() => {
      setPageState((prev) => (prev === "loading" ? "invalid" : prev));
    }, 8_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);

    if (updateError) {
      setError(updateError);
      setLoading(false);
      return;
    }

    setPageState("success");
    setTimeout(() => router.push("/"), 2_000);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-sketch">Verifying reset link…</p>
        </div>
      </div>
    );
  }

  // ── Invalid / expired link ────────────────────────────────────────────────
  if (pageState === "invalid") {
    return (
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-xl font-bold font-sketch mb-2">Link expired or invalid</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Password reset links expire after 1 hour. Request a new one and try again.
          </p>
          <Button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white"
          >
            Request new link
          </Button>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-9 w-9 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold font-sketch mb-2">Password updated!</h1>
          <p className="text-sm text-muted-foreground">Taking you to your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Ready — show the form ─────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md">
      <div className="sketch-card bg-card p-8 rounded-2xl">
        <div className="mb-6 text-center">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4 sketch-border-sm border-violet-500/30">
            <KeyRound className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold font-sketch mb-1">Set new password</h1>
          <p className="text-sm text-muted-foreground">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {loading ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
