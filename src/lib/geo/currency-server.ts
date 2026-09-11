import { cookies } from "next/headers";
import type { PaystackCurrency } from "@/lib/paystack";
import { CURRENCY_COOKIE } from "@/lib/geo/currency";

export { CURRENCY_COOKIE };

/**
 * Server-only: reads the visitor's currency preference cookie (set by
 * proxy.ts on first visit via geo-detection, or by the manual toggle
 * thereafter). Falls back to USD if the cookie is somehow missing.
 */
export async function getPreferredCurrency(): Promise<PaystackCurrency> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CURRENCY_COOKIE)?.value;
  return value === "NGN" ? "NGN" : "USD";
}
