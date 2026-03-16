# Testing Guide

## Framework

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (jsdom environment, global APIs) |
| @testing-library/react | Component rendering and user interaction |
| @testing-library/user-event | Realistic user event simulation |
| @testing-library/jest-dom | Custom DOM matchers |
| vitest-axe | Automated accessibility assertions |

## Commands

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
```

## Configuration

- Vitest config is in `vite.config.ts` under the `test` key.
- Test setup file: `src/test/setup.ts` — mocks browser APIs and cleans up between tests.
- Environment: `jsdom` with CSS support enabled.

## Test file map

| File | Coverage |
|------|----------|
| `src/App.test.tsx` | App shell smoke test |
| `src/components/ErrorBoundary.test.tsx` | Error boundary rendering |
| `src/pages/DashboardPage.test.tsx` | Dashboard render + accessibility |
| `src/pages/LeapsPage.test.tsx` | Leap data and resource links |
| `src/test/routes.test.tsx` | Route smoke tests + per-route accessibility |
| `src/test/storage.test.ts` | localStorage CRUD for all data types |
| `src/test/invites.test.ts` | Invite role mapping and access control |
| `src/test/reminderScope.test.ts` | Reminder scope (module-wide) |
| `src/test/accessibility.test.tsx` | Accessibility checks |
| `src/test/settings.childProfiles.test.tsx` | Settings child profile management |
| `src/test/theme.test.tsx` | Theme switching |

## Render helpers

| Helper | Use case |
|--------|----------|
| `src/test/renderWithProviders.tsx` | Render with AppContext + ThemeContext |
| `src/test/renderApp.tsx` | Render with full routing |
| `src/test/fixtures.ts` | Shared test data |

## Conventions

- Test files sit alongside source files or in `src/test/`.
- Name pattern: `*.test.ts` or `*.test.tsx`.
- Use `describe` / `it` blocks for structure.
- Test user-visible behaviour, not implementation details.
- Add accessibility assertions with vitest-axe where feasible.
- localStorage is cleared automatically between tests.

## Integration test note

`src/test/integration/api-auth.integration.test.ts` reaches a fixed deployed Vercel hostname. In isolated environments without network access to that host, this test may fail even when the rest of the suite is green. If this is the only failure, note it in the PR.

## Adding tests

When modifying:
- **Components**: add a render + accessibility test.
- **Utilities / storage**: add unit tests covering the changed logic.
- **Pages**: verify route renders and passes accessibility checks.
- **Forms**: test form validation and submission behaviour.
