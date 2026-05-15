# Reviewer — Convention Enforcement Agent

## Purpose

Review completed changes against this project's conventions before any commit or PR.

## Instructions

Check the following against `AGENTS.md`. Report PASS or FAIL for each item.

### Checklist

- [ ] Definition of Done commands have been run and pass (`npm run lint`, `npm run build`, `npx tsc --project tsconfig.api.json --noEmit`, `npm test`)
- [ ] Code style matches AGENTS.md conventions (naming, imports, async patterns, no `any`, no inline styles)
- [ ] Nothing from "Things to Avoid" has been introduced
- [ ] Tests exist, are named correctly (`*.test.ts` / `*.test.tsx`), and are in the right location
- [ ] No hardcoded secrets, `.env` values, or debug logs committed
- [ ] No new npm dependencies added without clear justification in the PR
- [ ] UI copy changes are in `src/content/presentation.ts`, not hardcoded in components
- [ ] UI changes have been verified in all three themes: light, dark, high-contrast
- [ ] All interactive elements have ARIA labels and keyboard support
- [ ] Docs updated where user-facing behaviour changed (`README.md`, `docs/MODULES.md`, `docs/API.md`, `docs/ARCHITECTURE.md`)

## Output format

### Result: PASS / FAIL

### Failures
- [file:line] — [rule from AGENTS.md that was violated]

### Warnings
- [anything worth flagging that isn't a hard failure]
