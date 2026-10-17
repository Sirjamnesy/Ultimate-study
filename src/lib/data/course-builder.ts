import type { CourseContent, CourseResource } from "@/lib/data/products";

export type LessonType = CourseResource["type"];

export const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "reading", label: "Reading" },
  { value: "video", label: "Video" },
  { value: "practice", label: "Practice exercise" },
  { value: "build", label: "Build project" },
  { value: "quiz", label: "Quiz" },
  { value: "docs", label: "Docs / reference" },
  { value: "course", label: "External course" },
];

/** Editing shape: every field is a plain string so inputs stay controlled. */
export type LessonDraft = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  body: string;
  url: string;
};

export type ModuleDraft = {
  id: string;
  title: string;
  lessons: LessonDraft[];
};

// Ids are random, never derived from position or reused after a delete: students'
// progress is saved against a lesson id, so a reused id would hand a deleted
// lesson's ticks to a brand-new one.
function randomId(prefix: string): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  const suffix = uuid ? uuid.replace(/-/g, "").slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${suffix}`;
}

export function newLesson(title = ""): LessonDraft {
  return { id: randomId("l"), title, type: "reading", duration: "", body: "", url: "" };
}

export function newModule(title = ""): ModuleDraft {
  return { id: randomId("m"), title, lessons: [newLesson()] };
}

export function courseToDrafts(content: CourseContent | null | undefined): ModuleDraft[] {
  const modules = Array.isArray(content?.modules) ? content.modules : [];
  return modules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: (m.resources ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      duration: r.duration ?? "",
      body: r.body ?? "",
      url: r.url ?? "",
    })),
  }));
}

/** Drafts → the stored shape. Empty optional fields are omitted, not saved as "". */
export function draftsToCourse(modules: ModuleDraft[]): CourseContent {
  return {
    modules: modules.map((m) => ({
      id: m.id,
      title: m.title.trim(),
      resources: m.lessons.map((l) => {
        const resource: CourseResource = { id: l.id, title: l.title.trim(), type: l.type };
        if (l.duration.trim()) resource.duration = l.duration.trim();
        if (l.body.trim()) resource.body = l.body.replace(/\s+$/, "");
        if (l.url.trim()) resource.url = l.url.trim();
        return resource;
      }),
    })),
  };
}

function isWebUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** A plain-English reason the course can't be saved yet, or null if it's fine. */
export function validateCourseDrafts(modules: ModuleDraft[]): string | null {
  if (modules.length === 0) return "Add at least one module.";

  for (let mi = 0; mi < modules.length; mi++) {
    const m = modules[mi];
    if (!m.title.trim()) return `Module ${mi + 1} needs a title.`;
    if (m.lessons.length === 0) return `"${m.title.trim()}" needs at least one lesson.`;

    for (let li = 0; li < m.lessons.length; li++) {
      const l = m.lessons[li];
      if (!l.title.trim()) return `Lesson ${li + 1} in "${m.title.trim()}" needs a title.`;
      if (l.url.trim() && !isWebUrl(l.url.trim())) {
        return `The link on "${l.title.trim()}" isn't a valid web address — it should start with https://`;
      }
    }
  }
  return null;
}

/** Returns a copy with the item at `from` moved to `to` (no-op if out of range). */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
