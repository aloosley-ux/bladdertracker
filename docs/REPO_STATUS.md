# Repository Status — Remaining Work Only

Last updated: March 2026 documentation/backlog correction pass.

This is the single durable list of unresolved work. Completed items should be removed, not marked as ongoing.

## Confirmed product gaps

### 1) Invite role labels do not match enforced access model
- **Description:** Invites can carry roles like `schoolAdmin`, but acceptance currently maps non-parent invites to caregiver-level DB access. This risks confusion between displayed role and effective permission.
- **Affected areas:** `api/invites.ts`, `src/pages/ProfilesPage.tsx`, role-related docs.
- **Priority:** High
- **Recommended next action:** Define canonical permission model and enforce it consistently in invite creation, acceptance mapping, and docs.

### 2) Reminder feature scope is broader in API than user-facing copy
- **Description:** API and state model support general reminder preferences per module, while some UI copy still frames reminders mainly around milestones.
- **Affected areas:** `api/modules.ts`, `src/pages/SettingsPage.tsx`, `src/pages/DashboardPage.tsx`, docs.
- **Priority:** Medium
- **Recommended next action:** Decide whether reminders are milestone-only or module-wide; then align UI copy and tests.

### 3) Server/API automated test coverage is still thin
- **Description:** Frontend and storage tests exist, but core server handlers and permission-sensitive behaviour need stronger automated coverage.
- **Affected areas:** `api/*.ts`, test suite strategy/docs.
- **Priority:** High
- **Recommended next action:** Add focused API handler tests for auth, invite acceptance, modules/reminders, and child access enforcement.

## Confirmed documentation follow-ups

### 4) README is comprehensive but overly dense for status/backlog truth
- **Description:** README contains long narrative sections that can drift. It should point to `docs/REPO_STATUS.md` for authoritative remaining work and avoid policy claims not enforced in code.
- **Affected areas:** `README.md`.
- **Priority:** Medium
- **Recommended next action:** Perform a focused README simplification pass with stricter “implemented vs planned” boundaries.

## Needs validation

### 5) Therapist/specialist workflow completeness
- **Description:** Role types exist in shared types and docs, but end-to-end UX/policy for these roles (invite selection, scoped UI, and permissions) appears partial.
- **Affected areas:** `src/types/index.ts`, `src/pages/LoginPage.tsx`, `src/pages/ProfilesPage.tsx`, `api/invites.ts`, docs.
- **Priority:** Medium
- **Recommended next action:** Run a role-matrix validation exercise and decide whether to fully implement or de-scope these roles in docs and code.

### 6) Cloud/local parity for all tracker-specific fields
- **Description:** Several extended fields (for example some sleep/food details) require explicit parity checks across local storage, APIs, migration schema, and CSV import/export.
- **Affected areas:** `src/utils/storage.ts`, `src/utils/api.ts`, `api/trackers.ts`, `api/data.ts`, `api/migrate.ts`.
- **Priority:** Medium
- **Recommended next action:** Execute a parity test matrix and patch any missing persistence paths.

## Nice-to-have polish

### 7) Build chunk-size warning follow-up
- **Description:** Build warnings indicate large chunks; optimization is not blocking but worth tracking.
- **Affected areas:** `vite.config.ts`, reports/chart imports.
- **Priority:** Low
- **Recommended next action:** Profile bundle and apply targeted lazy-loading/splitting where impact is measurable.
