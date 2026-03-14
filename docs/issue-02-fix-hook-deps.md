# Fix react-hooks/exhaustive-deps disables in AppContext and AddEntryPage

> NOTE: This draft was moved to `docs/github-issues/issue-02-fix-hook-deps.md`. Use the file in `docs/github-issues/` for publishing to GitHub.

Labels: bug, linter
Severity: medium

Files:
- src/context/AppContext.tsx
- src/pages/AddEntryPage.tsx

## Description
There are instances where the `react-hooks/exhaustive-deps` ESLint rule was disabled. This can hide stale-closure bugs or missing dependencies in effects. The code should be refactored so all effect dependencies are explicit or documented with a focused test.

## Proposed fix
- Re-enable the lint rule and update dependency arrays or refactor to avoid stale closures.
- If a dependency is intentionally omitted, add a clear comment explaining why and add a unit test covering the behavior.

## Acceptance criteria
- No `eslint-disable-next-line react-hooks/exhaustive-deps` remaining without justification.
- Tests covering the behavior that relied on omitted deps.
