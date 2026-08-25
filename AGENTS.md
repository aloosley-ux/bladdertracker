# AGENTS.md — BladderTracker

## Project Overview

BladderTracker is a child development, continence, SEND, and daily routine tracker for families, caregivers, and care teams. It runs as a mobile-first PWA with offline-first localStorage and optional cloud mode via Vercel + Neon Postgres.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 19 / 5.9 |
| Styling | Tailwind CSS (utility-only) | 4 |
| Build | Vite | 7 |
| Routing | React Router | v7 |
| Charts | Recharts | 3.8 |
| Icons | lucide-react | latest |
| PWA | vite-plugin-pwa | latest |
| API | Vercel Serverless Functions | Node.js 22 |
| Database | Neon Postgres | serverless |
| Package manager | npm | — |
| Test runner | Vitest + @testing-library/react + vitest-axe | — |
| Linter | ESLint 9 flat config (typescript-eslint) | 9 |

## Commands

- Install:       `npm install`
- Dev server:    `npm run dev`
- Build:         `npm run build`
- Test:          `npm test`
- Test (watch):  `npm run test:watch`
- Lint:          `npm run lint`
- Type-check API:`npx tsc --project tsconfig.api.json --noEmit`
- Preview build: `npm run preview`

Validation order: `npm run lint` → `npm run build` → `npx tsc --project tsconfig.api.json --noEmit` → `npm test`

> `npm test` includes a live integration test reaching a deployed Vercel hostname. If it fails due to network access, the rest of the suite must still pass.

## Code Style

- ALWAYS use named exports. Default exports are only allowed for React Router lazy-loaded page components.
- DO NOT use `any` — use `unknown` and narrow, or a specific type.
- ALWAYS use async/await. DO NOT use `.then()` chains.
- DO NOT use inline styles. ALWAYS use Tailwind CSS utility classes.
- DO NOT use CSS modules. All theming lives in CSS custom properties in `src/index.css`.
- DO NOT add UI copy inline in components — centralise it in `src/content/presentation.ts`.
- File names: `PascalCase.tsx` for components, `camelCase.ts` for utilities and hooks.
- Component names: PascalCase. Hook names: `use` + PascalCase prefix.
- ALWAYS add ARIA labels and keyboard support to interactive elements.
- TypeScript strict mode is enabled. DO NOT disable strict checks.

## Architecture

```
src/
├── components/     Shared UI components; sub-folders: forms/, leaps/, settings/
├── content/        Centralised UI labels and copy (presentation.ts)
├── context/        AppContext (single source of truth) + ThemeContext
├── data/           Static data: leap definitions, milestone guidance
├── hooks/          Custom React hooks
├── pages/          Lazy-loaded route page components
├── test/           Test helpers, fixtures, and test files
├── types/          All TypeScript types + DEFAULT_MODULES registry (index.ts)
└── utils/          storage.ts (local), api.ts (cloud), auth.ts, importers.ts

api/
├── _lib/           Shared helpers (auth.ts JWT/CORS, db.ts Neon connection) — NOT counted as functions
└── *.ts            12 serverless function endpoints (Vercel Hobby tier limit)
```

Key boundaries:
- All pages access data exclusively via `useApp()` from `AppContext`.
- `AppContext` delegates to `src/utils/api.ts` (cloud) or `src/utils/storage.ts` (local). Do not call either directly from pages.
- `api/_lib/` files are shared modules — not endpoints. The two existing files (`auth.ts` for JWT/CORS, `db.ts` for Neon connection and migrations) cover all shared concerns. Do not add new files here unless they are equally cross-cutting.
- The Vercel Hobby plan allows exactly **12** serverless functions. All 12 slots are used. DO NOT add a new `api/*.ts` endpoint without consolidating or removing an existing one.
- Leap symptom logs are local-only (no cloud API route exists for them).
- 13 tracker modules are defined in `src/types/index.ts` as `DEFAULT_MODULES`. Module labels/display strings are in `src/content/presentation.ts`.

## Testing

- Test files live alongside source files (`ComponentName.test.tsx`) or in `src/test/`.
- Naming: `<unit>.test.ts` or `<Component>.test.tsx`.
- Run tests: `npm test`
- Render helpers: `src/test/renderWithProviders.tsx` and `src/test/renderApp.tsx`
- Fixture data: `src/test/fixtures.ts`
- Use `vitest-axe` for accessibility assertions on interactive components.
- Add or update tests whenever component behaviour, utilities, or storage logic changes.

## Things to Avoid

- DO NOT call `src/utils/api.ts` or `src/utils/storage.ts` directly from page components — always go through `useApp()`.
- DO NOT add a 13th `api/*.ts` serverless function — consolidate into an existing endpoint instead.
- DO NOT modify `src/context/AppContext.tsx` without running the full test suite — it is consumed by every page.
- DO NOT modify `src/components/AppNav.tsx` without checking module-based nav filtering — changes affect all navigation.
- DO NOT modify `src/components/forms/FormStep.tsx` without checking all 11 entry form tabs in `AddEntryPage`.
- DO NOT modify `src/components/EntryCard.tsx` without verifying `data-entry-type` theme overrides in `src/index.css`.
- DO NOT add new routes without registering them as lazy routes in `src/App.tsx`.
- DO NOT put UI label strings directly in component JSX — use `src/content/presentation.ts`.
- DO NOT commit real child data, credentials, or environment secrets.
- DO NOT add new npm dependencies without clear justification — bundle size matters for a mobile PWA.

## Definition of Done

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npx tsc --project tsconfig.api.json --noEmit` passes
- [ ] `npm test` passes (excluding the live integration test if network is unavailable)
- [ ] `npm run test:e2e` passes (if E2E tests are configured)
- [ ] New/changed behaviour is covered by a test
- [ ] No new `any`, hardcoded secrets, or debug `console.log` without justification
- [ ] UI changes verified in all three themes: light, dark, high-contrast
- [ ] Docs updated: `README.md`, `docs/MODULES.md`, `docs/API.md`, and/or `docs/architecture.md` as applicable
- [ ] PR contains one concern only

## Approach by task type

### Bug fixes
1. Reproduce in `npm run dev`.
2. Write or update a test that covers the bug.
3. Fix with minimal changes.
4. Verify in all three themes if UI-related.
5. Run full validation.

### Features
1. Check whether the module/page/component already exists.
2. Follow patterns in `CONTRIBUTING.md`.
3. Types → `src/types/index.ts`; storage → `src/utils/storage.ts`; API → `src/utils/api.ts`.
4. New pages → `src/pages/`; register as lazy routes in `src/App.tsx`.
5. Update `README.md`, `docs/MODULES.md`, `docs/API.md`, `docs/architecture.md` as needed.

### UI work
1. Tailwind CSS only — no inline styles.
2. Reuse existing shared components before creating new ones.
3. All interactive elements need ARIA labels and keyboard support.
4. Use `vitest-axe` for accessibility assertions.
5. UI copy → `src/content/presentation.ts`.

## Pull request expectations

- One concern per PR.
- All validation must pass (see Definition of Done above).
- Fill in the PR template with summary, linked issue, validation results, and risks.
- Never commit real child data, credentials, or sensitive information.
