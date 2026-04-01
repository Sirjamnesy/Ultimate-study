// Auto-earn badges based on current progress state.

import { loadProgress } from "@/lib/store/progress";

type BadgeCheck = { id: string; earned: boolean };

export function checkStreakBadges(streak: number): BadgeCheck[] {
  const results: BadgeCheck[] = [];
  const data = loadProgress();
  const earned = data.earnedBadges;

  if (streak >= 3 && !earned.includes("first-flame")) {
    results.push({ id: "first-flame", earned: true });
  }
  if (streak >= 7 && !earned.includes("week-warrior")) {
    results.push({ id: "week-warrior", earned: true });
  }
  if (streak >= 30 && !earned.includes("monthly-machine")) {
    results.push({ id: "monthly-machine", earned: true });
  }

  return results;
}

export function getBadgeProgress(badgeId: string, progress: {
  streak: number;
  earnedBadges: string[];
  completedResources: string[];
  quizResults: { quizId: string; score: number }[];
}): string | null {
  // Return a hint string for locked badges showing progress
  switch (badgeId) {
    case "first-flame":
      return `${Math.min(progress.streak, 3)}/3 day streak`;
    case "week-warrior":
      return `${Math.min(progress.streak, 7)}/7 day streak`;
    case "monthly-machine":
      return `${Math.min(progress.streak, 30)}/30 day streak`;
    case "domain-master-1":
    case "domain-master-2":
    case "domain-master-3":
    case "domain-master-4":
    case "domain-master-5": {
      const domain = badgeId.replace("domain-master-", "");
      const best = progress.quizResults
        .filter((r) => r.quizId === `domain-${domain}`)
        .reduce((max, r) => Math.max(max, r.score), 0);
      return best > 0 ? `Best: ${best}% (need 90%)` : "Score 90%+ on domain quiz";
    }
    case "first-build": {
      const builds = progress.completedResources.filter((r) => r.includes("-") && r.startsWith("w"));
      // Can't easily determine build type from ID alone; show generic hint
      return "Complete a build project";
    }
    default:
      return null;
  }
}
