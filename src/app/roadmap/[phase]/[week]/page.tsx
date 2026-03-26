"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Code,
  FileText,
  Video,
  Wrench,
  HelpCircle,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getWeek, getPhase, weeks, type Resource } from "@/lib/data/roadmap";
import { use } from "react";

const resourceIcons: Record<string, React.ReactNode> = {
  course: <BookOpen className="h-4 w-4 text-blue-400" />,
  docs: <FileText className="h-4 w-4 text-emerald-400" />,
  video: <Video className="h-4 w-4 text-rose-400" />,
  practice: <Wrench className="h-4 w-4 text-amber-400" />,
  build: <Code className="h-4 w-4 text-violet-400" />,
  quiz: <HelpCircle className="h-4 w-4 text-cyan-400" />,
  reading: <BookOpen className="h-4 w-4 text-orange-400" />,
};

const resourceLabels: Record<string, string> = {
  course: "Course",
  docs: "Documentation",
  video: "Video",
  practice: "Practice",
  build: "Build Project",
  quiz: "Quiz",
  reading: "Reading",
};

function ResourceItem({
  resource,
  checked,
  onToggle,
}: {
  resource: Resource;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
        checked ? "bg-muted/30" : "hover:bg-muted/50"
      }`}
    >
      <Checkbox
        id={resource.id}
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {resourceIcons[resource.type]}
          <label
            htmlFor={resource.id}
            className={`text-sm font-medium cursor-pointer ${
              checked ? "line-through text-muted-foreground" : ""
            }`}
          >
            {resource.title}
          </label>
          {resource.optional && (
            <Badge variant="outline" className="text-[10px]">
              Optional
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">
            {resourceLabels[resource.type]}
          </Badge>
          {resource.duration && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {resource.duration}
            </span>
          )}
          {resource.source && (
            <span className="text-[10px] text-muted-foreground">
              {resource.source}
            </span>
          )}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Open <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WeekPage({
  params,
}: {
  params: Promise<{ phase: string; week: string }>;
}) {
  const { phase: phaseStr, week: weekStr } = use(params);
  const weekId = parseInt(weekStr, 10);
  const phaseId = parseInt(phaseStr, 10);
  const week = getWeek(weekId);
  const phase = getPhase(phaseId);

  // Local state for MVP - will be replaced with Supabase in Sprint 2
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (!week || !phase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Week not found</p>
      </div>
    );
  }

  const toggleResource = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = week.resources.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;

  const prevWeek = weeks.find((w) => w.id === weekId - 1);
  const nextWeek = weeks.find((w) => w.id === weekId + 1);

  // Group resources by type
  const requiredResources = week.resources.filter((r) => !r.optional);
  const optionalResources = week.resources.filter((r) => r.optional);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/roadmap"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Roadmap
          </Link>
          <div className="flex items-center gap-2">
            {prevWeek && (
              <Link href={`/roadmap/${prevWeek.phase}/${prevWeek.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <span className="text-sm font-mono text-muted-foreground">
              W{weekId}/26
            </span>
            {nextWeek && (
              <Link href={`/roadmap/${nextWeek.phase}/${nextWeek.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Week Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Phase {phase.id}: {phase.title}
            </Badge>
            {week.examDomains && week.examDomains.length > 0 && (
              <Badge variant="secondary" className="text-xs font-mono">
                {week.examDomains.map((d) => `D${d}`).join(", ")}
              </Badge>
            )}
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Week {week.id}: {week.title}
          </h2>
          <p className="text-muted-foreground">{week.description}</p>
        </div>

        {/* Progress + XP */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {completedCount} / {totalCount} resources
                </span>
                {isComplete && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    <Star className="h-3 w-3 mr-1" /> Complete!
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-mono text-violet-400">
                  +{week.xp} XP
                </span>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2" />
            {week.badge && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete this week to earn the{" "}
                <span className="text-foreground font-medium">
                  &ldquo;{week.badge}&rdquo;
                </span>{" "}
                badge
              </p>
            )}
          </CardContent>
        </Card>

        {/* Resource Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {requiredResources.map((resource) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                checked={completed.has(resource.id)}
                onToggle={() => toggleResource(resource.id)}
              />
            ))}

            {optionalResources.length > 0 && (
              <>
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground font-medium px-3 pb-1">
                  OPTIONAL
                </p>
                {optionalResources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    checked={completed.has(resource.id)}
                    onToggle={() => toggleResource(resource.id)}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {prevWeek ? (
            <Link href={`/roadmap/${prevWeek.phase}/${prevWeek.id}`}>
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Week {prevWeek.id}: {prevWeek.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextWeek ? (
            <Link href={`/roadmap/${nextWeek.phase}/${nextWeek.id}`}>
              <Button variant="outline" className="gap-2">
                Week {nextWeek.id}: {nextWeek.title}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
