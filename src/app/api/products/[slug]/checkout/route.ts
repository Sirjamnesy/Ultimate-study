import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { initializeTransaction, type PaystackCurrency } from "@/lib/paystack";
import { priceFor } from "@/lib/data/products";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ultimate-study-nu.vercel.app";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { currency } = (await request.json()) as { currency: PaystackCurrency };
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

    const svc = await createServiceRoleClient();
    const { data: product } = await svc
      .from("products")
      .select("id, status, price_ngn_kobo, price_usd_cents")
      .eq("slug", slug)
      .single();

    if (!product || product.status !== "published") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const { data: existing } = await svc
      .from("product_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Already owned.", alreadyOwned: true }, { status: 400 });
    }

    const email = user.email!;
    const amount = priceFor(product, currency);
    const transaction = await initializeTransaction({
      email,
      currency,
      amount,
      metadata: { user_id: user.id, product_id: product.id },
      callbackUrl: `${APP_URL}/payment/callback/product?slug=${encodeURIComponent(slug)}`,
    });

    return NextResponse.json({ authorization_url: transaction.authorization_url });
  } catch (err) {
    console.error("[products/checkout]", err);
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }
}
