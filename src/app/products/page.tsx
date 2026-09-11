import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { CurrencyToggle } from "@/components/shared/currency-toggle";
import { getPreferredCurrency } from "@/lib/geo/currency-server";
import { formatPrice, priceFor, type Product } from "@/lib/data/products";

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();
  const currency = await getPreferredCurrency();

  // Anon-key client honors RLS — only status='published' rows come back,
  // so this never needs the service-role client.
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold font-sketch mb-1">Shop</h1>
            <p className="text-sm text-muted-foreground">
              Courses and guides — one-time purchase, yours forever.
            </p>
          </div>
          <CurrencyToggle currency={currency} />
        </div>

        {!products || products.length === 0 ? (
          <div className="sketch-card bg-card p-10 rounded-2xl text-center text-sm text-muted-foreground">
            Nothing here yet — check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(products as Product[]).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="sketch-card bg-card rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform"
              >
                <div className="aspect-[16/9] bg-muted/40 flex items-center justify-center">
                  {product.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.cover_image_url} alt="" className="h-full w-full object-cover" />
                  ) : product.type === "pdf" ? (
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {product.type === "pdf" ? "PDF Guide" : "Course"}
                  </div>
                  <h2 className="font-semibold mb-1 leading-snug">{product.title}</h2>
                  {product.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.subtitle}</p>
                  )}
                  <div className="font-mono font-bold text-violet-400">
                    {formatPrice(priceFor(product, currency), currency)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
