
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
