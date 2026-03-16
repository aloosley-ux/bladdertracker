# AGENTS.md — BladderTracker

## Project purpose

BladderTracker is a child development, continence, SEND, and daily routine tracker for families, caregivers, and care teams. It runs as a mobile-first PWA with an offline-first localStorage mode and an optional cloud mode (Vercel + Neon Postgres).

## Architecture overview

- **Single-page React app** built with Vite and React Router v7.
- **AppContext** (`src/context/AppContext.tsx`) is the single source of truth. All pages use `useApp()` for data and CRUD operations.
- AppContext delegates to either `src/utils/storage.ts` (localStorage/offline) or `src/utils/api.ts` (cloud API).
- **13 tracker modules** are defined in `src/types/index.ts` as `DEFAULT_MODULES`. Modules can be enabled/disabled per child.
- **Three themes**: light, dark, high-contrast — implemented with CSS custom properties on `[data-theme]`.
- **Lazy-loaded pages** in `src/App.tsx` for fast initial load on mobile.
- **Vercel Serverless Functions** in `api/` — limited to 12 functions (Vercel Hobby tier).

## Key directories

```
src/
├── components/          # Shared UI components
│   ├── forms/           # One form component per tracker module + FormStep wrapper
│   ├── leaps/           # Leap-specific sub-components
│   └── settings/        # Settings sub-components
├── content/             # Centralised UI labels and copy (presentation.ts)
├── context/             # AppContext + ThemeContext providers and hooks
├── data/                # Static data (leap definitions, milestones, UK resources)
├── pages/               # Route page components (lazy-loaded)
├── test/                # Test helpers, fixtures, and test files
├── types/               # TypeScript types + DEFAULT_MODULES registry
└── utils/               # storage.ts, api.ts, auth.ts, importers.ts

api/
├── _lib/                # Shared auth + DB helpers (not counted as functions)
└── *.ts                 # Serverless function endpoints (12 total)

docs/                    # Architecture, API, modules, project plan docs
```

## How to run and validate

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localStorage mode)
npm run lint             # Lint
npm run build            # TypeScript check + Vite build
npx tsc --project tsconfig.api.json --noEmit   # API type-check
npm test                 # Run tests
```

Validation order: lint → build → API type-check → test.

> `npm test` includes a live integration test that contacts a deployed Vercel hostname. If it fails due to network access, the rest of the suite should still pass.

## Approach by task type

### Bug fixes

1. Reproduce the issue in `npm run dev`.
2. Write or update a test that covers the bug.
3. Fix the bug with minimal changes.
4. Verify the fix in all three themes if UI-related.
5. Run full validation (lint → build → API type-check → test).

### Features

1. Check if the module/page/component already exists.
2. Follow the existing patterns — see `CONTRIBUTING.md` for guidance on adding modules.
3. Types go in `src/types/index.ts`, storage in `src/utils/storage.ts`, API in `src/utils/api.ts`.
4. New pages go in `src/pages/` and are registered as lazy routes in `src/App.tsx`.
5. Update relevant docs (`README.md`, `docs/MODULES.md`, `docs/API.md`, `docs/ARCHITECTURE.md`).

### UI work

1. Use Tailwind CSS utility classes. No inline styles.
2. Reuse existing shared components before creating new ones.
3. Respect the three-theme system — test in light, dark, and high-contrast.
4. All interactive elements need ARIA labels and keyboard support.
5. Use `vitest-axe` to add accessibility assertions where possible.
6. UI copy lives in `src/content/presentation.ts` — update there, not in page components.

## Before editing shared components

- `AppContext` is consumed by every page — changes propagate everywhere.
- `EntryCard` uses `data-entry-type` attributes for theme overrides — check `src/index.css`.
- `AppNav` filters items based on enabled modules — changes affect navigation.
- `FormStep` is used by all 11 entry forms — check all tabs in `AddEntryPage`.
- Run the full test suite after modifying any shared component.

## Pull request expectations

- One concern per PR — do not bundle unrelated changes.
- All validation must pass: `npm run lint`, `npm run build`, `npx tsc --project tsconfig.api.json --noEmit`, `npm test`.
- Update tests when behaviour changes.
- Update docs when user-facing behaviour changes.
- Fill in the PR template with summary, linked issue, validation results, and risks.
- Never commit real child data, credentials, or sensitive information.
