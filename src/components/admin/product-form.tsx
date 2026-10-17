"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Upload } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CourseBuilder } from "@/components/admin/course-builder";
import {
  type CourseContent,
  type PdfContent,
  type Product,
  type ProductType,
  type ProductStatus,
  slugify,
  validateProductContent,
} from "@/lib/data/products";
import {
  type ModuleDraft,
  courseToDrafts,
  draftsToCourse,
  newModule,
  validateCourseDrafts,
} from "@/lib/data/course-builder";
import { cn } from "@/lib/utils";

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

  // Course lessons live in the builder; a PDF's only content is its uploaded file.
  const [course, setCourse] = useState<ModuleDraft[]>(() =>
    product?.type === "course" ? courseToDrafts(product.content as CourseContent) : [newModule("Module 1")]
  );
  const [pdfPath, setPdfPath] = useState<string | null>(() =>
    product?.type === "pdf" ? ((product.content as PdfContent).storage_path ?? null) : null
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let content: unknown;
    if (type === "course") {
      const problem = validateCourseDrafts(course);
      if (problem) {
        setError(problem);
        return;
      }
      content = draftsToCourse(course);
    } else {
      content = {
        ...(product?.type === "pdf" ? (product.content as PdfContent) : {}),
        ...(pdfPath ? { storage_path: pdfPath } : {}),
      };
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
        setPdfPath(json.storage_path);
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
      {isEdit && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            See exactly what a customer sees after buying — works for drafts too.
          </p>
          <Link
            href={`/library/${product!.slug}`}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1.5")}
          >
            <Eye /> Preview as customer
          </Link>
        </div>
      )}

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
            onChange={(e) => setType(e.target.value as ProductType)}
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
                {uploadingPdf ? "Uploading…" : pdfPath ? "Replace PDF" : "Upload PDF"}
              </Button>
              <span className="text-xs text-muted-foreground">
                {pdfPath ? "File uploaded and stored privately." : "No file yet — upload one before publishing."}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Save as a draft first — you&apos;ll be able to upload the PDF on the next screen.
            </p>
          )}
        </div>
      )}

      {type === "course" && <CourseBuilder modules={course} onChange={setCourse} />}

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
