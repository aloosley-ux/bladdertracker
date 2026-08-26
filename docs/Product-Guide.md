# 🧩 EveryStep — Product Guide

Detailed product documentation, moved here from the README (P1.4). Sections are
carried over from the original README; see [README.md](../README.md) for the
overview and quick start.

## 🧭 What you can do today

This section highlights the experience that already exists in the product today. For confirmed remaining work, see [docs/REPO_STATUS.md](./REPO_STATUS.md) and linked GitHub issues.

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
- Supported account roles: `admin`, `parent`, `caregiver`, `schoolAdmin`, `therapist`, `specialist`. Registration flows support `parent`, `caregiver`, and `schoolAdmin`; invite flows support all roles except `admin`.

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
| 👥 **User Roles** | 6 role labels in the data model; self-registration is limited to `parent`, `caregiver`, and `schoolAdmin`, while `therapist` and `specialist` are invite-only contextual labels |
| 🌗 **Theme System** | Light, Dark, High Contrast with CSS custom properties |
| 📊 **Charts & Calendar** | Recharts-powered data visualization + calendar view |
| 📤 **CSV Export** | Export all tracker types + milestones per child |
| 🤝 **Caregiver Invites** | Secure token-based sharing and collaboration |
| 📝 **Audit Trail** | Timestamped logging of all create/update/delete operations |
| ☁️ **Cloud Storage** | All diary trackers except leap diary/symptom logs, plus milestones and enabled modules, persist to Neon Postgres via `VITE_USE_CLOUD=true`. Local mode uses localStorage as fallback. |
| 📥 **Data Import** | Settings UI imports drinks / urine / bowel templates from CSV, JSON, or XLSX. The `/api/data` endpoint also accepts direct payload arrays for sleep, toilet attempts, and food. |
| 🎉 **Gentle celebrations** | Supportive, non-punitive celebration banners for milestones and daily effort |
| 🧱 **Brand & asset registry** | Brand copy in `src/content/presentation.ts` and asset references in `src/assets/index.ts` for easier updates |

---

## 🔍 Expand Entries — View & Edit

- **What it does:** Entry cards in the Diary and Today views are now expandable to show the full entry data and an audit history. Entries are read-only by default; an explicit Edit control enables inline editing of the entry data and a Save action persists changes to the backend.
- **Audit trail:** All create and update operations now write structured audit events to the server. Audit events can be queried per-entry via the API: [api/audit.ts](../api/audit.ts#L1) (`GET /api/audit?subject=<entryId>`).
- **Where it appears:** Diary (`/log`) and Today (`/`) pages include the expanded entry detail UI and per-entry audit history.


| Page | Route | Nav Icon | Description |
|------|-------|----------|-------------|
| Today | `/` | 📊 Today | Today's overview, reminders, supportive celebrations, and thumb-friendly quick actions |
| Diary | `/log` | 📋 Diary | Full diary history with calendar-strip, filters, and entry management |
| Add an update | `/add` | — | Fast tabbed entry forms with calmer wording and one-handed quick logging |
| Reports | `/reports` | 📈 Reports | Charts, trends, milestone summaries, and guided export |
| Milestones | `/milestones` | ⭐ Milestones | Developmental milestone dashboard (toggle-controlled, hidden when disabled) |
| Leaps | `/leaps` | 🌈 Leaps | Developmental leap guidance with sections: Overview, Milestones, Timeline. Includes missed milestone detection and NHS guidance links. (toggle-controlled, default off) |
| Calendar | `/calendar` | — | Monthly calendar view of all entries |
| Profiles | `/profiles` | 👥 Profiles | Child profiles, caregiver invites, access review, and notifications |
| Settings | `/settings` | ⚙️ Settings | Themes, module toggles, reminders, import/export, GDPR, and support |
| GDPR | `/gdpr` | — | Dedicated GDPR & Data Protection policy page (linked from Settings) |
| Audit Trail | `/audit-trail` | — | Full audit trail history with filtering (linked from Settings) |
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
- **Production-ready asset pack:** includes mark, wordmark, horizontal/stacked lockups, monochrome variant, and social preview metadata-friendly artwork.

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
| 🌙 Dark | `dark` | Dark backgrounds, muted accents, full text/card/input/nav/button theming |
| 🔲 High Contrast | `high-contrast` | Maximum contrast for accessibility with yellow accent for interactive elements |

Persisted to `localStorage` key `bt_theme`. All components use CSS custom properties (`--bg-primary`, `--bg-card`, `--bg-input`, `--text-primary`, `--text-secondary`, `--text-accent`, `--border-color`, `--divider-color`, `--ring-color`, `--bg-hover`, `--bg-accent`, `--icon-color`, etc.) for seamless switching across text, cards, inputs, buttons, navigation, modals, and dividers.

### Asset-driven theming

The app supports a **theme-aware asset system** that automatically serves the correct visual asset (icon, background, illustration) for the active theme.

- **Asset registry**: `src/assets/assetRegistry.ts` — central mapping of semantic asset keys to per-theme file URLs.
- **Hook**: `useThemeAsset(key)` — resolves the asset URL for the current theme.
- **Component**: `<AssetImage assetKey="..." fallback={...} />` — renders an image with graceful fallback.
- **Fallback chain**: dark/HC → light → `undefined` (CSS fallback).

See [ui-asset-integration-guide.md](./ui-asset-integration-guide.md) for the full integration guide, and [ui-asset-inventory.md](./ui-asset-inventory.md) for the complete asset catalogue.

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
| `GET/POST/PUT/DELETE /api/trackers?type=<type>` | `sleep`, `toilet_attempt`, `food` |
| `GET/POST/PUT/DELETE /api/modules?type=<type>` | `mood`, `sensory`, `medication`, `therapy`, `routine`, `milestones` |

Tracker list endpoints return entries for all children the signed-in user can access; only module toggles and reminder preferences use `childId` query parameters directly. There is currently **no cloud API for leap diary or leap symptom log data**.

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

## 📊 Clinical & Market Benchmarking

| Feature | EveryStep | CareZone | Ovia | MyTherapy | ASD-specific apps |
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

## 🎨 UI Design Principles (NHS-Inspired)

EveryStep follows NHS Digital Service Manual design principles, adapted for families caring for autistic children and children with special needs.

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
