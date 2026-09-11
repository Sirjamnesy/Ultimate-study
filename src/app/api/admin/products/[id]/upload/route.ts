import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const admin = await getAdminUser(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");
  if (!(file instanceof File) || (kind !== "pdf" && kind !== "cover")) {
    return NextResponse.json({ error: "Missing file or kind" }, { status: 400 });
  }

  const svc = await createServiceRoleClient();
  const { data: product, error: fetchError } = await svc
    .from("products")
    .select("content")
    .eq("id", id)
    .single();
  if (fetchError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const bucket = kind === "pdf" ? "product-files" : "product-covers";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await svc.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: true,
  });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  if (kind === "pdf") {
    const existingContent = (
      product.content && typeof product.content === "object" ? product.content : {}
    ) as Record<string, unknown>;
    const { error: updateError } = await svc
      .from("products")
      .update({ content: { ...existingContent, storage_path: path } })
      .eq("id", id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
    return NextResponse.json({ storage_path: path });
  }

  const { data: publicUrlData } = svc.storage.from(bucket).getPublicUrl(path);
  const { error: updateError } = await svc
    .from("products")
    .update({ cover_image_url: publicUrlData.publicUrl })
    .eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json({ cover_image_url: publicUrlData.publicUrl });
}
