const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = "https://api.paystack.co";

function paystackHeaders() {
  return {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

export type PaystackCurrency = "NGN" | "USD";

// ₦20,000 = 2,000,000 kobo | $15 = 1,500 cents
export const PRICES: Record<PaystackCurrency, number> = {
  NGN: 2_000_000,
  USD: 1_500,
};

export type InitTransactionResult = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

/**
 * Initialize a Paystack transaction and return the hosted checkout URL.
 */
export async function initializeTransaction(params: {
  email: string;
  currency: PaystackCurrency;
  metadata: Record<string, string>;
  callbackUrl: string;
}): Promise<InitTransactionResult> {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      email: params.email,
      amount: PRICES[params.currency],
      currency: params.currency,
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack initialize failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  if (!json.status) {
    throw new Error(`Paystack error: ${json.message}`);
  }

  return json.data as InitTransactionResult;
}

export type VerifyTransactionResult = {
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
  customer: { email: string };
  metadata: Record<string, string>;
};

/**
 * Verify a transaction by reference. Always verify server-side before granting access.
 */
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const res = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: paystackHeaders(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack verify failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  if (!json.status) {
    throw new Error(`Paystack error: ${json.message}`);
  }

  return json.data as VerifyTransactionResult;
}

/**
 * Verify Paystack webhook signature.
 * Paystack signs the payload with HMAC-SHA512 using your secret key.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(PAYSTACK_SECRET_KEY);
  const msgData = encoder.encode(rawBody);

  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-512" }, false, ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const computedHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedHex === signature;
}
