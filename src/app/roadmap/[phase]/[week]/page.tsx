"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Code,
  FileText,
  Video,
  Wrench,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { Confetti, XPToast } from "@/components/shared/confetti";
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
  docs: "Docs",
  video: "Video",
  practice: "Practice",
  build: "Build",
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
    <motion.div
      layout
      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
        checked
          ? "bg-emerald-500/5 border border-dashed border-emerald-500/20"
          : "hover:bg-muted/50 border border-transparent"
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
            className={`text-sm font-medium cursor-pointer transition-all ${
              checked ? "line-through text-muted-foreground" : ""
            }`}
          >
            {resource.title}
          </label>
          {resource.optional && (
            <span className="sticker border-muted-foreground/30 text-muted-foreground text-[9px] bg-transparent">
              Optional
            </span>
          )}
          {checked && <span className="text-xs">✅</span>}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="sticker border-border text-muted-foreground text-[9px] bg-transparent">
            {resourceLabels[resource.type]}
          </span>
          {resource.duration && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {resource.duration}
            </span>
          )}
          {resource.source && (
            <span className="text-[10px] text-muted-foreground italic">
              {resource.source}
            </span>
          )}
          {resource.url && (
            resource.url.startsWith("/quiz/") ? (
              <Link
                href={resource.url}
                className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Open <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            ) : (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Open <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )
          )}
        </div>
      </div>
    </motion.div>
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

  const { progress, toggleResource, logStudyDay, isCompleted, mounted } =
    useProgress();

  const [xpToast, setXpToast] = useState({ amount: 0, show: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState("");

  // Log study day on visit
  useEffect(() => {
    if (mounted) logStudyDay();
  }, [mounted, logStudyDay]);

  if (!week || !phase) {
    return (
      <div className="min-h-screen flex items-center justify-center notebook-bg">
        <Header />
        <p className="text-muted-foreground font-sketch text-2xl">
          Week not found 📝
        </p>
      </div>
    );
  }

  const handleToggle = (resource: Resource) => {
    const result = toggleResource(resource.id, resource.type);

    // Show XP toast
    setXpToast({ amount: result.xpDelta, show: true });
    setTimeout(() => setXpToast((t) => ({ ...t, show: false })), 2000);

    // Check if week is now complete
    if (result.added) {
      const allCompleted = week.resources.every(
        (r) => r.id === resource.id || isCompleted(r.id)
      );
      if (allCompleted && week.badge) {
        setConfettiMsg(`🏆 Week Complete! Badge: "${week.badge}"`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    }
  };

  const completedCount = mounted
    ? week.resources.filter((r) => isCompleted(r.id)).length
    : 0;
  const totalCount = week.resources.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;

  const prevWeek = weeks.find((w) => w.id === weekId - 1);
  const nextWeek = weeks.find((w) => w.id === weekId + 1);

  const requiredResources = week.resources.filter((r) => !r.optional);
  const optionalResources = week.resources.filter((r) => r.optional);

  return (
    <div className="min-h-screen notebook-bg">
      <Header />
      <Confetti trigger={showConfetti} message={confettiMsg} />
      <XPToast amount={xpToast.amount} show={xpToast.show} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Week nav */}
        <div className="flex items-center justify-between gap-2">
          <Link href={`/roadmap?phase=${phaseId}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
              <ChevronLeft className="h-3 w-3" />
              Phase {phaseId}
            </Button>
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

        {/* Week Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="sticker border-border text-muted-foreground bg-transparent text-[10px]">
              Phase {phase.id}: {phase.title}
            </span>
            {week.examDomains && week.examDomains.length > 0 && (
              <span className="sticker border-violet-400/50 text-violet-400 bg-transparent text-[10px]">
                {week.examDomains.map((d) => `D${d}`).join(", ")}
              </span>
            )}
          </div>
          <h2 className="font-sketch text-4xl sm:text-5xl font-bold">
            <span className="text-muted-foreground">W{week.id}.</span>{" "}
            {week.title}
          </h2>
          <p className="text-muted-foreground text-lg">{week.description}</p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="sketch-card bg-card p-5 relative">
            {isComplete && <div className="tape" />}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-sketch text-lg font-bold">
                  {completedCount} / {totalCount}
                </span>
                {isComplete && (
                  <span className="sticker border-emerald-400 text-emerald-400 bg-emerald-500/10 text-[10px]">
                    <Sparkles className="h-3 w-3" />
                    Complete!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-mono text-violet-400">
                  +{week.xp} XP
                </span>
              </div>
            </div>
            <div className="sketch-progress h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-[6px]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            {week.badge && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete to earn{" "}
                <span className="font-sketch text-sm text-foreground">
                  &ldquo;{week.badge}&rdquo;
                </span>{" "}
                <Star className="inline h-3 w-3 text-amber-400" />
              </p>
            )}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="sketch-card bg-card p-5">
            <h3 className="font-sketch text-xl font-bold mb-4 flex items-center gap-2">
              📚 Resources
            </h3>
            <div className="space-y-1">
              {requiredResources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  checked={mounted ? isCompleted(resource.id) : false}
                  onToggle={() => handleToggle(resource)}
                />
              ))}

              {optionalResources.length > 0 && (
                <>
                  <Separator className="my-4 border-dashed" />
                  <p className="font-sketch text-sm text-muted-foreground px-3 pb-2">
                    ✨ Bonus Resources
                  </p>
                  {optionalResources.map((resource) => (
                    <ResourceItem
                      key={resource.id}
                      resource={resource}
                      checked={mounted ? isCompleted(resource.id) : false}
                      onToggle={() => handleToggle(resource)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {prevWeek ? (
            <Link href={`/roadmap/${prevWeek.phase}/${prevWeek.id}`}>
              <Button variant="outline" className="gap-2 sketch-border-sm text-sm">
                <ChevronLeft className="h-4 w-4" />
                W{prevWeek.id}: {prevWeek.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextWeek ? (
            <Link href={`/roadmap/${nextWeek.phase}/${nextWeek.id}`}>
              <Button variant="outline" className="gap-2 sketch-border-sm text-sm">
                W{nextWeek.id}: {nextWeek.title}
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
