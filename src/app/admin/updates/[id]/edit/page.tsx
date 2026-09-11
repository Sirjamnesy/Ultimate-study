import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { UpdateForm } from "@/components/admin/update-form";
import type { Update } from "@/lib/data/updates";

export default async function EditUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const svc = await createServiceRoleClient();
  const { data: update } = await svc.from("updates").select("*").eq("id", id).single();

  if (!update) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit update</h2>
      <UpdateForm update={update as unknown as Update} />
    </div>
  );
}
