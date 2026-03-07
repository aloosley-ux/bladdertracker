# BladderTracker 🧸

A responsive web app for families to digitally track paediatric bladder, bowel, sleep, food, and behaviour diaries. Built with React 19 + TypeScript, Vite 7, and Tailwind CSS 4, with optional cloud sync via Neon Postgres and Vercel Serverless Functions.

---

## Table of Contents

1. [Features](#features)
2. [Project Architecture](#project-architecture)
3. [Local Development](#local-development)
4. [Cloud Deployment (Vercel + Neon DB)](#cloud-deployment-vercel--neon-db)
5. [Database Migration](#database-migration)
6. [Troubleshooting](#troubleshooting)
7. [Security, Privacy & Compliance](#security-privacy--compliance)
8. [Contribution & Extension Guide](#contribution--extension-guide)

---

## Features

### Tracker Types

| Tracker | Description | Key Fields |
|---|---|---|
| **Drink** | Log fluid intake | Time, type (cup/beaker/bottle/sippy/other), amount (ml), notes |
| **Urine** | Log bladder events | Wet/pass, voiding volume (ml), urgency (1–5), leakage (none/small/medium/large), notes |
| **Bowel** | Log bowel events | Location (toilet/nappy), amount (S/M/L), Bristol Stool Chart type (1–7 visual picker), laxatives given, image URL, notes |
| **Sleep** | Log sleep events | Event type (onset/wake/nap_start/nap_end), duration (min), quality (1–5), nighttime flag, notes |
| **Toilet Attempt** | Log prompted toilet sits | Outcome (success/failure/no_event), supervised, prompted, duration (min), notes |
| **Food** | Log meals and snacks | Meal type (breakfast/lunch/dinner/snack), description, portions, notes |

### Core Features

- **Cloud-synced accounts** — Register, sign in, reset password; data syncs across all devices
- **Multi-child profiles** — Create and switch between multiple child profiles
- **Role-based access control** — Four roles: `admin`, `parent`, `caregiver`, `schoolAdmin`
- **Caregiver invites** — Secure token-based invite links for sharing child access
- **Dashboard** — Daily/weekly overview with calendar strip, fluid balance, and clinical reminders
- **Charts & insights** — Fluid intake bar chart, event timeline, stool type distribution (Recharts)
- **Monthly calendar** — Day cells with coloured indicators for each entry type
- **CSV export** — Full diary export (all 6 tracker types) for clinic visits
- **Import** — Bulk import via CSV, JSON, or XLSX (all tracker types supported)
- **Notifications** — System notifications for invite acceptance and data changes
- **Audit trail** — Timestamped log of all data create/update/delete operations
- **Clinical guidance** — Dashboard reminders for constipation and bladder health
- **Mobile-first design** — Responsive layout optimised for phones (max-width 48rem)
- **Dual storage modes** — Local (localStorage, no setup) or Cloud (Neon Postgres + Vercel)
- **Admin panel** — User management, role changes, and account deletion (access via `?admin-access=bladdertracker-admin-2024`)

### Data Storage Modes

| Feature | Local Mode (default) | Cloud Mode (`VITE_USE_CLOUD=true`) |
|---|---|---|
| Storage | Browser localStorage | Neon Postgres via Vercel Serverless |
| Cross-device sync | ❌ | ✅ |
| Auth backend | Client-side PBKDF2 (600 k iterations) | Server-side bcrypt (cost 12) + JWT cookies |
| Invite system | Same-browser only | Cross-device, persistent |
| CSV import/export | ✅ | ✅ (all 6 tracker types) |
| Offline support | ✅ | ❌ |

---

## Project Architecture

### Repository Structure

```
bladdertracker/
├── api/                          # Vercel Serverless Functions (Node.js)
│   ├── _lib/                     # Shared helpers (not deployed as functions)
│   │   ├── auth.ts               # JWT session management, CORS, cookie helpers
│   │   └── db.ts                 # Neon Postgres connection, migration, shared queries
│   ├── auth.ts                   # GET/POST /api/auth  — register, login, logout, reset, session
│   ├── children.ts               # GET/POST/PUT /api/children
│   ├── drinks.ts                 # GET/POST/PUT/DELETE /api/drinks
│   ├── urine.ts                  # GET/POST/PUT/DELETE /api/urine
│   ├── bowel.ts                  # GET/POST/PUT/DELETE /api/bowel
│   ├── trackers.ts               # GET/POST/PUT/DELETE /api/trackers  — sleep, toilet_attempt, food
│   ├── invites.ts                # GET/POST /api/invites  — create & accept
│   ├── notifications.ts          # GET/PUT /api/notifications
│   ├── audit.ts                  # GET /api/audit
│   ├── data.ts                   # GET /api/data (CSV export), POST /api/data (bulk import)
│   └── migrate.ts                # POST /api/migrate  — run DB schema migration
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── BottomNav.tsx         # Bottom navigation bar
│   │   ├── BristolStoolPicker.tsx # Visual Bristol Stool Chart picker
│   │   ├── CalendarStrip.tsx     # Horizontal calendar strip on dashboard
│   │   └── EntryCard.tsx         # Diary entry list item card
│   ├── context/                  # React Context — global app state
│   │   ├── AppContext.tsx        # Provider with all state & action methods
│   │   ├── appContextDef.ts      # Context shape definition
│   │   └── useApp.ts             # useApp() hook
│   ├── pages/                    # Routed page components
│   │   ├── DashboardPage.tsx     # Main daily overview dashboard
│   │   ├── AddEntryPage.tsx      # 6-tab diary entry form
│   │   ├── ChartsPage.tsx        # Analytics & charts (Recharts)
│   │   ├── CalendarPage.tsx      # Monthly calendar view
│   │   ├── ProfilePage.tsx       # User & child profile management
│   │   ├── CaregiverPortalPage.tsx  # Caregiver dashboard & invite acceptance
│   │   ├── AdminPage.tsx         # Admin panel (user management)
│   │   └── LoginPage.tsx         # Register / login / password reset
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces and types
│   ├── utils/
│   │   ├── api.ts                # Cloud API client (fetch-based)
│   │   ├── auth.ts               # Local-mode auth helpers (PBKDF2)
│   │   ├── importers.ts          # File parsers (CSV / JSON / XLSX)
│   │   └── storage.ts            # localStorage adapter (local mode)
│   ├── App.tsx                   # React Router routes
│   ├── index.css
│   └── main.tsx
├── index.html
├── vercel.json                   # Vercel build + rewrite config
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.api.json / tsconfig.node.json
└── package.json
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/auth` | Get current session user |
| `POST` | `/api/auth` | `action`: `register` / `login` / `logout` / `reset` |
| `GET` | `/api/children` | List accessible children |
| `POST` | `/api/children` | Create child profile |
| `PUT` | `/api/children` | Update child profile |
| `GET` | `/api/drinks` | List drink entries |
| `POST` | `/api/drinks` | Create drink entry |
| `PUT` | `/api/drinks` | Update drink entry |
| `DELETE` | `/api/drinks?id=` | Delete drink entry |
| `GET` | `/api/urine` | List urine entries |
| `POST` | `/api/urine` | Create urine entry |
| `PUT` | `/api/urine` | Update urine entry |
| `DELETE` | `/api/urine?id=` | Delete urine entry |
| `GET` | `/api/bowel` | List bowel entries |
| `POST` | `/api/bowel` | Create bowel entry |
| `PUT` | `/api/bowel` | Update bowel entry |
| `DELETE` | `/api/bowel?id=` | Delete bowel entry |
| `GET` | `/api/trackers?type=sleep\|toilet_attempt\|food` | List sleep / toilet attempt / food entries |
| `POST` | `/api/trackers` | Create sleep / toilet attempt / food entry (body: `trackerType`) |
| `PUT` | `/api/trackers` | Update sleep / toilet attempt / food entry |
| `DELETE` | `/api/trackers?type=&id=` | Delete sleep / toilet attempt / food entry |
| `GET` | `/api/invites` | List invites for current user |
| `POST` | `/api/invites?action=create` | Create caregiver invite |
| `POST` | `/api/invites?action=accept` | Accept invite by token |
| `GET` | `/api/notifications` | List notifications |
| `PUT` | `/api/notifications` | Mark notification as read |
| `GET` | `/api/audit` | List audit events |
| `GET` | `/api/data?childId=` | Export all diary data as CSV |
| `POST` | `/api/data` | Bulk import diary data (all 6 tracker types) |
| `POST` | `/api/migrate` | Run DB schema migration (idempotent) |

### TypeScript Types (src/types/index.ts)

```typescript
type UserRole = 'admin' | 'parent' | 'caregiver' | 'schoolAdmin';

interface User           // id, name, role, email, avatar, createdAt
interface Child          // id, name, dateOfBirth, avatar, caregivers[], parentIds[], createdBy
interface DrinkEntry     // childId, date, time, type, amountMl, notes
interface UrineEntry     // childId, date, time, wet, pass, volumeMl?, urgency?(1-5), leakageAmount?
interface BowelEntry     // childId, date, time, location, amount, bristolType(1-7), laxativesGiven
interface SleepEntry     // childId, date, time, eventType, durationMinutes?, quality?(1-5), nighttimeEvent?
interface ToiletAttemptEntry  // childId, date, time, outcome, supervised, prompted, durationMinutes?
interface FoodEntry      // childId, date, time, mealType, description, portions?, notes
interface CaregiverInvite     // childId, email, role, status, token, link
interface NotificationItem    // userId, title, message, read
interface AuditEvent          // userId, action, subject, detail
interface ImportedDiaryPayload  // all 6 entry array types
interface ImportSummary       // counts per type + errors[]
```

### localStorage Keys (local mode)

| Key | Contents |
|---|---|
| `bt_user` | Current logged-in user |
| `bt_accounts` | All registered accounts (hashed passwords) |
| `bt_children` | Child profiles |
| `bt_drinks` | Drink entries |
| `bt_urine` | Urine entries |
| `bt_bowel` | Bowel entries |
| `bt_sleep` | Sleep entries |
| `bt_toilet_attempts` | Toilet attempt entries |
| `bt_food` | Food entries |
| `bt_invites` | Caregiver invites |
| `bt_notifications` | Notifications |
| `bt_audit` | Audit events |

---

## Local Development

Local mode uses browser **localStorage** — no database or cloud account is needed.

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing All Features Locally

1. **Register an account** on the Login page. Your first registration sets up a local account.
2. **Add a child** profile from the Profile page (tap the avatar area or "Add Child").
3. **Log entries** on the Add Entry page — it has six tabs: Drink, Urine, Bowel, Sleep, Toilet Attempt, Food.
4. **View dashboard** for daily summary, fluid balance, and clinical reminders.
5. **Open Charts** for fluid intake charts and bowel distribution graphs.
6. **Open Calendar** to see a monthly view with colour-coded day indicators.
7. **Invite a caregiver** from the Profile page → share the generated link with another browser session.
8. **Export CSV** from the Profile page to download the full diary.
9. **Import CSV/JSON/XLSX** from the Profile page → Import Data.
10. **Access Admin panel** by appending `?admin-access=bladdertracker-admin-2024` to the URL. The Admin page lets you view and manage all registered accounts and change roles.

### Other Commands

```bash
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (reports errors only)
npm run preview   # Preview production build locally
```

---

## Cloud Deployment (Vercel + Neon DB)

### Prerequisites

- A [Vercel](https://vercel.com) account (Hobby tier or higher)
- A [Neon](https://neon.tech) Postgres database (free tier available)
- Vercel CLI: `npm install -g vercel`

### Step 1 — Create a Vercel Project

```bash
# In the repository root
vercel link
```

Follow the prompts to link (or create) a Vercel project. Alternatively, import the repository directly through the Vercel dashboard.

### Step 2 — Provision a Neon Postgres Database

**Option A — Vercel Marketplace (recommended)**

In the Vercel dashboard: **Storage → Add → Neon Postgres**. The integration automatically sets `DATABASE_URL`, `POSTGRES_URL`, `PGHOST`, `PGUSER`, `PGDATABASE`, and `PGPASSWORD` on your project.

**Option B — Neon directly**

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string from **Project → Connection Details**.

### Step 3 — Configure Environment Variables

Set the following in **Vercel → Project → Settings → Environment Variables** (or in `.env.local` for local Vercel dev):

```env
# Neon Postgres connection string (one of these is required)
DATABASE_URL="postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require"
# POSTGRES_URL is also supported as a fallback
POSTGRES_URL="postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require"

# Individual Postgres connection params (set automatically by Vercel–Neon integration)
PGHOST="ep-xxxxx.neon.tech"
PGUSER="user"
PGDATABASE="dbname"
PGPASSWORD="password"

# JWT secret — generate a strong random value (32+ characters)
JWT_SECRET="your-random-secret-here-change-this"

# Tell the frontend to use the cloud API instead of localStorage
VITE_USE_CLOUD="true"
```

> **Important:** `VITE_USE_CLOUD` must be set in the **Build Environment** in Vercel (not just at runtime) because Vite bakes it into the frontend bundle at build time.

### Step 4 — Deploy

```bash
vercel --prod
```

Or push to your main branch and let Vercel's GitHub integration deploy automatically.

### Step 5 — Run Database Migration

After the first deploy, initialise the Neon schema by calling the migration endpoint:

```bash
curl -X POST https://your-app.vercel.app/api/migrate
```

Expected response:

```json
{
  "ok": true,
  "log": [
    "accounts table ready",
    "children table ready",
    "child_access table ready",
    "drink_entries table ready",
    "urine_entries table ready",
    "urine_entries columns up to date",
    "bowel_entries table ready",
    "invites table ready",
    "notifications table ready",
    "audit_events table ready",
    "sleep_entries table ready",
    "toilet_attempt_entries table ready",
    "food_entries table ready"
  ]
}
```

The migration is **idempotent** — it uses `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE … ADD COLUMN IF NOT EXISTS`, so re-running it is safe.

### Step 6 — Sign Up and Configure Users

1. Open your deployed app and register the first account (any role).
2. To create an admin account, append `?admin-access=bladdertracker-admin-2024` to the URL and register there, or use the Admin page to promote an existing user.
3. Use the Profile page to add children, and use the Caregiver Portal to invite other users by email.

### Local Development with Cloud Backend

```bash
# Pull env vars from Vercel
vercel env pull .env.local

# Start the Vercel dev server (includes serverless functions)
vercel dev
```

---

## Database Migration

The migration is handled automatically by `POST /api/migrate` (implemented in `api/migrate.ts` → `api/_lib/db.ts`).

### Full Schema

```sql
-- Accounts (users)
CREATE TABLE IF NOT EXISTS accounts (
  id            TEXT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('parent','caregiver','schoolAdmin')),
  avatar        VARCHAR(512),
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- Child profiles
CREATE TABLE IF NOT EXISTS children (
  id              TEXT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  date_of_birth   VARCHAR(20)  DEFAULT '',
  avatar          VARCHAR(512),
  created_by      TEXT REFERENCES accounts(id),
  last_updated_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Child access grants (many-to-many users ↔ children)
CREATE TABLE IF NOT EXISTS child_access (
  id          TEXT PRIMARY KEY,
  child_id    TEXT REFERENCES children(id) ON DELETE CASCADE,
  user_id     TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('parent','caregiver')),
  UNIQUE(child_id, user_id)
);

-- Drink entries
CREATE TABLE IF NOT EXISTS drink_entries (
  id         TEXT PRIMARY KEY,
  child_id   TEXT REFERENCES children(id) ON DELETE CASCADE,
  date       VARCHAR(20)  NOT NULL,
  time       VARCHAR(10)  NOT NULL,
  type       VARCHAR(20)  NOT NULL,
  amount_ml  INTEGER      NOT NULL,
  notes      TEXT         DEFAULT '',
  created_by TEXT REFERENCES accounts(id),
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Urine entries
CREATE TABLE IF NOT EXISTS urine_entries (
  id             TEXT PRIMARY KEY,
  child_id       TEXT REFERENCES children(id) ON DELETE CASCADE,
  date           VARCHAR(20)  NOT NULL,
  time           VARCHAR(10)  NOT NULL,
  wet            BOOLEAN      DEFAULT FALSE,
  pass           BOOLEAN      DEFAULT FALSE,
  volume_ml      INTEGER,
  urgency        SMALLINT CHECK (urgency IS NULL OR (urgency BETWEEN 1 AND 5)),
  leakage_amount VARCHAR(10)  CHECK (leakage_amount IS NULL OR leakage_amount IN ('none','small','medium','large')),
  notes          TEXT         DEFAULT '',
  created_by     TEXT REFERENCES accounts(id),
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);
-- Safe column additions for existing installations
ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS volume_ml      INTEGER;
ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS urgency        SMALLINT;
ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS leakage_amount VARCHAR(10);

-- Bowel entries
CREATE TABLE IF NOT EXISTS bowel_entries (
  id             TEXT PRIMARY KEY,
  child_id       TEXT REFERENCES children(id) ON DELETE CASCADE,
  date           VARCHAR(20) NOT NULL,
  time           VARCHAR(10) NOT NULL,
  location       VARCHAR(20) NOT NULL,
  amount         VARCHAR(5)  NOT NULL,
  bristol_type   SMALLINT    NOT NULL,
  laxatives_given BOOLEAN    DEFAULT FALSE,
  notes          TEXT        DEFAULT '',
  image_url      VARCHAR(512),
  created_by     TEXT REFERENCES accounts(id),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep entries
CREATE TABLE IF NOT EXISTS sleep_entries (
  id               TEXT PRIMARY KEY,
  child_id         TEXT REFERENCES children(id) ON DELETE CASCADE,
  date             VARCHAR(20) NOT NULL,
  time             VARCHAR(10) NOT NULL,
  event_type       VARCHAR(20) NOT NULL CHECK (event_type IN ('onset','wake','nap_start','nap_end')),
  duration_minutes INTEGER,
  quality          SMALLINT CHECK (quality IS NULL OR (quality BETWEEN 1 AND 5)),
  nighttime_event  BOOLEAN     DEFAULT FALSE,
  notes            TEXT        DEFAULT '',
  created_by       TEXT REFERENCES accounts(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Toilet attempt entries
CREATE TABLE IF NOT EXISTS toilet_attempt_entries (
  id               TEXT PRIMARY KEY,
  child_id         TEXT REFERENCES children(id) ON DELETE CASCADE,
  date             VARCHAR(20) NOT NULL,
  time             VARCHAR(10) NOT NULL,
  outcome          VARCHAR(20) NOT NULL CHECK (outcome IN ('success','failure','no_event')),
  supervised       BOOLEAN     DEFAULT FALSE,
  prompted         BOOLEAN     DEFAULT FALSE,
  duration_minutes INTEGER,
  notes            TEXT        DEFAULT '',
  created_by       TEXT REFERENCES accounts(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Food entries
CREATE TABLE IF NOT EXISTS food_entries (
  id          TEXT PRIMARY KEY,
  child_id    TEXT REFERENCES children(id) ON DELETE CASCADE,
  date        VARCHAR(20) NOT NULL,
  time        VARCHAR(10) NOT NULL,
  meal_type   VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  description TEXT        NOT NULL DEFAULT '',
  portions    NUMERIC(5,2),
  notes       TEXT        DEFAULT '',
  created_by  TEXT REFERENCES accounts(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Caregiver invites
CREATE TABLE IF NOT EXISTS invites (
  id          TEXT PRIMARY KEY,
  child_id    TEXT REFERENCES children(id) ON DELETE CASCADE,
  child_name  VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  role        VARCHAR(20)  NOT NULL,
  status      VARCHAR(20)  DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  invited_by  TEXT REFERENCES accounts(id),
  token       VARCHAR(64)  UNIQUE NOT NULL,
  link        TEXT         NOT NULL,
  accepted_by TEXT REFERENCES accounts(id),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  read       BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Audit events
CREATE TABLE IF NOT EXISTS audit_events (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  action     VARCHAR(255) NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  detail     TEXT         DEFAULT '',
  created_at TIMESTAMPTZ  DEFAULT NOW()
);
```

### Applying Migrations to an Existing Deployment

```bash
# Re-run the migration at any time — it is safe and idempotent
curl -X POST https://your-app.vercel.app/api/migrate
```

To inspect the schema in Neon:

1. Open [console.neon.tech](https://console.neon.tech) → your project → **SQL Editor**.
2. Run `\dt` (list tables) or query a table directly:
   ```sql
   SELECT * FROM accounts LIMIT 10;
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

---

## Troubleshooting

### Children or entries are missing after deployment

1. Confirm `VITE_USE_CLOUD=true` is set **in the Build environment** in Vercel and that the project was redeployed after setting it.
2. Re-run the migration: `curl -X POST https://your-app.vercel.app/api/migrate` and check the response `log` array for any failed table.
3. Open Neon SQL Editor and verify the table exists and has rows.

### Features appear missing or broken after a schema update

Run the migration endpoint again — it adds new columns with `ALTER TABLE … ADD COLUMN IF NOT EXISTS` and will not lose existing data.

### API returns 401 Unauthorized

- Ensure `JWT_SECRET` is set in Vercel env vars and that a fresh login was performed after setting it.
- Session cookies are `SameSite=Lax, HttpOnly` — they are sent automatically by the browser on same-origin requests.

### Sleep / food / toilet attempt data not appearing in cloud mode

- Confirm `api/trackers.ts` is deployed (it is the serverless function that handles these three types).
- Check the Vercel Functions tab for any runtime errors.
- Verify the `sleep_entries`, `toilet_attempt_entries`, and `food_entries` tables exist in Neon by running the migration.

### CSV export is empty for some tracker types

- Cloud-mode export requires `sleep_entries`, `toilet_attempt_entries`, and `food_entries` tables. Re-run `POST /api/migrate`.
- Check the Vercel function logs for the `/api/data` function.

### Debugging API endpoints

```bash
# Check session
curl -b "bt_session=<your-cookie>" https://your-app.vercel.app/api/auth

# Check children
curl -b "bt_session=<your-cookie>" https://your-app.vercel.app/api/children

# Check drink entries
curl -b "bt_session=<your-cookie>" https://your-app.vercel.app/api/drinks
```

In Vercel: **Dashboard → Project → Functions → (function name) → Logs** for real-time serverless logs.

### Permission / role access issues

- Check `child_access` table in Neon for the expected `(child_id, user_id)` rows.
- The `getAccessibleChildIds()` helper in `api/_lib/db.ts` drives all access checks — it selects children where the user is `created_by` OR has a row in `child_access`.
- Only `parent` and `caregiver` entries are written to `child_access`; `admin` access is validated at the role level in each API handler.

### Feature toggling

Feature toggling is currently at the role level (roles determine which UI tabs and admin features are visible). Per-child feature flags are not yet implemented in the backend schema; they are tracked in the frontend context.

---

## Security, Privacy & Compliance

### Authentication & Sessions

- **Cloud mode:** Passwords hashed server-side with `bcrypt` (cost factor 12). Sessions use signed **JWT tokens** (HS256, 7-day expiry) stored in **httpOnly, SameSite=Lax** cookies. The `Secure` flag is set automatically in production.
- **Local mode:** Passwords hashed client-side with **PBKDF2-SHA-256** (600 000 iterations) in the Web Crypto API. No network calls; credentials never leave the browser.

### Role-Based Access Control

| Role | Capabilities |
|---|---|
| `admin` | Full access to all users, children, and data. Manage roles. Access via `/admin` route. |
| `parent` | Create children, manage their diary entries, invite caregivers. |
| `caregiver` | View and add entries for children they are invited to. Cannot delete children. |
| `schoolAdmin` | Same as caregiver with a school context label. |

### Data Isolation

- All API endpoints call `getAccessibleChildIds(userId)` before returning any data. Users can only read or write entries for children they created or were granted access to via `child_access`.
- Deletion of a child cascades via `ON DELETE CASCADE` to all related entries, invites, and access records.

### Audit Trail

Every create, update, and delete action inserts an `audit_events` row with the user ID, action, subject (child ID), and a human-readable detail string.

### GDPR Best Practices

- Users can export all their data as CSV at any time.
- Users can delete their account and all associated child data through the Admin panel.
- No third-party analytics or tracking scripts are included.
- Data stored in Neon Postgres is isolated to your own Neon project (EU or US region selectable at project creation).

---

## Contribution & Extension Guide

### Adding a New Tracker Type

1. **Define the TypeScript type** in `src/types/index.ts`:
   ```typescript
   export interface MoodEntry {
     id: string;
     childId: string;
     date: string;
     time: string;
     mood: 1 | 2 | 3 | 4 | 5;
     notes: string;
     createdBy: string;
     createdAt: string;
   }
   ```

2. **Add localStorage support** in `src/utils/storage.ts`:
   - Add a key to `STORAGE_KEYS` (e.g., `MOOD: 'bt_mood'`).
   - Add `getMoodEntries()`, `addMoodEntry()`, `updateMoodEntry()`, `deleteMoodEntry()` functions following the existing pattern.

3. **Add cloud API functions** in `src/utils/api.ts`:
   - If the tracker is simple (similar to drinks/urine/bowel), add a dedicated API file in `api/`.
   - If keeping under the 12 serverless function limit, extend `api/trackers.ts` with a new `trackerType` value.

4. **Add the DB table** in `api/_lib/db.ts` inside the `migrate()` function:
   ```sql
   CREATE TABLE IF NOT EXISTS mood_entries (
     id         TEXT PRIMARY KEY,
     child_id   TEXT REFERENCES children(id) ON DELETE CASCADE,
     date       VARCHAR(20) NOT NULL,
     time       VARCHAR(10) NOT NULL,
     mood       SMALLINT    NOT NULL CHECK (mood BETWEEN 1 AND 5),
     notes      TEXT        DEFAULT '',
     created_by TEXT REFERENCES accounts(id),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. **Update `AppContext.tsx`** to add state, CRUD methods, and data refresh logic for the new type.

6. **Add a UI tab** in `src/pages/AddEntryPage.tsx` (new tab in the 6-tab form).

7. **Update CSV export/import** in `api/data.ts` and `src/utils/importers.ts`.

8. **Re-run the migration** on your cloud deployment:
   ```bash
   curl -X POST https://your-app.vercel.app/api/migrate
   ```

### Adding a New User Role

1. Add the role string to the `UserRole` union type in `src/types/index.ts`.
2. Update the `CHECK` constraint in the `accounts` table in `api/_lib/db.ts` and re-run the migration.
3. Add role-specific UI branching in `App.tsx`, `AppContext.tsx`, and any page components that gate features by role.
4. Update the `child_access.access_type` constraint if the new role should have scoped child access.

### Testing Changes

```bash
# Local mode (no DB required)
npm run dev

# Cloud mode (requires Vercel dev + environment variables)
vercel env pull .env.local
vercel dev

# TypeScript check (frontend)
npm run build

# TypeScript check (API/serverless functions)
./node_modules/.bin/tsc --project tsconfig.api.json --noEmit

# Lint
npm run lint
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Cloud mode | Neon Postgres connection string (primary) |
| `POSTGRES_URL` | Cloud mode | Fallback Postgres connection string |
| `PGHOST` | Optional | Postgres host (auto-set by Neon integration) |
| `PGUSER` | Optional | Postgres user (auto-set by Neon integration) |
| `PGDATABASE` | Optional | Postgres database name (auto-set by Neon integration) |
| `PGPASSWORD` | Optional | Postgres password (auto-set by Neon integration) |
| `JWT_SECRET` | Cloud mode | Secret for JWT signing (32+ char random string) |
| `VITE_USE_CLOUD` | Cloud mode | Set to `"true"` to enable the cloud API in the frontend |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript, Vite 7, Tailwind CSS 4, React Router 7 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Dates | date-fns |
| Import parsing | read-excel-file |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Neon Postgres via `@neondatabase/serverless` |
| Auth | jose (JWT), bcryptjs (server), Web Crypto API PBKDF2 (client) |

## Features

- **Cloud-synced accounts** — Register, sign in, and reset your password; data is available across all devices and sessions
- **Multi-user profiles** — Parent/caregiver & child profiles with easy switching
- **Role-based access** — Parents, caregivers, and school admins with real permissions management
- **Dashboard** — Daily and weekly overview with calendar strip, summary cards, fluid balance, and clinical reminders
- **Drink tracking** — Log time, type (cup/beaker/bottle/sippy), amount in ml, and notes
- **Urine tracking** — Log time, wet/pass events, voiding volume (ml), urgency level (1–5), leakage amount, and notes
- **Bowel tracking** — Log date/time, toilet/nappy, amount (S/M/L), Bristol Stool Chart type (visual picker), laxatives given, and notes
- **Daily fluid balance** — Real-time intake vs measured output calculation on the dashboard
- **Charts & Insights** — Fluid intake bar chart, events timeline, stool type distribution
- **Calendar review** — Monthly calendar with coloured indicators for each entry type
- **Export** — Download diary as CSV for clinic visits (includes voiding volume, urgency, leakage data)
- **Import** — Import CSV, JSON, or XLSX diary data for bulk updates
- **Invite caregivers** — Role-specific secure invite links for parents, caregivers, and school admins
- **Notifications & audit** — Track invite acceptance, data changes, and caregiver activity
- **Clinical advice** — Reminders for constipation/bladder health
- **Mobile-first** — Responsive design optimised for phones (max-width: 48rem)

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite 7, Tailwind CSS 4, React Router 7, Recharts 3, Lucide React icons, date-fns
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Neon Postgres via `@neondatabase/serverless`
- **Auth:** JWT sessions with httpOnly cookies, bcrypt password hashing

## Architecture

```
├── api/                  # Vercel Serverless Functions (10 functions, Hobby-plan safe)
│   ├── _lib/             # Shared utilities (not deployed as functions)
│   │   ├── auth.ts       # JWT session management, CORS helpers
│   │   └── db.ts         # Neon Postgres connection, migration, shared queries
│   ├── auth.ts           # POST /api/auth (action: register|login|logout|reset), GET /api/auth (session)
│   ├── children.ts       # GET/POST/PUT /api/children
│   ├── drinks.ts         # GET/POST/PUT/DELETE /api/drinks
│   ├── urine.ts          # GET/POST/PUT/DELETE /api/urine
│   ├── bowel.ts          # GET/POST/PUT/DELETE /api/bowel
│   ├── invites.ts        # GET/POST /api/invites (create & accept)
│   ├── notifications.ts  # GET/PUT /api/notifications
│   ├── audit.ts          # GET /api/audit
│   ├── data.ts           # GET /api/data (CSV export), POST /api/data (bulk import)
│   └── migrate.ts        # POST /api/migrate (database setup)
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── context/          # React context for app state
│   ├── pages/            # Page components (routed)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── api.ts        # Frontend API client (fetch-based)
│   │   ├── auth.ts       # Client-side auth helpers (local mode)
│   │   ├── importers.ts  # File import parsers (CSV/JSON/XLSX)
│   │   └── storage.ts    # localStorage fallback (local mode)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── vercel.json           # Vercel deployment configuration
└── package.json
```

## Getting Started

### Local Development (No Cloud)

By default, the app runs in **local mode** using `localStorage`. No database setup is needed:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. All data is stored in your browser's localStorage.

### Cloud Mode with Vercel

To enable cloud-synced storage with a Postgres database:

#### 1. Create a Vercel Project

```bash
npm install -g vercel
vercel link
```

#### 2. Set Up a Postgres Database

Option A: Use the **Vercel Marketplace** to add a Neon Postgres database to your project. The Neon integration will automatically set `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, `POSTGRES_URL`, and other connection variables.

Option B: Create a database at [neon.tech](https://neon.tech) directly and copy the connection string.

#### 3. Configure Environment Variables

Set these environment variables in your Vercel project (or in a `.env.local` file for local development):

```env
# Database connection (provided by Neon/Vercel integration)
DATABASE_URL="postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require"
# Alternative: POSTGRES_URL is also supported
POSTGRES_URL="postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require"

# Additional Neon variables (set automatically by the Vercel integration)
PGHOST="host.neon.tech"
PGUSER="user"
PGDATABASE="dbname"
PGPASSWORD="password"

# JWT secret for session tokens (generate a secure random string)
JWT_SECRET="your-random-secret-at-least-32-characters-long"

# Enable cloud mode in the frontend
VITE_USE_CLOUD="true"
```

> **Note:** The app reads `DATABASE_URL` or `POSTGRES_URL` (in that order) for the Neon connection string. The `VITE_USE_CLOUD` variable must be prefixed with `VITE_` so Vite exposes it to the frontend bundle. When this variable is set, the app uses API calls instead of localStorage.

#### 4. Run Database Migration

After deploying (or locally with `vercel dev`), run the migration endpoint to create database tables:

```bash
curl -X POST https://your-app.vercel.app/api/migrate
```

Or visit the endpoint in your browser's developer tools.

#### 5. Local Development with Cloud Backend

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run with Vercel's development server (includes serverless functions)
vercel dev
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For cloud mode | Neon PostgreSQL connection string (primary) |
| `POSTGRES_URL` | For cloud mode | Alternative PostgreSQL connection string (fallback) |
| `PGHOST` | Optional | PostgreSQL host (set by Neon integration) |
| `PGUSER` | Optional | PostgreSQL user (set by Neon integration) |
| `PGDATABASE` | Optional | PostgreSQL database name (set by Neon integration) |
| `PGPASSWORD` | Optional | PostgreSQL password (set by Neon integration) |
| `JWT_SECRET` | For cloud mode | Secret key for JWT session tokens |
| `VITE_USE_CLOUD` | For cloud mode | Set to `"true"` to enable cloud API calls |

## Security & Privacy

- **Password hashing:** bcrypt with cost factor 12 (server-side) or PBKDF2 with 600,000 iterations (local mode)
- **Session management:** JWT tokens stored in httpOnly, SameSite cookies
- **Role-based access:** Parents, caregivers, and school admins have scoped data access
- **Audit trail:** All data modifications are logged with timestamps
- **HTTPS only:** Session cookies are marked `Secure` in production
- **Data isolation:** Users can only access children they are linked to

## Modes of Operation

| Feature | Local Mode | Cloud Mode |
|---------|-----------|------------|
| Data storage | Browser localStorage | Vercel Postgres |
| Cross-device sync | ❌ | ✅ |
| Auth backend | Client-side hashing | Server-side bcrypt + JWT |
| Invite system | Same-browser only | Cross-device, persistent |
| Import/export | ✅ | ✅ |
| Offline support | ✅ | ❌ |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── BottomNav.tsx
│   ├── BristolStoolPicker.tsx
│   ├── CalendarStrip.tsx
│   └── EntryCard.tsx
├── context/          # React context for app state
│   ├── AppContext.tsx
│   ├── appContextDef.ts
│   └── useApp.ts
├── pages/            # Page components
│   ├── AddEntryPage.tsx
│   ├── CalendarPage.tsx
│   ├── CaregiverPortalPage.tsx
│   ├── ChartsPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── api.ts        # Cloud API client
│   ├── auth.ts       # Local auth helpers
│   ├── importers.ts  # Import file parsers
│   └── storage.ts    # localStorage layer
├── App.tsx
├── index.css
└── main.tsx
```
