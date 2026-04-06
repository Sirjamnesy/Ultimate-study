@AGENTS.md

# Ultimate Study — AI Engineering Learning Hub

## What This Is
A 26-week gamified study roadmap web app for becoming an AI Engineer, with a focus on the **Claude Certified Architect** exam. Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and Framer Motion.

**Live:** https://ultimatestudy.xyz (also: https://ultimate-study-nu.vercel.app/)
**Repo:** https://github.com/Sirjamnesy/Ultimate-study.git

## Tech Stack
- **Framework:** Next.js 16.2.1 (App Router, `use(params)` for async params)
- **React:** 19.2.4
- **Styling:** Tailwind CSS v4, shadcn/ui (base-nova style)
- **Animations:** Framer Motion
- **Fonts:** Google Fonts — Geist (body), Geist Mono (code), Caveat (sketch headings via `font-sketch` class)
- **Persistence:** Supabase (anonymous auth → real accounts + JSONB table) + localStorage cache
- **Database:** Supabase project `ultimate-study` (id: `jsxpvmrsfpqymwjxnxqn`, region: eu-west-1)
- **Payments:** Paystack (one-time purchase, NGN ₦20,000 / USD $15) — pending account activation
- **Domain:** ultimatestudy.xyz (purchased on Vercel, DNS managed by Vercel)
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
| `src/lib/data/quiz-questions.ts` | Quiz definitions: 5 domain quizzes + all weekly quizzes (fully populated — no more placeholders) |
| `src/components/shared/progress-provider.tsx` | Global progress context: XP, completed resources, streaks, badges, quiz scores. Handles Supabase anon auth + hybrid sync on mount |
| `src/components/shared/confetti.tsx` | Confetti, XP toast, and LevelUpCelebration animations |
| `src/components/shared/level-up-overlay.tsx` | Global level-up celebration overlay (mounted in layout) |
| `src/components/shared/header.tsx` | Shared header: nav (Roadmap, Quizzes, Check-Ins, Profile), mobile hamburger menu, XP display, theme toggle |
| `src/app/page.tsx` | Dashboard: level progress, streak, badge count, check-in prompt, phase cards |
| `src/app/badges/page.tsx` | Badge gallery: 19 badges in 4 categories, earned/locked states, progress hints |
| `src/app/profile/page.tsx` | Profile page: stats grid, badge showcase, domain strengths (full labels, compact bar), study heatmap, share card |
| `src/app/check-ins/page.tsx` | Weekly check-ins: reflection form (+25 XP), star rating, history timeline |
| `src/app/not-found.tsx` | Custom 404 page with sketch aesthetic |
| `src/app/roadmap/page.tsx` | Roadmap overview: phase accordion with week cards |
| `src/app/roadmap/[phase]/[week]/page.tsx` | Week detail: resource checklist with progress tracking |
| `src/app/quiz/page.tsx` | Quiz hub: practice exam card + domain quizzes + weekly quizzes |
| `src/app/quiz/[id]/page.tsx` | Quiz engine: timer, navigation, scoring, domain breakdown; handles practice-exam |
| `src/lib/gamification/practice-exam.ts` | Practice exam: weighted random question selection across 5 domains |
| `src/lib/gamification/badge-checker.ts` | Auto-earn streak badges, badge progress hints |
| `src/lib/supabase/client.ts` | Supabase browser client singleton (typed with Database generic) |
| `src/lib/supabase/database.types.ts` | Auto-generated Supabase TypeScript types |
| `src/lib/store/progress.ts` | localStorage store: ProgressData type, all synchronous read/write functions |
| `src/lib/store/supabase-sync.ts` | Async Supabase helpers: `fetchProgressFromSupabase()`, `syncProgressToSupabase()` |
| `src/proxy.ts` | Route protection: PAID_ROUTES → paid users only, AUTH_ROUTES → real accounts only, PUBLIC_ROUTES → always open |
| `src/lib/auth/helpers.ts` | Auth helpers: `promoteAnonymousUser`, `signIn`, `signInWithGoogle`, `signOut`, `sendPasswordReset`, `updatePassword`, `resendConfirmationEmail` |
| `src/lib/supabase/server.ts` | Server-side Supabase client (`createServerSupabaseClient`) using cookies via `@supabase/ssr` |
| `src/lib/supabase/purchases.ts` | Server-only: `hasUserPaid()`, `redeemInviteCode()` using service-role client |
| `src/lib/paystack.ts` | Paystack API: `initializeTransaction`, `verifyTransaction`, `verifyWebhookSignature` |
| `src/app/(auth)/login/page.tsx` | Login: email/password + Google OAuth + unconfirmed-email resend banner + forgot password link |
| `src/app/(auth)/signup/page.tsx` | Signup: promotes anon → real account, invite code redemption, check-your-email screen |
| `src/app/(auth)/forgot-password/page.tsx` | Forgot password: sends reset email via `resetPasswordForEmail` |
| `src/app/(auth)/reset-password/page.tsx` | Reset password: processes PASSWORD_RECOVERY token, sets new password |
| `src/app/checkout/page.tsx` | Checkout: NGN/USD price picker + invite code redemption |
| `src/app/payment/callback/page.tsx` | Post-payment: verifies Paystack reference with retry logic, shows confetti on success |
| `src/app/payment/cancelled/page.tsx` | Payment cancelled gracefully |
| `src/app/api/checkout/route.ts` | POST: initializes Paystack transaction, returns authorization_url |
| `src/app/api/webhooks/paystack/route.ts` | POST: handles `charge.success`, records purchase, marks user paid |
| `src/app/api/verify-payment/route.ts` | GET: verifies payment by reference (post-redirect fallback) |
| `src/app/api/redeem-invite/route.ts` | POST: validates + redeems invite code, marks user paid |
| `src/components/shared/landing-page.tsx` | Sales/landing page for unauthenticated or anonymous visitors |
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
- **Weekly Quizzes:** All 12 weekly quizzes fully populated — no more "Coming Soon" placeholders
  - Weeks 1, 2, 3, 5, 6, 8, 11: 2-3 questions each
  - Weeks 4, 7, 9, 10, 19: 5 questions each (7 min)
  - Week 12 (Phase 2 Capstone): 10 questions (15 min, 65% to pass)
  - Week 17 (Cross-Domain Scenarios): 12 scenario-based questions (20 min, 70% to pass)
- Quiz resources in roadmap use internal `/quiz/week-{N}` or `/quiz/domain-{N}` URLs
- Internal quiz URLs use `<Link>` (in-app navigation), external URLs use `<a target="_blank">`

### Claude Certified Architect Exam
- 5 domains, 30 task statements, 6 scenario-based questions, 720/1000 to pass
- Domain weights: D1 Agentic Architecture (27%), D2 Tool Integration (19%), D3 Claude Code (19%), D4 Prompt Engineering (20%), D5 Context Management (15%)
- Exam registration: https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request

## External Resources Linked
- **Anthropic Skilljar:** Deep-linked to specific course pages (e.g., `anthropic.skilljar.com/page/claude-101`). Cannot be iframe-embedded.
- **claudecertifications.com:** Deep-linked to domain pages, practice questions, and exam guide
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
8. **Sprint 6:** Quiz content — filled all 7 placeholder quizzes with 47 new questions (W4, W7, W9, W10, W12, W17, W19). No more "Coming Soon" quizzes.
9. **Sprint 8:** Auth + Payments — real accounts (email/password + Google OAuth), anonymous→real account promotion preserving progress UUID, Paystack one-time payment (NGN/USD), route protection via `proxy.ts`, landing page for unauthenticated visitors, invite code system, email confirmation UX (check-your-email screen + resend), password reset flow (`/forgot-password` + `/reset-password`), sign-out→new-anon-session flow, React hooks violation fix on home page. Domain `ultimatestudy.xyz` purchased and live. Paystack pending account verification.

## Supabase Architecture
- **Anonymous auth:** `supabase.auth.signInAnonymously()` on first visit — stable UUID per browser, no sign-up required. Promoted to real account via `updateUser({ email, password })` on signup (preserves UUID + all progress data).
- **Table:** `public.user_progress` — single JSONB `data` column stores full `ProgressData`. RLS: users can only access their own row.
- **Table:** `public.purchases` — records completed Paystack transactions. Columns: `user_id`, `paystack_reference` (UNIQUE), `amount_kobo`, `currency`, `status`.
- **Table:** `public.invite_codes` — `code` (PK), `max_uses`, `used_count`. Managed manually in Supabase Table Editor.
- **Functions:** `mark_user_paid(uuid)`, `mark_user_admin(uuid)` — write `has_paid`/`is_admin` to `raw_app_meta_data` so JWT reflects access.
- **Hybrid storage:** localStorage = instant synchronous reads (offline cache). Supabase = persistent backend. On mutations: write localStorage first (instant) + fire-and-forget Supabase upsert via `syncProgressToSupabase()`.
- **Session cookies:** Browser client uses `createBrowserClient` from `@supabase/ssr` with `flowType: 'implicit'` — stores session in cookies (readable by server-side proxy). Do NOT use `createClient` from `@supabase/supabase-js` — it uses localStorage which is invisible to the proxy.
- **Env vars required:**
  - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, set in Vercel
  - `SUPABASE_SERVICE_ROLE_KEY` — server-only, set in Vercel (used by webhook + invite redemption)
  - `PAYSTACK_SECRET_KEY` + `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — set when Paystack account verified
  - `NEXT_PUBLIC_APP_URL` — set to `https://ultimatestudy.xyz`

## Auth Flow (Sprint 8)
1. New visitor → anonymous session created automatically (`signInAnonymously`)
2. Visitor sees landing page (`<LandingPage />`) — dashboard hidden behind `hasPaid` check
3. Signup → `updateUser({ email, password })` promotes anon → real account (same UUID, progress preserved) → check-your-email screen
4. Google OAuth → `signInWithGoogle()` uses `linkIdentity()` for anon sessions (preserves UUID), `signInWithOAuth()` for new users → `/auth/callback` processes token → `/checkout` or dashboard
5. Checkout → Paystack hosted page → webhook fires `charge.success` → `mark_user_paid` → JWT updated → dashboard unlocked
6. Invite code → redeemable on signup page or checkout page → `mark_user_paid` → instant access
7. Sign out → new anonymous session auto-created (progress-provider `onAuthStateChange` handler)
8. Password reset → `resetPasswordForEmail` → link to `/reset-password` → `PASSWORD_RECOVERY` token → `updateUser({ password })`

## ProgressData type
```typescript
type ProgressData = {
  completedResources: string[];
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  dailyLog: string[];
  earnedBadges: string[];
  badgeEarnedDates: Record<string, string>;
  currentWeek: number;
  quizResults: QuizResult[];
  weeklyCheckIns: WeeklyCheckIn[];
};
```

## Upcoming Work (Post Sprint 8)
- **Paystack go-live:** Add `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_APP_URL` to Vercel env vars. Set webhook URL in Paystack dashboard: `https://ultimatestudy.xyz/api/webhooks/paystack`
- **Email branding:** Deferred until first paying customer. Currently using Supabase default emails (`noreply@mail.supabase.io`). When ready: set up Resend (free, 3k/mo) → configure custom SMTP in Supabase (Auth → SMTP Settings: host `smtp.resend.com`, port 465, user `resend`, password = Resend API key) → design branded confirmation + reset email templates in Supabase (Auth → Email Templates). Note: email confirmation UX code (check-your-email screen, resend buttons) is already built and works with any SMTP.
- **Public profiles:** Shareable `/profile/[userId]` read-only view — level, XP, badges, domain strengths
- **AI tutor:** Claude-powered Q&A for exam prep (requires Anthropic API key)

## Conventions
- Commit messages: `feat:` prefix for features/enhancements, `fix:` for bug fixes
- No test suite yet (planned)
- All resource IDs follow `w{week}-{n}` pattern (e.g., `w13-5`), quiz IDs use `w{week}-q`
- Question IDs follow `w{week}q-{n}` pattern (e.g., `w4q-1`), domain question IDs use `d{domain}-{n}`
- "Build" type resources intentionally have no URL (they're things you build yourself)
- Optional resources are separated with a "Bonus Resources" divider in week pages
