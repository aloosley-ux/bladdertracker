# Copilot Instructions — EveryStep

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.9 |
| Styling | Tailwind CSS 4 (utility classes only, no CSS modules or inline styles) |
| Build | Vite 7 |
| Routing | React Router v7 (lazy-loaded pages) |
| Charts | Recharts 3.8 |
| Icons | lucide-react |
| PWA | vite-plugin-pwa |
| Testing | Vitest + @testing-library/react + vitest-axe |
| Linting | ESLint 9 flat config (TypeScript + React Hooks + React Refresh) |
| API | Vercel Serverless Functions (Node.js) |
| Database | Neon Postgres (serverless) |
| Package manager | npm |

## Scripts

```bash
npm run dev          # Start Vite dev server (localStorage mode)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
npm run preview      # Preview production build locally
```

API type-check (not in package.json scripts):

```bash
npx tsc --project tsconfig.api.json --noEmit
```

## Validation order

Run these in order before opening a PR:

1. `npm run lint`
2. `npm run build`
3. `npx tsc --project tsconfig.api.json --noEmit`
4. `npm test`

> The live integration test in `src/test/integration/api-auth.integration.test.ts` reaches a deployed Vercel hostname. If it fails due to network access, note it in the PR — the rest of the suite must still pass.

## Coding rules

- **TypeScript strict mode** is enabled. Do not use `any`.
- **Tailwind CSS only** for styling. No inline styles or CSS modules.
- Follow existing naming and file organisation conventions.
- Keep changes **minimal and scoped**. One concern per PR.
- Use existing shared components (`EntryCard`, `EmptyState`, `HelpPanel`, `FormStep`, `CalendarStrip`, etc.) before creating new ones.
- All interactive elements must have **ARIA labels** and be keyboard-accessible.
- Respect the **three-theme system** (light, dark, high-contrast). New components must work in all themes via CSS custom properties in `src/index.css`.
- Use `useApp()` for data access. All state flows through `AppContext`.
- Use `useTheme()` for theme access.
- Route components live in `src/pages/` and are lazy-loaded in `src/App.tsx`.
- Shared components live in `src/components/`. Sub-component folders exist for `forms/`, `leaps/`, and `settings/`.
- UI copy and calmer labels are centralised in `src/content/presentation.ts`.
- Types and the module registry live in `src/types/index.ts`.

## Testing expectations

- Add or update tests when changing component behaviour, utilities, or storage logic.
- Test files sit alongside source files or in `src/test/`.
- Use `@testing-library/react` for component tests and `vitest-axe` for accessibility checks.
- Render helpers: `src/test/renderWithProviders.tsx` and `src/test/renderApp.tsx`.

## Documentation expectations

- Update `README.md` when product behaviour, routes, or environment variables change.
- Update `docs/MODULES.md` when tracker labels, fields, or defaults change.
- Update `docs/API.md` when API contracts or auth behaviour changes.
- Update `docs/architecture.md` when infrastructure, routing, or major structure changes.

## Dependencies

- Do not add new dependencies without clear justification — bundle size matters for a mobile-first PWA.
- Prefer built-in browser APIs and existing libraries already in the project.

## Environment variables

Frontend variables are prefixed with `VITE_` (see `.env.example`). API variables (`DATABASE_URL`, `JWT_SECRET`, etc.) are only available in Vercel Serverless Functions. Never commit secrets.
