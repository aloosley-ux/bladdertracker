# BladderTracker Revival Plan

**Goal:** ship BladderTracker free-to-use (FOC) for families like ours, with boring,
standard UI instead of bespoke custom components. Solid foundations stay; custom UI
goes; everything becomes maintainable by AI agents working in small verified steps.

**How to use this file:** work through tasks IN ORDER. One task per agent session.
Paste the task's "Agent prompt" block into your coding agent (Copilot/Claude/Hermes).
After each task: run the Definition of Done yourself, review the diff, commit.

---

## Ground rules (apply to every task)

- One task per session. If the agent wants to expand scope, stop it and split the work.
- Definition of Done for every task, run before committing:
  ```
  npm run lint
  npm run build
  npx tsc --project tsconfig.api.json --noEmit
  npm test        # must be green (129 pass / 1 skip minimum)
  ```
- Backend API shapes (api/*.ts, DB schema) must not change during UI phases unless
  the task explicitly says so.
- UI copy lives in `src/content/presentation.ts` — never hardcoded in components.
- No new npm dependencies unless the task explicitly names one and justifies it.
- Every commit message references the task ID (e.g. `P1.2: ...`).

---

## Phase 0 — Decisions (already made, recorded here)

| Question | Decision |
|---|---|
| Who is this for? | Families of SEND kids who need simple routine tracking. Free, no account cost. Our own family dogfoods it. |
| Custom UI? | Retire it. Standard component-library look (shadcn/ui defaults). |
| Themes? | Replace the bespoke 3-theme CSS-var system with shadcn's theme variables. Keep light + dark; re-add high-contrast as a proper third palette later if wanted. |
| Timeline? | No deadline. Small sessions, steady progress. |

---

## Phase 1 — Protect and clean (each task ≈ one evening)

### P1.1 — License file
The README implies MIT but there is no LICENSE file. FOC shipping needs one.

**Agent prompt:**
```
Add a MIT LICENSE file to this repository, copyright Aaron Loosley 2026.
Confirm README license wording matches MIT exactly (search for "MIT" and
"License" in README.md and fix any inconsistency, including package.json
license field). Run the project Definition of Done. Do not change anything else.
```

### P1.2 — Happy-path E2E safety net (do before any UI work)

**Agent prompt:**
```
Install Playwright (@playwright/test) as a devDependency and configure it for
this Vite React app (playwright.config.ts, chromium only). Justification for
the new dependency: we are about to refactor all UI pages and need an
end-to-end regression net; unit tests mock too much to catch broken flows.

Write ONE spec, e2e/happy-path.spec.ts, covering:
1. Register a parent account and log in (local mode if auth allows, otherwise
   against a locally started dev server — check src/utils/auth.ts and
   api/auth.ts for how local vs cloud mode works, prefer whatever needs no
   external service).
2. Add a child profile.
3. Log one drink entry for that child.
4. Assert the entry appears on the dashboard/log for today.
5. Log out.

Add "test:e2e" script to package.json. Make sure `npm test` (vitest) still
passes untouched. Update AGENTS.md Definition of Done to include
`npm run test:e2e`. Do not modify application source code.
```

### P1.3 — Security smell fixes

**Agent prompt:**
```
Two security fixes, backend only:

1. Admin promotion currently uses a query parameter (?admin-access=<key>),
   which leaks into logs and browser history. Find it (grep for admin-access),
   switch to reading the key from the x-admin-key request header, update the
   frontend caller(s) to send the header, and update docs/API.md.

2. Child date of birth is stored as VARCHAR. Find the schema definition
   (api/_lib or migrate.ts), change it to a proper DATE/timestamp type via a
   migration that converts existing values, and fix any TS types that assume
   string. Ensure CSV export/import still round-trips dates correctly
   (there are existing tests — keep them green, extend them if needed).

Update docs/API.md and GDPR.md if data handling wording changes. Run the
Definition of Done.
```

### P1.4 — README diet

**Agent prompt:**
```
README.md is ~47KB of marketing-density documentation. Restructure:

1. Create docs/Product-Guide.md and move these sections out of README verbatim:
   "What you can do today", "Features", "Expand Entries", "Product & UX
   principles", "Milestone Tracking", "Theme System", full API reference,
   "Clinical & Market Benchmarking", "Vercel & Neon Optimization",
   "UI Design Principles".
2. Rewrite README.md to max ~150 lines: one-paragraph pitch, screenshot
   placeholder, feature list as short bullets, quick-start (local dev +
   deploy), links into docs/ (including REPO_STATUS.md as authoritative for
   remaining work), Testing section, License, AI-Assisted Development section.
3. Fix every internal link that pointed to README sections so they point to
   the new docs files.
Do not invent new claims. Run the Definition of Done (docs-only changes but
build must stay green).
```

### P1.5 — FOC ship checklist

**Agent prompt (may need human input midway):**
```
Prepare the app for free public use. Work through this checklist and report
status of each item rather than guessing:

1. Demo mode: can a visitor try the app without signing up? If local-mode
   storage makes this possible, document it on the login page copy (in
   presentation.ts); if not, propose the smallest possible "try demo" path.
2. Verify the PWA installs on Android Chrome and iOS Safari (vite-plugin-pwa
   config, manifest, icons). Report gaps; implement icon/manifest fixes only.
3. Confirm GDPR.md matches reality after P1.3 changes (dates, admin key).
4. Produce DEPLOY.md: exact steps for Vercel + Neon free tiers, env vars,
   cost caps/limits on both platforms, and what happens when limits are hit.
5. List anything in the repo that would embarrass a public launch (leftover
   TODOs, debug pages, test data seeds) and clean the safe ones.

Do not deploy anything. Human will review DEPLOY.md and do the deploy click.
```

**Phase 1 exit criteria:** LICENSE exists, E2E passes, security smells fixed,
README lean, DEPLOY.md reviewed by Aaron, app deployed free-tier.

---

## Phase 2 — Normalise the UI (one page per session, NO redesigns)

### P2.0 — Foundation: adopt shadcn/ui, retire custom theming (do FIRST)

Everything else in Phase 2 lands on this foundation, so extracted components get
born normal instead of being converted twice.

**Agent prompt:**
```
Introduce shadcn/ui with its DEFAULT neutral theme as this project's component
system (justified new deps: radix primitives come bundled via shadcn CLI;
tailwind-merge + clsx for cn()). Steps:

1. Initialise shadcn per current docs for Tailwind v4 + Vite. Use the default
   zinc/neutral palette. Map its CSS variables onto :root in index.css.
2. RETIRE the bespoke theme system: remove --bg-primary/--bg-card/--text-* etc.
   custom properties, the [data-theme] !important override blocks, and the
   custom palette tokens (lavender-*, peach, sky-light etc.) from index.css
   and tailwind config. Grep for every usage and replace with shadcn tokens
   (bg-background, text-foreground, bg-card, text-muted-foreground, etc.).
   This will touch many files — mechanical replacement, no visual redesign.
3. Keep the dyslexia-friendly font toggle working (Atkinson Hyperlegible) —
   reimplement its persistence against the new setup if needed.
4. Keep light + dark working. Delete the high-contrast theme for now; note in
   docs/ui-rules.md that it returns later as a shadcn palette variant.
5. Replace NOTHING else yet. Existing pages may look slightly different in
   colour/shade — acceptable. Layout and behaviour unchanged.
6. Update docs/ui-rules.md to describe the new system. Run Definition of Done
   plus the new e2e suite.
```

### P2.1–P2.7 — Page-by-page decomposition + component swap

Run these in order (worst offenders first). Same prompt template each time —
swap the page name. One page per session.

**Prompt template:**
```
Refactor src/pages/SettingsPage.tsx using the shadcn/ui system set up in
commit <P2.0-sha>. Rules:

1. Extract every distinct widget/section into src/components/settings/,
   logic into src/hooks/ where reusable. Target: page file under 200 lines
   that mostly composes components.
2. Where the page uses hand-rolled UI (custom toggle switches, modals,
   dropdowns, tab bars, celebration/banner components), replace with the
   shadcn equivalent (Switch, Dialog, Select, Tabs). Delete replaced custom
   components from src/components/ once nothing imports them.
3. Behaviour, routes, data flow, and copy (presentation.ts) stay identical.
   This is a refactor, not a redesign. When in doubt, match current behaviour.
4. All tests must keep passing; add component tests for extracted pieces
   where the old page had coverage.
5. Accessibility: interactive elements keep ARIA labels and keyboard support
   (shadcn gives most of this free — verify, don't assume).
6. Update docs/MODULES.md if user-facing settings behaviour is described there.

Definition of Done: lint, build, tsc api check, vitest, e2e — all green.
Commit as "P2.x: decompose SettingsPage to standard components".
```

Page order: SettingsPage (903 lines) → DashboardPage (639) → LogPage (625) →
LeapsPage (623) → ReportsPage (484) → ProfilesPage (455) → MilestonesPage (446).

Likely custom-component deletion candidates to watch for along the way:
CelebrationBanner, BrandIcon, BrandBanner, custom stat-card ring styles,
rounded-2xl card grids — replace with plain shadcn Card. Delete each file only
when grep shows zero importers, and remove its test file with it.

**Phase 2 exit criteria:** no page over ~250 lines, zero custom-styled widgets
left (grep for old palette tokens returns nothing), all suites green, app looks
like a normal modern web app instead of a generated art project 😄

---

## After Phase 2 (parked, not planned)

- Re-add high-contrast theme as shadcn palette variant (SEND accessibility win)
- Real-user feedback round (r/autism_parenting style communities, friends)
- THEN the fun feature/UI ideas, landing on clean components

## Progress log

| Date | Task | Commit | Notes |
|---|---|---|---|
| 2026-08-25 | Pre-work cleanup | 5dd39f2 | junk removed, integration test gated, suite green |
