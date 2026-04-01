"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { getLevelForXP } from "@/lib/gamification/xp-engine";
import { checkStreakBadges } from "@/lib/gamification/badge-checker";

export type LevelUpInfo = { level: number; title: string } | null;

type ProgressContextType = {
  progress: ProgressData;
  toggleResource: (id: string, type: string) => { added: boolean; xpDelta: number };
  logStudyDay: () => { newStreak: number; isNewDay: boolean };
  earnBadge: (id: string) => boolean;
  isCompleted: (resourceId: string) => boolean;
  saveQuizResult: (result: QuizResult, xpEarned: number) => void;
  getBestQuizScore: (quizId: string) => number | null;
  levelUpInfo: LevelUpInfo;
  clearLevelUp: () => void;
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
    badgeEarnedDates: {},
    currentWeek: 1,
    quizResults: [],
  },
  toggleResource: () => ({ added: false, xpDelta: 0 }),
  logStudyDay: () => ({ newStreak: 0, isNewDay: false }),
  earnBadge: () => false,
  isCompleted: () => false,
  saveQuizResult: () => {},
  getBestQuizScore: () => null,
  levelUpInfo: null,
  clearLevelUp: () => {},
  mounted: false,
});

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [mounted, setMounted] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo>(null);
  const prevXPRef = useRef<number>(progress.xp);

  useEffect(() => {
    setMounted(true);
    const data = loadProgress();
    setProgress(data);
    prevXPRef.current = data.xp;
  }, []);

  const checkLevelUp = useCallback((oldXP: number) => {
    const newData = loadProgress();
    setProgress(newData);
    const oldLevel = getLevelForXP(oldXP);
    const newLevel = getLevelForXP(newData.xp);
    if (newLevel.level > oldLevel.level) {
      setLevelUpInfo({ level: newLevel.level, title: newLevel.title });
    }
    prevXPRef.current = newData.xp;
  }, []);

  const clearLevelUp = useCallback(() => setLevelUpInfo(null), []);

  const toggleResource = useCallback(
    (id: string, type: string) => {
      const oldXP = prevXPRef.current;
      const result = toggleResourceStore(id, type, progress.streak);
      checkLevelUp(oldXP);
      return result;
    },
    [progress.streak, checkLevelUp]
  );

  const logStudyDay = useCallback(() => {
    const oldXP = prevXPRef.current;
    const result = recordStudyDay();
    checkLevelUp(oldXP);
    // Auto-earn streak badges
    const newBadges = checkStreakBadges(result.newStreak);
    for (const b of newBadges) {
      earnBadgeStore(b.id);
    }
    if (newBadges.length > 0) setProgress(loadProgress());
    return result;
  }, [checkLevelUp]);

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
    const oldXP = prevXPRef.current;
    saveQuizResultStore(result, xpEarned);
    checkLevelUp(oldXP);
  }, [checkLevelUp]);

  const getBestQuizScore = useCallback((quizId: string) => {
    return getBestQuizScoreStore(quizId);
  }, []);

  return (
    <ProgressContext.Provider
      value={{ progress, toggleResource, logStudyDay, earnBadge, isCompleted, saveQuizResult, getBestQuizScore, levelUpInfo, clearLevelUp, mounted }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
