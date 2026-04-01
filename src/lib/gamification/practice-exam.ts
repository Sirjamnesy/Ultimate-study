// Practice exam: weighted random question selection across 5 domains.

import { questions, type QuizQuestion } from "@/lib/data/quiz-questions";

// Exam domain weights and question counts (30 total)
const DOMAIN_ALLOCATION: Record<number, number> = {
  1: 8, // Agentic Architecture (27%)
  2: 6, // Tool Design & MCP (19%)
  3: 6, // Claude Code (19%)
  4: 6, // Prompt Engineering (20%)
  5: 4, // Context & Reliability (15%)
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generatePracticeExam(): QuizQuestion[] {
  // Group all domain-tagged questions by domain
  const byDomain: Record<number, QuizQuestion[]> = {};
  for (const q of questions) {
    if (q.domain) {
      if (!byDomain[q.domain]) byDomain[q.domain] = [];
      byDomain[q.domain].push(q);
    }
  }

  const selected: QuizQuestion[] = [];

  for (const [domain, count] of Object.entries(DOMAIN_ALLOCATION)) {
    const domainNum = Number(domain);
    const pool = byDomain[domainNum] || [];
    const shuffled = shuffle(pool);
    // Take up to `count` questions (or all if pool is smaller)
    selected.push(...shuffled.slice(0, count));
  }

  // Shuffle the final exam
  return shuffle(selected);
}

export const PRACTICE_EXAM_CONFIG = {
  id: "practice-exam",
  title: "Practice Exam",
  description:
    "Full mock exam simulating the Claude Certified Architect test. 30 questions weighted by domain.",
  timeMinutes: 45,
  passingScore: 72,
  totalQuestions: 30,
};

export const DOMAIN_WEIGHTS: Record<number, { name: string; weight: string; color: string }> = {
  1: { name: "Agentic Architecture", weight: "27%", color: "text-rose-400" },
  2: { name: "Tool Design & MCP", weight: "19%", color: "text-blue-400" },
  3: { name: "Claude Code", weight: "19%", color: "text-emerald-400" },
  4: { name: "Prompt Engineering", weight: "20%", color: "text-amber-400" },
  5: { name: "Context & Reliability", weight: "15%", color: "text-violet-400" },
};
