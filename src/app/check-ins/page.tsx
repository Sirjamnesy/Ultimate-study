"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import type { WeeklyCheckIn } from "@/lib/store/progress";
import { format } from "date-fns";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={`transition-colors ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`h-5 w-5 ${
              n <= value
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function CheckInsPage() {
  const { progress, saveCheckIn, mounted } = useProgress();
  const [formOpen, setFormOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [weekNumber, setWeekNumber] = useState(
    mounted ? progress.currentWeek : 1
  );
  const [reflection, setReflection] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextFocus, setNextFocus] = useState("");
  const [rating, setRating] = useState(3);

  const checkIns = mounted ? [...(progress.weeklyCheckIns || [])].reverse() : [];

  const handleSubmit = () => {
    if (!reflection.trim()) return;

    const checkIn: WeeklyCheckIn = {
      id: `checkin-${weekNumber}-${Date.now()}`,
      weekNumber,
      date: new Date().toISOString(),
      reflection: reflection.trim(),
      rating,
      challenges: challenges.trim(),
      nextFocus: nextFocus.trim(),
    };

    saveCheckIn(checkIn);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReflection("");
      setChallenges("");
      setNextFocus("");
      setRating(3);
      setFormOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6"
      >
        {/* Hero */}
        <motion.section variants={item} className="text-center space-y-4 py-4">
          <div className="inline-block">
            <span className="sticker border-emerald-400 bg-emerald-500/10 text-emerald-400 font-mono text-xs tracking-wider">
              <ClipboardCheck className="h-3 w-3" />
              WEEKLY CHECK-INS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Reflect &{" "}
            <span className="sketch-underline font-sketch text-emerald-400 text-4xl sm:text-6xl">
              Grow
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Take a few minutes each week to reflect on your learning. Earn +25 XP per check-in.
          </p>
        </motion.section>

        {/* New Check-In Form */}
        <motion.section variants={item}>
          <div className="sketch-card bg-card overflow-hidden">
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-accent/20 transition-colors"
            >
              <span className="font-sketch text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                New Check-In
              </span>
              {formOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {formOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 space-y-4 border-t border-border/40 pt-4">
                    {/* Week selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium shrink-0">Week:</label>
                      <select
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(Number(e.target.value))}
                        className="sketch-border-sm bg-background px-3 py-1.5 text-sm rounded-lg"
                      >
                        {Array.from({ length: 26 }, (_, i) => i + 1).map((w) => (
                          <option key={w} value={w}>
                            Week {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Self-rating */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        How well did you learn this week?
                      </label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>

                    {/* Reflection */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        What did you learn? *
                      </label>
                      <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Share your key takeaways from this week..."
                        rows={3}
                        className="w-full sketch-border-sm bg-background px-3 py-2 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                    </div>

                    {/* Challenges */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        What was challenging?
                      </label>
                      <textarea
                        value={challenges}
                        onChange={(e) => setChallenges(e.target.value)}
                        placeholder="Any topics that were difficult or confusing..."
                        rows={2}
                        className="w-full sketch-border-sm bg-background px-3 py-2 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                    </div>

                    {/* Next focus */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Focus for next week
                      </label>
                      <textarea
                        value={nextFocus}
                        onChange={(e) => setNextFocus(e.target.value)}
                        placeholder="What will you focus on next..."
                        rows={2}
                        className="w-full sketch-border-sm bg-background px-3 py-2 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!reflection.trim() || submitted}
                      className="gap-2 sketch-border-sm"
                    >
                      {submitted ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                          Saved! +25 XP
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          Submit Check-In
                          <span className="text-xs text-muted-foreground ml-1">
                            +25 XP
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* History */}
        <motion.section variants={item} className="space-y-4">
          <h3 className="font-sketch text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Check-In History
          </h3>

          {checkIns.length === 0 ? (
            <div className="sketch-card bg-card p-8 text-center">
              <ClipboardCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No check-ins yet. Reflect on your learning each week!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkIns.map((ci, i) => {
                const isExpanded = expandedId === ci.id;
                return (
                  <motion.div
                    key={ci.id}
                    variants={item}
                    className="sketch-card bg-card overflow-hidden"
                    style={{
                      transform: `rotate(${i % 2 === 0 ? "-0.2" : "0.2"}deg)`,
                    }}
                  >
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : ci.id)
                      }
                      className="w-full text-left p-4 hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="sticker border-blue-400/50 bg-blue-500/10 text-blue-400 text-[10px] shrink-0">
                            W{ci.weekNumber}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {ci.reflection}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(ci.date), "MMM d, yyyy")}
                              </span>
                              <StarRating value={ci.rating} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="sticker border-emerald-400/50 bg-emerald-500/10 text-emerald-400 text-[9px]">
                            <Zap className="h-2.5 w-2.5" />
                            +25 XP
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                What I learned
                              </p>
                              <p className="text-sm">{ci.reflection}</p>
                            </div>
                            {ci.challenges && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Challenges
                                </p>
                                <p className="text-sm">{ci.challenges}</p>
                              </div>
                            )}
                            {ci.nextFocus && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Next week focus
                                </p>
                                <p className="text-sm">{ci.nextFocus}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Footer */}
        <motion.footer variants={item} className="text-center py-6">
          <p className="font-sketch text-lg text-muted-foreground">
            Reflection is a superpower
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
