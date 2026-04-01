"use client";

import { AnimatePresence } from "framer-motion";
import { useProgress } from "@/components/shared/progress-provider";
import { LevelUpCelebration } from "@/components/shared/confetti";

export function LevelUpOverlay() {
  const { levelUpInfo, clearLevelUp } = useProgress();

  return (
    <AnimatePresence>
      {levelUpInfo && (
        <LevelUpCelebration
          level={levelUpInfo.level}
          title={levelUpInfo.title}
          onComplete={clearLevelUp}
        />
      )}
    </AnimatePresence>
  );
}
