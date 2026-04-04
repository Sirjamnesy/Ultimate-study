import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase OAuth callback — exchanges the PKCE code for a session.
 * After success, redirects paid users to "/" and unpaid users to "/checkout".
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const hasPaid =
        user?.app_metadata?.has_paid === true ||
        user?.app_metadata?.is_admin === true;

      return NextResponse.redirect(`${origin}${hasPaid ? "/" : "/checkout"}`);
    }
  }

  // Something went wrong — back to login with an error flag
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
