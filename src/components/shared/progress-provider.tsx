"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  type ProgressData,
  type WeeklyCheckIn,
  loadProgress,
  saveProgress,
  recordStudyDay,
  toggleResource as toggleResourceStore,
  earnBadge as earnBadgeStore,
  saveQuizResult as saveQuizResultStore,
  getBestQuizScore as getBestQuizScoreStore,
  saveCheckIn as saveCheckInStore,
  getLatestCheckIn as getLatestCheckInStore,
} from "@/lib/store/progress";
import type { QuizResult } from "@/lib/gamification/quiz-engine";
import { getLevelForXP } from "@/lib/gamification/xp-engine";
import { checkStreakBadges } from "@/lib/gamification/badge-checker";
import { supabase } from "@/lib/supabase/client";
import { fetchProgressFromSupabase, syncProgressToSupabase } from "@/lib/store/supabase-sync";

export type LevelUpInfo = { level: number; title: string } | null;

type ProgressContextType = {
  progress: ProgressData;
  toggleResource: (id: string, type: string) => { added: boolean; xpDelta: number };
  logStudyDay: () => { newStreak: number; isNewDay: boolean };
  earnBadge: (id: string) => boolean;
  isCompleted: (resourceId: string) => boolean;
  saveQuizResult: (result: QuizResult, xpEarned: number) => void;
  getBestQuizScore: (quizId: string) => number | null;
  saveCheckIn: (checkIn: WeeklyCheckIn) => void;
  getLatestCheckIn: () => WeeklyCheckIn | null;
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
    weeklyCheckIns: [],
  },
  toggleResource: () => ({ added: false, xpDelta: 0 }),
  logStudyDay: () => ({ newStreak: 0, isNewDay: false }),
  earnBadge: () => false,
  isCompleted: () => false,
  saveQuizResult: () => {},
  getBestQuizScore: () => null,
  saveCheckIn: () => {},
  getLatestCheckIn: () => null,
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
    let cancelled = false;

    async function init() {
      // Anon auth — idempotent, returns existing session if already signed in
      const { error: authError } = await supabase.auth.signInAnonymously();

      if (authError) {
        // Offline or Supabase down — fall back to localStorage only
        console.warn("[progress-provider] anon auth failed, using localStorage:", authError.message);
        if (!cancelled) {
          const local = loadProgress();
          setProgress(local);
          prevXPRef.current = local.xp;
          setMounted(true);
        }
        return;
      }

      const remoteData = await fetchProgressFromSupabase();
      if (cancelled) return;

      if (remoteData) {
        // Remote wins — write back to localStorage cache so sync reads are fresh
        saveProgress(remoteData);
        setProgress(remoteData);
        prevXPRef.current = remoteData.xp;
      } else {
        // No remote row yet — check if localStorage has existing data to migrate
        const localData = loadProgress();
        const hasLocalData =
          localData.completedResources.length > 0 ||
          localData.xp > 0 ||
          localData.earnedBadges.length > 0;
        if (hasLocalData) await syncProgressToSupabase(localData);
        setProgress(localData);
        prevXPRef.current = localData.xp;
      }

      if (!cancelled) setMounted(true);
    }

    init();
    return () => { cancelled = true; };
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
    // Background sync to Supabase — fire-and-forget
    syncProgressToSupabase(newData);
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
    const newData = loadProgress();
    setProgress(newData);
    // earnBadge doesn't go through checkLevelUp, so sync explicitly
    syncProgressToSupabase(newData);
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

  const saveCheckIn = useCallback((checkIn: WeeklyCheckIn) => {
    const oldXP = prevXPRef.current;
    saveCheckInStore(checkIn);
    checkLevelUp(oldXP);
  }, [checkLevelUp]);

  const getLatestCheckIn = useCallback(() => {
    return getLatestCheckInStore();
  }, []);

  return (
    <ProgressContext.Provider
      value={{ progress, toggleResource, logStudyDay, earnBadge, isCompleted, saveQuizResult, getBestQuizScore, saveCheckIn, getLatestCheckIn, levelUpInfo, clearLevelUp, mounted }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
