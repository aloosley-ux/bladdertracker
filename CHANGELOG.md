# Changelog

All notable changes to EveryStep will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
 - Dedicated GDPR & Data Protection page at `/gdpr` with structured sections (data collected, storage, rights, deletion, retention, contact) (#102)
 - Dedicated Audit Trail page at `/audit-trail` with category filtering and expandable event details (#99)
 - Leaps page restructured into sections: Overview, Milestones, Timeline (#98)
 - Missed milestone detection with visual alerts and NHS guidance links (#98)
 - Milestone integration on Leaps page with progress-by-category view (#98)
 - NHS resource links and next-step guidance for missed milestones (#98)
 - End-to-end integration test for `/api/auth` endpoint against deployed Vercel API (see `src/test/integration/api-auth.integration.test.ts`).
 - All tracked issues resolved and archived (see `docs/issues-archive.md`).
 - Documentation and process alignment: README, REPO_STATUS.md, PROJECT_PLAN.md, and all issue/process files updated for accuracy and single-source-of-truth workflow.
- Architecture decomposition: extracted 11 form components from AddEntryPage into `src/components/forms/`
- Architecture decomposition: extracted ModuleSettings from SettingsPage into `src/components/settings/`
- Architecture decomposition: extracted 10 leap components from LeapsPage into `src/components/leaps/`
- Reusable `EmptyState` component applied across LogPage, CalendarPage, ReportsPage, and MilestonesPage
- CHANGELOG.md for structured release communication
- PR template with documentation verification checklist.

### Fixed
- Documentation audit completed across README, docs/, contributing notes, and policy files; obsolete issue-draft docs removed and a dedicated audit report added
- `/api/auth` self-registration is now restricted to `parent`, `caregiver`, and `schoolAdmin` to match the UI and published role model
- `/api/data` import/export now verifies child access before reading or writing child data
- Milestone SummaryCard on Dashboard now navigates to `/milestones` instead of opening the drink entry form (#104)
- Leaps toggle now controls entire Leaps page: navigation, route access, and dashboard links. Defaults to off (#93, #96)
- Milestones toggle now controls entire Milestones page: navigation, route access, and dashboard links (#103)
- Dark and High Contrast modes now apply comprehensively across text, cards, inputs, buttons, navigation, headers, dividers, rings, and form elements (#97)

### Changed
- Combined "Today's snapshot" and "Quick updates" into a single `TodayCombined` card on the Dashboard to streamline the Today view (see `src/components/TodayCombined.tsx` and `src/pages/DashboardPage.tsx`).

### Changed
- Documentation correction pass: refreshed API/module/onboarding docs, replaced sprawling project backlog with maintained status index, and added `docs/REPO_STATUS.md` + issue-ready drafts
- AddEntryPage reduced from ~1350 lines to ~170 lines (forms extracted to individual components)
- SettingsPage reduced from ~830 lines to ~740 lines (ModuleSettings extracted)
- LeapsPage reduced from ~1160 lines to ~70 lines (all sub-components extracted)
- Replaced inline empty states with consistent EmptyState component across data pages
- Updated ARCHITECTURE.md to reflect new component directory structure

## [1.0.0] - 2026-03

### Added
- 13 modular trackers: Drinks, Wee, Poo, Sleep, Toilet visits, Meals, Mood, Sensory, Medication, Therapy, Routines, Milestones, Leaps
- Dual offline-first (localStorage) and cloud (Neon Postgres) architecture
- 6 user roles with data isolation: admin, parent, caregiver, schoolAdmin, therapist, specialist
- Multi-child profile support with per-child module toggling
- Food Trying Tracker with texture/acceptance tracking (issue #15)
- Enhanced Sleep Tracker with bedtime, sleep onset latency, and night activity toggle (issue #16)
- Baby Leap module: age calculator, leap timeline, symptom logger, diary, notifications, calendar widget, progress charts (issue #36)
- Leap detail pages with parental tips and resource links (issue #39)
- Leap symptoms and signs logging (issue #40)
- Leap events history and timeline (issue #41)
- CI/CD pipeline (GitHub Actions) with build, lint, type-check, and test steps
- Comprehensive test suite: 45 tests covering routes, accessibility (axe), storage CRUD, component rendering
- PWA support via vite-plugin-pwa with service worker and web manifest
- Accessibility features: dyslexia-friendly font (Atkinson Hyperlegible) toggle, high-contrast theme, WCAG touch targets (44px min), keyboard navigation, focus visibility
- GDPR-first privacy: audit trail, right-to-erasure, data export (CSV)
- Error boundary for graceful error recovery
- NHS-inspired UI with step-by-step form guidance (FormStep, HelpPanel components)
- Notification system with leap reminders
- Caregiver invite flow with pending/accept workflow
- Bristol Stool Chart picker for bowel entries
- Centralised content system via presentation.ts
- Documentation suite: README, API.md, ARCHITECTURE.md, MODULES.md, Onboarding.md, CONTRIBUTING.md, SECURITY.md, GDPR.md
