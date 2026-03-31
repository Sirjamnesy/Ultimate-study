"use client";

// localStorage-based progress store for MVP.
// Will be replaced with Supabase in a future sprint.

import type { QuizResult } from "@/lib/gamification/quiz-engine";

export type ProgressData = {
  completedResources: string[];
  xp: number;
  streak: number;
  lastStudyDate: string | null; // ISO date string
  dailyLog: string[]; // ISO date strings of study days
  earnedBadges: string[];
  currentWeek: number;
  quizResults: QuizResult[]; // all quiz attempts
};

const STORAGE_KEY = "us-progress";

const defaultProgress: ProgressData = {
  completedResources: [],
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  dailyLog: [],
  earnedBadges: [],
  currentWeek: 1,
  quizResults: [],
};

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function toggleResource(
  resourceId: string,
  resourceType: string,
  streakDays: number
): { added: boolean; xpDelta: number } {
  const data = loadProgress();
  const idx = data.completedResources.indexOf(resourceId);

  const baseXP: Record<string, number> = {
    course: 50,
    docs: 25,
    video: 30,
    practice: 40,
    build: 200,
    quiz: 75,
    reading: 25,
  };
  const base = baseXP[resourceType] ?? 25;
  const multiplier = streakDays >= 30 ? 2.0 : streakDays >= 7 ? 1.5 : 1.0;
  const xpEarned = Math.round(base * multiplier);

  if (idx === -1) {
    // Add
    data.completedResources.push(resourceId);
    data.xp += xpEarned;
    saveProgress(data);
    return { added: true, xpDelta: xpEarned };
  } else {
    // Remove
    data.completedResources.splice(idx, 1);
    data.xp = Math.max(0, data.xp - xpEarned);
    saveProgress(data);
    return { added: false, xpDelta: -xpEarned };
  }
}

export function recordStudyDay(): { newStreak: number; isNewDay: boolean } {
  const data = loadProgress();
  const today = new Date().toISOString().split("T")[0];

  if (data.lastStudyDate === today) {
    return { newStreak: data.streak, isNewDay: false };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isConsecutive = data.lastStudyDate === yesterday;

  data.streak = isConsecutive ? data.streak + 1 : 1;
  data.lastStudyDate = today;
  if (!data.dailyLog.includes(today)) {
    data.dailyLog.push(today);
  }
  // Daily study XP
  data.xp += 15;
  saveProgress(data);

  return { newStreak: data.streak, isNewDay: true };
}

export function earnBadge(badgeId: string): boolean {
  const data = loadProgress();
  if (data.earnedBadges.includes(badgeId)) return false;
  data.earnedBadges.push(badgeId);
  saveProgress(data);
  return true;
}

export function setCurrentWeek(weekId: number): void {
  const data = loadProgress();
  data.currentWeek = weekId;
  saveProgress(data);
}

export function saveQuizResult(result: QuizResult, xpEarned: number): void {
  const data = loadProgress();
  data.quizResults.push(result);
  data.xp += xpEarned;
  saveProgress(data);
}

export function getBestQuizScore(quizId: string): number | null {
  const data = loadProgress();
  const attempts = data.quizResults.filter((r) => r.quizId === quizId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score));
}
