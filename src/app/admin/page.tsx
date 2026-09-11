import Link from "next/link";
import { Package, Megaphone, Plus, Wallet } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const svc = await createServiceRoleClient();

  const [{ count: productCount }, { count: publishedCount }, { count: updateCount }, { data: purchases }, { data: productPurchases }] =
    await Promise.all([
      svc.from("products").select("*", { count: "exact", head: true }),
      svc.from("products").select("*", { count: "exact", head: true }).eq("status", "published"),
      svc.from("updates").select("*", { count: "exact", head: true }),
      svc.from("purchases").select("amount_kobo, currency").eq("status", "completed"),
      svc.from("product_purchases").select("amount, currency").eq("status", "completed"),
    ]);

  const revenue = { NGN: 0, USD: 0 };
  for (const p of purchases ?? []) {
    if (p.currency === "NGN") revenue.NGN += p.amount_kobo;
    else if (p.currency === "USD") revenue.USD += p.amount_kobo;
  }
  for (const p of productPurchases ?? []) {
    if (p.currency === "NGN") revenue.NGN += p.amount;
    else if (p.currency === "USD") revenue.USD += p.amount;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Products" value={String(productCount ?? 0)} sub={`${publishedCount ?? 0} published`} />
        <StatCard label="Updates" value={String(updateCount ?? 0)} sub="posted" />
        <StatCard
          label="Revenue (NGN)"
          value={`₦${(revenue.NGN / 100).toLocaleString("en-NG")}`}
          sub="whole-app + products"
        />
        <StatCard
          label="Revenue (USD)"
          value={`$${(revenue.USD / 100).toLocaleString("en-US")}`}
          sub="whole-app + products"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sketch-card bg-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-violet-400" />
            <h2 className="font-semibold">Products</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Courses and PDFs sold for a one-time fee.
          </p>
          <div className="flex gap-2">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
            <Link href="/admin/products/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New product
              </Button>
            </Link>
          </div>
        </div>

        <div className="sketch-card bg-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="h-4 w-4 text-violet-400" />
            <h2 className="font-semibold">Updates</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            AI-world news and product/service announcements shown on /updates.
          </p>
          <div className="flex gap-2">
            <Link href="/admin/updates">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
            <Link href="/admin/updates/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New update
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="sketch-border-sm rounded-xl p-4 flex items-start gap-3 bg-muted/30">
        <Wallet className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Revenue combines the whole-app purchase (<code>purchases</code>) and per-product purchases
          (<code>product_purchases</code>) — they&apos;re tracked separately so the existing paywall stays untouched.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="sketch-border-sm rounded-xl p-4 bg-card">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-bold font-mono">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
