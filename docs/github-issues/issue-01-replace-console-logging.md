# Replace console.* logging with structured logger

Labels: bug, tech-debt
Severity: medium

Files referenced:
- api/auth.ts
- src/components/ErrorBoundary.tsx
- src/context/AppContext.tsx

## Description
Several places use console.error/console.log for error reporting. In production this should use a structured logger (e.g., pino, bunyan, or a wrapper that can be disabled/redirected) and avoid leaking sensitive data (child identifiers, PII) to stdout/stderr. Centralize logging to allow configurable log levels per environment.

## Proposed fix
- Add a small logging wrapper that respects NODE_ENV and redacts sensitive fields.
- Replace console.* usages in client and server code with the logger.
- Ensure serverless functions do not emit PII in production.

## Acceptance criteria
- No console.error/log calls remain in production code paths.
- Logger can be disabled or adjusted via env variables.
