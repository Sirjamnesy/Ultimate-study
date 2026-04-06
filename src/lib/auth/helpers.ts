"use client";

import { supabase } from "@/lib/supabase/client";
import { clearProgress } from "@/lib/store/progress";

/**
 * Promote anonymous session to a real account.
 * Uses updateUser() which preserves the user's UUID — all Supabase data stays linked.
 */
export async function promoteAnonymousUser(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Sign in with email + password.
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Sign in (or sign up) with Google OAuth.
 *
 * If the current session is anonymous, we use linkIdentity() so the same
 * UUID is kept and all study progress is preserved.
 * Otherwise we use a standard signInWithOAuth flow.
 *
 * Both paths redirect the browser to Google and then back to /auth/callback.
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const redirectTo = `${window.location.origin}/auth/callback`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.is_anonymous) {
    // Anonymous user — link Google identity to preserve progress UUID
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo },
    });
    if (error) return { error: error.message };
    return { error: null };
  }

  // No session or already a real account — standard OAuth
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Resend the email confirmation link to the given address.
 */
export async function resendConfirmationEmail(
  email: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) return { error: error.message };
  return { error: null };
}

/**
 * Sign out and clear local progress cache.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  clearProgress();
}
