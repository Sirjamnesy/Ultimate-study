"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { type Update, type UpdateCategory } from "@/lib/data/updates";
import { slugify } from "@/lib/data/products";

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function UpdateForm({ update }: { update?: Update }) {
  const router = useRouter();
  const isEdit = !!update;

  const [slug, setSlug] = useState(update?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [title, setTitle] = useState(update?.title ?? "");
  const [category, setCategory] = useState<UpdateCategory>(update?.category ?? "product-update");
  const [body, setBody] = useState(update?.body ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(update?.cover_image_url ?? "");
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocal(update?.published_at ?? null));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = { slug, title, category, body, cover_image_url: coverImageUrl, published_at: publishedAt };

    try {
      const res = await fetch(isEdit ? `/api/admin/updates/${update!.id}` : "/api/admin/updates", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not save update.");
        setSaving(false);
        return;
      }
      router.push("/admin/updates");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={category} onChange={(e) => setCategory(e.target.value as UpdateCategory)}>
            <option value="ai-news">AI News</option>
            <option value="product-update">Product Update</option>
            <option value="service-update">Service Update</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">Publish at (empty = draft)</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverImageUrl">Cover image URL</Label>
        <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Body (markdown)</Label>
        <Textarea id="body" rows={12} value={body} onChange={(e) => setBody(e.target.value)} required />
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <Button type="submit" disabled={saving} className="gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isEdit ? "Save changes" : "Create update"}
      </Button>
    </form>
  );
}
