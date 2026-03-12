# Issue: Verify cloud/local parity for extended tracker fields and import/export paths

**Status:** ✅ Resolved in March 2026 alignment pass

**Labels:** `needs-validation`, `priority:medium`

---

## Problem statement

Extended tracker fields added to the frontend type definitions and local storage were not persisted in the cloud (DB schema, API payloads) or included in CSV export/import. This created a silent data loss path for users switching between local and cloud modes.

**Sleep extended fields (pre-fix status):**
- `bedtime`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV
- `sleepOnsetMinutes`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV
- `nightActivity`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV

**Food extended fields (pre-fix status):**
- `isTrying`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV
- `texture`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV
- `accepted`: ✅ types, ✅ localStorage — ❌ DB schema, ❌ API GET/POST/PUT, ❌ CSV

## What was fixed

- `api/_lib/db.ts`: Added columns to `sleep_entries` (`bedtime`, `sleep_onset_minutes`, `night_activity`) and `food_entries` (`is_trying`, `texture`, `accepted`) in both `CREATE TABLE` and idempotent `ALTER TABLE IF NOT EXISTS` migration statements.
- `api/trackers.ts`: Updated `handleGet`, `handlePost`, `handlePut` for sleep and food to include all extended fields.
- `api/data.ts`: Updated CSV export queries and row formatters; updated import handler to include extended fields. Updated the `EntryPayload` interface.
- `docs/MODULES.md`: Added a cloud/local parity matrix.

## Acceptance criteria

- [x] `bedtime`, `sleepOnsetMinutes`, `nightActivity` round-trip through DB schema, API GET/POST/PUT, and CSV export/import.
- [x] `isTrying`, `texture`, `accepted` round-trip through DB schema, API GET/POST/PUT, and CSV export/import.
- [x] Migration is idempotent (`ALTER TABLE IF NOT EXISTS` guards existing deployments).
- [x] Parity matrix documented in `docs/MODULES.md`.
- [x] API TypeScript check passes (`npx tsc --project tsconfig.api.json --noEmit`).

## Files changed

- `api/_lib/db.ts`
- `api/trackers.ts`
- `api/data.ts`
- `docs/MODULES.md`
