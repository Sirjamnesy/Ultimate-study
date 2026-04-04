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

  if (!reference) {
    return NextResponse.json({ verified: false, error: "Missing reference." }, { status: 400 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ verified: false, error: "Not authenticated." }, { status: 401 });
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

    const admin = getAdminClient();

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
