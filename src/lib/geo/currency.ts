import type { PaystackCurrency } from "@/lib/paystack";

export const CURRENCY_COOKIE = "currency";

/**
 * Resolve a currency from Vercel's edge geo header. Absent in local dev
 * (Vercel only populates x-vercel-ip-country in production) — falls back to
 * USD there rather than erroring.
 */
export function resolveCurrencyFromHeader(countryCode: string | null): PaystackCurrency {
  return countryCode === "NG" ? "NGN" : "USD";
}
