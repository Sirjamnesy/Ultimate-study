@AGENTS.md

# Ultimate Study — AI Engineering Learning Hub

## What This Is
A 26-week gamified study roadmap web app for becoming an AI Engineer, with a focus on the **Claude Certified Architect** exam. Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and Framer Motion.

**Live:** https://ultimate-study-nu.vercel.app/
**Repo:** https://github.com/Sirjamnesy/Ultimate-study.git

## Tech Stack
- **Framework:** Next.js 16.2.1 (App Router, `use(params)` for async params)
- **React:** 19.2.4
- **Styling:** Tailwind CSS v4, shadcn/ui (base-nova style)
- **Animations:** Framer Motion
- **Fonts:** Google Fonts — Geist (body), Geist Mono (code), Caveat (sketch headings via `font-sketch` class)
- **Persistence:** Supabase (anonymous auth + JSONB table) + localStorage cache
- **Database:** Supabase project `ultimate-study` (id: `jsxpvmrsfpqymwjxnxqn`, region: eu-west-1)
- **Deployment:** Vercel

## Design System
Sketch/notebook aesthetic with hand-drawn borders, tape decorations, stickers, and a ruled-paper background. Key CSS classes:
- `notebook-bg` — ruled paper background
- `sketch-card` — hand-drawn border cards
- `sketch-border-sm` — lighter sketch borders
- `sketch-progress` — hand-drawn progress bars
- `sketch-underline` — wavy underline effect
- `.sticker` — pill badges with sketch borders
- `.tape` — decorative tape on completed cards
- `font-sketch` — Caveat handwriting font

Dark mode is the default. Theme toggle exists in header.

## Architecture

### Key Files
| File | Purpose |
|------|---------|
| `src/lib/data/roadmap.ts` | All 26 weeks of roadmap data: phases, weeks, resources, XP values, badges, exam domains |
| `src/lib/data/quiz-questions.ts` | Quiz definitions: 5 domain quizzes + weekly quizzes (some placeholder with empty `questions: []`) |
| `src/components/shared/progress-provider.tsx` | Global progress context: XP, completed resources, streaks, badges, quiz scores (localStorage) |
| `src/components/shared/confetti.tsx` | Confetti, XP toast, and LevelUpCelebration animations |
| `src/components/shared/level-up-overlay.tsx` | Global level-up celebration overlay (mounted in layout) |
| `src/components/shared/header.tsx` | Shared header with nav (Roadmap, Quizzes, Badges, Profile, Check-Ins), mobile hamburger menu, XP display, theme toggle |
| `src/app/page.tsx` | Dashboard: level progress, streak, badge count, check-in prompt, phase cards |
| `src/app/badges/page.tsx` | Badge gallery: 19 badges in 4 categories, earned/locked states, progress hints |
| `src/app/profile/page.tsx` | Profile page: stats grid, badge showcase, domain strengths, study heatmap, share card |
| `src/app/check-ins/page.tsx` | Weekly check-ins: reflection form (+25 XP), star rating, history timeline |
| `src/app/not-found.tsx` | Custom 404 page with sketch aesthetic |
| `src/app/roadmap/page.tsx` | Roadmap overview: phase accordion with week cards |
| `src/app/roadmap/[phase]/[week]/page.tsx` | Week detail: resource checklist with progress tracking |
| `src/app/quiz/page.tsx` | Quiz hub: practice exam card + domain quizzes + weekly quizzes |
| `src/app/quiz/[id]/page.tsx` | Quiz engine: timer, navigation, scoring, domain breakdown; handles practice-exam |
| `src/lib/gamification/practice-exam.ts` | Practice exam: weighted random question selection across 5 domains |
| `src/lib/gamification/badge-checker.ts` | Auto-earn streak badges, badge progress hints |
| `public/architects-playbook.pdf` | 27-page PDF on enterprise LLM architecture patterns (14MB) |

### Gamification System
- **XP:** Variable per resource type (course: 50, docs: 25, video: 30, practice: 40, build: 200, quiz: 75, reading: 25)
- **Levels:** 10 levels from "Curious Beginner" (0 XP) to "AI Master" (12000 XP), with level-up confetti celebration
- **Badges:** 19 badges in 4 categories (streak, knowledge, build, milestone) with gallery at `/badges`
- **Streak badges:** Auto-earned at 3/7/30 day streaks
- **Streaks:** Daily study streak with multiplier (1x base, 1.5x at 7+ days, 2x at 30+ days)
- **Quiz scores:** Best score tracked per quiz, 90%+ = "Mastered"
- **Badge earned dates:** Tracked in `badgeEarnedDates` field in progress data
- **Weekly check-ins:** +25 XP per check-in, stored in `weeklyCheckIns` array in progress data

### Roadmap Structure
- **Phase 1 (W1-6):** AI Foundations
- **Phase 2 (W7-12):** Developer Skills
- **Phase 3 (W13-18):** Architect Exam Sprint (Claude Certified Architect)
- **Phase 4 (W19-22):** Production AI & LLMOps
- **Phase 5 (W23-26):** Portfolio & Career

### Quiz System
- **5 Domain Quizzes:** Map to Claude Certified Architect exam domains (D1-D5)
- **Practice Exam:** Full mock at `/quiz/practice-exam` — 30 weighted questions (D1:8, D2:6, D3:6, D4:6, D5:4), 45 min, 72% pass, randomized each attempt
- **Weekly Quizzes:** Tied to weekly topics, linked from roadmap resources
- **Placeholder quizzes:** Have `questions: []` — show "Coming Soon" UI instead of "not found"
- Quiz resources in roadmap use internal `/quiz/week-{N}` or `/quiz/domain-{N}` URLs
- Internal quiz URLs use `<Link>` (in-app navigation), external URLs use `<a target="_blank">`

### Claude Certified Architect Exam
- 5 domains, 30 task statements, 6 scenario-based questions, 720/1000 to pass
- Domain weights: D1 Agentic Architecture (27%), D2 Tool Integration (19%), D3 Claude Code (19%), D4 Prompt Engineering (20%), D5 Context Management (15%)
- Exam registration: https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request

## External Resources Linked
- **Anthropic Skilljar:** Deep-linked to specific course pages (e.g., `anthropic.skilljar.com/page/claude-101`). Cannot be iframe-embedded.
- **claudecertifications.com:** Deep-linked to domain pages, practice questions, and exam guide (e.g., `/claude-certified-architect/domains/agentic-architecture`)
- **Anthropic docs:** Agent SDK, tool use, Claude Code, monitoring/evaluation
- **Architect's Playbook:** Hosted locally at `/architects-playbook.pdf` (no public URL exists)
- **DeepLearning.AI, Coursera, HuggingFace, Pinecone, LangChain, Streamlit** courses/docs linked in later weeks

## Completed Sprints
1. **Sprint 1:** MVP dashboard, roadmap, gamification (XP, levels, streaks, badges)
2. **Sprint 2:** Sketch design system, persistent progress (localStorage), theme toggle
3. **Sprint 3:** Quiz engine with timer, scoring, domain breakdown, confetti rewards
4. **Sprint 3.5:** Data quality fixes — deep-linked all resources, added quiz URLs to roadmap, placeholder quizzes with "Coming Soon" UI, restructured weeks 17-18/23-24, added Architect's Playbook PDF
5. **Sprint 4:** Badges gallery (`/badges`), level-up confetti celebration, practice exam simulator (`/quiz/practice-exam`), streak badge auto-earn, badge earned date tracking
6. **Sprint 5:** Profile page (`/profile`), weekly check-ins (`/check-ins`), mobile hamburger menu, responsive quiz fixes, dashboard check-in prompt, custom 404, enhanced SEO metadata
7. **Sprint 7:** Supabase migration — anonymous auth, `user_progress` JSONB table, RLS policies, hybrid localStorage+Supabase storage, data migration path for existing users

## Supabase Architecture
- **Anonymous auth:** `supabase.auth.signInAnonymously()` on first visit — stable UUID per browser, no sign-up required. Sprint 8 will promote to real accounts via Supabase identity linking.
- **Table:** `public.user_progress` — single JSONB `data` column stores full `ProgressData`. RLS: users can only access their own row.
- **Hybrid storage:** localStorage = instant synchronous reads (offline cache). Supabase = persistent backend. On mutations: write localStorage first (instant) + fire-and-forget Supabase upsert via `syncProgressToSupabase()`.
- **Key files:** `src/lib/supabase/client.ts`, `src/lib/supabase/database.types.ts`, `src/lib/store/supabase-sync.ts`
- **Anonymous auth must be enabled** in Supabase dashboard: Authentication → Providers → Anonymous → Enable

## Upcoming Work
- **Auth + payments:** Real user accounts (email/password), one-time purchase gate (product will be sold). Supabase anonymous sessions link to real accounts — UUID preserved.
- **Content:** Fill in placeholder quiz questions (weeks 4, 7, 9, 10, 12, 17, 19)
- **Public profiles:** Shareable public URLs (requires auth + database)

## Conventions
- Commit messages: `feat:` prefix for features/enhancements, `fix:` for bug fixes
- No test suite yet (planned)
- All resource IDs follow `w{week}-{n}` pattern (e.g., `w13-5`), quiz IDs use `w{week}-q`
- "Build" type resources intentionally have no URL (they're things you build yourself)
- Optional resources are separated with a "Bonus Resources" divider in week pages
