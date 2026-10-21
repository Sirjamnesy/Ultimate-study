import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePage } from "@/components/hub/course-page";
import { courses, getCourse } from "@/lib/data/courses";
import { ogImage } from "@/lib/site-url";

// Every course page is built at build time from the course list; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) return {};
  const title = `${c.title} | Wekaro`;
  return {
    title,
    description: c.short,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: {
      type: "website",
      siteName: "Wekaro",
      title,
      description: c.short,
      url: `/courses/${c.slug}`,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description: c.short, images: [ogImage.url] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  return <CoursePage course={course} />;
}
