import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require a paid account
const PAID_ROUTES = [
  "/roadmap",
  "/quiz",
  "/badges",
  "/profile",
  "/check-ins",
];

// Routes that require authentication but not payment
const AUTH_ROUTES = [
  "/checkout",
  "/payment",
  "/api/checkout",
  "/api/verify-payment",
  "/api/redeem-invite",
];

// Always-public routes (never redirect)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/auth/callback",      // OAuth callback — tokens processed client-side
  "/forgot-password",    // Anyone can request a reset
  "/reset-password",     // Token in URL hash IS the auth — must be public
  "/api/webhooks",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");
}

function requiresPaid(pathname: string): boolean {
  return PAID_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function requiresAuth(pathname: string): boolean {
  return AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Create a Supabase client that reads cookies from the request
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isAnonymous = !user || user.is_anonymous === true;
  const hasPaid = !isAnonymous && (
    user?.app_metadata?.has_paid === true ||
    user?.app_metadata?.is_admin === true
  );

  // Paid-route protection
  if (requiresPaid(pathname)) {
    if (!isAuthenticated || isAnonymous) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!hasPaid) {
      return NextResponse.redirect(new URL("/checkout", request.url));
    }
    return response;
  }

  // Auth-route protection (checkout, payment pages)
  if (requiresAuth(pathname)) {
    if (!isAuthenticated || isAnonymous) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
