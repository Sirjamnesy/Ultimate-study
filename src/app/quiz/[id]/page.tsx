"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Zap,
  Star,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { Confetti, XPToast } from "@/components/shared/confetti";
import { useProgress } from "@/components/shared/progress-provider";
import { getQuiz, getQuestionsByQuiz } from "@/lib/data/quiz-questions";
import { calculateResult, getXPForQuiz, formatTime, type QuizResult } from "@/lib/gamification/quiz-engine";

type Stage = "intro" | "active" | "review" | "results";

const domainNames: Record<number, string> = {
  1: "Agentic Architecture",
  2: "Tool Design & MCP",
  3: "Claude Code",
  4: "Prompt Engineering",
  5: "Context & Reliability",
};

const domainColors: Record<number, string> = {
  1: "text-rose-400",
  2: "text-blue-400",
  3: "text-emerald-400",
  4: "text-amber-400",
  5: "text-violet-400",
};

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { saveQuizResult, earnBadge, mounted } = useProgress();

  const quiz = getQuiz(id);
  const questionList = quiz ? getQuestionsByQuiz(id) : [];

  const [stage, setStage] = useState<Stage>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answersRef = useRef<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timeLeftRef = useRef(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (stage !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          // Defer finishQuiz to avoid setState-during-render
          setTimeout(() => finishQuiz(), 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  const startQuiz = useCallback(() => {
    answersRef.current = {};
    setAnswers({});
    setCurrentQ(0);
    setSelectedOption(null);
    const t = (quiz?.timeMinutes ?? 5) * 60;
    timeLeftRef.current = t;
    setTimeLeft(t);
    setStage("active");
  }, [quiz]);

  const finishQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const totalTime = (quiz?.timeMinutes ?? 5) * 60;
    const timeUsed = totalTime - timeLeftRef.current;
    const res = calculateResult(id, questionList, answersRef.current, timeUsed);
    setResult(res);

    const xp = getXPForQuiz(res.score, quiz?.passingScore ?? 70);
    saveQuizResult(res, xp);
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 3000);

    // Check for domain mastery badge
    if (quiz?.domain && res.score >= 90) {
      earnBadge(`domain-master-${quiz.domain}`);
    }

    if (res.score >= (quiz?.passingScore ?? 70)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }

    setStage("results");
  }, [id, questionList, quiz, saveQuizResult, earnBadge]);

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (stage !== "active") return;
      const qId = questionList[currentQ].id;
      setSelectedOption(optionIndex);
      answersRef.current = { ...answersRef.current, [qId]: optionIndex };
      setAnswers(answersRef.current);

      // Auto-advance after brief delay
      setTimeout(() => {
        if (currentQ < questionList.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelectedOption(null);
        }
      }, 300);
    },
    [stage, currentQ, questionList]
  );

  if (!quiz || questionList.length === 0) {
    return (
      <div className="min-h-screen notebook-bg">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="font-sketch text-2xl text-muted-foreground">Quiz not found</p>
          <Link href="/quiz">
            <Button variant="outline" className="mt-4 sketch-border-sm">
              Back to Quiz Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const q = questionList[currentQ];
  const progress = questionList.length > 0 ? Math.round(((currentQ + (selectedOption !== null ? 1 : 0)) / questionList.length) * 100) : 0;

  return (
    <div className="min-h-screen notebook-bg">
      <Header />

      <Confetti trigger={showConfetti} message="Quiz Passed!" />
      <XPToast amount={xpToast ?? 0} show={xpToast !== null} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* ── INTRO STAGE ── */}
        {stage === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quiz Hub
            </Link>

            <div className="sketch-card bg-card p-6 sm:p-8 text-center space-y-5 relative">
              <div className="tape" />
              <div className="pt-4">
                <span className="sticker border-blue-400 bg-blue-500/10 text-blue-400 text-xs">
                  {quiz.domain ? `DOMAIN ${quiz.domain}` : `WEEK ${quiz.week}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sketch">
                {quiz.title}
              </h2>
              <p className="text-muted-foreground">{quiz.description}</p>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  {quiz.questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {quiz.timeMinutes} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  {quiz.passingScore}% to pass
                </span>
              </div>

              {quiz.domain && (
                <p className="text-xs text-muted-foreground">
                  Score 90%+ to earn the <span className="text-amber-400 font-semibold">Domain Master</span> badge
                </p>
              )}

              <Button
                size="lg"
                className="gap-2 sketch-border-sm mt-2"
                onClick={startQuiz}
              >
                <Zap className="h-4 w-4" />
                Start Quiz
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── ACTIVE STAGE ── */}
        {stage === "active" && q && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Top bar: timer + progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className={`h-4 w-4 ${timeLeft <= 60 ? "text-red-400" : "text-amber-400"}`} />
                <span className={`font-mono font-bold ${timeLeft <= 60 ? "text-red-400" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-mono font-bold text-foreground">{currentQ + 1}</span>
                <span> / {questionList.length}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="sketch-progress h-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-[4px] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="sketch-card bg-card p-5 sm:p-6 space-y-5"
              >
                <p className="text-lg font-semibold leading-relaxed">
                  {q.question}
                </p>

                <div className="space-y-2.5">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[q.id] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => selectAnswer(i)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 border-dashed transition-all text-sm leading-relaxed
                          ${
                            isSelected
                              ? "border-violet-500 bg-violet-500/10 text-foreground"
                              : "border-border/60 hover:border-border hover:bg-accent/30 text-foreground/80"
                          }
                        `}
                        style={{ borderRadius: "12px 8px 14px 6px" }}
                      >
                        <span className="flex items-start gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold mt-0.5
                              ${
                                isSelected
                                  ? "border-violet-500 bg-violet-500 text-white"
                                  : "border-muted-foreground/30"
                              }
                            `}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentQ === 0}
                onClick={() => {
                  setCurrentQ((p) => p - 1);
                  setSelectedOption(null);
                }}
                className="gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Prev
              </Button>

              {currentQ === questionList.length - 1 ? (
                <Button
                  size="sm"
                  className="gap-1 sketch-border-sm"
                  onClick={finishQuiz}
                >
                  Finish Quiz <CheckCircle2 className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sketch-border-sm"
                  onClick={() => {
                    setCurrentQ((p) => p + 1);
                    setSelectedOption(null);
                  }}
                >
                  Next <ChevronRight className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Question dots */}
            <div className="flex flex-wrap gap-1.5 justify-center pt-2">
              {questionList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentQ(i);
                    setSelectedOption(null);
                  }}
                  className={`h-3 w-3 rounded-full border transition-all
                    ${
                      i === currentQ
                        ? "bg-violet-500 border-violet-500 scale-125"
                        : answers[questionList[i].id] !== undefined
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-transparent border-muted-foreground/30"
                    }
                  `}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS STAGE ── */}
        {stage === "results" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quiz Hub
            </Link>

            {/* Score card */}
            <div className="sketch-card bg-card p-6 sm:p-8 text-center space-y-4 relative">
              <div className="tape" />
              <div className="pt-4">
                <span className={`font-sketch text-6xl font-bold ${result.score >= (quiz.passingScore) ? "text-emerald-400" : "text-rose-400"}`}>
                  {result.score}%
                </span>
              </div>
              <p className="text-lg font-semibold">
                {result.score >= 90
                  ? "Outstanding!"
                  : result.score >= quiz.passingScore
                  ? "You Passed!"
                  : "Keep Studying!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {result.correct} of {result.total} correct in {formatTime(result.timeSeconds)}
              </p>

              {result.score >= 90 && quiz.domain && (
                <div className="inline-block">
                  <span className="sticker border-amber-400 bg-amber-500/10 text-amber-400 text-sm">
                    <Star className="h-3.5 w-3.5" />
                    Domain Master: D{quiz.domain} Earned!
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  className="gap-1.5 sketch-border-sm"
                  onClick={() => setStage("review")}
                >
                  Review Answers
                </Button>
                <Button
                  className="gap-1.5 sketch-border-sm"
                  onClick={startQuiz}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try Again
                </Button>
              </div>
            </div>

            {/* Domain breakdown */}
            {result.domainBreakdown && (
              <div className="sketch-card bg-card p-5 space-y-3">
                <h3 className="font-sketch text-xl font-bold">Domain Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(result.domainBreakdown).map(([d, stats]) => {
                    const dNum = Number(d);
                    const pct = Math.round((stats.correct / stats.total) * 100);
                    return (
                      <div key={d} className="flex items-center gap-3">
                        <span className={`text-sm font-semibold w-36 truncate ${domainColors[dNum] || ""}`}>
                          D{d}: {domainNames[dNum] || ""}
                        </span>
                        <div className="flex-1 sketch-progress h-2.5">
                          <div
                            className={`h-full rounded-[4px] transition-all duration-500 ${
                              pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-16 text-right">
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── REVIEW STAGE ── */}
        {stage === "review" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStage("results")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Results
              </button>
              <span className="text-sm font-mono text-muted-foreground">
                {result.correct}/{result.total} correct
              </span>
            </div>

            {questionList.map((question, i) => {
              const userAnswer = result.answers[question.id];
              const isCorrect = userAnswer === question.correctIndex;

              return (
                <div
                  key={question.id}
                  className={`sketch-card p-5 space-y-3 ${
                    isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                  }`}
                  style={{ borderLeftWidth: "4px", borderLeftColor: isCorrect ? "rgb(52 211 153 / 0.5)" : "rgb(251 113 133 / 0.5)" }}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <p className="font-semibold text-sm">
                      <span className="text-muted-foreground font-mono mr-2">Q{i + 1}</span>
                      {question.question}
                    </p>
                  </div>

                  <div className="space-y-1.5 ml-7">
                    {question.options.map((opt, oi) => {
                      const isUserPick = userAnswer === oi;
                      const isRight = question.correctIndex === oi;
                      return (
                        <div
                          key={oi}
                          className={`text-sm p-2 rounded-lg flex items-start gap-2 ${
                            isRight
                              ? "bg-emerald-500/10 text-emerald-400 font-medium"
                              : isUserPick
                              ? "bg-rose-500/10 text-rose-400 line-through opacity-70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="font-mono text-xs mt-0.5">{String.fromCharCode(65 + oi)}</span>
                          <span>{opt}</span>
                          {isRight && <CheckCircle2 className="h-3.5 w-3.5 ml-auto shrink-0 mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="ml-7 mt-2 p-3 bg-blue-500/5 border border-dashed border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400">
                      <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-4">
              <Button
                className="gap-1.5 sketch-border-sm"
                onClick={startQuiz}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
