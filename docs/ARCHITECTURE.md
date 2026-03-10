# Architecture Overview

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19 |
| Language | TypeScript | 5.9 |
| Styling | Tailwind CSS | 4 |
| Build tool | Vite | 7 |
| Routing | React Router | v7 |
| Charts | Recharts | 3.8 |
| Hosting | Vercel | Hobby tier |
| Database | Neon Postgres | Serverless |
| API | Vercel Serverless Functions | Node.js 22 |

---

## Project Structure

```
bladdertracker/
├── api/                        # Vercel Serverless Functions
│   ├── _lib/
│   │   ├── auth.ts             # JWT session helpers, CORS
│   │   └── db.ts               # Neon DB connection, migrations, getAccessibleChildIds()
│   ├── auth.ts                 # Register / login / logout / delete account
│   ├── audit.ts                # Audit event log
│   ├── bowel.ts                # Bowel entry CRUD
│   ├── children.ts             # Child profile CRUD
│   ├── data.ts                 # CSV export / bulk import
│   ├── drinks.ts               # Drink entry CRUD
│   ├── invites.ts              # Caregiver invite flow
│   ├── migrate.ts              # DB migration runner
│   ├── modules.ts              # mood / sensory / medication / therapy / routine / milestones + enabled_modules
│   ├── notifications.ts        # Notification management
│   ├── trackers.ts             # sleep / toilet / food entry CRUD
│   └── urine.ts                # Urine entry CRUD
├── docs/
│   ├── API.md                  # Full API endpoint reference
│   ├── ARCHITECTURE.md         # This file
│   ├── MODULES.md              # Per-module field documentation
│   ├── Onboarding.md           # User onboarding guide
│   └── PROJECT_PLAN.md         # Project plan and delivery backlog
├── src/
│   ├── assets/
│   │   ├── brand-icon.svg      # Primary logo asset
│   │   └── index.ts            # Central asset registry
│   ├── components/
│   │   ├── AppNav.tsx          # Responsive top/bottom navigation shell
│   │   ├── BrandBanner.tsx     # App header
│   │   ├── BrandIcon.tsx       # App logo
│   │   ├── BristolStoolPicker.tsx # Bristol scale UI component
│   │   ├── CalendarStrip.tsx   # Horizontal date scroller
│   │   ├── EntryCard.tsx       # Diary entry display card
│   │   └── HelpPanel.tsx       # Collapsible in-app help panel
│   ├── content/
│   │   └── presentation.ts    # Centralised UI labels, brand copy, and display overrides
│   ├── context/
│   │   ├── AppContext.tsx       # Main app state provider (all CRUD, cloud/local switching)
│   │   ├── appContextDef.ts    # AppContextType interface definition
│   │   ├── ThemeContext.tsx     # Theme provider
│   │   ├── themeContextDef.ts  # ThemeContextType interface
│   │   ├── useApp.ts           # useApp() hook
│   │   └── useTheme.ts         # useTheme() hook
│   ├── data/
│   │   ├── leapData.ts          # Developmental leap definitions and tips
│   │   └── milestoneGuidance.ts # NHS-contextual milestone guidance content
│   ├── pages/
│   │   ├── AddEntryPage.tsx    # 11-tab entry forms with HelpPanel guides
│   │   ├── AdminPage.tsx       # Admin panel (admin role only)
│   │   ├── CalendarPage.tsx    # Monthly calendar view
│   │   ├── DashboardPage.tsx   # Today overview, reminders, and quick add
│   │   ├── HelpPage.tsx        # Help, onboarding, FAQs, accessibility
│   │   ├── LeapsPage.tsx       # Developmental leap guidance and symptom logs
│   │   ├── LoginPage.tsx       # Auth (register / login / reset)
│   │   ├── LogPage.tsx         # Historical diary with CalendarStrip
│   │   ├── MilestonesPage.tsx  # Milestone CRUD
│   │   ├── ProfilesPage.tsx    # Children, invites, notifications
│   │   ├── ReportsPage.tsx     # Recharts visualisation + export review
│   │   └── SettingsPage.tsx    # Themes, modules, privacy, import/export
│   ├── types/
│   │   └── index.ts            # All TypeScript types + DEFAULT_MODULES registry
│   └── utils/
│       ├── api.ts              # Cloud API client (fetch wrappers)
│       ├── auth.ts             # Client-side auth helpers (PBKDF2, local mode)
│       ├── importers.ts        # CSV/Excel import logic
│       └── storage.ts          # localStorage CRUD (local/offline mode)
├── App.tsx                     # Root routing
├── index.css                   # Tailwind + CSS variables (themes)
└── main.tsx                    # React entry point
```

---

## Data Flow

```
User Action
    │
    ▼
AppContext.tsx
    │
    ├─── VITE_USE_CLOUD=true ──► api.ts ──► /api/* ──► Neon DB
    │
    └─── local mode ───────────► storage.ts ──► localStorage
```

**AppContext** is the single source of truth. All pages consume data via `useApp()` and call CRUD methods on the context. The context delegates to either:
- `src/utils/api.ts` — HTTP calls to Vercel Serverless Functions → Neon Postgres
- `src/utils/storage.ts` — localStorage reads/writes (offline/development mode)

Route components are lazy-loaded in `src/App.tsx` so the initial mobile shell can render more quickly while larger diary, reporting, and settings pages load on demand.

---

## Authentication

**Cloud mode:**
- Passwords hashed with bcrypt on the server (`api/_lib/auth.ts`)
- Session JWT signed with `JWT_SECRET`, stored in HttpOnly cookie `bt_session`
- `getSessionFromRequest(req)` validates the JWT on every API call
- `getAccessibleChildIds(userId)` returns child IDs the user owns or has been invited to

**Local mode:**
- Passwords hashed client-side with PBKDF2 (Web Crypto API)
- Session stored in `localStorage` as a user object
- No server involved

---

## Module System

Modules are defined in `src/types/index.ts` as `DEFAULT_MODULES: TrackerModule[]`. Shared UI wording, calmer labels, celebration copy, and role names are layered on top in `src/content/presentation.ts`. Each module has:
- `id: ModuleId` — unique string identifier
- `label` — base display name
- `icon` — emoji
- `description` — one-line description for the Settings UI
- `defaultEnabled` — whether enabled by default for new children

**Enabled modules per child** are stored in:
- Cloud: `enabled_modules` table (`child_id`, `module_id` columns, UNIQUE constraint)
- Local: `bt_enabled_modules` localStorage key as `{ childId: string, modules: ModuleId[] }[]`

The `api/modules.ts` endpoint manages all 6 newer tracker types (mood, sensory, medication, therapy, routine, milestones) and the enabled_modules state in a single consolidated serverless function.

---

## Vercel Function Limit

The Vercel Hobby plan allows **12 serverless functions**. This project uses all 12:

| # | File | Handles |
|---|------|---------|
| 1 | `api/auth.ts` | Register, login, logout, session, delete account |
| 2 | `api/audit.ts` | Audit log |
| 3 | `api/bowel.ts` | Bowel entries |
| 4 | `api/children.ts` | Child profiles |
| 5 | `api/data.ts` | CSV export + bulk import |
| 6 | `api/drinks.ts` | Drink entries |
| 7 | `api/invites.ts` | Caregiver invites |
| 8 | `api/migrate.ts` | DB schema migration |
| 9 | `api/modules.ts` | mood/sensory/medication/therapy/routine/milestones + enabled_modules |
| 10 | `api/notifications.ts` | Notifications |
| 11 | `api/trackers.ts` | sleep/toilet/food entries |
| 12 | `api/urine.ts` | Urine entries |

> **Note:** `api/_lib/auth.ts` and `api/_lib/db.ts` are shared modules, not counted as functions.

---

## Database Schema

See the `runMigrations()` function in `api/_lib/db.ts` for the full, up-to-date schema. Key tables:

| Table | Primary purpose |
|-------|----------------|
| `accounts` | User account records |
| `children` | Child profiles |
| `child_access` | Invite-based access grants |
| `drink_entries` | Fluid intake log |
| `urine_entries` | Voiding events |
| `bowel_entries` | Bowel movements |
| `sleep_entries` | Sleep events |
| `toilet_attempt_entries` | Toilet training sessions |
| `food_entries` | Dietary intake |
| `mood_entries` | Emotional wellbeing log |
| `sensory_entries` | Sensory processing events |
| `medication_entries` | Medication administration log |
| `therapy_entries` | Therapy session records |
| `routine_entries` | Daily routine completion |
| `milestones` | Developmental milestone tracking |
| `enabled_modules` | Per-child module toggle state |
| `reminder_preferences` | Per-child reminder settings |
| `invites` | Pending caregiver invites |
| `notifications` | User notification queue |
| `audit_events` | Immutable action log |

---

## Themes

Three themes are supported: `light`, `dark`, `high-contrast`. Implemented via CSS custom properties on the `data-theme` attribute of the root `<html>` element. Theme preference is stored in `localStorage` key `bt_theme`. See `src/index.css` for all CSS variables.
