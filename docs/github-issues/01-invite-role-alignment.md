# Issue: Align invite role labels with actual access enforcement in invite acceptance

**Status:** ✅ Resolved in March 2026 alignment pass

**Labels:** `bug`, `priority:high`

---

## Problem statement

Invite roles shown in the UI and stored on invites did not fully match the enforced access granted during acceptance. Non-parent invites (including `schoolAdmin`) were mapped to caregiver-level `child_access` at the database layer, but notification messages and UI copy implied the invitee received the full named role.

Additionally, the invite creation UI allowed `admin` as an invite role option, which would silently grant only caregiver-level access (deeply misleading).

## Evidence / affected files

- `api/invites.ts` — acceptance mapped all non-parent roles to caregiver without explaining this in notifications
- `src/pages/ProfilesPage.tsx` — `getInviteRoles()` included `admin` as an option for admin users
- `docs/API.md` — no canonical permission matrix; stale note said "currently maps access to parent or caregiver"

## Why it matters

Users invited with a `schoolAdmin` label might expect schoolAdmin-level permissions distinct from a regular caregiver invite. In practice they receive identical DB access. An `admin` invite granting caregiver access could create false expectations of elevated access.

## Acceptance criteria

- [x] `admin` is removed from valid invite role options in the UI.
- [x] Invite creation API validates role; rejects `admin`, `therapist`, `specialist`.
- [x] Acceptance API validates role before granting access; rejects unsupported roles.
- [x] Notification messages accurately state the `access_type` granted (`parent access` or `caregiver access`), not just the invite role label.
- [x] Canonical permission matrix documented in `docs/API.md`.
- [x] Unit tests verify role-to-access-type mapping for all supported invite roles.

## Implementation notes

- Permission matrix: `parent` → `parent` DB access; `caregiver` / `schoolAdmin` → `caregiver` DB access.
- `schoolAdmin` is retained as a label because it carries contextual meaning at the school boundary, even though the DB access type is `caregiver`.
- Tests added: `src/test/invites.test.ts`.

## Files changed

- `api/invites.ts`
- `src/pages/ProfilesPage.tsx`
- `docs/API.md`
- `src/test/invites.test.ts` (new)
