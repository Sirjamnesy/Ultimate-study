"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Zap,
  Flame,
  BookOpen,
  Trophy,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  Target,
  Copy,
  Check,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { getXPProgress, badges as allBadges } from "@/lib/gamification/xp-engine";
import { getTotalResources, getTotalXP } from "@/lib/data/roadmap";
import { DOMAIN_WEIGHTS } from "@/lib/gamification/practice-exam";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { progress, mounted } = useProgress();
  const [copied, setCopied] = useState(false);

  const xp = mounted ? progress.xp : 0;
  const streak = mounted ? progress.streak : 0;
  const levelInfo = getXPProgress(xp);
  const totalResources = getTotalResources();
  const totalXP = getTotalXP();
  const completedCount = mounted ? progress.completedResources.length : 0;
  const totalStudyDays = mounted ? progress.dailyLog.length : 0;
  const totalQuizAttempts = mounted ? progress.quizResults.length : 0;
  const earnedBadgeCount = mounted ? progress.earnedBadges.length : 0;

  const bestOverallQuiz = useMemo(() => {
    if (!mounted || progress.quizResults.length === 0) return null;
    return Math.max(...progress.quizResults.map((r) => r.score));
  }, [mounted, progress.quizResults]);

  // Domain best scores from quiz results
  const domainScores = useMemo(() => {
    if (!mounted) return {};
    const best: Record<number, number> = {};
    for (const r of progress.quizResults) {
      if (r.domainBreakdown) {
        for (const [d, stats] of Object.entries(r.domainBreakdown)) {
          const pct = Math.round((stats.correct / stats.total) * 100);
          const dNum = Number(d);
          if (!best[dNum] || pct > best[dNum]) best[dNum] = pct;
        }
      }
    }
    return best;
  }, [mounted, progress.quizResults]);

  // Study heatmap — last 12 weeks (84 days)
  const heatmapData = useMemo(() => {
    if (!mounted) return [];
    const today = new Date();
    const days: { date: string; active: boolean }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      days.push({ date: iso, active: progress.dailyLog.includes(iso) });
    }
    return days;
  }, [mounted, progress.dailyLog]);

  const copyStats = async () => {
    const text = [
      `Level ${levelInfo.current.level} — ${levelInfo.current.title}`,
      `${xp.toLocaleString()} XP | ${streak}-day streak`,
      `${completedCount}/${totalResources} resources | ${earnedBadgeCount}/${allBadges.length} badges`,
      `${totalStudyDays} study days | ${totalQuizAttempts} quizzes taken`,
      bestOverallQuiz !== null ? `Best quiz: ${bestOverallQuiz}%` : "",
      "",
      "Ultimate Study — AI Engineering Learning Hub",
    ]
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6"
      >
        {/* Profile Header */}
        <motion.section variants={item} className="sketch-card bg-card p-6 relative">
          <div className="tape" />
          <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
            <div className="h-20 w-20 rounded-2xl bg-violet-500/15 flex items-center justify-center sketch-border-sm border-violet-500/30 shrink-0">
              <span className="text-3xl font-bold font-mono text-violet-400">
                {levelInfo.current.level}
              </span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold font-sketch">
                {levelInfo.current.title}
              </h2>
              <p className="text-muted-foreground mt-1">
                Level {levelInfo.current.level} &middot; {xp.toLocaleString()} / {totalXP.toLocaleString()} XP
              </p>
              <div className="sketch-progress h-3 mt-3 max-w-sm mx-auto sm:mx-0">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-[6px] transition-all duration-500"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
              {levelInfo.next && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className="font-mono">{levelInfo.next.xpRequired - xp}</span> XP to{" "}
                  <span className="font-sketch text-sm text-foreground">{levelInfo.next.title}</span>
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <Zap className="h-5 w-5" />, value: xp.toLocaleString(), label: "Total XP", color: "text-violet-400 bg-violet-500/10" },
            { icon: <Calendar className="h-5 w-5" />, value: totalStudyDays, label: "Study Days", color: "text-blue-400 bg-blue-500/10" },
            { icon: <BookOpen className="h-5 w-5" />, value: `${completedCount}/${totalResources}`, label: "Resources", color: "text-emerald-400 bg-emerald-500/10" },
            { icon: <ClipboardCheck className="h-5 w-5" />, value: totalQuizAttempts, label: "Quizzes Taken", color: "text-amber-400 bg-amber-500/10" },
            { icon: <Target className="h-5 w-5" />, value: bestOverallQuiz !== null ? `${bestOverallQuiz}%` : "—", label: "Best Quiz", color: "text-rose-400 bg-rose-500/10" },
            { icon: <Flame className="h-5 w-5" />, value: streak, label: "Day Streak", color: "text-orange-400 bg-orange-500/10" },
          ].map((stat, i) => (
            <div
              key={i}
              className="sketch-card bg-card p-4"
              style={{ transform: `rotate(${i % 2 === 0 ? "-0.3" : "0.3"}deg)` }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold font-mono truncate">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Badge Showcase */}
        <motion.section variants={item}>
          <Link href="/badges">
            <div className="sketch-card bg-amber-500/5 border-amber-500/30 p-4 hover:scale-[1.01] transition-transform cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-sketch text-lg font-bold">
                      {earnedBadgeCount} / {allBadges.length} Badges Earned
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View your full collection
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              {earnedBadgeCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {allBadges
                    .filter((b) => mounted && progress.earnedBadges.includes(b.id))
                    .slice(0, 8)
                    .map((b) => (
                      <span
                        key={b.id}
                        className="sticker border-amber-400/50 bg-amber-500/10 text-amber-400 text-[10px]"
                      >
                        <Star className="h-2.5 w-2.5" />
                        {b.name}
                      </span>
                    ))}
                  {earnedBadgeCount > 8 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{earnedBadgeCount - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        </motion.section>

        {/* Domain Strengths */}
        <motion.section variants={item} className="sketch-card bg-card p-5 space-y-3">
          <h3 className="font-sketch text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-400" />
            Domain Strengths
          </h3>
          {Object.keys(domainScores).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(DOMAIN_WEIGHTS).map(([d, info]) => {
                const dNum = Number(d);
                const score = domainScores[dNum];
                return (
                  <div key={d} className="flex items-center gap-2">
                    <span className={`text-xs font-semibold shrink-0 whitespace-nowrap ${info.color}`}>
                      D{d}: {info.name}
                    </span>
                    <div className="flex-1 sketch-progress h-1.5 min-w-[40px]">
                      <div
                        className={`h-full rounded-[3px] transition-all duration-500 ${
                          score !== undefined
                            ? score >= 90
                              ? "bg-emerald-500"
                              : score >= 70
                              ? "bg-amber-500"
                              : "bg-rose-500"
                            : "bg-muted"
                        }`}
                        style={{ width: `${score ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-9 text-right shrink-0 text-muted-foreground">
                      {score !== undefined ? `${score}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Take domain quizzes to see your strengths here.
            </p>
          )}
        </motion.section>

        {/* Study Heatmap */}
        <motion.section variants={item} className="sketch-card bg-card p-5 space-y-3">
          <h3 className="font-sketch text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Study Activity
            <span className="text-xs font-normal text-muted-foreground font-sans ml-1">
              (last 12 weeks)
            </span>
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {heatmapData.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  day.active
                    ? "bg-emerald-500/70"
                    : "bg-muted/30"
                }`}
                title={`${day.date}${day.active ? " — studied" : ""}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-muted/30" /> No activity
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/70" /> Studied
            </span>
          </div>
        </motion.section>

        {/* Share Card */}
        <motion.section variants={item} className="sketch-card bg-gradient-to-br from-violet-500/5 to-blue-500/5 p-5 space-y-4">
          <h3 className="font-sketch text-xl font-bold">Share Your Progress</h3>
          <div className="sketch-card bg-card p-4 space-y-2">
            <p className="font-sketch text-lg font-bold">
              Lv.{levelInfo.current.level} {levelInfo.current.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {xp.toLocaleString()} XP &middot; {streak}-day streak &middot; {earnedBadgeCount} badges &middot; {completedCount} resources done
            </p>
            {bestOverallQuiz !== null && (
              <p className="text-sm text-muted-foreground">
                Best quiz: {bestOverallQuiz}% &middot; {totalQuizAttempts} quizzes taken
              </p>
            )}
            <p className="text-xs text-muted-foreground/60 pt-1">
              Ultimate Study — AI Engineering Learning Hub
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 sketch-border-sm"
            onClick={copyStats}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Stats to Clipboard
              </>
            )}
          </Button>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={item} className="text-center py-6">
          <p className="font-sketch text-lg text-muted-foreground">
            Keep studying, keep growing
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
