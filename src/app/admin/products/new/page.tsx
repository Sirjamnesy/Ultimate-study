import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">New product</h2>
      <ProductForm />
    </div>
  );
}
