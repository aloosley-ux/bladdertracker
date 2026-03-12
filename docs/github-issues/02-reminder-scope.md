# Issue: Decide and standardise reminder scope across API, UI copy, and tests

**Status:** ✅ Resolved in March 2026 alignment pass

**Labels:** `enhancement`, `priority:medium`

---

## Problem statement

Reminder preferences were modelled at module level in API/state (supporting `milestones`, `therapy`, `routine`, `mood`), but user-facing copy in SettingsPage referred to "milestone reminders" and the Dashboard reminder banner linked exclusively to `/milestones` for all reminder types — even when the active reminder was for `therapy` or `routine`.

## Evidence / affected files

- `src/pages/SettingsPage.tsx` — "Opt in to daily or weekly **milestone** reminders"
- `src/pages/DashboardPage.tsx` — reminder banner always linked to `/milestones` with "Review milestones" text
- `docs/API.md` — reminder section lacked a clear scope statement
- `docs/MODULES.md` — reminder section said "UI currently focuses on milestone reminders"

## Why it matters

A user with a `therapy` reminder enabled would click the dashboard reminder banner and land on the Milestones page, not the therapy-relevant page. The inconsistency between model and copy could confuse parents and carers about which modules the reminder applies to.

## Decision

**Reminders are module-wide, not milestone-only.**

This matches the existing data model (`reminder_preferences` table scoped per user + child + module) and avoids a regression to milestone-only behaviour.

## Acceptance criteria

- [x] SettingsPage copy reads "module reminders", not "milestone reminders".
- [x] Dashboard reminder banner links to `/settings` and reads "Review reminders".
- [x] `docs/API.md` states reminders are module-wide with a clear scope definition.
- [x] `docs/MODULES.md` states the module-wide decision explicitly.
- [x] Unit tests verify reminder scoping behaviour.

## Implementation notes

Supported reminder modules: `milestones`, `therapy`, `routine`, `mood` (controlled by `REMINDER_ENABLED_MODULES` constant in `SettingsPage.tsx`).

## Files changed

- `src/pages/SettingsPage.tsx`
- `src/pages/DashboardPage.tsx`
- `docs/API.md`
- `docs/MODULES.md`
- `src/test/reminderScope.test.ts` (new)
