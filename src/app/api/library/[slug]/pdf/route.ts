import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { hasUserPurchasedProduct } from "@/lib/supabase/product-purchases";
import type { PdfContent } from "@/lib/data/products";

const SIGNED_URL_TTL_SECONDS = 600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const svc = await createServiceRoleClient();
  const { data: product } = await svc
    .from("products")
    .select("id, type, content")
    .eq("slug", slug)
    .single();

  if (!product || product.type !== "pdf") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const owned = await hasUserPurchasedProduct(user.id, product.id);
  if (!owned) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const content = product.content as unknown as PdfContent;
  if (!content?.storage_path) {
    return NextResponse.json({ error: "File not uploaded yet." }, { status: 404 });
  }

  const { data: signed, error } = await svc.storage
    .from("product-files")
    .createSignedUrl(content.storage_path, SIGNED_URL_TTL_SECONDS);

  if (error || !signed) {
    return NextResponse.json({ error: "Could not create download link." }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
