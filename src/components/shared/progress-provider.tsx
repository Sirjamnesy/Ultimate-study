"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  type ProgressData,
  loadProgress,
  saveProgress,
  recordStudyDay,
  toggleResource as toggleResourceStore,
  earnBadge as earnBadgeStore,
  saveQuizResult as saveQuizResultStore,
  getBestQuizScore as getBestQuizScoreStore,
} from "@/lib/store/progress";
import type { QuizResult } from "@/lib/gamification/quiz-engine";

type ProgressContextType = {
  progress: ProgressData;
  toggleResource: (id: string, type: string) => { added: boolean; xpDelta: number };
  logStudyDay: () => { newStreak: number; isNewDay: boolean };
  earnBadge: (id: string) => boolean;
  isCompleted: (resourceId: string) => boolean;
  saveQuizResult: (result: QuizResult, xpEarned: number) => void;
  getBestQuizScore: (quizId: string) => number | null;
  mounted: boolean;
};

const ProgressContext = createContext<ProgressContextType>({
  progress: {
    completedResources: [],
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    dailyLog: [],
    earnedBadges: [],
    currentWeek: 1,
    quizResults: [],
  },
  toggleResource: () => ({ added: false, xpDelta: 0 }),
  logStudyDay: () => ({ newStreak: 0, isNewDay: false }),
  earnBadge: () => false,
  isCompleted: () => false,
  saveQuizResult: () => {},
  getBestQuizScore: () => null,
  mounted: false,
});

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
  }, []);

  const toggleResource = useCallback(
    (id: string, type: string) => {
      const result = toggleResourceStore(id, type, progress.streak);
      setProgress(loadProgress());
      return result;
    },
    [progress.streak]
  );

  const logStudyDay = useCallback(() => {
    const result = recordStudyDay();
    setProgress(loadProgress());
    return result;
  }, []);

  const earnBadge = useCallback((id: string) => {
    const result = earnBadgeStore(id);
    setProgress(loadProgress());
    return result;
  }, []);

  const isCompleted = useCallback(
    (resourceId: string) => progress.completedResources.includes(resourceId),
    [progress.completedResources]
  );

  const saveQuizResult = useCallback((result: QuizResult, xpEarned: number) => {
    saveQuizResultStore(result, xpEarned);
    setProgress(loadProgress());
  }, []);

  const getBestQuizScore = useCallback((quizId: string) => {
    return getBestQuizScoreStore(quizId);
  }, []);

  return (
    <ProgressContext.Provider
      value={{ progress, toggleResource, logStudyDay, earnBadge, isCompleted, saveQuizResult, getBestQuizScore, mounted }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
