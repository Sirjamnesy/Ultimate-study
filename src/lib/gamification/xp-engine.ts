export type Level = {
  level: number;
  title: string;
  xpRequired: number;
};

export type BadgeDef = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "knowledge" | "build" | "milestone";
};

export const levels: Level[] = [
  { level: 1, title: "Curious Beginner", xpRequired: 0 },
  { level: 2, title: "Prompt Apprentice", xpRequired: 250 },
  { level: 3, title: "API Explorer", xpRequired: 600 },
  { level: 4, title: "Tool Wielder", xpRequired: 1200 },
  { level: 5, title: "MCP Builder", xpRequired: 2000 },
  { level: 6, title: "Agent Crafter", xpRequired: 3000 },
  { level: 7, title: "System Designer", xpRequired: 4500 },
  { level: 8, title: "Exam Warrior", xpRequired: 6500 },
  { level: 9, title: "Claude Architect", xpRequired: 9000 },
  { level: 10, title: "AI Master", xpRequired: 12000 },
];

export const badges: BadgeDef[] = [
  // Streak badges
  { id: "first-flame", name: "First Flame", description: "3-day study streak", icon: "Flame", category: "streak" },
  { id: "week-warrior", name: "Week Warrior", description: "7-day study streak", icon: "Zap", category: "streak" },
  { id: "monthly-machine", name: "Monthly Machine", description: "30-day study streak", icon: "Trophy", category: "streak" },

  // Knowledge badges
  { id: "domain-master-1", name: "Domain Master: D1", description: "90%+ on Domain 1 quiz", icon: "Brain", category: "knowledge" },
  { id: "domain-master-2", name: "Domain Master: D2", description: "90%+ on Domain 2 quiz", icon: "Wrench", category: "knowledge" },
  { id: "domain-master-3", name: "Domain Master: D3", description: "90%+ on Domain 3 quiz", icon: "Terminal", category: "knowledge" },
  { id: "domain-master-4", name: "Domain Master: D4", description: "90%+ on Domain 4 quiz", icon: "MessageSquare", category: "knowledge" },
  { id: "domain-master-5", name: "Domain Master: D5", description: "90%+ on Domain 5 quiz", icon: "Shield", category: "knowledge" },

  // Build badges
  { id: "first-build", name: "First Build", description: "Complete your first build project", icon: "Hammer", category: "build" },
  { id: "tool-smith", name: "Tool Smith", description: "Build a multi-tool agent", icon: "Wrench", category: "build" },
  { id: "mcp-pioneer", name: "MCP Pioneer", description: "Build an MCP server", icon: "Plug", category: "build" },
  { id: "agent-architect", name: "Agent Architect", description: "Build a multi-agent system", icon: "Network", category: "build" },

  // Milestone badges
  { id: "first-steps", name: "First Steps", description: "Complete Week 1", icon: "Footprints", category: "milestone" },
  { id: "foundation-layer", name: "Foundation Layer", description: "Complete Phase 1", icon: "Layers", category: "milestone" },
  { id: "ai-engineer", name: "AI Engineer", description: "Complete Phase 2", icon: "Cpu", category: "milestone" },
  { id: "exam-ready", name: "Exam Ready", description: "Complete all mock exams", icon: "GraduationCap", category: "milestone" },
  { id: "certified-architect", name: "Certified Architect", description: "Pass the Claude Certified Architect exam!", icon: "Award", category: "milestone" },
  { id: "production-engineer", name: "Production Engineer", description: "Complete Phase 4", icon: "Rocket", category: "milestone" },
  { id: "ai-master", name: "AI Master", description: "Complete the full 26-week journey", icon: "Crown", category: "milestone" },
];

export function getLevelForXP(xp: number): Level {
  let current = levels[0];
  for (const level of levels) {
    if (xp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXPProgress(xp: number): { current: Level; next: Level | null; progress: number } {
  const current = getLevelForXP(xp);
  const nextIdx = levels.findIndex((l) => l.level === current.level) + 1;
  const next = nextIdx < levels.length ? levels[nextIdx] : null;

  if (!next) return { current, next: null, progress: 100 };

  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const progress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { current, next, progress };
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 7) return 1.5;
  return 1.0;
}

export function calculateResourceXP(
  resourceType: string,
  streakDays: number
): number {
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
  return Math.round(base * getStreakMultiplier(streakDays));
}
