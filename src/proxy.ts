import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { CURRENCY_COOKIE, resolveCurrencyFromHeader } from "@/lib/geo/currency";

// Routes that require a real, signed-in admin account. Deliberately excludes
// /api/admin/* — those route handlers check admin status themselves and
// return a 403 JSON response, which a redirect here would break (a fetch()
// caller expects JSON, not an HTML redirect target).
const ADMIN_ROUTES = [
  "/admin",
];

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
  "/library",             // owned digital products — real account, not the whole-app paywall
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
  "/products",            // public storefront — drives conversion for anonymous visitors
  "/updates",             // public changelog/announcements feed
  "/api/webhooks",
  "/api/currency",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");
}

function requiresAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function requiresPaid(pathname: string): boolean {
  return PAID_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function requiresAuth(pathname: string): boolean {
  return AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Geo-currency: default a currency cookie for first-time visitors based on
  // Vercel's edge geo header (absent in local dev, where this falls back to
  // USD). Never overwrites an existing cookie — that's what lets the manual
  // currency toggle stick after a visitor overrides the detected default.
  if (!request.cookies.get(CURRENCY_COOKIE)) {
    const country = request.headers.get("x-vercel-ip-country");
    response.cookies.set(CURRENCY_COOKIE, resolveCurrencyFromHeader(country), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  // Always allow public routes through
  if (isPublic(pathname)) {
    return response;
  }

  // Create a Supabase client that reads cookies from the request
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
  const isAdmin = !isAnonymous && user?.app_metadata?.is_admin === true;

  // Admin-route protection
  if (requiresAdmin(pathname)) {
    if (!isAuthenticated || isAnonymous) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

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
