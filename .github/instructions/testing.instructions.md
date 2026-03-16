---
applyTo: "src/test/**,**/*.test.{ts,tsx}"
---

# Testing Instructions

## Framework

- **Vitest** with jsdom environment and global test APIs.
- **@testing-library/react** for component rendering and interaction.
- **vitest-axe** for accessibility assertions.
- Test setup in `src/test/setup.ts` — mocks `ResizeObserver`, `matchMedia`, `scrollTo`, and cleans up after each test.

## Render helpers

- `src/test/renderWithProviders.tsx` — renders with AppContext and ThemeContext.
- `src/test/renderApp.tsx` — renders the full app with routing.
- `src/test/fixtures.ts` — shared test data.

## Running tests

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
```

## Test conventions

- Test files live alongside source files or in `src/test/`.
- Name test files `*.test.ts` or `*.test.tsx`.
- Use `describe` / `it` blocks.
- Prefer testing user-visible behaviour over implementation details.
- Add `vitest-axe` checks (`expect(container).toHaveNoViolations()`) for page and component tests.
- Clean up is handled automatically by the setup file — do not add manual cleanup.

## Known test notes

- `src/test/integration/api-auth.integration.test.ts` contacts a live deployed Vercel hostname. It may fail in isolated environments without network access to that host.
- Mock localStorage is cleared automatically between tests via the setup file.
