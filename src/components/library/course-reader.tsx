"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductProgress } from "@/lib/store/product-progress";
import { MARKDOWN_CLASSES } from "@/lib/markdown-classes";
import type { CourseContent, CourseResource } from "@/lib/data/products";

function ResourceRow({
  resource,
  checked,
  onToggle,
}: {
  resource: CourseResource;
  checked: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl transition-all ${
        checked ? "bg-emerald-500/5 border border-dashed border-emerald-500/20" : "border border-transparent"
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => resource.body && setExpanded((e) => !e)}
            className={`text-sm font-medium text-left ${checked ? "line-through text-muted-foreground" : ""} ${resource.body ? "cursor-pointer" : ""}`}
          >
            {resource.title}
          </button>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="sticker border-border text-muted-foreground text-[9px] bg-transparent capitalize">
              {resource.type}
            </span>
            {resource.duration && (
              <span className="text-[10px] text-muted-foreground font-mono">{resource.duration}</span>
            )}
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-medium"
              >
                Open <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      {resource.body && expanded && (
        <div className={`${MARKDOWN_CLASSES} px-4 pb-4`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{resource.body}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export function CourseReader({ productId, content }: { productId: string; content: CourseContent }) {
  const { isCompleted, toggle, loaded } = useProductProgress(productId);

  const totalResources = content.modules.reduce((sum, m) => sum + m.resources.length, 0);
  const completedCount = loaded
    ? content.modules.reduce(
        (sum, m) => sum + m.resources.filter((r) => isCompleted(r.id)).length,
        0
      )
    : 0;
  const progressPercent = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="sketch-card bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sketch text-lg font-bold">{completedCount} / {totalResources}</span>
          <span className="text-xs text-muted-foreground">{progressPercent}% complete</span>
        </div>
        <div className="sketch-progress h-2.5">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-[6px] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {content.modules.map((module) => (
        <div key={module.id} className="sketch-card bg-card p-5">
          <h2 className="font-sketch text-lg font-bold mb-3">{module.title}</h2>
          <div className="space-y-1">
            {module.resources.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                checked={loaded ? isCompleted(resource.id) : false}
                onToggle={() => toggle(resource.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
