# Add accessibility (axe) checks to CI

> NOTE: This draft was moved to `docs/github-issues/issue-04-a11y-ci.md`. Use the file in `docs/github-issues/` for publishing to GitHub.

Labels: accessibility, ci
Severity: medium

## Description
The project includes vitest-axe tests, but CI does not explicitly run axe checks as a separate gate. Add an accessibility job to CI to run axe on key pages/components and fail CI for serious violations.

## Proposed fix
- Add a CI job or step that runs `npx vitest --run --filter accessibility` (or specific test files) and fails on violations.
- Optionally add an a11y report artifact for review.

## Acceptance criteria
- CI runs accessibility tests and fails the workflow on serious axe violations.
