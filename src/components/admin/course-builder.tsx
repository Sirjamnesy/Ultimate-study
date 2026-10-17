"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { courseContentSchema } from "@/lib/data/products";
import { MARKDOWN_CLASSES } from "@/lib/markdown-classes";
import {
  LESSON_TYPES,
  type LessonDraft,
  type LessonType,
  type ModuleDraft,
  courseToDrafts,
  moveItem,
  newLesson,
  newModule,
} from "@/lib/data/course-builder";

function RowControls({
  label,
  index,
  total,
  onMove,
  onDelete,
}: {
  label: string;
  index: number;
  total: number;
  onMove: (to: number) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index - 1)}
      >
        <ChevronUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Move ${label} down`}
        disabled={index === total - 1}
        onClick={() => onMove(index + 1)}
      >
        <ChevronDown />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Delete ${label}`}
        className="text-muted-foreground hover:text-red-400"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function LessonEditor({
  lesson,
  index,
  total,
  onChange,
  onMove,
  onDelete,
}: {
  lesson: LessonDraft;
  index: number;
  total: number;
  onChange: (patch: Partial<LessonDraft>) => void;
  onMove: (to: number) => void;
  onDelete: () => void;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3 space-y-2.5">
      <div className="flex items-start gap-2">
        <span className="mt-2 w-5 shrink-0 text-xs font-mono text-muted-foreground">{index + 1}.</span>
        <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_9.5rem_6.5rem]">
          <Input
            aria-label="Lesson title"
            placeholder="Lesson title"
            value={lesson.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <Select
            aria-label="Lesson type"
            value={lesson.type}
            onChange={(e) => onChange({ type: e.target.value as LessonType })}
          >
            {LESSON_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
          <Input
            aria-label="Duration"
            placeholder="15 min"
            value={lesson.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </div>
        <RowControls label="lesson" index={index} total={total} onMove={onMove} onDelete={onDelete} />
      </div>

      <div className="space-y-2 sm:pl-7">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Lesson text (optional — markdown works)</Label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
        {preview ? (
          <div className={`${MARKDOWN_CLASSES} min-h-24 rounded-lg border border-border/60 p-3`}>
            {lesson.body.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
            ) : (
              <p className="text-xs text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <Textarea
            aria-label="Lesson text"
            rows={5}
            placeholder="Write the lesson here…"
            value={lesson.body}
            onChange={(e) => onChange({ body: e.target.value })}
          />
        )}
        <Input
          aria-label="Link"
          placeholder="Link to a video or page (optional) — https://…"
          value={lesson.url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </div>
    </div>
  );
}

function JsonImport({ onImport }: { onImport: (modules: ModuleDraft[]) => void }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function apply() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setMessage({ ok: false, text: "That isn't valid JSON." });
      return;
    }
    const result = courseContentSchema.safeParse(parsed);
    if (!result.success) {
      const issue = result.error.issues[0];
      setMessage({
        ok: false,
        text: `That doesn't match the course format (${issue?.path.join(" › ") || "top level"}: ${issue?.message}).`,
      });
      return;
    }
    if (!window.confirm("Replace everything in the builder above with this JSON?")) return;
    onImport(courseToDrafts(result.data));
    setText("");
    setMessage({ ok: true, text: "Imported. Check the builder above, then save." });
  }

  return (
    <details className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
      <summary className="cursor-pointer font-medium text-foreground/80">Advanced: import a course from JSON</summary>
      <div className="mt-2 space-y-2">
        <p>
          Have a course written elsewhere (or generated for you)? Paste it here in the format{" "}
          <code>{`{ "modules": [ { "id", "title", "resources": [ … ] } ] }`}</code> and it fills the builder.
        </p>
        <Textarea
          aria-label="Course JSON"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-xs"
          spellCheck={false}
        />
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" disabled={!text.trim()} onClick={apply}>
            Replace course with this JSON
          </Button>
          {message && (
            <span className={message.ok ? "text-emerald-400" : "text-red-400"}>{message.text}</span>
          )}
        </div>
      </div>
    </details>
  );
}

export function CourseBuilder({
  modules,
  onChange,
}: {
  modules: ModuleDraft[];
  onChange: (modules: ModuleDraft[]) => void;
}) {
  const updateModule = (mi: number, patch: Partial<ModuleDraft>) =>
    onChange(modules.map((m, i) => (i === mi ? { ...m, ...patch } : m)));

  const updateLesson = (mi: number, li: number, patch: Partial<LessonDraft>) =>
    updateModule(mi, { lessons: modules[mi].lessons.map((l, i) => (i === li ? { ...l, ...patch } : l)) });

  const deleteModule = (mi: number) => {
    const m = modules[mi];
    const label = m.title.trim() ? `"${m.title.trim()}"` : `Module ${mi + 1}`;
    if (!window.confirm(`Delete ${label} and its ${m.lessons.length} lesson(s)? Students lose their progress on them.`)) return;
    onChange(modules.filter((_, i) => i !== mi));
  };

  const deleteLesson = (mi: number, li: number) => {
    const l = modules[mi].lessons[li];
    const label = l.title.trim() ? `"${l.title.trim()}"` : `Lesson ${li + 1}`;
    if (!window.confirm(`Delete ${label}? Students lose their progress on it.`)) return;
    updateModule(mi, { lessons: modules[mi].lessons.filter((_, i) => i !== li) });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Course content</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          A course is made of <b>modules</b> (sections). Each module holds <b>lessons</b> that students tick off as they
          go. Reordering and editing are safe — progress follows each lesson, not its position. Deleting a lesson removes
          the progress on it.
        </p>
      </div>

      {modules.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          No modules yet. Add your first one below.
        </div>
      )}

      {modules.map((m, mi) => (
        <div key={m.id} className="sketch-card space-y-3 bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-mono text-muted-foreground">Module {mi + 1}</span>
            <Input
              aria-label="Module title"
              placeholder="Module title"
              className="flex-1"
              value={m.title}
              onChange={(e) => updateModule(mi, { title: e.target.value })}
            />
            <RowControls
              label="module"
              index={mi}
              total={modules.length}
              onMove={(to) => onChange(moveItem(modules, mi, to))}
              onDelete={() => deleteModule(mi)}
            />
          </div>

          <div className="space-y-2">
            {m.lessons.map((l, li) => (
              <LessonEditor
                key={l.id}
                lesson={l}
                index={li}
                total={m.lessons.length}
                onChange={(patch) => updateLesson(mi, li, patch)}
                onMove={(to) => updateModule(mi, { lessons: moveItem(m.lessons, li, to) })}
                onDelete={() => deleteLesson(mi, li)}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => updateModule(mi, { lessons: [...m.lessons, newLesson()] })}
          >
            <Plus /> Add lesson
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-1.5"
        onClick={() => onChange([...modules, newModule(`Module ${modules.length + 1}`)])}
      >
        <Plus /> Add module
      </Button>

      <JsonImport onImport={onChange} />
    </div>
  );
}
