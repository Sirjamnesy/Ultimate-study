"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendPasswordReset } from "@/lib/auth/helpers";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: resetError } = await sendPasswordReset(email);
    if (resetError) {
      setError(resetError);
      setLoading(false);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="sketch-card bg-card p-8 rounded-2xl text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 sketch-border-sm border-emerald-500/30">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold font-sketch mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-1">
            We sent a password reset link to
          </p>
          <p className="font-mono text-sm text-foreground font-medium mb-5">{email}</p>
          <p className="text-xs text-muted-foreground mb-6">
            Click the link in the email to set a new password. The link expires in 1 hour.
          </p>
          <Button
            variant="ghost"
            onClick={() => { setSent(false); setEmail(""); }}
            className="text-muted-foreground gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Try a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="sketch-card bg-card p-8 rounded-2xl">
        <div className="mb-6 text-center">
          <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4 sketch-border-sm border-violet-500/30">
            <Mail className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold font-sketch mb-1">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {loading ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember it?{" "}
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
