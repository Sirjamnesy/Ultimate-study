"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  type Product,
  type ProductType,
  type ProductStatus,
  slugify,
  validateProductContent,
} from "@/lib/data/products";

const DEFAULT_COURSE_CONTENT = JSON.stringify(
  {
    modules: [
      {
        id: "m1",
        title: "Module 1",
        resources: [
          { id: "m1-r1", title: "Lesson 1", type: "reading", body: "Write your lesson content here (markdown supported)." },
        ],
      },
    ],
  },
  null,
  2
);

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [type, setType] = useState<ProductType>(product?.type ?? "course");
  const [title, setTitle] = useState(product?.title ?? "");
  const [subtitle, setSubtitle] = useState(product?.subtitle ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(product?.cover_image_url ?? "");
  const [priceNgn, setPriceNgn] = useState(product ? String(product.price_ngn_kobo / 100) : "20000");
  const [priceUsd, setPriceUsd] = useState(product ? String(product.price_usd_cents / 100) : "15");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [contentJson, setContentJson] = useState(
    product ? JSON.stringify(product.content, null, 2) : DEFAULT_COURSE_CONTENT
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  // A PDF has no lesson JSON — its only "content" is the uploaded file — so
  // switching type on a new product swaps in the matching starting content.
  function handleTypeChange(next: ProductType) {
    setType(next);
    setContentJson(next === "pdf" ? "{}" : DEFAULT_COURSE_CONTENT);
  }

  const uploadedPdfPath = (() => {
    try {
      return (JSON.parse(contentJson) as { storage_path?: string }).storage_path ?? null;
    } catch {
      return null;
    }
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let content: unknown;
    try {
      content = JSON.parse(contentJson);
    } catch {
      setError("Content is not valid JSON.");
      return;
    }
    const contentCheck = validateProductContent(type, content);
    if (!contentCheck.success) {
      setError(`Invalid ${type} content: ${contentCheck.error.issues.map((i) => i.message).join("; ")}`);
      return;
    }

    const payload = {
      slug,
      type,
      title,
      subtitle,
      description,
      cover_image_url: coverImageUrl,
      price_ngn_kobo: Math.round(parseFloat(priceNgn || "0") * 100),
      price_usd_cents: Math.round(parseFloat(priceUsd || "0") * 100),
      status,
      content,
    };

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not save product.");
        setSaving(false);
        return;
      }
      if (isEdit) {
        router.refresh();
        setSaving(false);
      } else {
        router.push(`/admin/products/${json.product.id}/edit`);
      }
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleUpload(kind: "pdf" | "cover", file: File) {
    if (!product) return;
    const setUploading = kind === "pdf" ? setUploadingPdf : setUploadingCover;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      const res = await fetch(`/api/admin/products/${product.id}/upload`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed.");
        setUploading(false);
        return;
      }
      if (kind === "pdf") {
        const parsed = JSON.parse(contentJson || "{}");
        setContentJson(JSON.stringify({ ...parsed, storage_path: json.storage_path }, null, 2));
      } else {
        setCoverImageUrl(json.cover_image_url);
      }
      router.refresh();
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
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
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            value={type}
            disabled={isEdit}
            onChange={(e) => handleTypeChange(e.target.value as ProductType)}
          >
            <option value="course">Course (read in the app)</option>
            <option value="pdf">PDF (a file to read or download)</option>
          </Select>
          {isEdit && <p className="text-xs text-muted-foreground">Type can&apos;t change after creation.</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (markdown)</Label>
        <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="priceNgn">Price — NGN (₦)</Label>
          <Input id="priceNgn" type="number" min="0" step="1" value={priceNgn} onChange={(e) => setPriceNgn(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priceUsd">Price — USD ($)</Label>
          <Input id="priceUsd" type="number" min="0" step="0.01" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Cover image</Label>
        <div className="flex items-center gap-3">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt="" className="h-12 w-12 rounded-lg object-cover sketch-border-sm" />
          ) : null}
          <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" className="flex-1" />
          {isEdit && (
            <>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("cover", f); }}
              />
              <Button type="button" variant="outline" size="sm" disabled={uploadingCover} onClick={() => coverInputRef.current?.click()}>
                {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              </Button>
            </>
          )}
        </div>
        {!isEdit && <p className="text-xs text-muted-foreground">Save the product first to enable file uploads.</p>}
      </div>

      {type === "pdf" && (
        <div className="space-y-1.5">
          <Label>PDF file</Label>
          {isEdit ? (
            <div className="flex items-center gap-3 flex-wrap">
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("pdf", f); }}
              />
              <Button type="button" variant="outline" size="sm" disabled={uploadingPdf} onClick={() => pdfInputRef.current?.click()} className="gap-1.5">
                {uploadingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploadingPdf ? "Uploading…" : uploadedPdfPath ? "Replace PDF" : "Upload PDF"}
              </Button>
              <span className="text-xs text-muted-foreground">
                {uploadedPdfPath ? "File uploaded and stored privately." : "No file yet — upload one before publishing."}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Save as a draft first — you&apos;ll be able to upload the PDF on the next screen.
            </p>
          )}
        </div>
      )}

      {type === "course" && (
        <div className="space-y-1.5">
          <Label htmlFor="content">Course content (JSON)</Label>
          <details className="text-xs text-muted-foreground rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
            <summary className="cursor-pointer font-medium text-foreground/80">How this works</summary>
            <div className="mt-2 space-y-1.5 leading-relaxed">
              <p>
                A course is a list of <b>modules</b> (sections), and each module is a list of <b>resources</b> (lessons
                students tick off). Copy a resource block to add another lesson; copy a module block to add a section.
              </p>
              <p>
                Every <code>id</code> must be unique within the course and never change once students have started
                (their progress is saved against it). <code>type</code> is one of: reading, video, course, docs,
                practice, build, quiz.
              </p>
              <p>
                For a lesson you write here, put the text in <code>body</code> (markdown works). For a lesson hosted
                elsewhere (a YouTube video, a doc), use <code>url</code> instead. <code>duration</code> is optional,
                e.g. &quot;15 min&quot;.
              </p>
            </div>
          </details>
          <Textarea
            id="content"
            rows={14}
            value={contentJson}
            onChange={(e) => setContentJson(e.target.value)}
            className="font-mono text-xs"
            spellCheck={false}
          />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
