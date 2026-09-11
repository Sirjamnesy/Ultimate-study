import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/data/products";

/**
 * Server-only per-product ownership check. Unlike hasUserPaid() (a single
 * boolean carried in the JWT), this is a direct indexed query against
 * product_purchases — ownership is a growing, per-product set that doesn't
 * belong in app_metadata.
 */
export async function hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  const svc = await createServiceRoleClient();
  const { data, error } = await svc
    .from("product_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("status", "completed")
    .maybeSingle();

  return !error && !!data;
}

/** All products a user owns, most recently purchased first. */
export async function getUserProductPurchases(userId: string): Promise<Product[]> {
  const svc = await createServiceRoleClient();
  const { data: purchases } = await svc
    .from("product_purchases")
    .select("product_id, created_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  if (!purchases || purchases.length === 0) return [];

  const ids = purchases.map((p) => p.product_id);
  const { data: products } = await svc.from("products").select("*").in("id", ids);
  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  return purchases
    .map((p) => byId.get(p.product_id))
    .filter((p): p is NonNullable<typeof p> => !!p) as unknown as Product[];
}
