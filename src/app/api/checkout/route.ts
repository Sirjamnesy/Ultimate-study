import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { initializeTransaction, type PaystackCurrency } from "@/lib/paystack";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ultimate-study-nu.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const { currency } = await request.json() as { currency: PaystackCurrency };

    if (currency !== "NGN" && currency !== "USD") {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    if (user.is_anonymous) {
      return NextResponse.json({ error: "Please create an account first." }, { status: 403 });
    }

    // Already paid?
    if (user.app_metadata?.has_paid || user.app_metadata?.is_admin) {
      return NextResponse.json({ error: "Already paid.", alreadyPaid: true }, { status: 400 });
    }

    const email = user.email!;
    const transaction = await initializeTransaction({
      email,
      currency,
      metadata: { user_id: user.id },
      callbackUrl: `${APP_URL}/payment/callback`,
    });

    return NextResponse.json({ authorization_url: transaction.authorization_url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }
}
