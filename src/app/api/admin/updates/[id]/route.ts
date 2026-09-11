import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import { updateFormSchema } from "@/lib/data/updates";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const admin = await getAdminUser(supabase);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = updateFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const svc = await createServiceRoleClient();
  const { data, error } = await svc
    .from("updates")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      category: parsed.data.category,
      body: parsed.data.body,
      cover_image_url: parsed.data.cover_image_url || null,
      published_at: parsed.data.published_at ? new Date(parsed.data.published_at).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ update: data });
}
