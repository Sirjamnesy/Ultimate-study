import { NextResponse } from "next/server";
import { CURRENCY_COOKIE } from "@/lib/geo/currency-server";
import type { PaystackCurrency } from "@/lib/paystack";

export async function POST(request: Request) {
  const { currency } = (await request.json()) as { currency: PaystackCurrency };
  if (currency !== "NGN" && currency !== "USD") {
    return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(CURRENCY_COOKIE, currency, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
