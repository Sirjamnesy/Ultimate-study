"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Zap,
  GraduationCap,
  Map,
  Sparkles,
  Star,
  Pencil,
  ClipboardCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { LandingPage } from "@/components/shared/landing-page";
import { phases, weeks, getTotalResources, getTotalXP } from "@/lib/data/roadmap";
import { getXPProgress, badges as allBadges } from "@/lib/gamification/xp-engine";

const phaseColors: Record<string, string> = {
  emerald: "border-emerald-500 text-emerald-500",
  blue: "border-blue-500 text-blue-500",
  violet: "border-violet-500 text-violet-500",
  amber: "border-amber-500 text-amber-500",
  rose: "border-rose-500 text-rose-500",
};

const phaseBgs: Record<string, string> = {
  emerald: "bg-emerald-500/5",
  blue: "bg-blue-500/5",
  violet: "bg-violet-500/5",
  amber: "bg-amber-500/5",
  rose: "bg-rose-500/5",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { progress, getLatestCheckIn, mounted, hasPaid, user, isAnonymous } = useProgress();
  const router = useRouter();

  // Real (non-anonymous) authenticated user who hasn't paid yet → send to checkout
  useEffect(() => {
    if (mounted && !hasPaid && user && !isAnonymous) {
      router.replace("/checkout");
    }
  }, [mounted, hasPaid, user, isAnonymous, router]);

  // NOTE: ALL hooks must be declared before any conditional return (Rules of Hooks).
  // This useMemo is intentionally placed here, before the early return below.
  const showCheckInPrompt = useMemo(() => {
    if (!mounted) return false;
    const latest = getLatestCheckIn();
    if (!latest) return true;
    const daysSince = Math.floor(
      (Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= 7;
  }, [mounted, getLatestCheckIn]);

  // Show landing/sales page for unauthenticated or anonymous (unpaid) visitors
  if (mounted && !hasPaid) {
    return <LandingPage />;
  }

  const xp = mounted ? progress.xp : 0;
  const streak = mounted ? progress.streak : 0;
  const completedCount = mounted ? progress.completedResources.length : 0;
  const levelInfo = getXPProgress(xp);
  const totalResources = getTotalResources();
  const totalXP = getTotalXP();
  const currentWeekData = weeks.find(
    (w) => w.id === (mounted ? progress.currentWeek : 1)
  );

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      >
        {/* Hero */}
        <motion.section variants={item} className="text-center space-y-5 py-6 relative">
          {/* Doodle decorations */}
          <span className="absolute top-2 left-8 text-3xl opacity-20 animate-wiggle hidden sm:block">
            ✏️
          </span>
          <span className="absolute top-12 right-12 text-2xl opacity-20 animate-wiggle hidden sm:block" style={{ animationDelay: "0.5s" }}>
            💡
          </span>

          <div className="inline-block">
            <span className="sticker border-violet-400 bg-violet-500/10 text-violet-400 font-mono text-xs tracking-wider">
              <Pencil className="h-3 w-3" />
              26-WEEK AI ENGINEERING JOURNEY
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Become a{" "}
            <span className="sketch-underline font-sketch text-violet-400 text-5xl sm:text-7xl">
              Claude Architect
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            An interactive, gamified notebook to track your AI learning journey.
            Check off resources, earn XP, level up, and get certified.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link href="/roadmap">
              <Button size="lg" className="gap-2 sketch-border-sm">
                <Map className="h-4 w-4" />
                View Roadmap
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="gap-2 sketch-border-sm">
                <BookOpen className="h-4 w-4" />
                Quiz Hub
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: <Trophy className="h-5 w-5" />,
              value: xp,
              label: `/ ${totalXP.toLocaleString()} XP`,
              color: "text-violet-400 bg-violet-500/10",
              rotate: "-1deg",
            },
            {
              icon: <Flame className="h-5 w-5" />,
              value: streak,
              label: "Day Streak",
              color: "text-amber-400 bg-amber-500/10",
              rotate: "0.5deg",
            },
            {
              icon: <BookOpen className="h-5 w-5" />,
              value: completedCount,
              label: `/ ${totalResources} Done`,
              color: "text-emerald-400 bg-emerald-500/10",
              rotate: "-0.5deg",
            },
            {
              icon: <GraduationCap className="h-5 w-5" />,
              value: `Lv.${levelInfo.current.level}`,
              label: levelInfo.current.title,
              color: "text-blue-400 bg-blue-500/10",
              rotate: "1deg",
              href: undefined as string | undefined,
            },
          ].map((stat, i) => {
            const inner = (
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
            return (
              <div
                key={i}
                className="sketch-card bg-card p-4 relative"
                style={{ transform: `rotate(${stat.rotate})` }}
              >
                {inner}
              </div>
            );
          })}
        </motion.section>

        {/* Level Progress */}
        <motion.div variants={item}>
          <div className="sketch-card bg-card p-5 relative">
            <div className="tape" />
            <div className="flex items-center justify-between mb-3 pt-2">
              <span className="font-sketch text-lg font-bold">
                {levelInfo.current.title}
              </span>
              {levelInfo.next && (
                <span className="text-xs text-muted-foreground font-mono">
                  {xp} / {levelInfo.next.xpRequired} XP
                </span>
              )}
            </div>
            <div className="sketch-progress h-3">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-[6px] transition-all duration-500"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            {levelInfo.next && (
              <p className="text-xs text-muted-foreground mt-2">
                <span className="font-mono">{levelInfo.next.xpRequired - xp}</span> XP to{" "}
                <span className="text-foreground font-sketch text-sm">
                  {levelInfo.next.title}
                </span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Check-In Prompt */}
        {showCheckInPrompt && (
          <motion.div variants={item}>
            <Link href="/check-ins">
              <div className="sketch-card bg-emerald-500/5 border-emerald-500/30 border-l-4 p-4 hover:scale-[1.01] transition-transform cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-500/10">
                      <ClipboardCheck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-sketch text-lg font-bold">
                        Time for a Check-In!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reflect on your week and earn +25 XP
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Badge Summary */}
        <motion.div variants={item}>
          <Link href="/badges">
            <div className="sketch-card bg-amber-500/5 border-amber-500/30 p-4 relative hover:scale-[1.01] transition-transform cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-sketch text-lg font-bold">
                      {mounted ? progress.earnedBadges.length : 0} / {allBadges.length} Badges
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View your collection
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Current Week */}
        {currentWeekData && (
          <motion.div variants={item}>
            <div className="sketch-card bg-violet-500/5 border-violet-500/30 p-5 relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="sticker border-violet-400/50 bg-violet-500/10 text-violet-400 text-[10px] mb-2">
                    <Target className="h-3 w-3" />
                    THIS WEEK
                  </span>
                  <h3 className="text-xl font-bold mt-2">
                    <span className="font-sketch text-2xl">W{currentWeekData.id}</span>{" "}
                    {currentWeekData.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentWeekData.description}
                  </p>
                </div>
                <Link href={`/roadmap/${currentWeekData.phase}/${currentWeekData.id}`} className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="gap-1 sketch-border-sm shrink-0 w-full sm:w-auto">
                    Open <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                <span>{currentWeekData.resources.length} resources</span>
                <span className="font-mono text-violet-400">+{currentWeekData.xp} XP</span>
                {currentWeekData.badge && (
                  <span className="sticker border-amber-400/50 bg-amber-500/10 text-amber-400 text-[10px]">
                    <Star className="h-2.5 w-2.5" />
                    {currentWeekData.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase Overview */}
        <motion.section variants={item} className="space-y-4">
          <h3 className="font-sketch text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            Your Learning Path
          </h3>
          <div className="space-y-3">
            {phases.map((phase, i) => {
              const phaseWeeks = weeks.filter((w) => w.phase === phase.id);
              const phaseXP = phaseWeeks.reduce((s, w) => s + w.xp, 0);
              const phaseResources = phaseWeeks.reduce(
                (s, w) => s + w.resources.length,
                0
              );
              const completedInPhase = mounted
                ? phaseWeeks.reduce(
                    (s, w) =>
                      s +
                      w.resources.filter((r) =>
                        progress.completedResources.includes(r.id)
                      ).length,
                    0
                  )
                : 0;

              return (
                <Link key={phase.id} href={`/roadmap?phase=${phase.id}`}>
                  <motion.div
                    variants={item}
                    className={`sketch-card ${phaseBgs[phase.color]} p-4 border-l-4 ${phaseColors[phase.color]}`}
                    style={{ transform: `rotate(${i % 2 === 0 ? "-0.3" : "0.3"}deg)` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`sticker ${phaseColors[phase.color]} bg-transparent text-[10px]`}
                          >
                            Phase {phase.id}
                          </span>
                          <h4 className="font-semibold">{phase.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {phase.description}
                        </p>
                        {completedInPhase > 0 && (
                          <p className="text-xs font-mono text-emerald-400">
                            {completedInPhase}/{phaseResources} completed
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm space-y-1 shrink-0 ml-4">
                        <p className="text-muted-foreground text-xs">
                          Weeks {phase.weeks[0]}-{phase.weeks[phase.weeks.length - 1]}
                        </p>
                        <p className="font-mono text-xs">
                          {phaseResources} resources
                        </p>
                        <p className="font-mono text-xs text-violet-400">
                          {phaseXP} XP
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Exam Card */}
        <motion.div variants={item}>
          <div className="sketch-card bg-gradient-to-br from-violet-500/5 to-blue-500/5 p-6 relative">
            <div className="tape" />
            <div className="flex items-start gap-4 pt-2">
              <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0 sketch-border-sm border-violet-500/30">
                <GraduationCap className="h-7 w-7 text-violet-400" />
              </div>
              <div className="space-y-2">
                <h4 className="font-sketch text-2xl font-bold">
                  Claude Certified Architect
                </h4>
                <p className="text-sm text-muted-foreground">
                  5 domains &middot; 30 task statements &middot; 6 scenarios &middot;
                  Passing: 720/1000
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { name: "Agentic Architecture", weight: "27%", color: "border-rose-400 text-rose-400" },
                    { name: "Tool Design & MCP", weight: "18%", color: "border-blue-400 text-blue-400" },
                    { name: "Claude Code", weight: "20%", color: "border-emerald-400 text-emerald-400" },
                    { name: "Prompt Engineering", weight: "20%", color: "border-amber-400 text-amber-400" },
                    { name: "Context & Reliability", weight: "15%", color: "border-violet-400 text-violet-400" },
                  ].map((d) => (
                    <span
                      key={d.name}
                      className={`sticker ${d.color} bg-transparent text-[10px]`}
                    >
                      {d.name} ({d.weight})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer variants={item} className="text-center py-8">
          <p className="font-sketch text-lg text-muted-foreground">
            Built with love, caffeine, and Claude ☕
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
