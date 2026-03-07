# 🧩 Development Tracker

**A comprehensive developmental tracking platform for children with autism and developmental needs.**

Built for parents, caregivers, therapists, and educators to log daily activities, track developmental milestones, and collaborate on a child's progress — all from a mobile-first PWA.

[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com)
[![Vite 7](https://img.shields.io/badge/Vite-7-646cff)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000)](https://vercel.com)
[![Neon Postgres](https://img.shields.io/badge/DB-Neon_Postgres-00e599)](https://neon.tech)

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Module System](#-module-system)
- [Milestone Tracking](#-milestone-tracking)
- [Theme System](#-theme-system)
- [API Reference](#-api-reference)
- [Security, Privacy & Compliance](#-security-privacy--compliance)
- [Extension Guide](#-extension-guide)
- [Clinical & Market Benchmarking](#-clinical--market-benchmarking)
- [Vercel & Neon Optimization](#-vercel--neon-optimization)
- [Contributing](#-contributing)

---

## ✨ Features

### Tracker Modules

| # | Module | Icon | Description | Default |
|---|--------|------|-------------|---------|
| 1 | **Drinks** | 🥤 | Fluid intake (cup, beaker, bottle, sippy) with mL amounts | ✅ |
| 2 | **Urine** | 💦 | Wet/pass events, volume, urgency 1–5, leakage tracking | ✅ |
| 3 | **Bowel** | 🚽 | Bristol Stool Scale 1–7, location, laxative tracking | ✅ |
| 4 | **Sleep** | 🌙 | Onset/wake/nap events, duration, quality 1–5 | ✅ |
| 5 | **Toilet Attempts** | 🎯 | Training outcomes (success/failure), prompted/supervised | ✅ |
| 6 | **Food** | 🍽️ | Meals (breakfast/lunch/dinner/snack), portions | ✅ |
| 7 | **Mood** | 😊 | Emotional level 1–5 with trigger logging | ⬜ |
| 8 | **Sensory** | 🎨 | Sensory type, response (seeking/avoiding/neutral), intensity | ⬜ |
| 9 | **Medication** | 💊 | Medication name, dosage, administered status | ⬜ |
| 10 | **Therapy** | 🧩 | Session type (speech/OT/PT/behavioral), provider, goals | ⬜ |
| 11 | **Routine** | 📋 | Daily routine name, completion, duration | ⬜ |

### Platform Capabilities

| Capability | Details |
|------------|---------|
| 🏆 **Milestone Engine** | Full CRUD for developmental milestones across 8 categories with status workflow |
| 🔀 **Module Registry** | Per-child module toggling via `DEFAULT_MODULES` + localStorage/DB persistence |
| 👥 **6 User Roles** | admin, parent, caregiver, schoolAdmin, therapist, specialist |
| 🌗 **Theme System** | Light, Dark, High Contrast with CSS custom properties |
| 📊 **Charts & Calendar** | Recharts-powered data visualization + calendar view |
| 📤 **CSV Export** | Export all 11 tracker types + milestones per child |
| 🤝 **Caregiver Invites** | Secure token-based sharing and collaboration |
| 📝 **Audit Trail** | Timestamped logging of all create/update/delete operations |
| ☁️ **Dual Storage** | Offline-first localStorage or Neon Postgres cloud via `VITE_USE_CLOUD` |
| 📥 **Data Import** | Bulk import via CSV/Excel for all entry types |

### Pages

| Page | Route | Nav Icon | Description |
|------|-------|----------|-------------|
| Journal (Dashboard) | `/` | 🏠 Home | Daily log with all enabled trackers + milestones |
| Add Entry | `/add` | — | 11 tabbed entry forms |
| Charts | `/charts` | 🧭 Explore | Recharts data visualization |
| Calendar | `/calendar` | — | Calendar view of all entries |
| Milestones | `/milestones` | ⭐ Star | Developmental milestone dashboard |
| Caregiver Portal | `/caregiver` | 👥 Users | Invite management & shared access |
| Profile / Settings | `/profile` | ⚙️ Settings | Theme, module toggles, account settings |
| Admin | `/admin` | 👑 Crown | System admin (admin role only) |
| Login | — | — | Register / login / password reset |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (SPA)                  │
│  React 19 · TypeScript · Tailwind 4 · Vite 7   │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ AppCtx   │  │ ThemeCtx │  │ React Router │  │
│  │ useApp() │  │useTheme()│  │  9 pages     │  │
│  └────┬─────┘  └──────────┘  └──────────────┘  │
│       │                                         │
│  ┌────▼──────────────────────────────────────┐  │
│  │  VITE_USE_CLOUD ? api.ts : storage.ts     │  │
│  │  (Cloud fetch client / localStorage CRUD) │  │
│  └────┬──────────────────────┬───────────────┘  │
└───────┼──────────────────────┼──────────────────┘
        │ Cloud mode           │ Local mode
        ▼                      ▼
┌───────────────┐     ┌────────────────┐
│ Vercel Edge   │     │ localStorage   │
│ /api/*.ts     │     │ bt_* keys      │
│ (Serverless)  │     └────────────────┘
└───────┬───────┘
        ▼
┌───────────────┐
│ Neon Postgres │
│ 19 tables     │
│ @neondatabase │
│ /serverless   │
└───────────────┘
```

**Tech Stack:**

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.2 |
| Language | TypeScript | ~5.9 |
| Styling | Tailwind CSS | 4.2 |
| Bundler | Vite | 7.3 |
| Icons | Lucide React | 0.577 |
| Charts | Recharts | 3.8 |
| Dates | date-fns | 4.1 |
| Database | Neon Postgres | `@neondatabase/serverless` 1.0 |
| Auth | JWT (jose 6.2) + bcryptjs 3.0 | — |
| Hosting | Vercel (Serverless Functions) | — |
| Import | read-excel-file | 7.0 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- (Cloud mode) A [Neon](https://neon.tech) Postgres database + [Vercel](https://vercel.com) account

### Install & Run Locally

```bash
git clone <repo-url> && cd bladdertracker
npm install
npm run dev          # → http://localhost:5173
```

Local mode uses `localStorage` — no database required.

### Cloud Mode (Neon + Vercel)

```bash
# 1. Set environment variables
export DATABASE_URL="postgres://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
export JWT_SECRET="your-secure-random-secret"
export VITE_USE_CLOUD=true

# 2. Initialize the database (creates all 19 tables)
curl -X POST https://your-app.vercel.app/api/migrate

# 3. Deploy to Vercel
vercel --prod
```

Or for local cloud development:

```bash
vercel dev            # Runs API functions locally with env vars from Vercel
```

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` — type-check + production bundle |
| `npm run lint` | ESLint across the entire project |
| `npm run preview` | Preview the production build locally |
| `vercel dev` | Local dev with serverless functions + cloud DB |

---

## 🗄 Database Schema

19 tables auto-created by `POST /api/migrate` (idempotent):

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `accounts` | User auth | `id`, `name`, `email`, `password_hash`, `role`, `avatar`, `created_at` |
| `children` | Child profiles | `id`, `name`, `date_of_birth`, `avatar`, `created_by` → accounts |
| `child_access` | Shared access | `child_id` → children, `user_id` → accounts, `access_type` |
| `drink_entries` | Fluid intake | `child_id`, `date`, `time`, `type`, `amount_ml`, `notes`, `created_by` |
| `urine_entries` | Urination | `child_id`, `date`, `time`, `wet`, `pass`, `volume_ml`, `urgency`, `leakage_amount` |
| `bowel_entries` | Bowel movements | `child_id`, `date`, `time`, `location`, `amount`, `bristol_type`, `laxatives_given` |
| `sleep_entries` | Sleep events | `child_id`, `date`, `time`, `event_type`, `duration_minutes`, `quality` |
| `toilet_attempt_entries` | Toilet training | `child_id`, `date`, `time`, `outcome`, `supervised`, `prompted`, `duration_minutes` |
| `food_entries` | Meals | `child_id`, `date`, `time`, `meal_type`, `description`, `portions` |
| `mood_entries` | Emotional state | `child_id`, `date`, `time`, `level` (1–5), `triggers` |
| `sensory_entries` | Sensory responses | `child_id`, `date`, `time`, `sensory_type`, `response`, `intensity` |
| `medication_entries` | Medications | `child_id`, `date`, `time`, `name`, `dosage`, `administered` |
| `therapy_entries` | Therapy sessions | `child_id`, `date`, `time`, `therapy_type`, `provider`, `duration_minutes`, `goals` |
| `routine_entries` | Daily routines | `child_id`, `date`, `time`, `routine_name`, `completed`, `duration_minutes` |
| `milestones` | Developmental goals | `child_id`, `name`, `category`, `status`, `date_achieved`, `notes`, `created_by` |
| `enabled_modules` | Module toggles | `child_id`, `module_id` (UNIQUE constraint) |
| `invites` | Caregiver invites | `child_id`, `email`, `role`, `status`, `token` (UNIQUE), `invited_by` |
| `notifications` | User notifications | `user_id`, `title`, `message`, `read` |
| `audit_events` | Activity log | `user_id`, `action`, `subject`, `detail`, `created_at` |

All entry tables share: `id` (UUID PK), `created_by` (FK → accounts), `created_at` (timestamp), `notes`.

---

## 👥 User Roles & Permissions

| Role | Description | View Data | Add Entries | Manage Children | Invite Caregivers | Admin Panel |
|------|-------------|-----------|-------------|-----------------|-------------------|-------------|
| `parent` | Primary caregiver | ✅ Own children | ✅ | ✅ | ✅ | ❌ |
| `caregiver` | Invited collaborator | ✅ Shared children | ✅ | ❌ | ❌ | ❌ |
| `schoolAdmin` | Educational staff | ✅ Shared children | ✅ | ❌ | ❌ | ❌ |
| `therapist` | Clinical therapist | ✅ Shared children | ✅ | ❌ | ❌ | ❌ |
| `specialist` | Medical specialist | ✅ Shared children | ✅ | ❌ | ❌ | ❌ |
| `admin` | System administrator | ✅ All | ✅ | ✅ | ✅ | ✅ |

**Data isolation:** Users only see children they created or were explicitly granted access to via `child_access` or caregiver invites.

---

## 🔌 Module System

The module registry (`DEFAULT_MODULES` in `src/types/index.ts`) defines all 12 modules:

```typescript
export const DEFAULT_MODULES: TrackerModule[] = [
  { id: 'drinks',     label: 'Drinks',           icon: '🥤', builtIn: true, defaultEnabled: true  },
  { id: 'urine',      label: 'Urine',            icon: '💦', builtIn: true, defaultEnabled: true  },
  { id: 'bowel',      label: 'Bowel',             icon: '🚽', builtIn: true, defaultEnabled: true  },
  { id: 'sleep',      label: 'Sleep',             icon: '🌙', builtIn: true, defaultEnabled: true  },
  { id: 'toilet',     label: 'Toilet Attempts',   icon: '🎯', builtIn: true, defaultEnabled: true  },
  { id: 'food',       label: 'Food',              icon: '🍽️', builtIn: true, defaultEnabled: true  },
  { id: 'mood',       label: 'Mood',              icon: '😊', builtIn: true, defaultEnabled: false },
  { id: 'sensory',    label: 'Sensory',           icon: '🎨', builtIn: true, defaultEnabled: false },
  { id: 'medication', label: 'Medication',        icon: '💊', builtIn: true, defaultEnabled: false },
  { id: 'therapy',    label: 'Therapy',           icon: '🧩', builtIn: true, defaultEnabled: false },
  { id: 'routine',    label: 'Routine',           icon: '📋', builtIn: true, defaultEnabled: false },
  { id: 'milestones', label: 'Milestones',        icon: '⭐', builtIn: true, defaultEnabled: true  },
];
```

**Per-child toggling:** Parents toggle modules on/off in Profile → Settings. State persists to `bt_enabled_modules` (localStorage) or the `enabled_modules` table (cloud). The Dashboard, Add Entry, and Charts pages all respect the active module set for the selected child.

---

## ⭐ Milestone Tracking

Track developmental progress across 8 evidence-based categories:

| Category | Icon | Examples |
|----------|------|---------|
| `speech` | 🗣️ | First words, two-word phrases, conversation skills |
| `motor` | 🏃 | Crawling, walking, fine motor, handwriting |
| `social` | 🤝 | Eye contact, turn-taking, group play |
| `cognitive` | 🧠 | Problem solving, counting, pattern recognition |
| `self_care` | 🪥 | Dressing, feeding, hygiene |
| `routine` | 📋 | Morning routine, bedtime routine |
| `sensory` | 🎨 | Sensory tolerance, self-regulation |
| `other` | 📌 | Custom milestones |

**Status workflow:** `not_started` → `in_progress` → `achieved` (with optional `dateAchieved`)

The Milestones page (`/milestones`) provides filtering by category and status, timeline views, and full CRUD operations.

---

## 🌗 Theme System

Three themes controlled via `ThemeContext` with `data-theme` attribute on `<html>`:

| Theme | Key | Description |
|-------|-----|-------------|
| ☀️ Light | `light` | Default — soft lavender palette |
| 🌙 Dark | `dark` | Dark backgrounds, muted accents |
| 🔲 High Contrast | `high-contrast` | Maximum contrast for accessibility |

Persisted to `localStorage` key `bt_theme`. All components use CSS custom properties (`--bg-primary`, `--text-primary`, etc.) for seamless switching.

---

## 📡 API Reference

All endpoints are Vercel Serverless Functions under `/api/`. Auth is via JWT in HttpOnly cookies.

### Authentication — `POST /api/auth`

| Action | Body | Response |
|--------|------|----------|
| `register` | `{ action, name, email, password, role }` | `{ user: User }` + Set-Cookie |
| `login` | `{ action, email, password }` | `{ user: User }` + Set-Cookie |
| `logout` | `{ action: 'logout' }` | `{ ok: true }` + Clear-Cookie |
| `reset` | `{ action: 'reset', email, password }` | `{ user: User }` |
| `session` | `GET /api/auth` | `{ user: User }` or `{ user: null }` |

### Children — `/api/children`

| Method | Description |
|--------|-------------|
| `GET` | List children for current user |
| `POST` | Create child `{ name, dateOfBirth? }` |
| `PUT` | Update child `{ id, name, ... }` |
| `DELETE` | Delete child `{ id }` |

### Trackers — CRUD per type

| Endpoint | Tracker Types |
|----------|--------------|
| `GET/POST/PUT/DELETE /api/drinks` | Drink entries |
| `GET/POST/PUT/DELETE /api/urine` | Urine entries |
| `GET/POST/PUT/DELETE /api/bowel` | Bowel entries |
| `GET/POST/PUT/DELETE /api/trackers?type=<type>` | sleep, toilet, food, mood, sensory, medication, therapy, routine |

All tracker endpoints accept `?childId=<id>` for filtering and return `{ entries: Entry[] }`.

### Other Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/invites` | GET/POST | List invites or create/accept invite (`{ action: 'accept', token }`) |
| `/api/notifications` | GET/PUT | List or mark-read notifications |
| `/api/audit` | GET | Retrieve audit event log |
| `/api/data?childId=<id>` | GET | Export all child data as CSV |
| `/api/data` | POST | Import bulk data `{ childId, drinks?, urineEntries?, ... }` |
| `/api/migrate` | POST | Run idempotent DB schema migration |

---

## 🔒 Security, Privacy & Compliance

| Concern | Implementation |
|---------|---------------|
| **Authentication** | bcryptjs password hashing + JWT (jose) in Secure HttpOnly cookies |
| **Session** | Stateless JWT; `Secure` flag in production; `SameSite=Lax` |
| **Data Isolation** | Users see only their own children or explicitly shared via `child_access` |
| **Caregiver Invites** | Cryptographic tokens; invite must be accepted before granting access |
| **Audit Trail** | All mutations logged to `audit_events` with userId, action, timestamp |
| **CORS** | Controlled via `_lib/auth.ts` — origin-restricted in production |
| **GDPR Considerations** | Per-child data export (CSV); `clearAllAppData()` for full local wipe |
| **Input Validation** | Server-side type checking on all API endpoints |
| **Secrets** | `JWT_SECRET` via environment variable; dev fallback clearly marked |

---

## 🛠 Extension Guide

### Adding a New Tracker Module

1. **Define the type** in `src/types/index.ts`:
   ```typescript
   export interface NewEntry {
     id: string; childId: string; date: string; time: string;
     /* custom fields */
     notes: string; createdBy: string; createdAt: string;
   }
   ```
2. **Add to `ModuleId`** union type and `DEFAULT_MODULES` array.
3. **Add localStorage CRUD** in `src/utils/storage.ts` — follow the `get*Entries / add*Entry / update*Entry / delete*Entry` pattern with a `bt_new` key.
4. **Add cloud API** in `src/utils/api.ts` — add functions that call `/api/trackers?type=new`.
5. **Add server handler** in `api/trackers.ts` — add a case for the new type in the `switch(type)` block.
6. **Add DB table** in `api/_lib/db.ts` — add `CREATE TABLE IF NOT EXISTS` in the migration function.
7. **Wire into AppContext** — add state, fetch, and CRUD methods in `src/context/AppContext.tsx`.
8. **Add UI** — add tab in `AddEntryPage.tsx`, card in `DashboardPage.tsx`, and chart in `ChartsPage.tsx`.

### Adding a New User Role

1. Add to `UserRole` union in `src/types/index.ts`.
2. Add role option in `LoginPage.tsx` registration form.
3. Update server-side role validation in `api/_lib/auth.ts`.
4. Adjust conditional UI rendering (e.g., `BottomNav.tsx` admin check).

### DB Migration Pattern

All migrations are idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`). Add new tables or columns in the `runMigrations()` function in `api/_lib/db.ts`, then hit `POST /api/migrate`.

---

## 📊 Clinical & Market Benchmarking

| Feature | Development Tracker | CareZone | Ovia | MyTherapy | ASD-specific apps |
|---------|:------------------:|:--------:|:----:|:---------:|:-----------------:|
| Multi-tracker (11+) | ✅ | ❌ | Partial | ❌ | ❌ |
| Developmental milestones | ✅ 8 categories | ❌ | Basic | ❌ | Partial |
| Sensory profiling | ✅ | ❌ | ❌ | ❌ | Partial |
| Therapy session logging | ✅ | ❌ | ❌ | ❌ | ❌ |
| Multi-role collaboration | ✅ 6 roles | ❌ | ❌ | ❌ | ❌ |
| Per-child module toggling | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bristol Stool Scale | ✅ | ❌ | ❌ | ❌ | ❌ |
| Offline-first + Cloud sync | ✅ | Cloud-only | Cloud-only | Cloud-only | Varies |
| Open source | ✅ | ❌ | ❌ | ❌ | Rare |

**Research gaps addressed:** Combined bladder/bowel/sleep + sensory + therapy tracking in one platform; multi-caregiver data sharing for ASD support teams; structured milestone tracking aligned with developmental assessment categories.

---

## ⚡ Vercel & Neon Optimization

### Vercel Free Tier Strategy

Vercel's Hobby plan limits serverless functions per deployment. This project consolidates endpoints:

| Strategy | Implementation |
|----------|---------------|
| **Consolidated `/api/trackers.ts`** | Single function handles 8 tracker types (sleep, toilet, food, mood, sensory, medication, therapy, routine) via `?type=` query parameter |
| **Separate high-traffic endpoints** | Drinks, urine, and bowel retain dedicated functions for clarity |
| **Shared `_lib/`** | `auth.ts` and `db.ts` are shared modules (not counted as functions) |
| **Total functions** | ~12 serverless functions — well within Hobby tier limits |

### Neon Free Tier

| Resource | Limit | Usage |
|----------|-------|-------|
| Compute | 0.25 vCPU (191 hrs/month) | Low — serverless cold-start only |
| Storage | 512 MB | 19 tables, text-heavy — ample headroom |
| Branches | 10 | 1 production branch sufficient |

**Connection:** Uses `@neondatabase/serverless` HTTP driver — no persistent connections, ideal for serverless.

---

## 🤝 Contributing

### Project Structure

```
api/                  → Vercel Serverless Functions (one file = one endpoint)
  _lib/               → Shared auth (JWT/CORS) and DB (Neon/migrations)
src/
  pages/              → 9 React page components
  components/         → Reusable UI (BottomNav, BristolStoolPicker, EntryCard, etc.)
  context/            → AppContext (state + CRUD) and ThemeContext (light/dark)
  types/index.ts      → All TypeScript types, enums, and DEFAULT_MODULES
  utils/storage.ts    → localStorage CRUD (1000+ lines, all 11 trackers)
  utils/api.ts        → Cloud API fetch client (mirrors storage.ts interface)
  utils/auth.ts       → Client-side auth helpers
  utils/importers.ts  → Excel/CSV import logic
```

### Conventions

- **State management:** React Context + hooks (`useApp()`, `useTheme()`) — no external state library
- **Storage duality:** Every data operation exists in both `storage.ts` (local) and `api.ts` (cloud); `AppContext` switches based on `VITE_USE_CLOUD`
- **Naming:** camelCase for TS, snake_case for DB columns, `bt_` prefix for localStorage keys
- **Auth pattern:** JWT in HttpOnly cookies; server functions call `authenticate(req)` from `_lib/auth.ts`
- **Audit:** All mutations should call `logAuditEvent()` / write to `audit_events`

### Getting Started with Development

```bash
npm install
npm run dev           # Start dev server
npm run lint          # Check for lint errors
npm run build         # Full type-check + production build
```

---

<p align="center">
  Built with ❤️ for families navigating developmental journeys
</p>
