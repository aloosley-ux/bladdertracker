# Replace console.* logging with structured logger

> NOTE: This draft was moved to `docs/github-issues/issue-01-replace-console-logging.md`. Use the file in `docs/github-issues/` for publishing to GitHub.

Labels: bug, tech-debt
Severity: medium

Files referenced:
- api/auth.ts
- src/components/ErrorBoundary.tsx
- src/context/AppContext.tsx

## Description
Several places use console.error/console.log for error reporting. In production this should use a structured logger (e.g., pino, bunyan, or an internal wrapper) and avoid leaking sensitive data (child identifiers, PII) to stdout/stderr.

## Proposed fix
- Add a small logging wrapper that respects NODE_ENV and supports redaction (src/utils/logger.ts or api/_lib/logger.js).
- Replace console.* usages in client and server code with the logger.
- Ensure serverless functions do not emit PII in production.

## Acceptance criteria
- No console.error/log calls remain in production code paths.
- Logger can be disabled or adjusted via env variables.
