import { z } from "zod";

export type UpdateCategory = "ai-news" | "product-update" | "service-update";

export type Update = {
  id: string;
  slug: string;
  title: string;
  category: UpdateCategory;
  body: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export const updateFormSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  category: z.enum(["ai-news", "product-update", "service-update"]),
  body: z.string().min(1),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  // Datetime-local input value ("YYYY-MM-DDTHH:mm") or "" for draft (unpublished).
  published_at: z.string().optional().or(z.literal("")),
});

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function categoryLabel(category: UpdateCategory): string {
  switch (category) {
    case "ai-news":
      return "AI News";
    case "product-update":
      return "Product Update";
    case "service-update":
      return "Service Update";
  }
}
