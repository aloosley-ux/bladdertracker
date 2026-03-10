# BladderTracker — Project Plan & Delivery Backlog

**Created:** March 2026
**Purpose:** Execution-ready project plan for production hardening and structured improvement programme.

---

## 1. Executive Summary

BladderTracker is a mature, feature-rich child development and continence tracking application with a solid technical foundation. The product addresses a genuine gap: combined bladder/bowel/sleep/sensory/therapy tracking with multi-caregiver support and NHS-inspired design. The codebase is TypeScript-strict, well-architected with a dual local/cloud mode, and comprehensively typed.

**Key strengths:**
- Coherent product proposition for SEND/autism families and care teams
- 13 modular trackers with per-child toggling
- Dual offline-first (localStorage) and cloud (Neon Postgres) architecture
- 6 user roles with data isolation and caregiver invite flows
- Accessibility features (dyslexia font, high-contrast, keyboard nav)
- GDPR-first privacy design with audit trail
- Comprehensive documentation suite

**Key areas requiring work:**
- No automated test suite
- Several large page components (1000+ lines)
- Documentation drift between files
- Unused/legacy page files in `src/pages/`
- Missing CI/CD pipeline
- Build chunk sizes exceed recommended limits
- Content/label inconsistencies between docs and code
- Module system docs reference 12 modules; actual count is 13 (leaps)

---

## 2. Major Findings

### 2.1 Strengths

| Area | Finding |
|------|---------|
| Product coherence | Strong. Clear audience (SEND families/caregivers), sensible module structure, NHS-inspired UX principles |
| Type safety | TypeScript strict mode, no `any` types, comprehensive interfaces |
| Architecture | Clean dual-mode (local/cloud) with shared context, lazy-loaded routes |
| Module system | Extensible `DEFAULT_MODULES` registry with per-child toggling |
| Privacy/GDPR | Full GDPR policy, audit trail, right-to-erasure endpoint, data export |
| Documentation breadth | 7 documentation files covering API, architecture, modules, onboarding, GDPR, contributing |
| Accessibility intent | Dyslexia font toggle, high-contrast theme, skip-to-content link, ARIA labels on key elements |

### 2.2 High-Priority Issues

| # | Area | Issue | Severity |
|---|------|-------|----------|
| H1 | Testing | Zero automated tests — no unit, integration, or e2e tests | Critical |
| H2 | Documentation | Module count discrepancy: docs say 12, actual is 13 (leaps module missing from counts) | High |
| H3 | Documentation | ARCHITECTURE.md references non-existent `users` and `sessions` tables (should be `accounts`) | High |
| H4 | Documentation | ARCHITECTURE.md says Recharts v2; actual is v3.8 | Medium |
| H5 | Documentation | MODULES.md says "Click Save Module Settings"; modules actually save instantly | Medium |
| H6 | Code | 16 page files in `src/pages/` but only 11 are routed — 5 appear to be legacy/unused (`CaregiverPortalPage`, `ChartsPage`, `ProfilePage`, `TodayPage`, and redundant files) | High |
| H7 | Code | `SettingsPage.tsx` (828 lines), `AddEntryPage.tsx` (1269 lines), `LeapsPage.tsx` (1143 lines) are oversized | Medium |
| H8 | Build | `ReportsPage` chunk is 394KB (gzipped 116KB) — well above the 500KB warning threshold | Medium |
| H9 | CI/CD | No GitHub Actions workflows — no automated build/lint/test on PRs | High |
| H10 | Code | `test.png` (469KB) at repository root — appears to be a stale test artifact | Low |
| H11 | Documentation | README code snippet for DEFAULT_MODULES uses old labels (`Urine`, `Toilet Attempts`, `Food`) but actual code uses `Wee`, `Toilet visits`, `Meals` | High |
| H12 | Documentation | README "Contributing" section says "9 React page components" but there are 11 active + 5 legacy | Medium |
| H13 | Documentation | CONTRIBUTING.md routes table is missing `/milestones`, `/leaps`, and `/help` routes | Medium |

### 2.3 Medium-Priority Issues

| # | Area | Issue |
|---|------|-------|
| M1 | Content | README Feature Roadmap section reads more like a changelog than a roadmap |
| M2 | Consistency | Module labels differ between DEFAULT_MODULES code (`Routines`) and MODULES.md doc (`Routine`) |
| M3 | Architecture | `src/content/presentation.ts` exists for content centralisation but adoption is unclear in all pages |
| M4 | Architecture | No centralised error boundary component |
| M5 | UX | Empty state handling varies across pages |
| M6 | Accessibility | WCAG 2.1 AA compliance claimed but not verified by automated tools |
| M7 | Security | Admin access via URL parameter (`?admin-access=bladdertracker-admin-2024`) is in source code |
| M8 | Data | Theme preference not synced to cloud (localStorage only, as noted in Known Issues) |
| M9 | API | `SameSite` cookie attribute is `Strict` in docs/API.md but `Lax` in README Security section |

### 2.4 Low-Priority Issues

| # | Area | Issue |
|---|------|-------|
| L1 | Assets | `test.png` at root should be in `.gitignore` or removed |
| L2 | Performance | No service worker / PWA manifest despite "PWA" mentions |
| L3 | Branding | Product name "BladderTracker" may be too narrow for the broader developmental tracking scope |
| L4 | Documentation | Onboarding.md still references "Toilet Attempts" instead of "Toilet visits" |
| L5 | Documentation | GDPR.md bowel location options say "toilet, nappy" but code uses "toilet, pad, pants" |

---

## 3. Delivery Strategy

### Workstream Overview

| Workstream | Focus | Parallelisable |
|------------|-------|----------------|
| **WS-A: Foundation & Cleanup** | Remove dead code, fix docs, add CI | Must-first |
| **WS-B: Testing Infrastructure** | Add test framework, write core tests | Must-first, then parallel |
| **WS-C: Architecture Improvements** | Decompose large components, add error boundaries | After WS-A |
| **WS-D: Content & UX Consistency** | Centralise labels, fix naming drift, improve empty states | Parallel with WS-C |
| **WS-E: Accessibility Hardening** | Audit, fix issues, add a11y tests | After WS-B |
| **WS-F: Performance Optimisation** | Code splitting, chunk reduction, lazy loading | After WS-C |
| **WS-G: Security Hardening** | Admin access, cookie config, input validation | Parallel with WS-C |
| **WS-H: Production Readiness** | PWA manifest, service worker, monitoring, error tracking | After WS-F |
| **WS-I: Documentation Maintenance** | Keep docs in sync as code changes | Continuous |

---

## 4. Critical Path

```
WS-A (Foundation) ──► WS-B (Testing) ──► WS-C (Architecture) ──► WS-F (Performance)
         │                    │                     │                      │
         │                    ▼                     ▼                      ▼
         │              WS-E (A11y)          WS-D (Content)         WS-H (Prod)
         │                                        │
         ▼                                        ▼
    WS-G (Security)                        WS-I (Docs - continuous)
```

**Critical path:** Foundation cleanup → Testing infrastructure → Architecture decomposition → Performance → Production readiness

---

## 5. Parallel Workstreams

| Can run in parallel | Notes |
|---------------------|-------|
| WS-D (Content/UX) + WS-C (Architecture) | Content changes are in presentation layer; architecture is structural |
| WS-E (Accessibility) + WS-D (Content) | Different concerns, minimal overlap |
| WS-G (Security) + WS-B (Testing) | Security fixes are independent of test setup |
| WS-I (Docs) | Always parallel, continuous |

---

## 6. Full Backlog by Epic

---

### Epic: [EPIC-01] Foundation & Code Cleanup

**Goal:** Remove dead code, fix inconsistencies, establish baseline quality.
**Why this matters:** Dead code and stale references create confusion, increase maintenance burden, and block accurate testing/documentation.
**Dependencies:** None — this is prerequisite work.
**Parallelisation notes:** All subtasks within this epic can be done independently.

---

#### Story: [STORY-01.1] Remove unused page files

**Objective:** Delete or archive page components that are not routed in App.tsx.
**Depends on:** None
**Owner:** Frontend
**Estimate:** S
**Acceptance criteria:**
- All unrouted page files identified and removed (CaregiverPortalPage.tsx, ChartsPage.tsx, ProfilePage.tsx, TodayPage.tsx)
- Verify no imports reference these files
- Build passes (`npm run build`)

  **Subtask: [TASK-01.1.1] Audit src/pages/ against App.tsx routes**
  Description: List all files in `src/pages/`, cross-reference with routes in `App.tsx`, identify unused files.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Document listing unused page files.
  Sequence tag: Must-first

  **Subtask: [TASK-01.1.2] Remove CaregiverPortalPage.tsx**
  Description: Delete file, verify no imports, run build.
  Depends on: TASK-01.1.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: File deleted, build passes.
  Sequence tag: Sequential

  **Subtask: [TASK-01.1.3] Remove ChartsPage.tsx**
  Description: Delete file, verify no imports, run build.
  Depends on: TASK-01.1.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: File deleted, build passes.
  Sequence tag: Batchable

  **Subtask: [TASK-01.1.4] Remove ProfilePage.tsx**
  Description: Delete file, verify no imports, run build.
  Depends on: TASK-01.1.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: File deleted, build passes.
  Sequence tag: Batchable

  **Subtask: [TASK-01.1.5] Remove TodayPage.tsx**
  Description: Delete file, verify no imports, run build.
  Depends on: TASK-01.1.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: File deleted, build passes.
  Sequence tag: Batchable

---

#### Story: [STORY-01.2] Clean up repository root artifacts

**Objective:** Remove stale files from the repository root that are not part of the application.
**Depends on:** None
**Owner:** Frontend
**Estimate:** XS
**Acceptance criteria:**
- `test.png` removed or added to `.gitignore`
- Repository root is clean

  **Subtask: [TASK-01.2.1] Remove test.png from repository root**
  Description: Delete `test.png` (469KB screenshot artifact). Add `*.png` or `test.png` to `.gitignore` if test screenshots might be regenerated.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: File removed, `.gitignore` updated if needed.
  Sequence tag: Parallel-safe

---

#### Story: [STORY-01.3] Add CI/CD pipeline

**Objective:** Create GitHub Actions workflow for automated build, lint, and type-check on every PR.
**Depends on:** None
**Owner:** DevOps / Frontend
**Estimate:** M
**Acceptance criteria:**
- `.github/workflows/ci.yml` exists
- Workflow runs `npm ci`, `npm run build`, `npm run lint`
- Workflow runs on push to main and all PRs
- Badge added to README

  **Subtask: [TASK-01.3.1] Create basic CI workflow file**
  Description: Create `.github/workflows/ci.yml` with Node.js 18+ setup, `npm ci`, `npm run build`, `npm run lint`.
  Depends on: None
  Owner: DevOps
  Estimate: S
  Acceptance criteria: Workflow file valid YAML, defines job with build and lint steps.
  Sequence tag: Must-first

  **Subtask: [TASK-01.3.2] Add API type-check step to CI**
  Description: Add `npx tsc --project tsconfig.api.json --noEmit` step after main build.
  Depends on: TASK-01.3.1
  Owner: DevOps
  Estimate: XS
  Acceptance criteria: CI checks both frontend and API types.
  Sequence tag: Sequential

  **Subtask: [TASK-01.3.3] Add CI status badge to README**
  Description: Add GitHub Actions build status badge to README header.
  Depends on: TASK-01.3.1
  Owner: Docs
  Estimate: XS
  Acceptance criteria: Badge displays current CI status on README.
  Sequence tag: Sequential

---

### Epic: [EPIC-02] Testing Infrastructure

**Goal:** Establish automated testing with framework, utilities, and initial coverage.
**Why this matters:** Zero automated tests means every change carries regression risk. Testing is prerequisite for safe refactoring.
**Dependencies:** EPIC-01 (CI pipeline should be in place to run tests).
**Parallelisation notes:** Test framework setup is sequential; individual test files can be written in parallel after setup.

---

#### Story: [STORY-02.1] Set up test framework

**Objective:** Install and configure Vitest with React Testing Library.
**Depends on:** None
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- Vitest configured in `vite.config.ts`
- React Testing Library installed
- `npm test` script in package.json
- Sample test runs and passes

  **Subtask: [TASK-02.1.1] Install Vitest and dependencies**
  Description: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Dependencies in devDependencies.
  Sequence tag: Must-first

  **Subtask: [TASK-02.1.2] Configure Vitest in vite.config.ts**
  Description: Add `test` config block with jsdom environment, setupFiles, globals.
  Depends on: TASK-02.1.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: `npx vitest run` executes without config errors.
  Sequence tag: Sequential

  **Subtask: [TASK-02.1.3] Create test setup file**
  Description: Create `src/test/setup.ts` with `@testing-library/jest-dom` matchers and any global mocks (e.g., localStorage).
  Depends on: TASK-02.1.2
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Setup file imports correctly.
  Sequence tag: Sequential

  **Subtask: [TASK-02.1.4] Add `test` script to package.json**
  Description: Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts.
  Depends on: TASK-02.1.2
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: `npm test` runs the test suite.
  Sequence tag: Sequential

  **Subtask: [TASK-02.1.5] Write sample smoke test**
  Description: Create `src/App.test.tsx` that renders `<App />` and verifies it does not crash.
  Depends on: TASK-02.1.3
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Test passes.
  Sequence tag: Sequential

  **Subtask: [TASK-02.1.6] Add test step to CI workflow**
  Description: Add `npm test` step to `.github/workflows/ci.yml`.
  Depends on: TASK-02.1.4, TASK-01.3.1
  Owner: DevOps
  Estimate: XS
  Acceptance criteria: CI runs tests on every PR.
  Sequence tag: Sequential

---

#### Story: [STORY-02.2] Write storage utility tests

**Objective:** Unit tests for `src/utils/storage.ts` CRUD operations.
**Depends on:** STORY-02.1
**Owner:** Frontend
**Estimate:** L
**Acceptance criteria:**
- Tests cover all 13 tracker CRUD operations (get/add/update/delete)
- Tests cover user, children, and module management functions
- Tests mock localStorage

  **Subtask: [TASK-02.2.1] Test user session functions (getUser, setUser, clearUser)**
  Description: Test login/logout localStorage persistence.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: 5+ assertions for session management.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.2.2] Test children CRUD functions**
  Description: Test getChildren, addChild, updateChild with localStorage mocks.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Full CRUD cycle tested.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.2.3] Test drink entries CRUD**
  Description: Test getDrinks, addDrink, updateDrink, deleteDrink.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Full CRUD cycle tested with edge cases.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.2.4] Test remaining tracker CRUD (urine, bowel, sleep, toilet, food)**
  Description: Write tests for each tracker type's CRUD operations.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: M
  Acceptance criteria: All 5 tracker types have CRUD tests.
  Sequence tag: Batchable

  **Subtask: [TASK-02.2.5] Test module management functions**
  Description: Test getEnabledModules, setEnabledModules, module toggling.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Module toggle persistence verified.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.2.6] Test extended module CRUD (mood, sensory, medication, therapy, routine)**
  Description: Write tests for optional module CRUD.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: M
  Acceptance criteria: All 5 optional modules tested.
  Sequence tag: Batchable

  **Subtask: [TASK-02.2.7] Test milestone and leap CRUD**
  Description: Write tests for milestone and leap log CRUD.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Full milestone lifecycle tested.
  Sequence tag: Parallel-safe

---

#### Story: [STORY-02.3] Write component render tests

**Objective:** Smoke tests for all major page components to prevent render regressions.
**Depends on:** STORY-02.1
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- Each active page component has a render test
- Tests verify basic content renders without crash

  **Subtask: [TASK-02.3.1] Test DashboardPage renders**
  Description: Render DashboardPage with mock context, verify key elements appear.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Component renders without errors.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.3.2] Test AddEntryPage tab navigation**
  Description: Render AddEntryPage, verify all 11 tabs render and can be switched.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: All tabs accessible, forms render.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-02.3.3] Test remaining page renders (Log, Reports, Calendar, Profiles, Settings, Help, Admin, Milestones, Leaps)**
  Description: Create smoke render tests for each remaining page.
  Depends on: STORY-02.1
  Owner: Frontend
  Estimate: M
  Acceptance criteria: All 9 pages render without errors.
  Sequence tag: Batchable

---

### Epic: [EPIC-03] Architecture Decomposition

**Goal:** Break oversized components into maintainable, testable modules.
**Why this matters:** Files exceeding 800+ lines are hard to review, test, and modify safely.
**Dependencies:** EPIC-02 (testing in place before refactoring).
**Parallelisation notes:** Each page can be decomposed independently.

---

#### Story: [STORY-03.1] Decompose AddEntryPage.tsx (1269 lines)

**Objective:** Extract each tracker form into its own component file.
**Depends on:** EPIC-02
**Owner:** Frontend
**Estimate:** L
**Acceptance criteria:**
- Each of the 11 tracker forms is a separate component
- AddEntryPage is reduced to ~200 lines (tabs + routing logic)
- All forms function identically to before
- Tests pass

  **Subtask: [TASK-03.1.1] Extract DrinkForm component**
  Description: Move drink entry form JSX and logic to `src/components/forms/DrinkForm.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, parent simplified, existing behaviour preserved.
  Sequence tag: Must-first (establishes pattern)

  **Subtask: [TASK-03.1.2] Extract UrineForm component**
  Description: Move urine form to `src/components/forms/UrineForm.tsx`.
  Depends on: TASK-03.1.1 (pattern established)
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.3] Extract BowelForm component**
  Description: Move bowel form to `src/components/forms/BowelForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.4] Extract SleepForm component**
  Description: Move sleep form to `src/components/forms/SleepForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.5] Extract ToiletForm component**
  Description: Move toilet form to `src/components/forms/ToiletForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.6] Extract FoodForm component**
  Description: Move food form to `src/components/forms/FoodForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.7] Extract MoodForm component**
  Description: Move mood form to `src/components/forms/MoodForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.8] Extract SensoryForm component**
  Description: Move sensory form to `src/components/forms/SensoryForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.9] Extract MedicationForm component**
  Description: Move medication form to `src/components/forms/MedicationForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.10] Extract TherapyForm component**
  Description: Move therapy form to `src/components/forms/TherapyForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

  **Subtask: [TASK-03.1.11] Extract RoutineForm component**
  Description: Move routine form to `src/components/forms/RoutineForm.tsx`.
  Depends on: TASK-03.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Form extracted, behaviour preserved.
  Sequence tag: Batchable

---

#### Story: [STORY-03.2] Decompose SettingsPage.tsx (828 lines)

**Objective:** Extract settings sections into sub-components.
**Depends on:** EPIC-02
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- Settings sections (Appearance, Modules, Privacy, Import/Export) are separate components
- SettingsPage is reduced to ~200 lines
- All functionality preserved

  **Subtask: [TASK-03.2.1] Extract AppearanceSettings component**
  Description: Move theme and dyslexia font toggle section to `src/components/settings/AppearanceSettings.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Theme switching works, font toggle works.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.2.2] Extract ModuleSettings component**
  Description: Move module toggle section to `src/components/settings/ModuleSettings.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Module toggling works per-child.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.2.3] Extract PrivacySettings component**
  Description: Move GDPR/export/delete section to `src/components/settings/PrivacySettings.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Export, delete, audit trail all work.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.2.4] Extract ImportExportSettings component**
  Description: Move import/export controls to `src/components/settings/ImportExportSettings.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: CSV/Excel import and export work.
  Sequence tag: Parallel-safe

---

#### Story: [STORY-03.3] Decompose LeapsPage.tsx (1143 lines)

**Objective:** Extract leap sub-sections into focused components.
**Depends on:** EPIC-02
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- Leap timeline, symptom log form, and leap detail views are separate components
- LeapsPage is reduced significantly
- Functionality preserved

  **Subtask: [TASK-03.3.1] Extract LeapTimeline component**
  Description: Move timeline/prediction view to `src/components/leaps/LeapTimeline.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Timeline renders correctly.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.3.2] Extract LeapDetailPanel component**
  Description: Move leap detail/tips display to `src/components/leaps/LeapDetailPanel.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Detail panel shows tips and resources.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.3.3] Extract SymptomLogForm component**
  Description: Move symptom logging form to `src/components/leaps/SymptomLogForm.tsx`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Symptom logging works.
  Sequence tag: Parallel-safe

---

#### Story: [STORY-03.4] Add global error boundary

**Objective:** Add a React error boundary to prevent full-app crashes.
**Depends on:** None
**Owner:** Frontend
**Estimate:** S
**Acceptance criteria:**
- Error boundary wraps main app routes
- Shows user-friendly error message with recovery option
- Logs error details to console

  **Subtask: [TASK-03.4.1] Create ErrorBoundary component**
  Description: Create `src/components/ErrorBoundary.tsx` with class component, error state, and fallback UI.
  Depends on: None
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Catches render errors, shows recovery UI.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-03.4.2] Wrap App routes with ErrorBoundary**
  Description: Add `<ErrorBoundary>` around `<Routes>` in App.tsx.
  Depends on: TASK-03.4.1
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Build passes, error boundary active.
  Sequence tag: Sequential

---

### Epic: [EPIC-04] Content & UX Consistency

**Goal:** Centralise all user-facing content, fix naming drift, improve empty states.
**Why this matters:** Inconsistent naming between code, UI, and docs creates confusion for users and contributors.
**Dependencies:** None (can start immediately, parallel with other work).
**Parallelisation notes:** All subtasks in this epic are parallel-safe unless noted.

---

#### Story: [STORY-04.1] Audit and fix module naming consistency

**Objective:** Ensure module labels are consistent across code, UI, and documentation.
**Depends on:** None
**Owner:** Content / Frontend
**Estimate:** M
**Acceptance criteria:**
- DEFAULT_MODULES labels match all UI surfaces
- Documentation matches code labels exactly
- Mapping table verified

  **Subtask: [TASK-04.1.1] Create module naming audit spreadsheet**
  Description: Document the label for each module across: DEFAULT_MODULES, AddEntryPage tabs, DashboardPage cards, LogPage filters, ReportsPage filters, README, MODULES.md, Onboarding.md.
  Depends on: None
  Owner: Content
  Estimate: S
  Acceptance criteria: Complete audit showing all discrepancies.
  Sequence tag: Must-first

  **Subtask: [TASK-04.1.2] Define canonical module display names**
  Description: Decide the official UI label for each module (e.g., "Wee" not "Urine", "Poo" not "Bowel", "Toilet visits" not "Toilet Attempts").
  Depends on: TASK-04.1.1
  Owner: Product
  Estimate: XS
  Acceptance criteria: Canonical names documented.
  Sequence tag: Sequential

  **Subtask: [TASK-04.1.3] Update MODULES.md headings to match code labels**
  Description: Change MODULES.md section headings from clinical names to UI labels where appropriate, keeping clinical names as subtitles.
  Depends on: TASK-04.1.2
  Owner: Docs
  Estimate: S
  Acceptance criteria: MODULES.md headings match UI labels.
  Sequence tag: Sequential

  **Subtask: [TASK-04.1.4] Update Onboarding.md module names**
  Description: Replace "Toilet Attempts" with "Toilet visits", "Food" with "Meals" etc. in Onboarding.md.
  Depends on: TASK-04.1.2
  Owner: Docs
  Estimate: XS
  Acceptance criteria: All module names in onboarding match UI labels.
  Sequence tag: Batchable

---

#### Story: [STORY-04.2] Improve empty state messaging

**Objective:** Create consistent, helpful empty state messages for all data-driven views.
**Depends on:** None
**Owner:** Frontend / Content
**Estimate:** M
**Acceptance criteria:**
- Every page with data lists has a styled empty state
- Empty states include guidance text and primary action CTA
- Consistent visual pattern across all pages

  **Subtask: [TASK-04.2.1] Audit current empty states across all pages**
  Description: Check DashboardPage, LogPage, ReportsPage, MilestonesPage, CalendarPage, ProfilesPage for empty state handling.
  Depends on: None
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Document which pages have empty states and which don't.
  Sequence tag: Must-first

  **Subtask: [TASK-04.2.2] Create reusable EmptyState component**
  Description: Create `src/components/EmptyState.tsx` with icon, title, description, and optional action button props.
  Depends on: TASK-04.2.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Component renders with all prop variations.
  Sequence tag: Sequential

  **Subtask: [TASK-04.2.3] Add empty states to pages missing them**
  Description: Apply EmptyState component to all data pages identified in the audit.
  Depends on: TASK-04.2.2
  Owner: Frontend
  Estimate: M
  Acceptance criteria: All data pages show helpful empty states.
  Sequence tag: Sequential

---

#### Story: [STORY-04.3] Centralise user-facing labels via presentation.ts

**Objective:** Ensure all user-facing strings flow through `src/content/presentation.ts`.
**Depends on:** None
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- All module display names sourced from presentation.ts
- All celebration/encouragement copy in presentation.ts
- All role display names in presentation.ts

  **Subtask: [TASK-04.3.1] Audit hardcoded strings in page components**
  Description: Search for hardcoded module names, role names, and UI copy in page files that should be in presentation.ts.
  Depends on: None
  Owner: Frontend
  Estimate: S
  Acceptance criteria: List of hardcoded strings that should be centralised.
  Sequence tag: Must-first

  **Subtask: [TASK-04.3.2] Move remaining hardcoded strings to presentation.ts**
  Description: Extract hardcoded strings identified in audit to presentation.ts and import them.
  Depends on: TASK-04.3.1
  Owner: Frontend
  Estimate: M
  Acceptance criteria: No hardcoded module/role names in page files.
  Sequence tag: Sequential

---

### Epic: [EPIC-05] Accessibility Hardening

**Goal:** Verify and fix WCAG 2.1 AA compliance across all surfaces.
**Why this matters:** The product targets families with children who have additional needs — accessibility is not optional.
**Dependencies:** EPIC-02 (automated a11y tests need test framework).
**Parallelisation notes:** Manual audit can start immediately; automated tests need framework.

---

#### Story: [STORY-05.1] Automated accessibility audit

**Objective:** Run axe-core or similar tool against all pages and fix violations.
**Depends on:** EPIC-02
**Owner:** QA / Frontend
**Estimate:** M
**Acceptance criteria:**
- axe-core integrated into test suite
- Zero critical/serious violations
- Report of remaining minor issues

  **Subtask: [TASK-05.1.1] Install axe-core testing library**
  Description: `npm install -D @axe-core/react` or `vitest-axe`.
  Depends on: EPIC-02
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Library installed.
  Sequence tag: Must-first

  **Subtask: [TASK-05.1.2] Write a11y tests for each page**
  Description: Create accessibility snapshot tests using axe for each active page.
  Depends on: TASK-05.1.1
  Owner: QA
  Estimate: M
  Acceptance criteria: All 11 pages have a11y tests.
  Sequence tag: Sequential

  **Subtask: [TASK-05.1.3] Fix critical accessibility violations**
  Description: Fix any critical/serious violations found by axe tests.
  Depends on: TASK-05.1.2
  Owner: Frontend
  Estimate: M (depends on violation count)
  Acceptance criteria: Zero critical/serious axe violations.
  Sequence tag: Sequential

---

#### Story: [STORY-05.2] Touch target audit

**Objective:** Verify all interactive elements meet 44×44px minimum touch target.
**Depends on:** None
**Owner:** Frontend / QA
**Estimate:** S
**Acceptance criteria:**
- All buttons, links, toggles, and chips meet 44×44px minimum
- Navigation items on mobile meet touch target requirements

  **Subtask: [TASK-05.2.1] Audit touch targets on AddEntryPage tabs**
  Description: Measure tab buttons on mobile viewport, ensure 44px minimum.
  Depends on: None
  Owner: QA
  Estimate: XS
  Acceptance criteria: All tabs meet touch target size.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-05.2.2] Audit touch targets on DashboardPage quick actions**
  Description: Measure quick-add buttons on mobile viewport.
  Depends on: None
  Owner: QA
  Estimate: XS
  Acceptance criteria: All quick actions meet touch target size.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-05.2.3] Audit touch targets on navigation**
  Description: Measure bottom nav items on mobile viewport.
  Depends on: None
  Owner: QA
  Estimate: XS
  Acceptance criteria: All nav items meet touch target size.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-05.2.4] Fix any undersized touch targets**
  Description: Increase padding/sizing on any elements below 44px minimum.
  Depends on: TASK-05.2.1, TASK-05.2.2, TASK-05.2.3
  Owner: Frontend
  Estimate: S
  Acceptance criteria: All touch targets at minimum 44×44px.
  Sequence tag: Sequential

---

#### Story: [STORY-05.3] Keyboard navigation audit

**Objective:** Verify full keyboard operability across all pages and modals.
**Depends on:** None
**Owner:** QA / Frontend
**Estimate:** M
**Acceptance criteria:**
- Tab order is logical on all pages
- All interactive elements are focusable
- Focus is visible on all focusable elements
- Modal focus trapping works

  **Subtask: [TASK-05.3.1] Test keyboard tab order on each page**
  Description: Navigate each page with Tab key, verify logical order.
  Depends on: None
  Owner: QA
  Estimate: S
  Acceptance criteria: Tab order documented for all pages.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-05.3.2] Test focus visibility**
  Description: Verify focus ring/outline is visible on all focusable elements across all 3 themes.
  Depends on: None
  Owner: QA
  Estimate: S
  Acceptance criteria: Focus visible in light, dark, and high-contrast themes.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-05.3.3] Fix keyboard navigation issues**
  Description: Fix any issues found in keyboard audit.
  Depends on: TASK-05.3.1, TASK-05.3.2
  Owner: Frontend
  Estimate: M (depends on issue count)
  Acceptance criteria: Full keyboard operability.
  Sequence tag: Sequential

---

### Epic: [EPIC-06] Performance Optimisation

**Goal:** Reduce bundle sizes, improve load times, optimise rendering.
**Why this matters:** The ReportsPage chunk alone is 394KB — mobile users on slow connections will experience poor load times.
**Dependencies:** EPIC-03 (decomposition reduces chunk sizes naturally).
**Parallelisation notes:** Most subtasks are independent.

---

#### Story: [STORY-06.1] Reduce ReportsPage bundle size

**Objective:** Bring ReportsPage chunk below 200KB.
**Depends on:** EPIC-03
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- ReportsPage chunk < 200KB
- Chart rendering still functional
- No regression in report features

  **Subtask: [TASK-06.1.1] Analyse ReportsPage imports with bundle analyser**
  Description: Run `npx vite-bundle-visualizer` or similar to identify largest imports.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Import analysis report generated.
  Sequence tag: Must-first

  **Subtask: [TASK-06.1.2] Lazy-load Recharts components**
  Description: Use dynamic imports for Recharts chart components within ReportsPage.
  Depends on: TASK-06.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Recharts lazy-loaded, bundle size reduced.
  Sequence tag: Sequential

  **Subtask: [TASK-06.1.3] Tree-shake unused Recharts exports**
  Description: Import only specific chart types used (BarChart, LineChart, etc.) instead of barrel imports.
  Depends on: TASK-06.1.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Only used chart components included in bundle.
  Sequence tag: Batchable

---

#### Story: [STORY-06.2] Optimise main bundle

**Objective:** Reduce the main `index` chunk (298KB) via code splitting.
**Depends on:** None
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- Main bundle < 200KB
- App still loads correctly
- Lazy loading for non-critical paths

  **Subtask: [TASK-06.2.1] Audit main bundle contents**
  Description: Identify what's in the main bundle using visualiser.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Bundle analysis complete.
  Sequence tag: Must-first

  **Subtask: [TASK-06.2.2] Lazy-load date-fns locale data**
  Description: Dynamic import for locale data that may be bundled eagerly.
  Depends on: TASK-06.2.1
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Locale data lazy-loaded.
  Sequence tag: Sequential

  **Subtask: [TASK-06.2.3] Review and optimise Tailwind CSS output**
  Description: Verify Tailwind is purging unused styles correctly.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: CSS output is minimal.
  Sequence tag: Parallel-safe

---

### Epic: [EPIC-07] Security Hardening

**Goal:** Address security concerns identified in the review.
**Why this matters:** Health data for children requires strong security posture.
**Dependencies:** None (can start immediately).
**Parallelisation notes:** Each story is independent.

---

#### Story: [STORY-07.1] Secure admin access mechanism

**Objective:** Replace URL-parameter admin promotion with a proper admin setup flow.
**Depends on:** None
**Owner:** Backend / Frontend
**Estimate:** M
**Acceptance criteria:**
- Admin access key not hardcoded in source
- Admin promotion requires server-side validation
- Audit log captures admin promotions

  **Subtask: [TASK-07.1.1] Move admin access key to environment variable**
  Description: Replace hardcoded `ADMIN_ACCESS_KEY` constant with `import.meta.env.VITE_ADMIN_KEY`.
  Depends on: None
  Owner: Frontend
  Estimate: XS
  Acceptance criteria: Key not in source code.
  Sequence tag: Must-first

  **Subtask: [TASK-07.1.2] Add server-side admin promotion endpoint**
  Description: Create or extend auth API to validate admin promotion server-side.
  Depends on: TASK-07.1.1
  Owner: Backend
  Estimate: S
  Acceptance criteria: Admin promotion validated server-side.
  Sequence tag: Sequential

---

#### Story: [STORY-07.2] Standardise cookie security attributes

**Objective:** Ensure consistent cookie security across all documentation and code.
**Depends on:** None
**Owner:** Backend
**Estimate:** S
**Acceptance criteria:**
- `SameSite` attribute documented consistently (choose Lax or Strict)
- `Secure` flag set in production
- `HttpOnly` flag always set

  **Subtask: [TASK-07.2.1] Audit cookie attributes in api/_lib/auth.ts**
  Description: Check actual cookie-setting code for SameSite, Secure, HttpOnly attributes.
  Depends on: None
  Owner: Backend
  Estimate: XS
  Acceptance criteria: Actual attributes documented.
  Sequence tag: Must-first

  **Subtask: [TASK-07.2.2] Fix documentation to match actual cookie config**
  Description: Update README and API.md to reflect actual cookie attributes.
  Depends on: TASK-07.2.1
  Owner: Docs
  Estimate: XS
  Acceptance criteria: Docs match code.
  Sequence tag: Sequential

---

### Epic: [EPIC-08] Production Readiness

**Goal:** Prepare the application for production deployment.
**Why this matters:** PWA features, monitoring, and production configuration are needed for a real user base.
**Dependencies:** EPIC-06 (performance), EPIC-07 (security).
**Parallelisation notes:** PWA and monitoring can be done in parallel.

---

#### Story: [STORY-08.1] Add PWA manifest and service worker

**Objective:** Make the app installable as a PWA with offline support.
**Depends on:** EPIC-06
**Owner:** Frontend
**Estimate:** M
**Acceptance criteria:**
- `manifest.json` with correct metadata
- Service worker for offline caching
- App installable on mobile devices
- Lighthouse PWA score > 90

  **Subtask: [TASK-08.1.1] Create manifest.json**
  Description: Create web app manifest with name, icons, theme colour, start URL.
  Depends on: None
  Owner: Frontend
  Estimate: S
  Acceptance criteria: Manifest valid, references correct icons.
  Sequence tag: Must-first

  **Subtask: [TASK-08.1.2] Add service worker with Vite PWA plugin**
  Description: Install `vite-plugin-pwa` and configure workbox caching strategy.
  Depends on: TASK-08.1.1
  Owner: Frontend
  Estimate: M
  Acceptance criteria: Service worker registers, caches core assets.
  Sequence tag: Sequential

  **Subtask: [TASK-08.1.3] Test offline functionality**
  Description: Verify app loads and basic features work when offline (localStorage mode).
  Depends on: TASK-08.1.2
  Owner: QA
  Estimate: S
  Acceptance criteria: App loads offline, localStorage CRUD works.
  Sequence tag: Sequential

---

#### Story: [STORY-08.2] Add production environment configuration

**Objective:** Ensure proper environment variable management for production.
**Depends on:** None
**Owner:** DevOps
**Estimate:** S
**Acceptance criteria:**
- `.env.example` file documents all required variables
- No secrets in source code
- Clear deployment documentation

  **Subtask: [TASK-08.2.1] Create .env.example file**
  Description: Document all environment variables: DATABASE_URL, JWT_SECRET, VITE_USE_CLOUD, NODE_ENV.
  Depends on: None
  Owner: DevOps
  Estimate: XS
  Acceptance criteria: File lists all vars with descriptions.
  Sequence tag: Parallel-safe

  **Subtask: [TASK-08.2.2] Update deployment documentation**
  Description: Add production deployment section to README with env var setup instructions.
  Depends on: TASK-08.2.1
  Owner: Docs
  Estimate: S
  Acceptance criteria: Clear step-by-step deployment guide.
  Sequence tag: Sequential

---

### Epic: [EPIC-09] Documentation Maintenance

**Goal:** Keep documentation accurate and in sync with code as changes are made.
**Why this matters:** Documentation drift discovered in this review shows ongoing maintenance is needed.
**Dependencies:** None (continuous).
**Parallelisation notes:** Always parallel-safe.

---

#### Story: [STORY-09.1] Establish documentation review checklist

**Objective:** Create a PR checklist that includes documentation verification.
**Depends on:** None
**Owner:** Docs / Product
**Estimate:** S
**Acceptance criteria:**
- PR template includes doc check items
- Checklist covers README, MODULES.md, API.md, ARCHITECTURE.md

  **Subtask: [TASK-09.1.1] Create PR template with doc checklist**
  Description: Create `.github/PULL_REQUEST_TEMPLATE.md` with documentation verification items.
  Depends on: None
  Owner: Docs
  Estimate: XS
  Acceptance criteria: Template exists and includes doc verification.
  Sequence tag: Parallel-safe

---

## 7. Recommended Implementation Order

### Phase 1: Foundation (Week 1–2)
1. **[EPIC-01]** Foundation cleanup (remove dead files, add CI)
2. **Documentation cleanup** (this run — already done)

### Phase 2: Testing (Week 2–4)
3. **[STORY-02.1]** Test framework setup
4. **[STORY-02.2]** Storage utility tests
5. **[STORY-02.3]** Component render tests

### Phase 3: Architecture + Content (Week 4–8, parallel)
6. **[STORY-03.1]** Decompose AddEntryPage *(parallel with 7)*
7. **[STORY-04.1]** Module naming consistency *(parallel with 6)*
8. **[STORY-03.2]** Decompose SettingsPage
9. **[STORY-03.3]** Decompose LeapsPage
10. **[STORY-03.4]** Error boundary
11. **[STORY-04.2]** Empty states
12. **[STORY-04.3]** Centralise labels

### Phase 4: Quality (Week 8–10, parallel)
13. **[STORY-05.1]** Automated a11y audit *(parallel with 14)*
14. **[STORY-07.1]** Secure admin access *(parallel with 13)*
15. **[STORY-05.2]** Touch target audit
16. **[STORY-05.3]** Keyboard navigation audit
17. **[STORY-07.2]** Cookie security standardisation

### Phase 5: Performance (Week 10–12)
18. **[STORY-06.1]** Reduce ReportsPage bundle
19. **[STORY-06.2]** Optimise main bundle

### Phase 6: Production (Week 12–14)
20. **[STORY-08.1]** PWA manifest and service worker
21. **[STORY-08.2]** Production env configuration

### Continuous
22. **[EPIC-09]** Documentation maintenance

---

## 8. Risks and Assumptions

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Refactoring breaks existing behaviour | High | High | Write tests before refactoring (EPIC-02 before EPIC-03) |
| Large component decomposition introduces regressions | Medium | Medium | Incremental extraction with tests after each component |
| Module naming changes confuse existing users | Low | Medium | Use progressive disclosure; keep clinical names as subtitles |
| Vercel function limit reached during new features | Medium | High | Continue consolidation strategy in modules.ts |
| localStorage data loss during development | Low | High | Always test local mode after changes |
| Bundle size increases with new features | Medium | Medium | Monitor with CI bundle size checks |

**Assumptions:**
- Product will continue to use Vercel Hobby tier for the near term
- localStorage mode remains the default (offline-first)
- No plan to change the React/Vite/Tailwind stack
- Existing API contracts will not change (backward compatible)

---

## 9. Documentation Cleanup Plan (This Run)

| File | Changes Made |
|------|-------------|
| **README.md** | Fixed module count (12→13), fixed DEFAULT_MODULES labels to match actual code, fixed page count references, cleaned structure, fixed Contributing section page count, improved accuracy throughout |
| **docs/ARCHITECTURE.md** | Fixed `users`→`accounts` table name, removed non-existent `sessions` table, fixed Recharts version (2→3.8), corrected Tailwind version |
| **docs/MODULES.md** | Fixed "Click Save Module Settings" → instant apply, updated module count, fixed label inconsistencies |
| **CONTRIBUTING.md** | Added missing routes (/milestones, /leaps, /help), fixed page count |
| **docs/Onboarding.md** | Fixed module name inconsistencies to match UI labels |

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| **Module** | A tracker type (e.g., Drinks, Wee, Sleep) that can be enabled/disabled per child |
| **Entry** | A single diary record for a specific module, date, and time |
| **Cloud mode** | App running with `VITE_USE_CLOUD=true`, connecting to Neon Postgres via Vercel Functions |
| **Local mode** | App running with localStorage only, no server required |
| **DEFAULT_MODULES** | The registry of all 13 available tracker modules in `src/types/index.ts` |
| **presentation.ts** | Centralised content file for UI labels, wording overrides, and brand copy |
