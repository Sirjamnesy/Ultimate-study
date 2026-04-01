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
- **Persistence:** localStorage (Supabase planned for later)
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
| `src/components/shared/confetti.tsx` | Confetti + XP toast animations |
| `src/components/shared/header.tsx` | Shared header with nav, XP display, theme toggle |
| `src/app/page.tsx` | Dashboard: level progress, streak, phase cards, recent activity |
| `src/app/roadmap/page.tsx` | Roadmap overview: phase accordion with week cards |
| `src/app/roadmap/[phase]/[week]/page.tsx` | Week detail: resource checklist with progress tracking |
| `src/app/quiz/page.tsx` | Quiz hub: domain quizzes + weekly quizzes grid |
| `src/app/quiz/[id]/page.tsx` | Quiz engine: timer, question navigation, scoring, domain breakdown |
| `public/architects-playbook.pdf` | 27-page PDF on enterprise LLM architecture patterns (14MB) |

### Gamification System
- **XP:** 10 XP per resource type (course, docs, video, practice, build, quiz, reading)
- **Levels:** 10 levels from "Curious Explorer" (0 XP) to "AI Architect" (12000 XP)
- **Badges:** 20+ badges earned by completing weeks
- **Streaks:** Daily study streak with multiplier
- **Quiz scores:** Best score tracked per quiz, 90%+ = "Mastered"

### Roadmap Structure
- **Phase 1 (W1-6):** AI Foundations
- **Phase 2 (W7-12):** Developer Skills
- **Phase 3 (W13-18):** Architect Exam Sprint (Claude Certified Architect)
- **Phase 4 (W19-22):** Production AI & LLMOps
- **Phase 5 (W23-26):** Portfolio & Career

### Quiz System
- **5 Domain Quizzes:** Map to Claude Certified Architect exam domains (D1-D5)
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
4. **Sprint 3.5 (current):** Data quality fixes — deep-linked all resources, added quiz URLs to roadmap, placeholder quizzes with "Coming Soon" UI, restructured weeks 17-18/23-24, added Architect's Playbook PDF

## Upcoming Work
- **Sprint 4:** Badges gallery UI, confetti on level-up, practice exam simulator, AI study buddy chat
- **Sprint 5:** Public profiles, weekly check-ins, mobile polish, final deploy
- **Supabase migration:** Replace localStorage with real database
- **Content:** Fill in placeholder quiz questions (weeks 4, 7, 9, 10, 12, 17, 19)

## Conventions
- Commit messages: `feat:` prefix for features/enhancements, `fix:` for bug fixes
- No test suite yet (planned)
- All resource IDs follow `w{week}-{n}` pattern (e.g., `w13-5`), quiz IDs use `w{week}-q`
- "Build" type resources intentionally have no URL (they're things you build yourself)
- Optional resources are separated with a "Bonus Resources" divider in week pages
