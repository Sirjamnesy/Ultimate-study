import { z } from "zod";

/**
 * Mirrors the Resource/Week shape in src/lib/data/roadmap.ts so the course
 * reader can reuse the roadmap's resource-checklist rendering patterns.
 */
export const courseResourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["course", "docs", "video", "practice", "build", "quiz", "reading"]),
  // http(s) only: students click these links, so reject javascript:/data: URLs.
  url: z
    .string()
    .url()
    .refine((u) => /^https?:\/\//i.test(u), "Links must start with http:// or https://")
    .optional(),
  body: z.string().optional(), // markdown, rendered inline when there's no external url
  duration: z.string().optional(),
});

export const courseModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  resources: z.array(courseResourceSchema).min(1),
});

export const courseContentSchema = z.object({
  modules: z.array(courseModuleSchema).min(1),
});

// storage_path is optional so a PDF product can be saved as a draft before its
// file is uploaded (uploads need the product's id, which only exists after
// the first save). Publishing without a file is blocked in productFormSchema.
export const pdfContentSchema = z.object({
  storage_path: z.string().min(1).optional(),
  page_count: z.number().int().positive().optional(),
});

export type CourseResource = z.infer<typeof courseResourceSchema>;
export type CourseModule = z.infer<typeof courseModuleSchema>;
export type CourseContent = z.infer<typeof courseContentSchema>;
export type PdfContent = z.infer<typeof pdfContentSchema>;

export type ProductType = "course" | "pdf";
export type ProductStatus = "draft" | "published" | "archived";

export type Product = {
  id: string;
  slug: string;
  type: ProductType;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  price_ngn_kobo: number;
  price_usd_cents: number;
  status: ProductStatus;
  content: CourseContent | PdfContent;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

/** Validates `content` against the schema matching the product's `type`. */
export function validateProductContent(type: ProductType, content: unknown) {
  return type === "pdf" ? pdfContentSchema.safeParse(content) : courseContentSchema.safeParse(content);
}

export const productFormSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    type: z.enum(["course", "pdf"]),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    cover_image_url: z.string().url().optional().or(z.literal("")),
    price_ngn_kobo: z.coerce.number().int().min(0),
    price_usd_cents: z.coerce.number().int().min(0),
    status: z.enum(["draft", "published", "archived"]),
    content: z.unknown(),
  })
  .superRefine((data, ctx) => {
    const result = validateProductContent(data.type, data.content);
    if (!result.success) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: `Invalid ${data.type} content: ${result.error.issues.map((i) => i.message).join("; ")}`,
      });
      return;
    }
    if (data.type === "pdf" && data.status === "published") {
      const storagePath = (data.content as { storage_path?: string } | null)?.storage_path;
      if (!storagePath) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Upload the PDF file before publishing this product.",
        });
      }
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve price for a product in the given currency, in kobo (NGN) or cents (USD). */
export function priceFor(product: Pick<Product, "price_ngn_kobo" | "price_usd_cents">, currency: "NGN" | "USD") {
  return currency === "NGN" ? product.price_ngn_kobo : product.price_usd_cents;
}

/** Format a kobo/cent amount for display, e.g. 2000000 NGN -> "₦20,000", 1500 USD -> "$15". */
export function formatPrice(amount: number, currency: "NGN" | "USD") {
  const major = amount / 100;
  const formatted = major.toLocaleString(currency === "NGN" ? "en-NG" : "en-US", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return currency === "NGN" ? `₦${formatted}` : `$${formatted}`;
}
