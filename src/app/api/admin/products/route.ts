import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import { productFormSchema } from "@/lib/data/products";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const admin = await getAdminUser(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = productFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const svc = await createServiceRoleClient();
  const { data, error } = await svc
    .from("products")
    .insert({
      slug: parsed.data.slug,
      type: parsed.data.type,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      cover_image_url: parsed.data.cover_image_url || null,
      price_ngn_kobo: parsed.data.price_ngn_kobo,
      price_usd_cents: parsed.data.price_usd_cents,
      status: parsed.data.status,
      content: parsed.data.content as never,
      created_by: admin.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}
