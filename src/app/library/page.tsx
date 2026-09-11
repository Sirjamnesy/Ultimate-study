import Link from "next/link";
import { BookOpen, FileText, Library as LibraryIcon } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserProductPurchases } from "@/lib/supabase/product-purchases";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";

export default async function LibraryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const products = user && !user.is_anonymous ? await getUserProductPurchases(user.id) : [];

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold font-sketch mb-1">My Library</h1>
        <p className="text-sm text-muted-foreground mb-8">Courses and PDFs you own.</p>

        {products.length === 0 ? (
          <div className="sketch-card bg-card p-10 rounded-2xl text-center">
            <LibraryIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">Nothing here yet.</p>
            <Link href="/products">
              <Button size="sm">Browse the shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/library/${product.slug}`}
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
                  <h2 className="font-semibold leading-snug">{product.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
