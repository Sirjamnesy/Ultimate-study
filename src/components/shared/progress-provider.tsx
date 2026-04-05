"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
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
  // Auth state
  user: User | null;
  isAnonymous: boolean;
  hasPaid: boolean;
  refreshAuth: () => Promise<void>;
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
  user: null,
  isAnonymous: true,
  hasPaid: false,
  refreshAuth: async () => {},
});

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [mounted, setMounted] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const prevXPRef = useRef<number>(progress.xp);

  function applyUser(u: User | null) {
    setUser(u);
    const anon = !u || u.is_anonymous === true;
    setIsAnonymous(anon);
    setHasPaid(!anon && (u?.app_metadata?.has_paid === true || u?.app_metadata?.is_admin === true));
  }

  const refreshAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.refreshSession();
    applyUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Check for existing session first (returning user)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user && !session.user.is_anonymous) {
        // Real authenticated user — use their session
        if (!cancelled) applyUser(session.user);
      } else {
        // No session or anonymous — sign in anonymously (idempotent)
        const { error: authError } = await supabase.auth.signInAnonymously();
        if (authError) {
          console.warn("[progress-provider] anon auth failed:", authError.message);
          if (!cancelled) {
            const local = loadProgress();
            setProgress(local);
            prevXPRef.current = local.xp;
            setMounted(true);
          }
          return;
        }
        const { data: { user: anonUser } } = await supabase.auth.getUser();
        if (!cancelled) applyUser(anonUser);
      }

      const remoteData = await fetchProgressFromSupabase();
      if (cancelled) return;

      if (remoteData) {
        saveProgress(remoteData);
        setProgress(remoteData);
        prevXPRef.current = remoteData.xp;
      } else {
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

  // Listen for auth state changes (sign-in, sign-out, session refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // After sign-out, re-create an anonymous session so the app keeps
        // functioning correctly (landing page, no crash, fresh local state).
        supabase.auth.signInAnonymously().then(({ data }) => {
          applyUser(data.user ?? null);
        });
      } else {
        applyUser(session?.user ?? null);
      }
    });
    return () => subscription.unsubscribe();
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
      value={{
        progress, toggleResource, logStudyDay, earnBadge, isCompleted,
        saveQuizResult, getBestQuizScore, saveCheckIn, getLatestCheckIn,
        levelUpInfo, clearLevelUp, mounted,
        user, isAnonymous, hasPaid, refreshAuth,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
