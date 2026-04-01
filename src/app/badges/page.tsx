"use client";

import {
  Flame,
  Zap,
  Trophy,
  Brain,
  Wrench,
  Terminal,
  MessageSquare,
  Shield,
  Hammer,
  Plug,
  Network,
  Footprints,
  Layers,
  Cpu,
  GraduationCap,
  Award,
  Rocket,
  Crown,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { badges, type BadgeDef } from "@/lib/gamification/xp-engine";
import { getBadgeProgress } from "@/lib/gamification/badge-checker";
import { format } from "date-fns";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Zap,
  Trophy,
  Brain,
  Wrench,
  Terminal,
  MessageSquare,
  Shield,
  Hammer,
  Plug,
  Network,
  Footprints,
  Layers,
  Cpu,
  GraduationCap,
  Award,
  Rocket,
  Crown,
};

const categoryMeta: Record<string, { title: string; color: string; bgColor: string }> = {
  streak: { title: "Streak Badges", color: "text-orange-400", bgColor: "bg-orange-500/10 border-orange-500/30" },
  knowledge: { title: "Knowledge Badges", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/30" },
  build: { title: "Build Badges", color: "text-emerald-400", bgColor: "bg-emerald-500/10 border-emerald-500/30" },
  milestone: { title: "Milestone Badges", color: "text-violet-400", bgColor: "bg-violet-500/10 border-violet-500/30" },
};

const categoryOrder: BadgeDef["category"][] = ["streak", "knowledge", "build", "milestone"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function BadgesPage() {
  const { progress, mounted } = useProgress();

  const earned = new Set(progress.earnedBadges);
  const earnedCount = progress.earnedBadges.length;
  const totalCount = badges.length;
  const progressPct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    ...categoryMeta[cat],
    badges: badges.filter((b) => b.category === cat),
  }));

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-sketch font-bold mb-2">Badge Collection</h1>
          <p className="text-muted-foreground text-sm mb-4">
            Earn badges by building streaks, mastering domains, completing builds, and hitting milestones.
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 rounded-full bg-muted/50 border border-dashed border-border/60 overflow-hidden sketch-border-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: mounted ? `${progressPct}%` : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-violet-600 to-amber-500 rounded-full"
              />
            </div>
            <span className="font-mono text-sm text-muted-foreground whitespace-nowrap">
              {mounted ? earnedCount : 0} / {totalCount}
            </span>
          </div>
        </motion.div>

        {grouped.map((group) => (
          <motion.section
            key={group.category}
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <h2 className={`text-lg font-sketch font-bold mb-3 ${group.color}`}>
              {group.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.badges.map((badge) => {
                const isEarned = mounted && earned.has(badge.id);
                const Icon = iconMap[badge.icon] || Trophy;
                const earnedDate = progress.badgeEarnedDates?.[badge.id];
                const hint = !isEarned
                  ? getBadgeProgress(badge.id, progress)
                  : null;

                return (
                  <motion.div
                    key={badge.id}
                    variants={item}
                    className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                      isEarned
                        ? `${group.bgColor} shadow-md`
                        : "border-border/40 bg-muted/20 opacity-60"
                    }`}
                  >
                    {/* Lock overlay for unearned */}
                    {!isEarned && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </div>
                    )}

                    <div
                      className={`mx-auto mb-2 h-12 w-12 rounded-xl flex items-center justify-center ${
                        isEarned
                          ? "bg-background/80 shadow-sm"
                          : "bg-muted/40"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isEarned ? group.color : "text-muted-foreground/40"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-sm font-bold leading-tight ${
                        isEarned ? "" : "text-muted-foreground"
                      }`}
                    >
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {badge.description}
                    </p>

                    {/* Earned date */}
                    {isEarned && earnedDate && (
                      <p className="text-[10px] font-mono text-muted-foreground/70 mt-2">
                        {format(new Date(earnedDate), "MMM d, yyyy")}
                      </p>
                    )}

                    {/* Progress hint for locked */}
                    {!isEarned && hint && (
                      <p className="text-[10px] font-mono text-muted-foreground/60 mt-2">
                        {hint}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </main>
    </>
  );
}
