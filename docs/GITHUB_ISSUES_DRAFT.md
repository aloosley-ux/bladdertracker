# GitHub Issue Drafts

Use these if direct GitHub issue creation is unavailable.

---

## 1) Align invite roles with enforced access permissions

**Title:** Align invite role labels with actual access enforcement in invite acceptance

**Problem statement**
Invite roles shown in the UI and stored on invites do not fully match enforced access in acceptance logic. Non-parent invites are currently mapped to caregiver-level access during acceptance, which can mislead users about effective permissions.

**Evidence / affected files**
- `api/invites.ts` (accept flow maps role to parent/caregiver access type)
- `src/pages/ProfilesPage.tsx` (invite role options and labels)
- Docs referencing role-based invite behaviour

**Why it matters**
Role trust is central to data sharing safety. Misaligned labels can cause incorrect expectations and governance issues.

**Acceptance criteria**
- Canonical permission matrix is documented.
- Invite creation options reflect supported, enforced roles.
- Invite acceptance enforces the documented matrix.
- Docs updated to match implementation.

**Priority label suggestion:** `priority:high`
**Type label suggestion:** `bug`

---

## 2) Clarify and enforce reminder scope (milestones-only vs module-wide)

**Title:** Decide and standardize reminder scope across API, UI copy, and tests

**Problem statement**
Reminder preferences are modelled at module level in API/state, but portions of user-facing copy imply milestone-focused behaviour.

**Evidence / affected files**
- `api/modules.ts` reminder preferences endpoints/actions
- `src/pages/SettingsPage.tsx` reminder copy
- `src/pages/DashboardPage.tsx` reminder banner behaviour
- `docs/API.md`, `docs/MODULES.md`, `README.md`

**Why it matters**
Inconsistent scope creates confusion and complicates QA.

**Acceptance criteria**
- Product decision recorded (module-wide or milestone-only).
- UI copy, API docs, and behaviour all aligned.
- Automated test coverage added for chosen scope.

**Priority label suggestion:** `priority:medium`
**Type label suggestion:** `enhancement`

---

## 3) Add API-level permission and contract tests

**Title:** Add focused tests for server handlers and role-sensitive access control

**Problem statement**
Current automated tests are strong on frontend flows but limited for server handlers and role-sensitive behaviour.

**Evidence / affected files**
- `api/auth.ts`
- `api/children.ts`
- `api/invites.ts`
- `api/modules.ts`
- `api/trackers.ts`

**Why it matters**
Permissions and API contract regressions are high-risk in shared-care data systems.

**Acceptance criteria**
- Add automated tests covering auth/session paths, access checks, and invite acceptance edge cases.
- Include reminder/module endpoints in API tests.
- Document how to run API tests in `CONTRIBUTING.md`.

**Priority label suggestion:** `priority:high`
**Type label suggestion:** `tech-debt`

---

## 4) Validate therapist/specialist role completeness or de-scope docs

**Title:** Validate therapist/specialist role workflow end-to-end and align docs

**Problem statement**
Role types include `therapist` and `specialist`, but current signup/invite UX and permission mapping suggest partial support.

**Evidence / affected files**
- `src/types/index.ts`
- `src/pages/LoginPage.tsx`
- `src/pages/ProfilesPage.tsx`
- `api/invites.ts`

**Why it matters**
Role claims should match real, testable behaviour.

**Acceptance criteria**
- Confirm intended support level for therapist/specialist roles.
- Either implement full supported flows or remove/soften claims in docs/UI.
- Add tests for whichever behaviour is retained.

**Priority label suggestion:** `priority:medium`
**Type label suggestion:** `needs-validation`

---

## 5) Run cloud/local parity audit for extended tracker fields

**Title:** Verify cloud/local parity for extended tracker fields and import/export paths

**Problem statement**
Extended tracker fields require parity across local storage, APIs, DB schema, and import/export paths; this needs explicit validation.

**Evidence / affected files**
- `src/utils/storage.ts`
- `src/utils/api.ts`
- `api/trackers.ts`
- `api/data.ts`
- `api/migrate.ts`

**Why it matters**
Parity gaps can silently drop data or produce inconsistent reporting between modes.

**Acceptance criteria**
- Document parity matrix for each tracker field.
- Add tests for fields previously unverified.
- Patch any missing mappings.

**Priority label suggestion:** `priority:medium`
**Type label suggestion:** `needs-validation`
