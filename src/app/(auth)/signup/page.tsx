"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Loader2, Tag, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { promoteAnonymousUser, signInWithGoogle, resendConfirmationEmail } from "@/lib/auth/helpers";
import { supabase } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // After email signup: show "check your email" screen
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

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

    // Promote the anonymous session to a real account
    const { error: authError } = await promoteAnonymousUser(email, password);
    if (authError) {
      if (authError.toLowerCase().includes("already") || authError.toLowerCase().includes("taken")) {
        setError("An account with this email already exists. Try signing in instead.");
      } else {
        setError(authError);
      }
      setLoading(false);
      return;
    }

    // If invite code provided, redeem it server-side
    if (showInvite && inviteCode.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Session error. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/redeem-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Invalid invite code.");
        setLoading(false);
        return;
      }

      await supabase.auth.refreshSession();
      router.push("/");
      router.refresh();
      return;
    }

    // Show "check your email" screen — user must confirm before logging in next time
    setConfirmedEmail(email);
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError);
      setGoogleLoading(false);
    }
    // On success, browser redirects to Google — no further action needed
  }

  async function handleResend() {
    if (!confirmedEmail) return;
    setResendLoading(true);
    await resendConfirmationEmail(confirmedEmail);
    setResendLoading(false);
    setResendSent(true);
    setTimeout(() => setResendSent(false), 5000);
  }

  // ── Check-your-email screen ──────────────────────────────────────────────
  if (confirmedEmail) {
    return (
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-5 sketch-border-sm border-violet-500/30">
            <Mail className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold font-sketch mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-1">
            We sent a confirmation link to
          </p>
          <p className="font-mono text-sm text-foreground font-medium mb-5">
            {confirmedEmail}
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Click the link in the email to verify your address. You can still access the app — your progress is saved.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2"
            >
              Continue to Checkout
            </Button>

            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendLoading || resendSent}
              className="w-full text-muted-foreground gap-2"
            >
              {resendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : resendSent ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : null}
              {resendSent ? "Email sent!" : resendLoading ? "Sending…" : "Resend confirmation email"}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Wrong email?{" "}
            <button
              onClick={() => setConfirmedEmail(null)}
              className="text-violet-400 hover:text-violet-300 underline"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="sketch-card bg-card p-8 rounded-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold font-sketch mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Your study progress is already saved — just set a password to secure it.
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full gap-2 mb-4"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </Button>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
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

          {/* Invite code — collapsible */}
          <div>
            <button
              type="button"
              onClick={() => { setShowInvite(!showInvite); setInviteCode(""); }}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Tag className="h-3.5 w-3.5" />
              {showInvite ? "Remove invite code" : "Have an invite code?"}
            </button>
            {showInvite && (
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. FRIEND-JAMES"
                className="mt-2 w-full px-3 py-2 rounded-lg border border-violet-500/30 bg-violet-500/5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors placeholder:font-sans"
              />
            )}
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
              {error.includes("already exists") && (
                <span>
                  {" "}
                  <Link href="/login" className="underline font-medium">
                    Sign in instead
                  </Link>
                </span>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {loading
              ? inviteCode.trim()
                ? "Redeeming code…"
                : "Creating account…"
              : showInvite && inviteCode.trim()
              ? "Create Account & Redeem Code"
              : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
