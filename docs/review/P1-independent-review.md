# P1 Independent Review — blind audit of Phase 1 work

Reviewer: P1.6 (independent). Source of requirements: `docs/REVIVAL_PLAN.md` only.
Method: per branch, `git log main..<branch>` and full diff review; DoD run on the
P1.3 security worktree (lint / build / tsc api / vitest).

Branches checked: wt/p1-rebrand, wt/p1-license, wt/p1-e2e, wt/p1-security,
wt/p1-readme — all five exist. Note: branches are not mutually rebased; each is
branched from `main` independently (except wt/p1-readme, which merges P1.1–P1.3
into itself), so combining them will need merges and conflict resolution.

---

## P1.0 — Rebrand BladderTracker → EveryStep (wt/p1-rebrand)

**Verdict: PASS**

Commit: 84d47ec "P1.0: rebrand ...". 13 files, +26/−26.

Findings:
- User-facing strings updated consistently: `BRAND` in presentation.ts (correct
  location per ground rules), index.html title/OG/Twitter tags, PWA manifest,
  brand SVGs (titles/descs/wordmark text), ErrorBoundary log message, ICS
  PRODID/UID domains, CSV export header, WelcomeModal heading + aria-label.
- package.json name → `everystep`. Reasonable for a rebrand.
- No scope creep; no behaviour changes.

Minor residue (not blocking):
- `src/test/integration/api-auth.integration.test.ts:10` still references the
  `bladdertracker-git-testing...vercel.app` hostname — that's a deployed
  environment URL, arguably out of scope for a user-facing rebrand.

DoD status: docs-only/string-only change; suite verified green downstream on
wt/p1-security (which contains this work via main? — no: it does NOT contain it;
see cross-branch note below). Lint/build/tsc/tests green on wt/p1-security;
rebrand strings are orthogonal and low-risk.

---

## P1.1 — License file (wt/p1-license)

**Verdict: PASS**

Commit: dead86b. Adds LICENSE (standard MIT text, "Copyright (c) 2026 Aaron
Loosley") and `"license": "MIT"` in package.json.

Findings:
- Matches plan exactly. README already said MIT (verified wording elsewhere in
  Phase 1); no inconsistency to fix.
- Minimal diff, nothing else touched.

DoD status: trivially green (two-line metadata change); build/test unaffected
(verified indirectly via the merged wt/p1-readme tree which includes this file).

---

## P1.2 — Happy-path E2E safety net (wt/p1-e2e)

**Verdict: PARTIAL**

Commits: f2289d8 (main work) + 1e9d31c ("review fix" changing the welcome-dialog
assertion to "Welcome to EveryStep").

What matches the plan:
- @playwright/test added as devDependency with clear justification comment;
  playwright.config.ts with chromium only, webServer against Vite dev server
  (local mode, no external service) — matches "prefer whatever needs no
  external service".
- e2e/happy-path.spec.ts covers all 5 steps: register/login → add child → log a
  drink → assert entry appears on dashboard AND diary → sign out. Good use of
  role-based locators throughout.
- `test:e2e` script added; vitest `exclude` updated so vitest doesn't pick up
  e2e specs; tsconfig.node.json includes playwright config/e2e; .gitignore
  entries for test-results/report.
- Application source untouched except vite.config.ts test-exclude (acceptable
  config, not app code).

Issues:
1. **The "review fix" commit makes the spec wrong on its own branch.** The spec
   now asserts dialog name `'Welcome to EveryStep'`, but HelpPage.tsx on this
   branch still renders "Welcome to BladderTracker" (aria-label line 375, h2
   line 392) because wt/p1-rebrand was never merged into wt/p1-e2e. As it
   stands, `npm run test:e2e` on this branch fails at step 1. The fix commit
   anticipates the rebrand instead of matching the branch's actual UI. It will
   pass once branches merge — but on-branch DoD is red.
2. **AGENTS.md Definition of Done was NOT updated** to include
   `npm run test:e2e`, explicitly required by the prompt. `git diff
   main..wt/p1-e2e -- AGENTS.md` is empty; AGENTS.md on the branch has zero
   mentions of Playwright/E2E.
3. Minor: hardcoded port 5173 + strictPort is fine locally but can collide if a
   dev server is already running on that port (reuseExistingServer mitigates
   outside CI).
4. Minor: password visible as a literal in the spec (`TestPassw0rd!`) — fine
   for local-mode E2E, worth a comment noting it's throwaway.

DoD status: lint/build/tsc/vitest untouched by design (vitest exclude change is
config-only); **e2e itself fails on this branch** due to finding 1; AGENTS.md
update missing (finding 2).

---

## P1.3 — Security smell fixes (wt/p1-security)

**Verdict: PARTIAL** (fix 1 solid; fix 2 solid server-side, frontend types not
addressed; GDPR.md update skipped)

Fix 1 — admin key via header:
- api/auth.ts handlePromote now reads `x-admin-key` header (array-safe); body
  key rejected. Correct.
- src/utils/api.ts sends the header; body no longer carries the key. Correct.
- CORS Allow-Headers extended with x-admin-key — easy-to-miss detail, done.
- Frontend App.tsx now scrubs `?admin-access=` from the URL synchronously
  before async promotion, replacing the old finally-cleanup. Good hardening,
  slightly beyond the letter of the prompt but squarely within intent.
- Docs updated: API.md promote row, README env table, CONTRIBUTING.md,
  .env.example. Consistent everywhere I grepped.
- Tests: three new cases in api-auth-handler.test.ts (header accepted, body
  rejected, wrong key rejected). Good coverage of the new contract.

Fix 2 — DOB VARCHAR → DATE:
- db.ts migration: type-checked, idempotent VARCHAR→DATE conversion using
  to_date(); malformed values NULLed first; DROP DEFAULT before ALTER TYPE.
  Carefully written. One caveat: the whole migration is wrapped in a bare
  `try/catch` that logs "migration skipped" and swallows real errors (e.g.
  permissions failure) silently — a sloppy edge worth tightening later.
- api/children.ts: ISO validation helper (rejects impossible dates like
  2025-02-30 both client-side and via Postgres), Date→'YYYY-MM-DD' UTC
  normalisation on read to avoid timezone off-by-one. POST/PUT/GET all handled.
  CSV round-trip preserved by keeping the 'YYYY-MM-DD'/'' API contract — right
  call.
- New integration tests for DATE mapping and invalid DOB rejection (135 lines).
- docs/API.md children section updated accurately.

Gaps:
1. **"fix any TS types that assume string"** — the API contract deliberately
   stays string ('YYYY-MM-DD'), which is defensible, but the prompt asked to
   check TS types; there is no note anywhere (commit, docs) confirming types
   were reviewed. Local mode storage still uses free-form strings with no
   validation parity — cloud rejects 2025-02-30, local mode would accept it.
   Behavioural inconsistency between modes.
2. **GDPR.md not updated.** Prompt: "Update docs/API.md and GDPR.md if data
   handling wording changes." GDPR.md diff vs main on this branch is empty.
   Arguably nothing needed changing (storage semantics unchanged externally),
   but it wasn't checked/documented.
3. Migration error swallowing (above).

DoD status (run on this branch's worktree): lint ✅, build ✅ (PWA files
generated), tsc api ✅, vitest ✅ **137 passed / 1 skipped (138)** — above the
plan's minimum of 129/1. All green.

---

## P1.4 — README diet (wt/p1-readme)

**Verdict: PASS**

Commits: merges P1.1–P1.3 into this branch plus 58f0d1d "slim README...".

What matches the plan:
- docs/Product-Guide.md created (346 lines); all required sections moved:
  What you can do today, Features, Expand Entries, Product & UX principles,
  Milestone Tracking, Theme System, API Reference, Clinical & Market
  Benchmarking, Vercel & Neon Optimization, UI Design Principles. Verbatim
  move confirmed by section headings.
- README.md reduced ~818 lines → 95 lines (target ≤~150 ✅): pitch, screenshot,
  feature bullets, quick-start (local + deploy), docs links table (including
  REPO_STATUS.md flagged authoritative), Testing, Contributing, License,
  AI-Assisted Development. No invented claims spotted; content reads as moved/
  condensed from existing material.
- Internal links fixed across CONTRIBUTING.md, SECURITY.md, copilot-instructions,
  etc.; rebrand consistency applied repo-wide on this branch (README, GDPR,
  CHANGELOG, STORE_SUBMISSION, docs/*).
- Build stays green (verified on wt/p1-security; this branch is a superset —
  see caveat).

Caveats:
1. **Screenshot link points at a nonexistent image.**
   `docs/images/screenshot-home.png` does not exist on any branch (`git ls-tree`
   confirms; no docs/images dir). Plan said "screenshot placeholder" — a broken
   image path is worse than a placeholder comment.
2. This branch bundles the merges of P1.1–P1.3 — good for coherence, but means
   the branch isn't a pure P1.4 diff; reviewing P1.4 alone requires reading
   through four commits of merged work.
3. Quick-start deploy snippet shows `export DATABASE_URL=...***...` with a
   literal `***` — clearly redacted placeholder, fine, but the curl-to-/api/migrate
   step ordering (init DB before `vercel --prod`) is odd since migrate targets
   the deployed URL. Cosmetic.

DoD status: docs-only + merged prior work; build/lint/tsc/vitest green on the
superset security worktree; e2e caveat from P1.2 applies until branches unify.

---

## Cross-cutting observations

1. **Branch topology risk**: wt/p1-rebrand, -license, -e2e, -security are all
   independent off main; wt/p1-readme merges P1.1–P1.3 but NOT P1.0 (rebrand).
   Merging everything to main will need care; the P1.2 spec/rebrand interaction
   (finding above) is the one known semantic conflict, and it currently
   resolves in favour of EveryStep — correct end state.
2. Commit messages reference task IDs per ground rules (P1.0…P1.4) ✅.
3. No new dependencies beyond justified @playwright/test ✅.
4. Backend API shapes unchanged except where P1.3 explicitly authorises ✅.

## Summary verdicts

| Task | Branch | Verdict |
|---|---|---|
| P1.0 Rebrand | wt/p1-rebrand | PASS |
| P1.1 License | wt/p1-license | PASS |
| P1.2 E2E net | wt/p1-e2e | PARTIAL (spec asserts unmerged branding; AGENTS.md DoD not updated) |
| P1.3 Security | wt/p1-security | PARTIAL (strong fixes; silent migration catch-all; GDPR.md untouched; local-mode DOB validation gap) |
| P1.4 README diet | wt/p1-readme | PASS (broken screenshot path) |

No task marked INCOMPLETE: every assigned branch exists with substantive work.
