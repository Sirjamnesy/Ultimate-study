# Handoff: Ultimate Study → AI learning hub (brand, paywall, landing page)

Written 2026-10-17 so a new session can pick this up cold. Read this file first, then `CLAUDE.md`.
Nothing in the "hub overhaul" below has been built yet. We were in **discussion mode**.

## 0. Where the code stands

- Branch: `claude/nifty-hypatia-hou8me` (pushed). **No PR opened, nothing merged to `main`, nothing in production.** Only a Vercel preview exists.
- Latest commits on the branch:
  - `9881888` admins can preview any product in the library
  - `b667ef6` form-based course builder replaces the raw JSON box
  - `a469125` header nav grouped into Shop / Account dropdowns
  - earlier: Sprint 9 marketplace (products, library, admin, geo-currency, updates feed, Mascot scaffold), design-taste skill install
- Working tree was clean before this handoff doc and the preview copies were added.
- Not verified by me (needs the owner's logged-in Google session): the admin dashboard on the real preview. Real purchases cannot be tested: Paystack is still pending activation.

## 1. What the owner wants (their words, condensed)

Ultimate Study began as a study tool for the Claude Certified Architect exam. They now want a **general hub for AI content**: courses, brochures/PDFs, learning material, plus a "what's new in AI" billboard. The Architect programme **remains the biggest product and stays prominent on the homepage**.

Specific asks:
1. **Remove the paywall.** It feels too imposing for a hub.
2. A billboard / banner / ticker / carousel for updates and "what's new in AI", clickable, possibly linking to the brand's **Instagram** (which will be built in parallel).
3. Build a **consistent brand identity** across website and social, probably in **Claude Design**, before/while redesigning the site.
4. **Leave purple.** It has an "AI slop" stigma. Pick a better palette.
5. They cannot decide from words; they need visuals. Hence the three previews below.
6. They like **A** best, and also like **C**.
7. They can use Opus 5.5 subagents in this kind of session (the Agent tool takes `model: "opus"`; a separate session can be started on `claude-opus-5-5`).

## 2. The three landing-page previews (built by Opus subagents)

All three are standalone HTML mocks, **not wired into the app**. Open `index.html` directly in a browser. They are saved in `docs/handoff/landing-previews/{A,B,C}/`. B needs its `assets/` folder next to it.
Screenshots (full-page desktop/mobile) were sent in chat but not committed; regenerate with Playwright if needed.

| | Direction id | Idea | Palette | Type |
|---|---|---|---|---|
| **A** | `colour-chapters` | Exam domain weights (27/19/19/20/15) set the heights of five full-bleed colour bands | white `#fff`, black `#000`, grey `#c5c5c5`, mint `#a7ff9c`, orange `#ff6831`, deep green `#0d5c3a` | Rubik 400/500/600 |
| **B** | `editorial-report` | A candidate's briefing document / printed annual; 26 weeks as a table of contents; 720/1000 and the weights as margin notes | sand `#e6dbc7`, darker sand `#ddd0b9`, cobalt `#062b8a`, light cobalt `#3a5aa8` | Literata |
| **C** | `loud-flat-poster` | The pass mark "720" is the hero; blunt countable claims ("Get to 720 in 26 weeks") | bone `#e6e0d2`, ink `#1a1a1a`, green `#18bc42`, coral `#ed4b44`, yellow `#f2c21a` | Epilogue 900/400/500 |

Each has: hero, five weighted domains, 26-week/5-phase path, a live answerable quiz question built from real repo data, an app-UI card, pricing (₦20,000 / $15), FAQ, final CTA, footer. No purple anywhere.

Notes per preview:
- **A:** headline changes colour at the black/orange seam (two stacked copies; the inspector flags this as "covered text" but nothing is covered). Mint/orange double as right/wrong. Rubik is friendlier than B/C.
- **B:** imagery is greyscale crops of the project's own Architect's Playbook PDF, because open image archives were blocked by the sandbox proxy. Most "serious/credible".
- **C:** loudest; 11 font sizes (inspector warns above 9); the hero card sits under the headline rather than overlapping it (the skill forbids covering a headline).
- **Placeholder content in all three:** XP/level/streak/badge counts and practice-exam scores are invented samples. FAQ wording and a "not affiliated with Anthropic" line need owner confirmation.
- A and C's flat-colour, heavy-type look also translates well to Instagram tiles. B's printed-report look is harder to carry to social.

**Verdict so far:** owner leans **A as the structure, with C's heavy poster type** for the hero and the billboard. Not final; brand identity may change the palette.

## 3. Facts to correct (found by the subagents)

- **Phase weeks in `CLAUDE.md` and in my brief were wrong.** The real data in `src/lib/data/roadmap.ts`: Phase 1 = weeks 1-4 ("AI Foundations"), Phase 2 = weeks 5-12 ("AI Engineering Deep Dive"), Phase 3 = 13-18 ("Architect Exam Sprint"), Phase 4 = 19-22, Phase 5 = 23-26. All three previews used the wrong 1-6 / 7-12 split. **To do:** fix `CLAUDE.md` ("Roadmap Structure") and the previews when one is ported.
- **Resource count:** the current landing page says "200+ curated resources"; `roadmap.ts` has **150**. Use 150 or compute it from data.
- Trademark/affiliation: the product uses the "Claude Certified Architect" name. A visible "independent, not affiliated with Anthropic" line matters more as this becomes a brand.

## 4. Strategy discussed (my recommendations, awaiting the owner's decisions)

### 4a. Paywall
Paystack is not live, so (as far as we know) nobody has paid; removal costs nothing now and is reversible. Keep the checkout / `has_paid` / invite-code code dormant, do not delete it. Three options:
1. **All free** (max growth, no revenue except the shop).
2. **Free to enter, pay for depth** (**recommended**): roadmap, quizzes, progress free; specific products paid (Playbook PDF, full practice-exam bank, future courses, the AI tutor). Matches the Sprint 9 shop. The AI tutor costs real API money per student, so it is a natural paid feature.
3. **Architect becomes just another shop product.**

Anonymous accounts already work, so signup becomes "save your progress", not a gate.
Technical shape (verify before building): `src/proxy.ts` `PAID_ROUTES` → open or auth-only; landing page pricing section removed; "Get started" → "Start free"; `/checkout` and `hasPaid` gating on the dashboard relaxed. Whole-app `purchases` / `mark_user_paid` stays untouched.

### 4b. Hub homepage
Base on A's colour-chapters structure; each chapter has a job: (1) Architect flagship (keeps the domain-weights idea), (2) shop: courses & PDFs, (3) what's new in AI billboard, (4) community / Instagram. Borrow C's heavy poster type for hero and billboard. Pricing section goes.

### 4c. "What's new in AI" billboard
Two different things: (i) Ultimate Study product updates (already built: `/updates`, `src/lib/data/updates.ts`, `updates` table) and (ii) curated AI news that links out or to Instagram posts.
- Display: a **slow headline ticker** (pauses on hover, respects `prefers-reduced-motion`) plus one featured card. Avoid an auto-rotating carousel (poor engagement and accessibility).
- Source: **manual** (admin posts items), **automatic** (RSS), or **semi-automatic (recommended)**: Claude drafts items from trusted feeds into an approval queue; needs an Anthropic API key and costs a little per run.
- Instagram: treat as a pipeline: one admin item produces both the site card and an on-brand Instagram image from the same template, cross-linked. Linking is easy; embedding live posts is restricted by Meta.
- Risk: a stale feed looks worse than none. Hide items after N days. Real cost is a posting cadence of a few items per week.
- Likely data model change: add a `kind` ('product' | 'ai-news'), `link_url`, optional image to the `updates` table via a new `supabase/migrations/*.sql` applied with the Supabase MCP `apply_migration`.

### 4d. Brand identity (before the site)
Do brand first so the site and Instagram share one system; the three previews each chose a palette in isolation. Scope: name (is "Ultimate Study" too exam-centric for an AI hub? also domain `ultimatestudy.xyz` and Instagram handle), logo/wordmark, palette (no purple), type, **mascot** (still placeholder: `<Mascot />` falls back to the Zap mark until SVGs land in `public/mascot/` and `ARTWORK_READY` is flipped), voice, social templates (carousel, news card, story, link-preview image).
Tooling: the owner proposes **Claude Design**. In this session the tool list showed an Artifact "design" type and a Vercel `import-claude-design-from-url` tool; how exactly to bring a Claude Design back into code was **not tested**: confirm when we get there. The owner leads the identity work; the agent supplies facts and a brief.

### 4e. Suggested order
1. **Free access** (small, safe, independent of design; ship as its own change).
2. **Brand identity** in Claude Design.
3. **Hub homepage** (A + C type, Architect flagship, shop, billboard placeholder).
4. **Updates / AI-news billboard** + Instagram link-up.
5. **App interior re-skin** to the new brand (the app still uses the violet sketch/notebook look; the design skill excludes app screens, so this is a separate pass).

## 5. Open questions for the owner (answer these to continue)

1. Paywall: all free, **free to enter + pay for depth (recommended)**, or Architect as a shop product?
2. AI news source: manual, automatic, or **semi-automatic (recommended)**?
3. Brand identity (name, mascot, palette) in Claude Design **before** touching the homepage? (recommended: yes)
4. Do the free-access change **now**, since it does not depend on the design? (recommended: yes)
5. Final pick for the homepage look: A (leaning), A + C type, or something else, once brand direction exists.
6. Keep or drop the sample numbers on the landing page (swap for clearly labelled examples or remove).

## 6. Other outstanding items (not part of this overhaul)

- Open a PR and merge `claude/nifty-hypatia-hou8me` to production **only when the owner says so**.
- Paystack go-live: keys in Vercel (`PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_APP_URL`), webhook `https://ultimatestudy.xyz/api/webhooks/paystack`.
- Owner to confirm the logged-in admin dashboard on the preview.
- Known gap: `/library` list shows only owned products; admins use the "Preview" links in `/admin/products`.
- Pre-existing lint debt (5 `react-hooks/set-state-in-effect` errors) documented in `CLAUDE.md`.
- Mascot artwork, email branding (Resend), public profiles, AI tutor: see `CLAUDE.md` "Upcoming Work".

## 7. Practical notes for the next session

- Supabase project `ultimate-study` (id `jsxpvmrsfpqymwjxnxqn`, eu-west-1). `.env.local` is gitignored and must be recreated (public Supabase URL + anon key + `NEXT_PUBLIC_APP_URL=http://localhost:3000`). The service-role key is never available to the agent.
- The design skill (`.claude/skills/design-taste-frontend/`) needs Chrome as root with `--no-sandbox`: create a wrapper script and point `CHROME_PATH` at it (recipe in `CLAUDE.md`). Run `draw.mjs` from a per-job folder so parallel runs don't collide on `.taste-skill/`. Open image archives are blocked by the sandbox proxy.
- `pkill -f "next dev"` can kill the agent's own shell (exit 144); use bracketed patterns like `[n]ext-server`.
- Next.js here is a newer major with breaking changes (`AGENTS.md`): read `node_modules/next/dist/docs/` before writing Next code; `params` is a Promise; middleware file is `src/proxy.ts`.
- Subagents: the Agent tool's `model` accepts `"opus"`; forks inherit the parent model. Only spawn when the owner asks.

## 8. Prompt to paste into the new session

> Read `docs/handoff/2026-10-17-hub-overhaul.md` and `CLAUDE.md`. We are in discussion mode on the Ultimate Study hub overhaul. Here are my answers to section 5: (1) … (2) … (3) … (4) … (5) … (6) …. Then propose the first concrete step and wait for my go-ahead before building.
