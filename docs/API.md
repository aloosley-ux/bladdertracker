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
| `register` | `name`, `email`, `password`, `role?` | Creates account + signs in. |
| `login` | `email`, `password` | Signs in existing account. |
| `logout` | none | Clears session cookie. |
| `reset` | `email`, `password` | Resets password for matching account. |
| `promote` | `key` | Promotes signed-in user to `admin` when key is valid. |

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

### Toilet attempt fields
`outcome`, `supervised`, `prompted`, `durationMinutes?`, `notes?`

### Food fields
`mealType`, `description`, `portions?`, `isTrying?`, `texture?`, `accepted?`, `notes?`

---

## New modules + preferences — `/api/modules`

### Entry types
`mood | sensory | medication | therapy | routine | milestones`

### Module toggles
- `GET /api/modules?type=enabled_modules&childId=<id>` → `{ modules: ModuleId[] }`
- `POST /api/modules` with `{ action: 'set_enabled_modules', childId, modules }` → `{ ok: true }`

### Reminder preferences
- `GET /api/modules?type=reminder_preferences[&childId=<id>]` → `{ reminders: ReminderPreference[] }`
- `POST /api/modules` with `{ action: 'set_reminder_preferences', childId, reminders }` → `{ ok: true }`

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
| `POST` | `{ childId, email, role }` | Creates invite |
| `POST` | `{ action: 'accept', token }` | Accepts invite |

Notes:
- Invite acceptance currently maps access to `parent` or `caregiver` at database access level.
- UI currently offers invite roles based on current user role (see `src/pages/ProfilesPage.tsx`).

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
