"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { phases, weeks, type Week } from "@/lib/data/roadmap";

const phaseDots: Record<string, string> = {
  emerald: "bg-wk-mint",
  blue: "bg-wk-green",
  violet: "bg-wk-orange",
  amber: "bg-wk-orange",
  rose: "bg-wk-orange",
};

const phaseLines: Record<string, string> = {
  emerald: "border-wk-good/30",
  blue: "border-wk-info/30",
  violet: "border-wk-orange/30",
  amber: "border-wk-orange/30",
  rose: "border-wk-orange/30",
};

const phaseSticker: Record<string, string> = {
  emerald: "border-wk-good text-wk-good",
  blue: "border-wk-info text-wk-info",
  violet: "border-wk-orange text-wk-accent",
  amber: "border-wk-orange text-wk-accent",
  rose: "border-wk-orange text-wk-accent",
};

function WeekCard({ week, completed, total }: { week: Week; completed: number; total: number }) {
  const isDone = completed === total && total > 0;

  return (
    <Link href={`/roadmap/${week.phase}/${week.id}`}>
      <div className="sketch-card bg-card p-4 group relative">
        {isDone && (
          <span className="absolute -top-2 -right-2 text-wk-good">
            <CheckCircle2 className="h-5 w-5 fill-wk-good/20" />
          </span>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sketch text-xl font-bold text-muted-foreground">
                W{week.id}
              </span>
              <h4 className="font-medium truncate">{week.title}</h4>
              {week.badge && (
                <span className="sticker border-wk-orange/50 bg-wk-orange/10 text-wk-accent text-[9px]">
                  <Star className="h-2.5 w-2.5" />
                  {week.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {week.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">
                {completed}/{total} resources
              </span>
              <span className="font-mono text-wk-accent">+{week.xp} XP</span>
              {week.examDomains && week.examDomains.length > 0 && (
                <span className="font-mono opacity-60">
                  {week.examDomains.map((d) => `D${d}`).join(", ")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}

export default function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const { progress, mounted } = useProgress();

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sketch text-4xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-wk-accent" />
            Roadmap
          </h2>
          <span className="text-sm text-muted-foreground font-mono">
            26 weeks &middot; 5 phases
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {phases.map((phase, phaseIdx) => {
            const phaseWeeks = weeks.filter((w) => w.phase === phase.id);
            const isExpanded = expandedPhase === phase.id;
            const phaseXP = phaseWeeks.reduce((s, w) => s + w.xp, 0);

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phaseIdx * 0.05 }}
                className="relative"
              >
                {/* Phase Header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4 group">
                    <div
                      className={`h-5 w-5 rounded-full ${phaseDots[phase.color]} ring-4 ring-background shrink-0 transition-transform group-hover:scale-110`}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`sticker ${phaseSticker[phase.color]} bg-transparent text-[10px]`}>
                            Phase {phase.id}
                          </span>
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
                          Weeks {phase.weeks[0]}-{phase.weeks[phase.weeks.length - 1]}
                        </p>
                        <p className="font-mono">{phaseXP} XP</p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Phase Weeks */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`ml-2.5 pl-6 border-l-2 border-solid ${phaseLines[phase.color]} mt-4 space-y-3 pb-2`}
                  >
                    {phaseWeeks.map((week) => {
                      const total = week.resources.length;
                      const completed = mounted
                        ? week.resources.filter((r) =>
                            progress.completedResources.includes(r.id)
                          ).length
                        : 0;
                      return (
                        <WeekCard
                          key={week.id}
                          week={week}
                          completed={completed}
                          total={total}
                        />
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
