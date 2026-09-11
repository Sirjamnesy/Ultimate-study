import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";
import { categoryLabel, type UpdateCategory } from "@/lib/data/updates";

const categoryColor: Record<UpdateCategory, string> = {
  "ai-news": "border-blue-400/50 text-blue-400",
  "product-update": "border-violet-400/50 text-violet-400",
  "service-update": "border-amber-400/50 text-amber-400",
};

export default async function UpdatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: updates } = await supabase
    .from("updates")
    .select("id, slug, title, category, cover_image_url, published_at")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen notebook-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold font-sketch mb-1">Updates</h1>
        <p className="text-sm text-muted-foreground mb-8">
          What&apos;s new — in AI, and around here.
        </p>

        {!updates || updates.length === 0 ? (
          <div className="sketch-card bg-card p-10 rounded-2xl text-center text-sm text-muted-foreground">
            Nothing posted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((u) => (
              <Link
                key={u.id}
                href={`/updates/${u.slug}`}
                className="sketch-card bg-card p-4 rounded-2xl flex items-start gap-3 hover:-translate-y-0.5 transition-transform"
              >
                {u.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.cover_image_url}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover shrink-0 sketch-border-sm"
                  />
                )}
                <div className="min-w-0">
                  <span
                    className={`sticker text-[9px] bg-transparent ${categoryColor[u.category as UpdateCategory]}`}
                  >
                    {categoryLabel(u.category as UpdateCategory)}
                  </span>
                  <h2 className="font-semibold mt-1.5 leading-snug">{u.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(u.published_at!).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
