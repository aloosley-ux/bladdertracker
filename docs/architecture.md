# Architecture

> Agent-focused reference. For the full schema, see [`docs/architecture.md`](./architecture.md).

## System Overview

BladderTracker is a mobile-first PWA for tracking child health, development, and daily routines. It targets families, caregivers, and care teams. Key constraints: mobile-first, offline-capable, Vercel Hobby tier (12 serverless function limit), privacy-sensitive data.

## Directory Map

```
bladdertracker/
├── api/                        Vercel Serverless Functions (12 endpoints, Hobby tier limit)
│   ├── _lib/                   Shared helpers: JWT auth + Neon DB — NOT endpoints
│   └── *.ts                    One file = one endpoint (auth, children, trackers, modules…)
├── docs/                       Architecture, API, module, and process documentation
├── public/                     Static assets for PWA manifest
└── src/
    ├── App.tsx                 Root router — registers all lazy-loaded routes
    ├── main.tsx                React entry point
    ├── index.css               Tailwind directives + all three theme CSS variables
    ├── assets/                 Brand images + central asset registry (index.ts)
    ├── components/             Shared UI — reuse before creating new
    │   ├── forms/              One form component per tracker module + FormStep wrapper
    │   ├── leaps/              Leap-specific sub-components
    │   └── settings/           Settings sub-components
    ├── content/                UI labels, brand copy, calmer display overrides (presentation.ts)
    ├── context/                AppContext (source of truth) + ThemeContext + hooks
    ├── data/                   Static content: leap definitions, milestone NHS guidance
    ├── hooks/                  Custom React hooks
    ├── pages/                  Route page components — lazy-loaded in App.tsx
    ├── test/                   Shared render helpers, fixtures, and integration tests
    ├── types/                  All TypeScript types + DEFAULT_MODULES registry (index.ts)
    └── utils/                  storage.ts · api.ts · auth.ts · importers.ts
```

## Module Boundaries

### Data flow

```
Page component
  → useApp() hook
    → AppContext (src/context/AppContext.tsx)
      ├── Cloud mode  → src/utils/api.ts  → fetch() → Vercel Serverless Function → Neon Postgres
      └── Local mode  → src/utils/storage.ts → localStorage
```

Pages must **never** call `api.ts` or `storage.ts` directly. All data access goes through `useApp()`.

### Module system

13 tracker modules are defined in `src/types/index.ts` as `DEFAULT_MODULES`. Display labels and calmer strings are in `src/content/presentation.ts`. Enabled modules per child are stored in `enabled_modules` (cloud) or `bt_enabled_modules` localStorage key (local).

### API function budget

The Vercel Hobby tier allows **exactly 12** serverless functions. All 12 slots are occupied:

| # | File | Responsibility |
|---|------|---------------|
| 1 | `api/auth.ts` | Register / login / logout / session / delete account |
| 2 | `api/audit.ts` | Audit event log |
| 3 | `api/bowel.ts` | Bowel entries |
| 4 | `api/children.ts` | Child profiles |
| 5 | `api/data.ts` | CSV export + bulk import |
| 6 | `api/drinks.ts` | Drink entries |
| 7 | `api/invites.ts` | Caregiver invites |
| 8 | `api/migrate.ts` | DB schema migration |
| 9 | `api/modules.ts` | mood / sensory / medication / therapy / routine / milestones + enabled_modules |
| 10 | `api/notifications.ts` | Notifications |
| 11 | `api/trackers.ts` | sleep / toilet / food entries |
| 12 | `api/urine.ts` | Urine entries |

Adding a new endpoint **requires removing or consolidating an existing one**.

### Key local-only data

Leap symptom logs and leap diary entries are stored in `AppContext` memory only — no cloud API route exists for them.

## Key Patterns

1. **Single source of truth via AppContext.** Every page calls `useApp()`. Bypass is a bug.
2. **Dual-mode storage.** `AppContext` switches between `api.ts` (cloud) and `storage.ts` (local) at runtime based on `VITE_USE_CLOUD`. Both implement the same interface.
3. **Content / code separation.** UI strings and calmer labels live in `src/content/presentation.ts`, never inline in JSX. Types and module metadata live in `src/types/index.ts`.
4. **Theme via CSS custom properties.** Three themes (`light`, `dark`, `high-contrast`) are implemented as `[data-theme]` attribute variants on `<html>`. All new components must work in all three.

## Infrastructure & Deployment

- **Frontend:** deployed to Vercel (static + CDN); PWA with offline support via `vite-plugin-pwa`.
- **API:** Vercel Serverless Functions (Node.js 22).
- **Database:** Neon Postgres (serverless); schema managed by `api/migrate.ts` via `api/_lib/db.ts`. Run migrations by calling `POST /api/migrate` after deploying. The `runMigrations()` function in `api/_lib/db.ts` contains the full up-to-date schema.
- **Auth (cloud):** bcrypt password hashing; JWT stored as `bt_session` HttpOnly cookie.
- **Auth (local):** PBKDF2 (Web Crypto API); session in localStorage.

### Required environment variables

| Variable | Where used |
|----------|-----------|
| `VITE_USE_CLOUD` | Frontend — enable cloud mode |
| `VITE_ADMIN_KEY` | Frontend — local admin promotion |
| `DATABASE_URL` / `POSTGRES_URL` | API — Neon connection string |
| `JWT_SECRET` | API — session token signing |
| `ADMIN_ACCESS_KEY` | API — cloud admin promotion |
| `ALLOWED_ORIGIN` | API — CORS (falls back to `VERCEL_URL`) |
| `UPSTASH_REDIS_REST_URL` | API — rate limiting (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | API — rate limiting (optional) |

See `.env.example` for the full list.

## Extension Points

### Adding a new tracker module
1. Add `ModuleId` variant to `src/types/index.ts` and a `DEFAULT_MODULES` entry.
2. Add display labels to `src/content/presentation.ts`.
3. Create a form component in `src/components/forms/`.
4. Add storage CRUD in `src/utils/storage.ts`.
5. Add cloud CRUD to an existing `api/*.ts` endpoint (budget is full — consolidate if needed).
6. Update `docs/MODULES.md` and `docs/API.md`.

### Adding a new page / route
1. Create `src/pages/MyPage.tsx`.
2. Register as a lazy route in `src/App.tsx`.
3. Add nav item in `src/components/AppNav.tsx` if applicable.

### Adding a new shared component
1. Create in `src/components/` (or the appropriate sub-folder).
2. Export from the nearest `index.ts`.
3. Verify it works in all three themes before shipping.
