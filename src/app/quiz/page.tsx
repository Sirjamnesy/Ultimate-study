"use client";

import Link from "next/link";
import {
  Brain,
  Wrench,
  Terminal,
  MessageSquare,
  Shield,
  BookOpen,
  Trophy,
  ChevronRight,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { useProgress } from "@/components/shared/progress-provider";
import { getDomainQuizzes, getWeeklyQuizzes } from "@/lib/data/quiz-questions";

const domainIcons: Record<number, React.ReactNode> = {
  1: <Brain className="h-5 w-5" />,
  2: <Wrench className="h-5 w-5" />,
  3: <Terminal className="h-5 w-5" />,
  4: <MessageSquare className="h-5 w-5" />,
  5: <Shield className="h-5 w-5" />,
};

const domainColors: Record<number, { border: string; bg: string; text: string }> = {
  1: { border: "border-rose-500/40", bg: "bg-rose-500/10", text: "text-rose-400" },
  2: { border: "border-blue-500/40", bg: "bg-blue-500/10", text: "text-blue-400" },
  3: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  4: { border: "border-amber-500/40", bg: "bg-amber-500/10", text: "text-amber-400" },
  5: { border: "border-violet-500/40", bg: "bg-violet-500/10", text: "text-violet-400" },
};

const domainWeights = ["27%", "19%", "19%", "20%", "15%"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function QuizHub() {
  const { getBestQuizScore, mounted } = useProgress();
  const domainQuizzes = getDomainQuizzes();
  const weeklyQuizzes = getWeeklyQuizzes();

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8"
      >
        {/* Hero */}
        <motion.section variants={item} className="text-center space-y-4 py-4 relative">
          <span className="absolute top-0 left-8 text-2xl opacity-20 animate-wiggle hidden sm:block">
            📝
          </span>
          <span className="absolute top-8 right-10 text-2xl opacity-20 animate-wiggle hidden sm:block" style={{ animationDelay: "0.5s" }}>
            🧠
          </span>

          <div className="inline-block">
            <span className="sticker border-blue-400 bg-blue-500/10 text-blue-400 font-mono text-xs tracking-wider">
              <BookOpen className="h-3 w-3" />
              QUIZ HUB
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Test Your{" "}
            <span className="sketch-underline font-sketch text-blue-400 text-4xl sm:text-6xl">
              Knowledge
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Practice quizzes for each exam domain and weekly topics. Score 90%+ to earn Domain Master badges.
          </p>
        </motion.section>

        {/* Domain Quizzes */}
        <motion.section variants={item} className="space-y-4">
          <h3 className="font-sketch text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Exam Domain Quizzes
          </h3>
          <p className="text-sm text-muted-foreground">
            These map directly to the 5 Claude Certified Architect exam domains
          </p>

          <div className="space-y-3">
            {domainQuizzes.map((quiz, i) => {
              const domain = quiz.domain!;
              const colors = domainColors[domain];
              const bestScore = mounted ? getBestQuizScore(quiz.id) : null;
              const passed = bestScore !== null && bestScore >= quiz.passingScore;
              const mastered = bestScore !== null && bestScore >= 90;

              return (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                  <motion.div
                    variants={item}
                    className={`sketch-card p-4 ${colors.bg} ${colors.border} border-l-4`}
                    style={{ transform: `rotate(${i % 2 === 0 ? "-0.3" : "0.3"}deg)` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                        {domainIcons[domain]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold truncate">{quiz.title}</h4>
                          {mastered && (
                            <span className="sticker border-amber-400/50 bg-amber-500/10 text-amber-400 text-[9px]">
                              <Star className="h-2.5 w-2.5" />
                              MASTERED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span>{quiz.questions.length} questions</span>
                          <span>{quiz.timeMinutes} min</span>
                          <span className={`font-mono ${colors.text}`}>
                            Exam weight: {domainWeights[domain - 1]}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        {bestScore !== null ? (
                          <div className="space-y-1">
                            <p className={`text-xl font-bold font-mono ${passed ? "text-emerald-400" : "text-muted-foreground"}`}>
                              {bestScore}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">Best</p>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1 sketch-border-sm text-xs">
                            Start <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Weekly Quizzes */}
        <motion.section variants={item} className="space-y-4">
          <h3 className="font-sketch text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            Weekly Topic Quizzes
          </h3>
          <p className="text-sm text-muted-foreground">
            Quick checks to reinforce what you learned each week
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weeklyQuizzes.map((quiz, i) => {
              const bestScore = mounted ? getBestQuizScore(quiz.id) : null;
              const passed = bestScore !== null && bestScore >= quiz.passingScore;

              return (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                  <motion.div
                    variants={item}
                    className="sketch-card p-4 bg-card h-full"
                    style={{ transform: `rotate(${i % 3 === 0 ? "-0.3" : i % 3 === 1 ? "0.3" : "0"}deg)` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">{quiz.title}</h4>
                        <p className="text-xs text-muted-foreground">{quiz.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {quiz.questions.length > 0 ? (
                            <>
                              <span>{quiz.questions.length} Q</span>
                              <span>{quiz.timeMinutes} min</span>
                            </>
                          ) : (
                            <span className="text-amber-400 font-medium">Coming Soon</span>
                          )}
                        </div>
                      </div>
                      {bestScore !== null ? (
                        <div className="flex items-center gap-1.5">
                          {passed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                          <span className={`text-lg font-bold font-mono ${passed ? "text-emerald-400" : "text-muted-foreground"}`}>
                            {bestScore}%
                          </span>
                        </div>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={item} className="text-center py-6">
          <p className="font-sketch text-lg text-muted-foreground">
            More questions added as you progress through the roadmap
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
