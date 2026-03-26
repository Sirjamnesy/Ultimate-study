import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  Zap,
  GraduationCap,
  Map,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { phases, weeks, getTotalResources, getTotalXP } from "@/lib/data/roadmap";
import { getLevelForXP, getXPProgress } from "@/lib/gamification/xp-engine";

// For MVP, we use static demo state. Supabase integration comes in Sprint 2.
const demoState = {
  xp: 0,
  streak: 0,
  completedResources: [] as string[],
  currentWeek: 1,
};

const phaseColors: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const phaseAccents: Record<string, string> = {
  emerald: "border-l-emerald-500",
  blue: "border-l-blue-500",
  violet: "border-l-violet-500",
  amber: "border-l-amber-500",
  rose: "border-l-rose-500",
};

export default function Home() {
  const { xp, streak, completedResources, currentWeek } = demoState;
  const levelInfo = getXPProgress(xp);
  const totalResources = getTotalResources();
  const totalXP = getTotalXP();
  const completionPercent = Math.round(
    (completedResources.length / totalResources) * 100
  );
  const currentWeekData = weeks.find((w) => w.id === currentWeek);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Ultimate Study
            </h1>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href="/roadmap"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Roadmap
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <Badge variant="secondary" className="text-xs font-mono">
            26-WEEK AI ENGINEERING JOURNEY
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Become a{" "}
            <span className="text-violet-400">Claude Architect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            An interactive, gamified roadmap from AI fundamentals to certified
            architect. Track your progress, earn XP, and level up.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/roadmap">
              <Button size="lg" className="gap-2">
                <Map className="h-4 w-4" />
                View Roadmap
              </Button>
            </Link>
            <Link href={`/roadmap/1/1`}>
              <Button size="lg" variant="outline" className="gap-2">
                Start Week 1
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{xp}</p>
                  <p className="text-xs text-muted-foreground">
                    / {totalXP.toLocaleString()} XP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    {completedResources.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {totalResources} Done
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    Lv.{levelInfo.current.level}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {levelInfo.current.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Level Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Level {levelInfo.current.level}: {levelInfo.current.title}
              </span>
              {levelInfo.next && (
                <span className="text-xs text-muted-foreground font-mono">
                  {xp} / {levelInfo.next.xpRequired} XP
                </span>
              )}
            </div>
            <Progress value={levelInfo.progress} className="h-2" />
            {levelInfo.next && (
              <p className="text-xs text-muted-foreground mt-1">
                {levelInfo.next.xpRequired - xp} XP to{" "}
                <span className="text-foreground">
                  {levelInfo.next.title}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Week Highlight */}
        {currentWeekData && (
          <Card className="border-violet-500/30 bg-violet-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    CURRENT WEEK
                  </Badge>
                  <CardTitle className="text-xl">
                    Week {currentWeekData.id}: {currentWeekData.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentWeekData.description}
                  </p>
                </div>
                <Link href={`/roadmap/${currentWeekData.phase}/${currentWeekData.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    Open <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{currentWeekData.resources.length} resources</span>
                <span className="font-mono text-violet-400">
                  +{currentWeekData.xp} XP
                </span>
                {currentWeekData.badge && (
                  <Badge variant="outline" className="text-xs">
                    {currentWeekData.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase Overview */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">
            Your Learning Path
          </h3>
          <div className="space-y-3">
            {phases.map((phase) => {
              const phaseWeeks = weeks.filter((w) => w.phase === phase.id);
              const phaseXP = phaseWeeks.reduce((s, w) => s + w.xp, 0);
              const phaseResources = phaseWeeks.reduce(
                (s, w) => s + w.resources.length,
                0
              );
              return (
                <Link
                  key={phase.id}
                  href={`/roadmap?phase=${phase.id}`}
                >
                  <Card
                    className={`border-l-4 ${phaseAccents[phase.color]} hover:bg-muted/50 transition-colors cursor-pointer`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={phaseColors[phase.color]}
                            >
                              Phase {phase.id}
                            </Badge>
                            <h4 className="font-medium">{phase.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {phase.description}
                          </p>
                        </div>
                        <div className="text-right text-sm space-y-1 shrink-0 ml-4">
                          <p className="text-muted-foreground">
                            Weeks {phase.weeks[0]}-
                            {phase.weeks[phase.weeks.length - 1]}
                          </p>
                          <p className="font-mono text-xs">
                            {phaseResources} resources &middot; {phaseXP} XP
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Exam Info */}
        <Card className="bg-gradient-to-r from-violet-500/5 to-blue-500/5 border-violet-500/20">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 text-violet-400" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">
                  Claude Certified Architect - Foundations
                </h4>
                <p className="text-sm text-muted-foreground">
                  5 domains &middot; 30 task statements &middot; 6 scenarios
                  &middot; Passing score: 720/1000
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { name: "D1: Agentic Architecture", weight: "27%" },
                    { name: "D2: Tool Design & MCP", weight: "18%" },
                    { name: "D3: Claude Code", weight: "20%" },
                    { name: "D4: Prompt Engineering", weight: "20%" },
                    { name: "D5: Context & Reliability", weight: "15%" },
                  ].map((d) => (
                    <Badge
                      key={d.name}
                      variant="outline"
                      className="text-xs font-mono"
                    >
                      {d.name} ({d.weight})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted-foreground">
          Built with Next.js, Tailwind CSS, and shadcn/ui. Powered by the desire
          to learn.
        </footer>
      </main>
    </div>
  );
}
