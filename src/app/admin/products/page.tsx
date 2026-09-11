import Link from "next/link";
import { Plus } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data/products";

export default async function AdminProductsPage() {
  const svc = await createServiceRoleClient();
  const { data: products } = await svc
    .from("products")
    .select("id, slug, type, title, status, price_ngn_kobo, price_usd_cents, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link href="/admin/products/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New product
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="sketch-card bg-card p-8 rounded-2xl text-center text-sm text-muted-foreground">
          No products yet. Create your first one.
        </div>
      ) : (
        <div className="sketch-card bg-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{p.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === "published" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatPrice(p.price_ngn_kobo, "NGN")} / {formatPrice(p.price_usd_cents, "USD")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
