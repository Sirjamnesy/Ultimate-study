import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/data/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const svc = await createServiceRoleClient();
  const { data: product } = await svc.from("products").select("*").eq("id", id).single();

  if (!product) notFound();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit product</h2>
      <ProductForm product={product as unknown as Product} />
    </div>
  );
}
