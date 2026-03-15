# Repository Status — Remaining Work Only

Last updated: March 2026 (post alignment pass).

This is the single durable list of unresolved work. Completed items are removed; add new items as they are confirmed.

## Resolved in March 2026 alignment pass (no longer tracked here)

The following items were completed and removed:
- Invite role labels now match enforced access model (`api/invites.ts`, `ProfilesPage.tsx`, `docs/API.md`).
- Reminder scope standardised as module-wide; UI copy and docs updated (`SettingsPage.tsx`, `DashboardPage.tsx`, `docs/MODULES.md`).
- Invite and reminder scope unit tests added (`src/test/invites.test.ts`, `src/test/reminderScope.test.ts`).
- Therapist/specialist roles are now documented as invite-only contextual labels with caregiver-level access.
- Extended sleep/food fields (`bedtime`, `sleepOnsetMinutes`, `nightActivity`, `isTrying`, `texture`, `accepted`) are now fully round-tripped through DB schema, API GET/POST/PUT, CSV export, and CSV import.
- Cloud/local parity matrix added to `docs/MODULES.md`.

---

## Confirmed documentation follow-up

### 1) README density
- **Description:** README contains long narrative sections that can drift from reality. It should point to `docs/REPO_STATUS.md` as the authoritative remaining-work list.
- **Priority:** Low
- **Recommended next action:** Periodic trim to remove aspirational claims; ensure "What you can do today" section is current.

## Nice-to-have polish

### 2) Build chunk-size warning
- **Description:** Build warnings indicate large chunks; optimization is not blocking.
- **Affected areas:** `vite.config.ts`, reports/chart imports.
- **Priority:** Low
- **Recommended next action:** Profile bundle and apply targeted lazy-loading/splitting where impact is measurable.


### 3) Live API integration test depends on external hostname
- **Description:** `src/test/integration/api-auth.integration.test.ts` hits a fixed deployed Vercel hostname. In isolated or offline environments, `npm test` can fail even when the local/unit suite is healthy.
- **Priority:** Low
- **Recommended next action:** Convert the test to a configurable base URL, mock it locally, or gate it behind an explicit integration-test flag
