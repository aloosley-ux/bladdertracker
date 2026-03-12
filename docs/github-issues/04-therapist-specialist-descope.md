# Issue: Validate therapist/specialist role completeness or de-scope docs

**Status:** ✅ Resolved (de-scoped) in March 2026 alignment pass

**Labels:** `needs-validation`, `priority:medium`

---

## Problem statement

`therapist` and `specialist` were present in the `UserRole` TypeScript union and referenced in the type comment as if they were supported roles with distinct capabilities. However:

- Neither role appeared as an option in the registration UI (`LoginPage.tsx`).
- Neither role appeared as an invite option in `ProfilesPage.tsx`.
- Neither role could be used to create an invite via `api/invites.ts`.
- The DB `accounts` table constraint was updated to allow these roles, but no user-facing workflow supported creating such accounts.
- Type comments described specific capabilities (`therapist: View/edit entries and milestones for assigned children`) that were not enforced anywhere in code.

## Decision

**De-scope.** The roles are retained in the type union for future use, but:
- The type comment now clearly states they are "reserved for future implementation — not yet available in registration or invite flows".
- `api/invites.ts` explicitly rejects these roles in both invite creation and acceptance.
- Documentation no longer claims capabilities that are not enforced.

## Acceptance criteria

- [x] `UserRole` type comment accurately marks `therapist` and `specialist` as reserved/future.
- [x] `api/invites.ts` rejects `therapist` and `specialist` as invite roles.
- [x] No UI element implies these roles are supported for registration or invite.
- [x] Docs do not describe scoped permissions for these roles unless they are enforced.

## Files changed

- `src/types/index.ts`
- `api/invites.ts`
- `docs/API.md`

## Follow-up (if roles are later implemented)

When therapist/specialist is implemented, the following must be added:
- Registration UI option with accurate role description
- Invite UI option (guarded by appropriate inviter role check)
- API validation allowing the role in creation + acceptance
- DB access enforcement distinguishing therapist/specialist from caregiver (if intended)
- Test coverage for the new role workflows
