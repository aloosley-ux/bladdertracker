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
│   │   ├── forms/              # Extracted entry form components (one per tracker)
│   │   │   ├── DrinkForm.tsx
│   │   │   ├── UrineForm.tsx
│   │   │   ├── BowelForm.tsx
│   │   │   ├── SleepForm.tsx
│   │   │   ├── ToiletAttemptForm.tsx
│   │   │   ├── FoodForm.tsx
│   │   │   ├── MoodForm.tsx
│   │   │   ├── SensoryForm.tsx
│   │   │   ├── MedicationForm.tsx
│   │   │   ├── TherapyForm.tsx
│   │   │   ├── RoutineForm.tsx
│   │   │   ├── FormStep.tsx    # Shared step-by-step form wrapper
│   │   │   └── index.ts
│   │   ├── leaps/              # Extracted leap sub-components
│   │   │   ├── DueDateEditor.tsx
│   │   │   ├── AgeCalculator.tsx
│   │   │   ├── LeapTimeline.tsx
│   │   │   ├── LeapTimelineCard.tsx
│   │   │   ├── SymptomLogger.tsx
│   │   │   ├── LeapDiary.tsx
│   │   │   ├── LeapNotifications.tsx
│   │   │   ├── LeapCalendarWidget.tsx
│   │   │   ├── LeapProgressChart.tsx
│   │   │   ├── generateICS.ts
│   │   │   ├── leapConstants.ts
│   │   │   └── index.ts
│   │   ├── settings/           # Extracted settings sub-components
│   │   │   ├── ModuleSettings.tsx
│   │   │   └── index.ts
│   │   ├── AppNav.tsx          # Responsive top/bottom navigation shell
│   │   ├── BrandBanner.tsx     # App header
│   │   ├── BrandIcon.tsx       # App logo
│   │   ├── BristolStoolPicker.tsx # Bristol scale UI component
│   │   ├── CalendarStrip.tsx   # Horizontal date scroller
│   │   ├── EmptyState.tsx      # Reusable empty state placeholder
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

## Modules

The following modules are defined in `src/types/index.ts` and supported throughout the app:

| ModuleId     | Description                                              | Default Enabled |
|--------------|----------------------------------------------------------|-----------------|
| drinks       | Track drinks and fluids                                  | Yes             |
| urine        | Log wees, wet clothes and urgency                        | Yes             |
| bowel        | Track poos and stool consistency                         | Yes             |
| sleep        | Track sleep patterns                                     | Yes             |
| toilet       | Track toilet sits, prompts and outcomes                  | Yes             |
| food         | Track meals, snacks and new foods                        | Yes             |
| mood         | Track emotional states and triggers                      | No              |
| sensory      | Track sensory responses and preferences                  | No              |
| medication   | Track medications and dosages                            | No              |
| therapy      | Track therapy sessions and goals                         | No              |
| routine      | Track routines and what helped                           | No              |
| milestones   | Track developmental milestones                           | Yes             |
| leaps        | Baby age calculator, leap predictions & symptom logging  | No              |

---

## User Roles

User roles are defined as:

- admin: Full access to all features, user management, system config
- parent: Manage children, all trackers, invite caregivers
- caregiver: View/edit entries for shared children
- schoolAdmin: View/edit entries for shared children (school context label)
- therapist: Invite-only contextual label; currently maps to caregiver-level diary access
- specialist: Invite-only contextual label; currently maps to caregiver-level diary access

---

## Database Schema (Summary)

The following tables are created and managed by the migration logic in `api/_lib/db.ts`:

- accounts (id, name, email, password_hash, role, avatar, created_at)
- children (id, name, date_of_birth, avatar, created_by, last_updated_at)
- child_access (id, child_id, user_id, access_type)
- drink_entries (id, child_id, date, time, type, amount_ml, notes, created_by, created_at)
- urine_entries (id, child_id, date, time, wet, pass, volume_ml, urgency, leakage_amount, notes, created_by, created_at)
- bowel_entries (id, child_id, date, time, location, amount, bristol_type, laxatives_given, notes, image_url, created_by, created_at)
- invites (id, child_id, child_name, email, role, status, invited_by, token, link, accepted_by, created_at)
- notifications (id, user_id, title, message, read, created_at)
- audit_events (id, user_id, action, subject, detail, created_at)
- sleep_entries (id, child_id, date, time, event_type, duration_minutes, quality, nighttime_event, bedtime, sleep_onset_minutes, night_activity, notes, created_by, created_at)
- toilet_attempt_entries (id, child_id, date, time, outcome, supervised, prompted, duration_minutes, notes, created_by, created_at)
- food_entries (id, child_id, date, time, meal_type, description, portions, is_trying, texture, accepted, notes, created_by, created_at)
- mood_entries (id, child_id, date, time, level, triggers, notes, created_by, created_at)
- sensory_entries (id, child_id, date, time, sensory_type, response, intensity, notes, created_by, created_at)
- medication_entries (id, child_id, date, time, name, dosage, administered, notes, created_by, created_at)
- therapy_entries (id, child_id, date, time, therapy_type, provider, duration_minutes, goals, notes, created_by, created_at)
- routine_entries (id, child_id, date, time, routine_name, completed, duration_minutes, notes, created_by, created_at)
- milestones (id, child_id, name, description, category, module_id, milestone_type, status, target_date, date_achieved, notes, source_role, created_by, created_at)
- enabled_modules (id, child_id, module_id)
- reminder_preferences (id, user_id, child_id, module_id, frequency, enabled, snoozed_until, next_reminder_at, created_at, updated_at)

**AppContext** is the single source of truth. All pages consume data via `useApp()` and call CRUD methods on the context. The context delegates to either:
- `src/utils/api.ts` — HTTP calls to Vercel Serverless Functions → Neon Postgres
- `src/utils/storage.ts` — localStorage reads/writes (offline/development mode)

Leap symptom logs and leap diary entries currently remain local-only in `AppContext`; there is no cloud API route for them in `/api/*`.

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

### Theme-Aware CSS Classes

Semantic CSS utility classes are defined at the end of `src/index.css` to provide consistent theme-aware styling across all pages and themes:

| Class | Purpose |
|-------|---------|
| `.theme-surface-card` | Card background, text color, border — adapts to dark/HC |
| `.theme-stat-tile` | Report stat tile background with theme-appropriate tint |
| `.theme-surface-banner` | Gradient header/banner backgrounds for dark/HC |
| `.theme-surface-muted` | Light muted background for cards (profiles, invites, audit) |
| `.faq-item` | FAQ accordion item hover states for dark/HC |
| `.nhs-guidance-btn` | NHS guidance button styling (white bg/blue text in all themes) |
| `.btn-delete` | Delete button with enhanced contrast in dark/HC |
| `.tag-selected` | "Selected" tag visibility fix in dark/HC |
| `.landing-top` | Login page header gradient dark/HC override |

All components should use `var(--text-primary)`, `var(--text-secondary)`, `var(--bg-card)`, `var(--bg-primary)`, `var(--border-color)` etc. instead of hardcoded Tailwind gray/white classes to ensure proper theme support.
