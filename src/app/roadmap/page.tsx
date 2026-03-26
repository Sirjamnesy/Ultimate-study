"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Code,
  FileText,
  Video,
  Wrench,
  HelpCircle,
  Zap,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { phases, weeks, type Week } from "@/lib/data/roadmap";

const phaseColors: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const phaseDots: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const phaseLines: Record<string, string> = {
  emerald: "border-emerald-500/30",
  blue: "border-blue-500/30",
  violet: "border-violet-500/30",
  amber: "border-amber-500/30",
  rose: "border-rose-500/30",
};

const resourceIcons: Record<string, React.ReactNode> = {
  course: <BookOpen className="h-3.5 w-3.5" />,
  docs: <FileText className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  practice: <Wrench className="h-3.5 w-3.5" />,
  build: <Code className="h-3.5 w-3.5" />,
  quiz: <HelpCircle className="h-3.5 w-3.5" />,
  reading: <BookOpen className="h-3.5 w-3.5" />,
};

function WeekCard({ week, phaseColor }: { week: Week; phaseColor: string }) {
  const completed = 0; // Will come from Supabase in Sprint 2
  const total = week.resources.length;

  return (
    <Link href={`/roadmap/${week.phase}/${week.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer group">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">
                  W{week.id}
                </span>
                <h4 className="font-medium truncate">{week.title}</h4>
                {week.badge && (
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {week.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {week.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  {completed}/{total} resources
                </span>
                <span className="font-mono text-violet-400">+{week.xp} XP</span>
                {week.examDomains && week.examDomains.length > 0 && (
                  <span className="flex items-center gap-1">
                    {week.examDomains.map((d) => `D${d}`).join(", ")}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight">
                Roadmap
              </h1>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            26 weeks &middot; 5 phases
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Timeline */}
        <div className="space-y-6">
          {phases.map((phase) => {
            const phaseWeeks = weeks.filter((w) => w.phase === phase.id);
            const isExpanded = expandedPhase === phase.id;
            const phaseXP = phaseWeeks.reduce((s, w) => s + w.xp, 0);

            return (
              <div key={phase.id} className="relative">
                {/* Phase Header */}
                <button
                  onClick={() =>
                    setExpandedPhase(isExpanded ? null : phase.id)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4 group">
                    {/* Timeline dot */}
                    <div
                      className={`h-4 w-4 rounded-full ${phaseDots[phase.color]} ring-4 ring-background shrink-0`}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={phaseColors[phase.color]}
                          >
                            Phase {phase.id}
                          </Badge>
                          <h3 className="font-semibold group-hover:text-foreground transition-colors">
                            {phase.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {phase.description}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0 ml-4">
                        <p>
                          Weeks {phase.weeks[0]}-
                          {phase.weeks[phase.weeks.length - 1]}
                        </p>
                        <p className="font-mono">{phaseXP} XP</p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Phase Weeks */}
                {isExpanded && (
                  <div
                    className={`ml-2 pl-6 border-l-2 ${phaseLines[phase.color]} mt-4 space-y-3 pb-2`}
                  >
                    {phaseWeeks.map((week) => (
                      <WeekCard
                        key={week.id}
                        week={week}
                        phaseColor={phase.color}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
