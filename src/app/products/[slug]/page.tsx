import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, FileText } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasUserPurchasedProduct } from "@/lib/supabase/product-purchases";
import { Header } from "@/components/shared/header";
import { BuyButton } from "@/components/products/buy-button";
import { getPreferredCurrency } from "@/lib/geo/currency-server";
import { formatPrice, priceFor, type Product } from "@/lib/data/products";
import { MARKDOWN_CLASSES } from "@/lib/markdown-classes";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const currency = await getPreferredCurrency();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!product) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const owned =
    !!user && !user.is_anonymous && (await hasUserPurchasedProduct(user.id, product.id));

  const typed = product as unknown as Product;

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="sketch-card bg-card rounded-2xl overflow-hidden mb-6">
          <div className="aspect-[21/9] bg-muted/40 flex items-center justify-center">
            {typed.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typed.cover_image_url} alt="" className="h-full w-full object-cover" />
            ) : typed.type === "pdf" ? (
              <FileText className="h-14 w-14 text-muted-foreground/50" />
            ) : (
              <BookOpen className="h-14 w-14 text-muted-foreground/50" />
            )}
          </div>
          <div className="p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {typed.type === "pdf" ? "PDF Guide" : "Course"}
            </div>
            <h1 className="text-2xl font-bold font-sketch mb-1">{typed.title}</h1>
            {typed.subtitle && <p className="text-muted-foreground mb-4">{typed.subtitle}</p>}

            {typed.description && (
              <div className={`${MARKDOWN_CLASSES} mb-6`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{typed.description}</ReactMarkdown>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 flex-wrap sketch-border-sm rounded-xl p-4 bg-muted/20">
              <div>
                <div className="text-xs text-muted-foreground">One-time purchase</div>
                <div className="text-xl font-bold font-mono text-violet-400">
                  {formatPrice(priceFor(typed, currency), currency)}
                </div>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[180px]">
                <BuyButton slug={typed.slug} currency={currency} owned={owned} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
