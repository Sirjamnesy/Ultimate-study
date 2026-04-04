import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Service-role client — no cookies needed, webhook has no user session
function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const rawBody = await request.text();

  // Verify the webhook is genuinely from Paystack
  const isValid = await verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn("[webhook/paystack] Invalid signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: { event: string; data: { reference: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    // Acknowledge non-payment events without processing
    return NextResponse.json({ received: true });
  }

  const { reference } = event.data;

  try {
    // Double-verify via Paystack API
    const txn = await verifyTransaction(reference);

    if (txn.status !== "success") {
      console.warn("[webhook/paystack] Transaction not successful:", reference);
      return NextResponse.json({ received: true });
    }

    const userId = txn.metadata?.user_id;
    if (!userId) {
      console.error("[webhook/paystack] No user_id in metadata for reference:", reference);
      return NextResponse.json({ received: true });
    }

    const admin = getAdminClient();

    // Insert purchase record (idempotent via UNIQUE on paystack_reference)
    const { error: insertError } = await admin.from("purchases").insert({
      user_id: userId,
      paystack_reference: reference,
      amount_kobo: txn.amount,
      currency: txn.currency,
      status: "completed",
    });

    if (insertError && !insertError.message.includes("duplicate")) {
      console.error("[webhook/paystack] Insert failed:", insertError.message);
      return NextResponse.json({ error: "DB insert failed." }, { status: 500 });
    }

    // Mark user as paid in auth metadata so JWT reflects it
    const { error: rpcError } = await admin.rpc("mark_user_paid", {
      target_user_id: userId,
    });

    if (rpcError) {
      console.error("[webhook/paystack] mark_user_paid failed:", rpcError.message);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook/paystack] Error:", err);
    return NextResponse.json({ error: "Processing error." }, { status: 500 });
  }
}
