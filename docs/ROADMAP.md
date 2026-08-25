# BladderTracker Revival Roadmap

**Goal:** ship a free-for-everyone version of EveryStep (formerly BladderTracker) with
standard UI, proper engineering, and a public portfolio piece that shows the world what
you can build.

**The rule of this roadmap:** you *do* every task. Cortana guides, reviews, and pushes —
you learn by doing it right the first time, with guardrails that catch mistakes before
they go public.

---

## Phase 0 — Foundation (DONE)
Everything in P1.0–P1.5. Rebrand, license, E2E, security, README, ship prep. These are
branched worktrees waiting to be merged.

---

## Phase 1.5 — Land the work you've done

**Why this first:** Right now you have 6 branches of good work that have never been merged
to main. Each branch was built independently against `main`, so they don't know about each
other. The blind review found conflicts (e.g., P1.2 spec expects rebrand that only exists
on P1.0). We need to merge them properly so main actually reflects everything we built.

**How you learn:** This is your first lesson in the PR workflow. One branch, one PR, one
merge. Cortana walks you through it step by step.

| Task | What you learn |
|---|---|
| **P1.5-finish** — coder finishes validation & remaining sweep on wt/p1-ship | waiting on CI |
| **P1.6-review** — review team's blind audit (already done) | reading a code review |
| **P1.7-pr-walkthrough** — open your first PR (wt/p1-license, simplest one), get CI green, merge it. Cortana teaches every command. | **git branch → PR → CI → merge** |
| **P1.8-review-fixes** — fix the blind review's findings (AGENTS.md DoD, screenshot path, GDPR mention, DOB parity) | acting on review feedback |
| **P1.9-merge-all** — merge remaining branches to main (resolving conflicts where they exist) | conflict resolution on real work |

**DoD for Phase 1.5:** main contains all P1 work, CI green, every fix from the independent
review applied.

---

## Phase 2 — Normalise the UI (the big one)

**Why this matters:** Your app is "solid foundations undermined by its own mess" (agents'
words). SettingsPage is 903 lines doing layout + logic + styling in one file. That's why
every UI tweak became a war. Phase 2 replaces custom-built UI primitives with standard
libraries (shadcn/ui) and splits the monolith pages into components + hooks.

**The golden rule:** refactor only — no visual changes. The app should look identical after
every task. If something looks different, you redesigned instead of refactored. Stop.

| Task | What you learn |
|---|---|
| **P2.0-shadcn-foundation** — install shadcn/ui, default theme, retire the 3-theme bespoke CSS-var system | replacing a design system |
| **P2.1-settings-page** — SettingsPage 903 → components + hooks (worst offender first) | breaking up a monolith |
| **P2.2-dashboard-page** — DashboardPage 639 → components + hooks | same pattern, different page |
| **P2.3-log-page** — LogPage 625 → components + hooks | same pattern, different page |
| **P2.4-profiles-entry** — ProfilesPage, EntryPage | same pattern |
| **P2.5-replace-custom** — hand-rolled toggles/modals/tabs → shadcn equivalents across all pages | mechanical substitution |
| **P2.6-delete-dead** — remove custom components once nothing imports them (delete-by-testing) | safe deletion |

**DoD for Phase 2:** all pages split, shadcn in use, zero visual change vs Phase 1.5,
every `npm run test:e2e` still passes.

---

## Phase 3 — FOC feature completeness

**Why after Phase 2:** You don't build features on top of messy UI. The features land on
clean components with an E2E net underneath. Now they're a pleasure instead of a war.

| Task | What you learn |
|---|---|
| **P3.1-demo-mode-polish** — works without backend, clear "try before deploy" onboarding | local-first UX |
| **P3.2-empty-states** — first-run experience, proper onboarding for new users | UX thinking |
| **P3.3-export-polish** — CSV works, PDF currently "works but ugly" — make PDF decent | shipping quality |
| **P3.4-pwa-install-flow** — install prompt, offline indicator | progressive enhancement |
| **P3.5-reminders-system** — frontend-only scheduler, push notification scaffold | async design |

---

## Phase 4 — Ship readiness

**Why last:** You don't polish until the boring stuff is boring-standard and the features
exist. Phase 4 is where you make it look like a real product.

| Task | What you learn |
|---|---|
| **P4.1-security-review-pass** — do a full security review of the now-normalised code | defence in depth |
| **P4.2-performance** — Core Web Vitals, bundle audit, lazy loading | performance budgeting |
| **P4.3-accessibility** — keyboard nav, screen reader labels (custom UI broke this; standard UI fixes most of it) | inclusive design |
| **P4.4-app-store-ready** — Capacitor already wired, fill STORE_SUBMISSION.md, screenshot requirements | multi-platform shipping |
| **P4.5-launch-checklist** — domain, analytics, feedback channel, basic docs site | go-live prep |

---

## How you use this roadmap

Every task becomes a kanban card with:
- A **prompt block** you paste into a fresh coder session
- A **Definition of DoD** so you know when it's done
- A **"what this teaches"** line so you know *why* you're doing it

The workflow for every single task:
```
Create branch → code → test LOCALLY (pre-push hook enforces) 
→ PR → CI runs → Cortana reviews → fix any feedback 
→ merge → next task
```

No shortcuts. No "just push to main." Every task lands through CI. You build the muscle
memory of doing it right until it's automatic.

---

## Branch topology note

Right now the P1 worktrees are all branched from `main` independently. When we merge them
we'll hit real conflicts — the P1.0 rebrand and P1.2 E2E expecting rebrand, the P1.3
security fixes touching files P1.4's README diet also touched. Resolving those is itself a
teaching moment. We'll walk through it.
