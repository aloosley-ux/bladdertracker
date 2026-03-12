# Issue: Add focused tests for server handlers and role-sensitive access control

**Status:** ✅ Partially resolved in March 2026 alignment pass

**Labels:** `tech-debt`, `priority:high`

---

## Problem statement

Frontend coverage (route smoke tests, storage CRUD tests, accessibility checks) was stronger than server-handler and role-sensitive coverage. Core server handlers (`api/invites.ts`, `api/auth.ts`, `api/modules.ts`) had no automated tests.

## Evidence / affected files

- `api/auth.ts`, `api/children.ts`, `api/invites.ts`, `api/modules.ts`, `api/trackers.ts`
- `src/test/` — no invite, reminder scope, or permission-level tests existed

## What was done

- Added `src/test/invites.test.ts`: tests for invite role-to-access-type mapping, acceptance logic (parent/caregiver/schoolAdmin invite outcomes, email mismatch rejection, non-existent token rejection, status transition).
- Added `src/test/reminderScope.test.ts`: tests for module-wide reminder scoping, due/snoozed states, per-child filtering, and multi-module independence.
- Updated `CONTRIBUTING.md` with a test file map so contributors know what each file covers.

## Remaining gap

These tests use the local storage layer (not the cloud API handlers). True server-handler integration tests (requiring a DB or handler mock) are not yet present. This is tracked in `docs/REPO_STATUS.md` as a follow-up item.

## Acceptance criteria

- [x] Invite role mapping logic has automated test coverage.
- [x] Reminder scope behaviour has automated test coverage.
- [x] Test file map documented in `CONTRIBUTING.md`.
- [ ] *(Follow-up)* End-to-end server handler integration tests with DB or mock.

## Files changed

- `src/test/invites.test.ts` (new)
- `src/test/reminderScope.test.ts` (new)
- `CONTRIBUTING.md`
