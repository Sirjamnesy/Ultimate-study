import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { categoryLabel, type UpdateCategory } from "@/lib/data/updates";
import { MARKDOWN_CLASSES } from "@/lib/markdown-classes";

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: update } = await supabase
    .from("updates")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .single();

  if (!update) notFound();

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          href="/updates"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Updates
        </Link>

        <div className="sketch-card bg-card rounded-2xl overflow-hidden">
          {update.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={update.cover_image_url} alt="" className="w-full aspect-[21/9] object-cover" />
          )}
          <div className="p-6">
            <span className="sticker text-[9px] bg-transparent border-violet-400/50 text-violet-400">
              {categoryLabel(update.category as UpdateCategory)}
            </span>
            <h1 className="text-2xl font-bold font-sketch mt-2 mb-1">{update.title}</h1>
            <p className="text-xs text-muted-foreground mb-6">
              {new Date(update.published_at!).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className={MARKDOWN_CLASSES}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{update.body}</ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
