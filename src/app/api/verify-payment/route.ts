import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/paystack";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  const productId = request.nextUrl.searchParams.get("productId");

  if (!reference) {
    return NextResponse.json({ verified: false, error: "Missing reference." }, { status: 400 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ verified: false, error: "Not authenticated." }, { status: 401 });
    }

    const admin = getAdminClient();

    if (productId) {
      // Per-product path — never short-circuits on has_paid/is_admin, since
      // whole-app entitlement says nothing about owning this specific product.
      const { data: existing } = await admin
        .from("product_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ verified: true, productId });
      }

      const txn = await verifyTransaction(reference);
      if (txn.status !== "success") {
        return NextResponse.json({ verified: false });
      }

      const userId = txn.metadata?.user_id;
      const txnProductId = txn.metadata?.product_id;
      if (!userId || userId !== user.id || txnProductId !== productId) {
        return NextResponse.json({ verified: false, error: "User or product mismatch." }, { status: 403 });
      }

      await admin.from("product_purchases").upsert(
        {
          user_id: userId,
          product_id: txnProductId,
          paystack_reference: reference,
          amount: txn.amount,
          currency: txn.currency,
          status: "completed",
        },
        { onConflict: "paystack_reference" }
      );

      return NextResponse.json({ verified: true, productId: txnProductId });
    }

    // If already marked as paid in JWT, return immediately
    if (user.app_metadata?.has_paid || user.app_metadata?.is_admin) {
      return NextResponse.json({ verified: true });
    }

    const txn = await verifyTransaction(reference);

    if (txn.status !== "success") {
      return NextResponse.json({ verified: false });
    }

    const userId = txn.metadata?.user_id;
    if (!userId || userId !== user.id) {
      return NextResponse.json({ verified: false, error: "User mismatch." }, { status: 403 });
    }

    // Record purchase if not already recorded (webhook may have beaten us to it)
    await admin.from("purchases").upsert(
      {
        user_id: userId,
        paystack_reference: reference,
        amount_kobo: txn.amount,
        currency: txn.currency,
        status: "completed",
      },
      { onConflict: "paystack_reference" }
    );

    // Mark paid
    await admin.rpc("mark_user_paid", { target_user_id: userId });

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("[verify-payment]", err);
    return NextResponse.json({ verified: false, error: "Verification failed." }, { status: 500 });
  }
}
