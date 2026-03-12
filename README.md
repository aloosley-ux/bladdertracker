# 🧩 BladderTracker

**Calm tracking for families, caregivers, and care teams** — a child development, continence, SEND, and daily routine tracker with NHS-style clarity and a mobile-first layout.

Built for tired, busy, real-world use: one-handed on a phone, during routines, school handovers, and care conversations. The product uses plain-English labels in the UI (for example **Wee**, **Poo**, and **Toilet visits**) while keeping the underlying data model stable for reporting and clinical workflows.

[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com)
[![Vite 7](https://img.shields.io/badge/Vite-7-646cff)](https://vite.dev)
[![CI](https://github.com/aloosley-ux/bladdertracker/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/aloosley-ux/bladdertracker/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000)](https://vercel.com)
[![Neon Postgres](https://img.shields.io/badge/DB-Neon_Postgres-00e599)](https://neon.tech)

---

> **BladderTracker helps families and care teams capture the full picture, not just isolated symptoms.** It combines continence, sleep, meals, routines, mood, sensory notes, milestones, and caregiver collaboration in a single calm workflow that works both offline and in the cloud.

## 🌟 Why BladderTracker stands out

- **Built for real handovers:** designed for tired evenings, school transitions, clinic conversations, and quick one-handed updates.
- **Broader than a bladder diary:** combines 13 tracking modules, developmental milestones, and leap guidance in one shared system.
- **Flexible deployment model:** use it locally with `localStorage` or connect it to Vercel + Neon for shared cloud access.
- **Collaboration-ready:** invite caregivers and school staff from the current UI; additional role pathways exist in the data model but need validation before broad claims.
- **Privacy-conscious by design:** export and deletion flows are built in, with GDPR documentation and audit history support.

## 🚦 Project status

| Area | Current state |
|------|---------------|
| Product maturity | Active, feature-rich MVP with a strong public demo/readme story |
| Quality checks | CI runs tests, linting, build, and API type-checks on pull requests |
| Deployment modes | Local/offline mode by default, optional cloud mode via Vercel + Neon |
| Accessibility | High-contrast theme, dyslexia-friendly font, keyboard support, accessibility tests |
| Current focus | Role/access consistency, API test depth, and docs/backlog trustworthiness (see `docs/REPO_STATUS.md`) |

## 🔗 Quick links

- **Get started:** [Install & run locally](#-getting-started)
- **Understand the product:** [Features](#-features), [Architecture](#-architecture), [Module System](#-module-system)
- **Use the docs:** [Documentation hub](#-documentation)
- **Contribute:** [CONTRIBUTING.md](./CONTRIBUTING.md) and [pull request template](./.github/PULL_REQUEST_TEMPLATE.md)
- **Report work clearly:** use the GitHub issue templates for bugs, feature requests, and documentation improvements
- **Report vulnerabilities privately:** see [SECURITY.md](./SECURITY.md)
- **Review repo status & remaining work:** [docs/REPO_STATUS.md](./docs/REPO_STATUS.md)
- **What changed:** [CHANGELOG.md](./CHANGELOG.md)

---

## 📑 Table of Contents

- [Why BladderTracker stands out](#-why-bladdertracker-stands-out)
- [Project status](#-project-status)
- [Quick links](#-quick-links)
- [Features](#-features)
- [What you can do today](#-what-you-can-do-today)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deployment & Environment](#-deployment--environment)
- [Database Schema](#-database-schema)
- [User Roles & Permissions](#-user-roles--permissions)
- [Module System](#-module-system)
- [Milestone Tracking](#-milestone-tracking)
- [Theme System](#-theme-system)
- [API Reference](#-api-reference)
- [Security, Privacy & Compliance](#-security-privacy--compliance)
- [GDPR & Privacy](#-gdpr--privacy)
- [Accessibility](#-accessibility)
- [Extension Guide](#-extension-guide)
- [Clinical & Market Benchmarking](#-clinical--market-benchmarking)
- [Vercel & Neon Optimization](#-vercel--neon-optimization)
- [Issues, roadmap & support](#-issues-roadmap--support)
- [Known Issues](#-known-issues)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Testing & QA](#-testing--qa)

---

## 🧭 What you can do today

This section highlights the experience that already exists in the product today. For confirmed remaining work, see [docs/REPO_STATUS.md](./docs/REPO_STATUS.md) and linked GitHub issues.

### 1) Milestones timeline & calendar
- `/milestones` now provides a milestone timeline with **weekly / monthly / annual zoom**, date markers, and milestone cards.
- Filters are available for **module, milestone type, status, category, and time window**.
- “**Jump to today**” and “**Next upcoming milestone**” controls are included.
- Custom milestones support module-scoped entries, milestone type, target date, diary notes, and role source metadata.

### 2) Contextual guidance panels
- Milestone cards provide an “NHS guidance” action that opens a contextual panel:
  - what this means,
  - expected behaviours,
  - practical tips,
  - next steps,
  - autism/SEND support.
- Guidance content is maintained in `src/data/milestoneGuidance.ts` for easy future updates and localization.

### 3) Modular logging, diary notes, and source metadata
- Milestones include diary notes and source role metadata for parent, caregiver, and school handover workflows.
- Existing module logging remains per-child and per-category.

### 4) Reminders and non-intrusive notifications
- Reminder preferences can now be configured in Settings per child and per module (daily/weekly).
- Dashboard displays reminder banners with a one-tap “snooze 1 hour” control.
- Reminder preferences persist in both local mode and cloud mode.

### 5) Multi-child, multi-role behaviour
- Child switching refreshes milestone, reminder, and report context for the selected child.
- Role-aware UI remains in Settings and admin/profiles pages.
- Supported account roles: `admin`, `parent`, `caregiver`, `schoolAdmin`. Registration and invite flows support these four roles. `therapist` and `specialist` are reserved in the data model for future implementation.

### 6) Reports & export
- Reports now include milestone trend charting.
- Export controls include:
  - CSV export with explicit privacy confirmation modal
  - PDF export via browser print-to-PDF workflow

### 7) Accessibility and NHS-style UX
- Dyslexia-friendly font toggle (Atkinson Hyperlegible), keyboard-accessible controls, and high-contrast support remain available.
- New milestone/reminder/report controls use large tap targets and high-contrast card/toggle styling.

### 8) Privacy, consent, and compliance
- Export path now requires a consent confirmation step.
- Reminder preferences and milestone metadata are scoped per user and child in storage/DB.
- GDPR policy remains in `GDPR.md` and applies to new milestone/reminder fields.

### 9) Onboarding flow summary
1. Create/login account and select role.
2. Add/select child profile.
3. Enable modules in Settings.
4. Configure reminder preferences.
5. Track milestones in timeline view and open NHS guidance panels.
6. Use Reports to review trends and export with consent confirmation.

### Role & permission matrix

| Role | View timeline/logs | Add milestones/notes | Reminder setup | Export summaries |
|------|--------------------|----------------------|----------------|------------------|
| Parent | ✅ | ✅ | ✅ | ✅ |
| Caregiver | ✅ | ✅ | ✅ (assigned child only) | ⚠️ owner policy |
| School admin (teacher-equivalent) | ✅ | ✅ | ✅ (assigned child only) | ⚠️ owner policy |
| Therapist / Specialist (health professional-equivalent) | ✅ | ✅ | ✅ (assigned child only) | ✅ clinical workflow |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## ✨ Features

### Tracker Modules

| # | Module | Icon | Description | Default |
|---|--------|------|-------------|---------|
| 1 | **Drinks** | 🥤 | Fluid intake (cup, beaker, bottle, sippy) with mL amounts | ✅ |
| 2 | **Wee** | 💦 | Wet clothes / used toilet updates, measured amount, urgency, and leaks | ✅ |
| 3 | **Poo** | 🚽 | Poo consistency, location, amount, and laxative tracking | ✅ |
| 4 | **Sleep** | 🌙 | Bedtime, sleep onset, wakes, naps, and quality | ✅ |
| 5 | **Toilet visits** | 🎯 | Toilet sits, prompts, adult support, and outcomes | ✅ |
| 6 | **Meals** | 🍽️ | Meals, snacks, portions, new foods, and acceptance | ✅ |
| 7 | **Mood** | 😊 | Emotional level 1–5 with trigger logging | ⬜ |
| 8 | **Sensory** | 🎨 | Sensory type, response (seeking/avoiding/neutral), intensity | ⬜ |
| 9 | **Medication** | 💊 | Medication name, dosage, administered status | ⬜ |
| 10 | **Therapy** | 🧩 | Session type (speech/OT/PT/behavioral), provider, goals | ⬜ |
| 11 | **Routines** | 📋 | Daily routine name, completion, duration | ⬜ |
| 12 | **Milestones** | ⭐ | Developmental milestones across 8 categories with status workflow | ✅ |
| 13 | **Leaps** | 🌈 | Baby age calculator, leap predictions, symptom logging, and trusted guidance links | ⬜ |

### Platform Capabilities

| Capability | Details |
|------------|---------|
| 🏥 **NHS-Inspired UI** | Responsive layout with top navigation on desktop and bottom navigation on mobile |
| 📱 **Mobile-First Layout** | Larger quick actions, shorter nav labels, and calmer one-handed flows on phones |
| 🏆 **Milestone Engine** | Full CRUD for developmental milestones across 8 categories with status workflow |
| 🔀 **Module Registry** | Per-child module toggling via `DEFAULT_MODULES` (13 modules) with UI wording and helper copy centralised in `src/content/presentation.ts` |
| 👥 **User Roles** | admin, parent, caregiver, schoolAdmin (therapist/specialist reserved for future) |
| 🌗 **Theme System** | Light, Dark, High Contrast with CSS custom properties |
| 📊 **Charts & Calendar** | Recharts-powered data visualization + calendar view |
| 📤 **CSV Export** | Export all tracker types + milestones per child |
| 🤝 **Caregiver Invites** | Secure token-based sharing and collaboration |
| 📝 **Audit Trail** | Timestamped logging of all create/update/delete operations |
| ☁️ **Cloud Storage** | All tracker types + milestones + enabled_modules persist to Neon Postgres via `VITE_USE_CLOUD=true`. Local mode uses localStorage as fallback. |
| 📥 **Data Import** | Bulk import via CSV/Excel for all entry types |
| 🎉 **Gentle celebrations** | Supportive, non-punitive celebration banners for milestones and daily effort |
| 🧱 **Brand & asset registry** | Brand copy in `src/content/presentation.ts` and asset references in `src/assets/index.ts` for easier updates |

### Pages

| Page | Route | Nav Icon | Description |
|------|-------|----------|-------------|
| Today | `/` | 📊 Today | Today's overview, reminders, supportive celebrations, and thumb-friendly quick actions |
| Diary | `/log` | 📋 Diary | Full diary history with calendar-strip, filters, and entry management |
| Add an update | `/add` | — | Fast tabbed entry forms with calmer wording and one-handed quick logging |
| Reports | `/reports` | 📈 Reports | Charts, trends, milestone summaries, and guided export |
| Milestones | `/milestones` | ⭐ Milestones | Developmental milestone dashboard |
| Leaps | `/leaps` | 🌈 Leaps | Developmental leap guidance, predictions, symptom logging, and trusted resource links |
| Calendar | `/calendar` | — | Monthly calendar view of all entries |
| Profiles | `/profiles` | 👥 Profiles | Child profiles, caregiver invites, access review, and notifications |
| Settings | `/settings` | ⚙️ Settings | Themes, module toggles, reminders, import/export, GDPR, and support |
| Help & Support | `/help` | — | Onboarding guidance, FAQs, accessibility, privacy, and support signposting |
| Admin | `/admin` | 👑 Crown | System admin (admin role only) |
| Login | — | — | Register / login / password reset with role descriptions |

---

## 🧭 Product & UX principles

- **Plain-English first:** the UI now prefers family-friendly labels such as **Wee**, **Poo**, and **Toilet visits** while preserving the existing internal schema.
- **One-handed mobile use:** primary quick actions are larger, shorter, and grouped for thumb-friendly use on phones.
- **Gentle encouragement:** celebration banners recognise effort and progress without streak pressure or guilt-based nudges.
- **Maintainable content:** shared product wording, celebration copy, role labels, and brand strings live in `src/content/presentation.ts`.
- **Updateable assets:** app-wide asset references now flow through `src/assets/index.ts`, making future brand refreshes easier.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (SPA)                  │
│  React 19 · TypeScript · Tailwind 4 · Vite 7   │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ AppCtx   │  │ ThemeCtx │  │ React Router │  │
│  │ useApp() │  │useTheme()│  │ lazy routes  │  │
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
│ 20 tables     │
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

# 2. Initialize the database (creates all 20 tables)
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
| `npm test` | Vitest + React Testing Library smoke, storage, and accessibility checks |
| `npm run preview` | Preview the production build locally |
| `vercel dev` | Local dev with serverless functions + cloud DB |

---

## 🚢 Deployment & Environment

Copy `.env.example` and set the variables that match your deployment mode:

```bash
cp .env.example .env.local
```

| Variable | Required when | Purpose |
|----------|----------------|---------|
| `VITE_USE_CLOUD` | Cloud mode | Switches the frontend from localStorage mode to the Vercel/Neon API |
| `VITE_ADMIN_KEY` | Local-only admin setup | Allows local/offline admin promotion without hardcoding a key in source |
| `DATABASE_URL` / `POSTGRES_URL` | Cloud mode | Neon Postgres connection string |
| `JWT_SECRET` | Cloud mode | Signs server-side session tokens |
| `ADMIN_ACCESS_KEY` | Cloud mode | Server-side admin promotion key used by `/api/auth` |
| `NODE_ENV` | All environments | Controls production-only cookie hardening |

Deployment checklist:

1. Set the environment variables in Vercel (or your deployment platform).
2. Run `POST /api/migrate` once against the target environment.
3. Verify CI is green for `npm test`, `npm run lint`, `npm run build`, and the API type-check.
4. In cloud mode, confirm admin promotion only works with the configured server-side key.

---

## 🗄 Database Schema

20 tables auto-created by `POST /api/migrate` (idempotent):

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
| `reminder_preferences` | Reminder settings | `child_id`, `module_id`, `frequency`, `created_by` |
| `invites` | Caregiver invites | `child_id`, `email`, `role`, `status`, `token` (UNIQUE), `invited_by` |
| `notifications` | User notifications | `user_id`, `title`, `message`, `read` |
| `audit_events` | Activity log | `user_id`, `action`, `subject`, `detail`, `created_at` |

All entry tables share: `id` (UUID PK), `created_by` (FK → accounts), `created_at` (timestamp), `notes`.

---

## 👥 User Roles & Permissions

The following roles are supported in registration and invite flows. The `child_access` DB table enforces access at two levels: `parent` and `caregiver`.

| Role | Description | View diary | Add entries | Manage children | Invite others | Admin panel | Registration / invite available |
|------|-------------|-----------|-------------|-----------------|-------------------|-------------|---|
| `admin` | System administrator | ✅ All | ✅ | ✅ | ✅ | ✅ | Via `promote` action only |
| `parent` | Primary caregiver | ✅ Own children | ✅ | ✅ | ✅ | ❌ | ✅ |
| `caregiver` | Invited collaborator | ✅ Shared children | ✅ | ❌ | ❌ | ❌ | ✅ |
| `schoolAdmin` | School/educational staff | ✅ Shared children | ✅ | ❌ | ❌ | ❌ | ✅ (grants caregiver DB access) |
| `therapist` | Clinical therapist | — | — | — | — | — | Reserved — not yet available |
| `specialist` | Medical specialist | — | — | — | — | — | Reserved — not yet available |

**Note:** `schoolAdmin` invites grant `caregiver`-level DB access (same data permissions as caregiver). The label is retained for contextual clarity in school-handover workflows. See `docs/API.md` for the canonical invite permission matrix.

**Data isolation:** Users only see children they created or were explicitly granted access to via invite acceptance.

---

## 🔌 Module System

The module registry (`DEFAULT_MODULES` in `src/types/index.ts`) defines all 13 modules:

```typescript
export const DEFAULT_MODULES: TrackerModule[] = [
  { id: 'drinks',     label: 'Drinks',         icon: '🥤', builtIn: true, defaultEnabled: true  },
  { id: 'urine',      label: 'Wee',            icon: '💦', builtIn: true, defaultEnabled: true  },
  { id: 'bowel',      label: 'Poo',            icon: '🚽', builtIn: true, defaultEnabled: true  },
  { id: 'sleep',      label: 'Sleep',          icon: '🌙', builtIn: true, defaultEnabled: true  },
  { id: 'toilet',     label: 'Toilet visits',  icon: '🎯', builtIn: true, defaultEnabled: true  },
  { id: 'food',       label: 'Meals',          icon: '🍽️', builtIn: true, defaultEnabled: true  },
  { id: 'mood',       label: 'Mood',           icon: '😊', builtIn: true, defaultEnabled: false },
  { id: 'sensory',    label: 'Sensory',        icon: '🎨', builtIn: true, defaultEnabled: false },
  { id: 'medication', label: 'Medication',     icon: '💊', builtIn: true, defaultEnabled: false },
  { id: 'therapy',    label: 'Therapy',        icon: '🧩', builtIn: true, defaultEnabled: false },
  { id: 'routine',    label: 'Routines',       icon: '📋', builtIn: true, defaultEnabled: false },
  { id: 'milestones', label: 'Milestones',     icon: '⭐', builtIn: true, defaultEnabled: true  },
  { id: 'leaps',      label: 'Leaps',          icon: '🌈', builtIn: true, defaultEnabled: false },
];
```

**Per-child toggling:** Parents toggle modules on/off in Settings (or Profile). Toggles apply **instantly** — no Save button required. State persists to the `enabled_modules` table in Neon DB (cloud mode) or `bt_enabled_modules` localStorage key (local mode). The enabled set is reloaded per-child on login and child selection, ensuring correct state across sessions and multiple children.

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
| `GET/POST/PUT/DELETE /api/trackers?type=<type>` | `sleep`, `toilet`, `food` |
| `GET/POST/PUT/DELETE /api/modules?type=<type>` | `mood`, `sensory`, `medication`, `therapy`, `routine`, `milestones` |

All tracker endpoints accept `?childId=<id>` for filtering and return `{ entries: Entry[] }`.

### `/api/modules` — New Module Endpoint

The `/api/modules` endpoint handles all 6 newer tracker types plus enabled_modules management in a single consolidated function.

| Method | `type` param | Body | Purpose |
|--------|-------------|------|---------|
| `GET` | `mood\|sensory\|medication\|therapy\|routine\|milestones` | — | List entries for accessible children |
| `GET` | `enabled_modules` | `?childId=<id>` | Get enabled module IDs for a child |
| `POST` | — | `{ trackerType, childId, date, time, ...fields }` | Create entry |
| `POST` | — | `{ action: 'set_enabled_modules', childId, modules: string[] }` | Save enabled modules to DB |
| `PUT` | — | `{ trackerType, id, ...fields }` | Update entry |
| `DELETE` | `mood\|sensory\|...` | `?id=<entry-id>` | Delete entry |

### Other Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/invites` | GET/POST | List invites or create/accept invite (`{ action: 'accept', token }`) |
| `/api/notifications` | GET/PUT | List or mark-read notifications |
| `/api/audit` | GET | Retrieve audit event log |
| `/api/data?childId=<id>` | GET | Export all child data as CSV |
| `/api/data` | POST | Import bulk data `{ childId, drinks?, urineEntries?, ... }` |
| `/api/migrate` | POST | Run idempotent DB schema migration |
| `/api/auth` | `DELETE` | Delete account and all associated data (GDPR right to erasure) |

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
4. **Add cloud API** in `src/utils/api.ts` — add functions that call `/api/modules?type=new` (or create a dedicated endpoint if approaching the 12-function limit).
5. **Add server handler** in `api/modules.ts` — add a handler for the new type in `api/modules.ts` (which consolidates mood, sensory, medication, therapy, routine, and milestones). If modules exceed the Vercel function limit, create a new consolidated endpoint.
6. **Add DB table** in `api/_lib/db.ts` — add `CREATE TABLE IF NOT EXISTS` in the migration function.
7. **Wire into AppContext** — add state, fetch, and CRUD methods in `src/context/AppContext.tsx`.
8. **Add UI** — add tab in `AddEntryPage.tsx`, card in `DashboardPage.tsx`, and chart in `ReportsPage.tsx`.

### Adding a New User Role

1. Add to `UserRole` union in `src/types/index.ts`.
2. Add role option in `LoginPage.tsx` registration form.
3. Update server-side role validation in `api/_lib/auth.ts`.
4. Adjust conditional UI rendering (e.g., `AppNav.tsx` admin check).

### DB Migration Pattern

All migrations are idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`). Add new tables or columns in the `runMigrations()` function in `api/_lib/db.ts`, then hit `POST /api/migrate`.

### Adding In-App Help to a New Module

Every entry form should include a `<HelpPanel>` component at the top:

```tsx
import HelpPanel from '../components/HelpPanel';

// Inside your form's return JSX:
<HelpPanel title="Logging a New Module">
  <p><strong>Field name:</strong> Explanation of what to enter.</p>
  <p><strong>Another field:</strong> Why this data is useful.</p>
</HelpPanel>
```

See `src/components/HelpPanel.tsx` for the full component. It is collapsible, keyboard-navigable, and ARIA-labelled.

---

## 📊 Clinical & Market Benchmarking

| Feature | BladderTracker | CareZone | Ovia | MyTherapy | ASD-specific apps |
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
| **Consolidated `/api/trackers.ts`** | Single function handles sleep, toilet, and food entries via `?type=` query parameter |
| **Consolidated `/api/modules.ts`** | Single function handles 6 newer tracker types (mood, sensory, medication, therapy, routine, milestones) plus `enabled_modules` management |
| **Separate high-traffic endpoints** | Drinks, urine, and bowel retain dedicated functions for clarity |
| **Shared `_lib/`** | `auth.ts` and `db.ts` are shared modules (not counted as functions) |
| **Total functions** | 12 serverless functions — at Hobby tier limit. New tracker types consolidated into `/api/modules`. |

### Neon Free Tier

| Resource | Limit | Usage |
|----------|-------|-------|
| Compute | 0.25 vCPU (191 hrs/month) | Low — serverless cold-start only |
| Storage | 512 MB | 20 tables, text-heavy — ample headroom |
| Branches | 10 | 1 production branch sufficient |

**Connection:** Uses `@neondatabase/serverless` HTTP driver — no persistent connections, ideal for serverless.

---

## 🤝 Contributing

### Project Structure

```
api/                  → Vercel Serverless Functions (one file = one endpoint)
  _lib/               → Shared auth (JWT/CORS) and DB (Neon/migrations)
src/
  pages/              → 11 React page components + LoginPage
  components/         → Reusable UI (AppNav, BristolStoolPicker, EntryCard, etc.)
  context/            → AppContext (state + CRUD) and ThemeContext (light/dark)
  types/index.ts      → All TypeScript types, enums, and DEFAULT_MODULES
  utils/storage.ts    → localStorage CRUD (all 13 trackers)
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
npm test              # Run unit, route smoke, and accessibility checks
npm run lint          # Check for lint errors
npm run build         # Full type-check + production build
```

---

## 🧾 Issues, roadmap & support

- **Bug reports:** open a GitHub issue with the **Bug report** template and include reproduction steps, mode (local/cloud), and screenshots when helpful.
- **Feature requests:** use the **Feature request** template with user value, scope boundaries, and acceptance criteria.
- **Documentation improvements:** use the **Documentation improvement** template when instructions, wording, or examples drift from the code.
- **Security concerns:** do **not** post exploit details publicly; follow [SECURITY.md](./SECURITY.md).
- **Backlog alignment:** treat [docs/REPO_STATUS.md](./docs/REPO_STATUS.md) as the source of open work, then use GitHub issues for discrete, actionable tasks.
- **Architecture decomposition (completed):** large page components (AddEntryPage, LeapsPage, SettingsPage) have been decomposed into focused sub-components under `src/components/forms/`, `src/components/leaps/`, and `src/components/settings/`. See [CHANGELOG.md](./CHANGELOG.md) for details.

---

<p align="center">
  Built with ❤️ for families navigating developmental journeys
</p>

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [GDPR.md](./GDPR.md) | Full GDPR & Data Protection Policy |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Developer guide, module schema, adding features |
| [docs/Onboarding.md](./docs/Onboarding.md) | User step-by-step onboarding guide |
| [docs/API.md](./docs/API.md) | API endpoint reference |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture |
| [docs/MODULES.md](./docs/MODULES.md) | Module field reference and clinical guidance |
| [docs/REPO_STATUS.md](./docs/REPO_STATUS.md) | Durable list of genuine remaining work |
| [docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) | Lightweight planning index and historical context |
| [CHANGELOG.md](./CHANGELOG.md) | Release notes and version history |

---

## ♿ Accessibility

- **WCAG 2.1 AA** compliance throughout
- Three theme options: Light, Dark, High Contrast
- **Dyslexia-friendly font** toggle in Settings — switches to [Atkinson Hyperlegible](https://brailleinstitute.org/freefont), recommended by RNIB and the Braille Institute [7]
- Keyboard navigation support with proper focus management
- ARIA labels and semantic HTML on all interactive elements
- Clear, simple language suitable for all users
- Screen reader compatible

---

## 🎨 UI Design Principles (NHS-Inspired)

BladderTracker follows NHS Digital Service Manual design principles, adapted for families caring for autistic children and children with special needs.

### Callout Reference (from UI mockup)

| # | Principle | Implementation |
|---|-----------|---------------|
| **[1]** | **Large tap/click zones** | Quick-add buttons use `py-5` padding; nav items `min-h-[4rem]`; toggle switches are 44×24px |
| **[2]** | **Simplified icons, uniform colour scheme** | Each module has a consistent accent colour across Dashboard chips, Log chips, Reports chips, and stat cards. Disabled modules are hidden entirely — no cognitive noise |
| **[3]** | **High-contrast text, logical grouping** | Summary stat cards have a coloured top border matching their module colour. Entry feeds are grouped by module section |
| **[4]** | **Simple, uncluttered data views** | Reports charts use clean axes, minimal gridlines, and concise tooltips |
| **[5]** | **Visual structure breaks complex forms into steps** | Add Entry form is tab-per-module with minimal required fields; each form uses step-by-step sectioning |
| **[6]** | **Step-by-step guidance to avoid overwhelming users** | Welcome / onboarding modal shows exactly 3 steps: Add Profile → Enable Modules → Make First Entry. Each step has a single CTA button |
| **[7]** | **Specialised accessibility options** | Dyslexia-friendly font toggle (Atkinson Hyperlegible) in Settings > Appearance. Persisted in `localStorage` key `bt_dyslexia_font` |

### Colour Coding (per module)

| Module | Accent colour | Usage |
|--------|--------------|-------|
| Drinks | Sky blue `#0ea5e9` | Stat card border, quick-add badge, Log chip, Reports chip |
| Urine | Amber `#f59e0b` | Same pattern |
| Bowel | Emerald `#22c55e` | Same pattern |
| Sleep | Indigo `#6366f1` | Same pattern |
| Toilet Attempts | Purple `#a855f7` | Same pattern |
| Food | Orange `#f97316` | Same pattern |
| Mood | Pink `#ec4899` | Same pattern |
| Sensory | Teal `#14b8a6` | Same pattern |
| Medication | Red `#ef4444` | Same pattern |
| Therapy | Cyan `#06b6d4` | Same pattern |
| Routine | Lime `#84cc16` | Same pattern |
| Milestones | Yellow `#eab308` | Same pattern |

### Module Visibility

Modules toggled **off** in Settings are hidden from:
- Dashboard quick-add grid and stat cards
- Log page filter chips and entry feed
- Reports filter chips and charts
- Add Entry tab bar

Changes apply **instantly** (no Save button) and persist to localStorage (local mode) or Neon DB (cloud mode). Child switching and login/logout correctly reload each child's module preferences.

---

## 🔒 GDPR & Privacy

- Full [GDPR Policy](./GDPR.md) available
- **Export**: Download all diary data as CSV from Settings > Data & Privacy
- **Delete**: Permanently remove your account and all data
- **Clear**: Remove all local app data
- **Audit Trail**: View all account actions in Settings
- Data isolation per child and per user
- Role-based access control (6 roles)

---

## ⚠️ Known Issues

- Chunk size warning during build (>500KB) — consider code-splitting for production
- Theme persistence uses localStorage (not synced to cloud)
- Goal dismissal state uses localStorage

---

## 🧪 Testing & QA

### Automated checks run
- `npm test` ✅
- `npm run build` ✅
- `./node_modules/.bin/tsc --project tsconfig.api.json --noEmit` ✅
- `npm run lint` ✅

### Manual QA checklist
- [ ] Milestones timeline: weekly/monthly/annual zoom, filters, and jump controls
- [ ] Milestones cards: add/update/delete, category/module/type/status behaviour
- [ ] Guidance panel: opens from milestone card and shows NHS-contextual text/links
- [ ] Reminders: configure per child/module in Settings, banner appears on Dashboard, snooze works
- [ ] Multi-child switch: timeline/reminder/report context refreshes correctly
- [ ] Reports: milestone trend chart renders; CSV export requires consent modal; PDF print flow works
- [ ] Accessibility: dyslexia font toggle, keyboard tab order, switch controls, readable contrast
- [ ] Edge cases: rapid toggle changes, login/logout, no child selected, empty milestone filter results
