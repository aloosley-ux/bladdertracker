# API Reference

All endpoints are Vercel Serverless Functions at `/api/`. Authentication is via JWT stored in an HttpOnly cookie (`bt_session`).

---

## Authentication — `/api/auth`

### `GET /api/auth`
Returns the current session user.

**Response:**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "parent" } }
```
Returns `{ "user": null }` when not authenticated.

---

### `POST /api/auth`

| `action` | Body fields | Description |
|----------|-------------|-------------|
| `register` | `name, email, password, role` | Create a new account. Sets session cookie. |
| `login` | `email, password` | Sign in to an existing account. Sets session cookie. |
| `logout` | _(none)_ | Clears the session cookie. |
| `reset` | `email, password` | Reset password (must be the account owner). |

**Roles:** `parent`, `caregiver`, `schoolAdmin`, `therapist`, `specialist`

---

### `DELETE /api/auth`
Permanently deletes the authenticated user's account and **all associated data** (children, diary entries, milestones, sessions, audit events). GDPR right-to-erasure implementation.

**Response:** `{ "ok": true }`

---

## Children — `/api/children`

| Method | Body / Query | Description |
|--------|-------------|-------------|
| `GET` | — | List all children accessible to the current user |
| `POST` | `{ name, dateOfBirth? }` | Create a child profile |
| `PUT` | `{ id, name, dateOfBirth? }` | Update a child profile |
| `DELETE` | `?id=<childId>` | Delete a child and all their data |

**Response for GET:** `{ "children": Child[] }`

---

## Drinks — `/api/drinks`

| Method | Body / Query | Description |
|--------|-------------|-------------|
| `GET` | — | List drink entries for all accessible children |
| `POST` | `{ childId, date, time, amountMl, type, notes? }` | Create a drink entry |
| `PUT` | `{ id, date, time, amountMl, type, notes? }` | Update a drink entry |
| `DELETE` | `?id=<entryId>` | Delete a drink entry |

---

## Urine — `/api/urine`

| Method | Body / Query | Description |
|--------|-------------|-------------|
| `GET` | — | List urine entries |
| `POST` | `{ childId, date, time, wet, pass, volumeMl?, urgency?, leakageAmount?, notes? }` | Create |
| `PUT` | `{ id, ...fields }` | Update |
| `DELETE` | `?id=<entryId>` | Delete |

---

## Bowel — `/api/bowel`

| Method | Body / Query | Description |
|--------|-------------|-------------|
| `GET` | — | List bowel entries |
| `POST` | `{ childId, date, time, bristolType, amount, location, laxativesGiven, notes? }` | Create |
| `PUT` | `{ id, ...fields }` | Update |
| `DELETE` | `?id=<entryId>` | Delete |

---

## Trackers — `/api/trackers`

Handles sleep, toilet attempts, and food entries via `?type=` query parameter.

| Method | Query | Body | Description |
|--------|-------|------|-------------|
| `GET` | `?type=sleep\|toilet\|food` | — | List entries |
| `POST` | — | `{ trackerType: 'sleep'\|'toilet'\|'food', childId, date, time, ...typeFields }` | Create |
| `PUT` | — | `{ trackerType, id, ...fields }` | Update |
| `DELETE` | `?type=sleep\|toilet\|food&id=<entryId>` | — | Delete |

### Sleep entry fields
`{ eventType: 'onset'\|'wake'\|'nap'\|'disturbed', durationMinutes?, quality?: 1-5, nighttimeEvent: boolean, notes? }`

### Toilet attempt fields
`{ outcome: 'success'\|'failure'\|'refused', supervised: boolean, prompted: boolean, durationMinutes?, notes? }`

### Food entry fields
`{ mealType: 'breakfast'\|'lunch'\|'dinner'\|'snack', description, portions?: number, notes? }`

---

## Modules — `/api/modules`

Consolidated endpoint for 6 newer tracker types and enabled-modules management.

### GET — list entries
`GET /api/modules?type=<trackerType>`

Valid types: `mood`, `sensory`, `medication`, `therapy`, `routine`, `milestones`

**Response:** `{ "entries": Entry[] }`

### GET — enabled modules
`GET /api/modules?type=enabled_modules&childId=<id>`

**Response:** `{ "modules": ["mood", "therapy", ...] }`

### POST — create entry
```json
{
  "trackerType": "mood",
  "childId": "...",
  "date": "2026-03-07",
  "time": "14:30",
  "level": 4,
  "triggers": "transition",
  "notes": ""
}
```

### POST — set enabled modules
```json
{
  "action": "set_enabled_modules",
  "childId": "...",
  "modules": ["mood", "sensory", "medication"]
}
```

### PUT — update entry
```json
{
  "trackerType": "mood",
  "id": "...",
  "date": "2026-03-07",
  "time": "14:30",
  "level": 3,
  "triggers": "",
  "notes": "updated"
}
```

### DELETE — delete entry
`DELETE /api/modules?type=mood&id=<entryId>`

#### Module-specific fields

| Module | Extra fields |
|--------|-------------|
| `mood` | `level: 1-5`, `triggers: string` |
| `sensory` | `sensoryType: string`, `response: 'seeking'\|'avoiding'\|'neutral'`, `intensity: 1-5` |
| `medication` | `name: string`, `dosage: string`, `administered: boolean` |
| `therapy` | `therapyType: string`, `provider: string`, `durationMinutes: number`, `goals: string` |
| `routine` | `routineName: string`, `completed: boolean`, `durationMinutes: number\|null` |
| `milestones` | `name: string`, `description: string`, `category: string`, `status: 'not_started'\|'in_progress'\|'achieved'`, `dateAchieved: string\|null` |

---

## Invites — `/api/invites`

| Method | Body | Description |
|--------|------|-------------|
| `GET` | — | List pending invites for the current user |
| `POST` | `{ childId, email, role }` | Create a new invite (parent/admin only) |
| `POST` | `{ action: 'accept', token }` | Accept an invite using the token |

---

## Notifications — `/api/notifications`

| Method | Body | Description |
|--------|------|-------------|
| `GET` | — | List notifications for current user |
| `PUT` | `{ id }` | Mark a notification as read |

---

## Audit — `/api/audit`

| Method | Description |
|--------|-------------|
| `GET` | Returns audit event log for the current user |

---

## Data Export / Import — `/api/data`

| Method | Query / Body | Description |
|--------|-------------|-------------|
| `GET` | `?childId=<id>` | Export all data for a child as CSV download |
| `POST` | `{ childId, drinks?, urineEntries?, bowelEntries?, ... }` | Bulk import data |

---

## Migration — `/api/migrate`

| Method | Description |
|--------|-------------|
| `POST` | Run idempotent database schema migration (creates all tables if not exist) |

---

## Error Responses

All endpoints return JSON error objects on failure:

```json
{ "error": "Not authenticated" }       // 401
{ "error": "Access denied" }           // 403
{ "error": "Entry id is required" }    // 400
{ "error": "Internal server error" }   // 500
```

---

## Authentication Details

- Session tokens are JWTs signed with `JWT_SECRET` environment variable
- Stored in HttpOnly, Secure, SameSite=Strict cookies named `bt_session`
- `getAccessibleChildIds(userId)` in `api/_lib/db.ts` returns all child IDs the user can access (own children + invited access)
