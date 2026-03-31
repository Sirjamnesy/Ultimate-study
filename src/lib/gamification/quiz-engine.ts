// Quiz engine: scoring, results, and domain breakdown.

import type { QuizQuestion } from "@/lib/data/quiz-questions";

export type QuizResult = {
  quizId: string;
  score: number; // percentage 0-100
  correct: number;
  total: number;
  timeSeconds: number;
  answers: Record<string, number>; // questionId -> selected index
  date: string; // ISO string
  domainBreakdown?: Record<number, { correct: number; total: number }>;
};

export function calculateResult(
  quizId: string,
  questionList: QuizQuestion[],
  answers: Record<string, number>,
  timeSeconds: number
): QuizResult {
  let correct = 0;
  const domainBreakdown: Record<number, { correct: number; total: number }> = {};

  for (const q of questionList) {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) correct++;

    if (q.domain) {
      if (!domainBreakdown[q.domain]) {
        domainBreakdown[q.domain] = { correct: 0, total: 0 };
      }
      domainBreakdown[q.domain].total++;
      if (isCorrect) domainBreakdown[q.domain].correct++;
    }
  }

  const total = questionList.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    quizId,
    score,
    correct,
    total,
    timeSeconds,
    answers,
    date: new Date().toISOString(),
    domainBreakdown: Object.keys(domainBreakdown).length > 0 ? domainBreakdown : undefined,
  };
}

export function getXPForQuiz(score: number, passingScore: number): number {
  // Base 75 XP for completing, bonus for high scores
  let xp = 75;
  if (score >= passingScore) xp += 25; // passing bonus
  if (score >= 90) xp += 50; // excellence bonus
  if (score === 100) xp += 25; // perfect score
  return xp;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
