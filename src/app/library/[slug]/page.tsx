import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { hasUserPurchasedProduct } from "@/lib/supabase/product-purchases";
import { isAdminUser } from "@/lib/auth/admin";
import { Header } from "@/components/shared/header";
import { PdfViewer } from "@/components/library/pdf-viewer";
import { CourseReader } from "@/components/library/course-reader";
import type { CourseContent, Product } from "@/lib/data/products";

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    redirect("/login");
  }

  const svc = await createServiceRoleClient();
  const { data: product } = await svc.from("products").select("*").eq("slug", slug).single();

  if (!product) notFound();

  // Admins can open any product — drafts included — so the owner can check a
  // course or PDF exactly as a customer sees it, without buying their own.
  const adminPreview = isAdminUser(user);
  const owned = adminPreview || (await hasUserPurchasedProduct(user.id, product.id));
  if (!owned) {
    redirect(`/products/${slug}`);
  }

  const typed = product as unknown as Product;

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Library
        </Link>

        {adminPreview && (
          <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-300">
            Admin preview — this is what a customer sees after buying
            {typed.status !== "published" && <> (this product is <b>{typed.status}</b>, so customers can&apos;t find it yet)</>}.
          </div>
        )}

        <h1 className="text-2xl font-bold font-sketch">{typed.title}</h1>

        {typed.type === "pdf" ? (
          <PdfViewer slug={typed.slug} />
        ) : (
          <CourseReader productId={typed.id} content={typed.content as CourseContent} />
        )}
      </main>
    </div>
  );
}
