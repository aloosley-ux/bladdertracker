# API Reference

All server endpoints are Vercel functions under `/api/*`. Cloud mode is enabled when `VITE_USE_CLOUD=true`; local mode bypasses these APIs and uses `localStorage` via `src/utils/storage.ts`.

Authentication uses JWT session cookies (`bt_session`) in HttpOnly cookies.

## Authentication — `/api/auth`

### `GET /api/auth`
Returns current session:
- `{ "user": User }` when signed in
- `{ "user": null }` when not signed in

### `POST /api/auth`
Use `action` in body.

| Action | Required fields | Notes |
|---|---|---|
| `register` | `name`, `email`, `password`, `role?` | Creates account + signs in. Valid roles for self-registration: `parent`, `caregiver`, `schoolAdmin`. |
| `login` | `email`, `password` | Signs in existing account. |
| `logout` | none | Clears session cookie. |
| `reset` | `email`, `password` | Resets password for matching account. |
| `promote` | `key` | Promotes signed-in user to `admin` when key matches `ADMIN_ACCESS_KEY` env var. |

### `DELETE /api/auth`
Deletes the signed-in account and related data. Returns `{ "ok": true }`.

---

## Children — `/api/children`

| Method | Payload | Result |
|---|---|---|
| `GET` | — | `{ children: Child[] }` |
| `POST` | `{ name, dateOfBirth? }` | `{ child: Child }` |
| `PUT` | `{ id, ...partialChild }` | `{ ok: true }` |
| `DELETE` | `?id=<childId>` | `{ ok: true }` |

---

## Core tracker endpoints

### Drinks — `/api/drinks`
CRUD for drink entries.

### Urine — `/api/urine`
CRUD for urine entries.
- `leakageAmount` values: `none | small | medium | large`

### Bowel — `/api/bowel`
CRUD for bowel entries.

---

## Consolidated tracker endpoint — `/api/trackers`
Handles sleep, toilet attempts, and food entries.

| Method | Query/body requirement |
|---|---|
| `GET` | `?type=sleep|toilet_attempt|food` |
| `POST` | body includes `trackerType: 'sleep'|'toilet_attempt'|'food'` |
| `PUT` | body includes `trackerType` and `id` |
| `DELETE` | `?type=sleep|toilet_attempt|food&id=<entryId>` |

### Sleep fields
`eventType`, `durationMinutes?`, `quality?`, `nighttimeEvent?`, `bedtime?`, `sleepOnsetMinutes?`, `nightActivity?`, `notes?`

All extended sleep fields (`bedtime`, `sleepOnsetMinutes`, `nightActivity`) are persisted in both cloud (DB) and local (localStorage) modes. The CSV export includes these fields.

### Toilet attempt fields
`outcome`, `supervised`, `prompted`, `durationMinutes?`, `notes?`

### Food fields
`mealType`, `description`, `portions?`, `isTrying?`, `texture?`, `accepted?`, `notes?`

All extended food fields (`isTrying`, `texture`, `accepted`) are persisted in both cloud (DB) and local (localStorage) modes. The CSV export includes these fields.

---

## New modules + preferences — `/api/modules`

### Entry types
`mood | sensory | medication | therapy | routine | milestones`

### Module toggles
- `GET /api/modules?type=enabled_modules&childId=<id>` → `{ modules: ModuleId[] }`
- `POST /api/modules` with `{ action: 'set_enabled_modules', childId, modules }` → `{ ok: true }`

### Reminder preferences
Reminders are **module-wide** (not milestone-only). Any enabled module can have a reminder preference. Supported reminder modules: `milestones`, `therapy`, `routine`, `mood`.

- `GET /api/modules?type=reminder_preferences[&childId=<id>]` → `{ reminders: ReminderPreference[] }`
- `POST /api/modules` with `{ action: 'set_reminder_preferences', childId, reminders }` → `{ ok: true }`

Each `ReminderPreference` object:
```json
{
  "moduleId": "therapy",
  "frequency": "daily | weekly",
  "enabled": true,
  "snoozedUntil": "ISO timestamp or null",
  "nextReminderAt": "ISO timestamp or null"
}
```

### Entry CRUD
- `GET /api/modules?type=<entryType>`
- `POST /api/modules` with `{ trackerType: <entryType>, ...fields }`
- `PUT /api/modules` with `{ trackerType: <entryType>, id, ...fields }`
- `DELETE /api/modules?type=<entryType>&id=<entryId>`

Milestones include `moduleId?`, `milestoneType?`, `targetDate?`, `dateAchieved?`, `sourceRole?`.

---

## Invites — `/api/invites`

| Method | Payload | Result |
|---|---|---|
| `GET` | — | `{ invites: CaregiverInvite[] }` |
| `POST` | `{ childId, email, role }` | Creates invite. Valid roles: `parent`, `caregiver`, `schoolAdmin`, `therapist`, `specialist`. |
| `POST` | `{ action: 'accept', token }` | Accepts invite, grants diary access. |

### Invite permission matrix

| Invite role | DB `access_type` granted | Effective diary access |
|---|---|---|
| `parent` | `parent` | Read + write all entries; can manage child profile and send invites |
| `caregiver` | `caregiver` | Read + write diary entries for the shared child |
| `schoolAdmin` | `caregiver` | Read + write diary entries (same as caregiver; label is contextual only) |
| `therapist` | `caregiver` | View diary entries + log therapy and milestone entries (label is contextual only) |
| `specialist` | `caregiver` | View diary entries + log therapy and milestone entries (label is contextual only) |

Notes:
- `admin` is not a valid invite role. Admin access is granted via the `promote` auth action, not via invites.
- Acceptance is rejected if the invite token is invalid, already used, or the acceptor's email does not match.
- Notification messages accurately reflect the `access_type` granted, not just the invite role label.

---

## Notifications — `/api/notifications`
- `GET` list notifications.
- `PUT` `{ id }` marks one notification as read.

## Audit — `/api/audit`
- `GET` latest audit events for signed-in user.

## Data import/export — `/api/data`
- `GET ?childId=<id>` returns CSV export.
- `POST` accepts bulk import payload for core trackers.

## Schema migration — `/api/migrate`
- `POST` runs idempotent schema/table setup.

---

## Common error responses

```json
{ "error": "Not authenticated" }
{ "error": "Access denied" }
{ "error": "Method not allowed" }
{ "error": "Internal server error" }
```
