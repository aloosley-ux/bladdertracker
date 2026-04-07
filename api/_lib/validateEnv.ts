/**
 * Server-side environment variable validation.
 *
 * Import and call `validateEnv()` at the top of any API handler that requires
 * database or auth access. The function throws with a descriptive message if a
 * required variable is missing, ensuring failures happen at boot rather than
 * mid-request.
 *
 * Usage:
 *   import { validateEnv } from './_lib/validateEnv.js';
 *   // At the top of your handler:
 *   validateEnv();
 */

/** Required server-side environment variables. */
const REQUIRED_VARS = [
  'JWT_SECRET',
] as const;

/**
 * Variables where at least one must be present (e.g. database URL can be
 * either DATABASE_URL or POSTGRES_URL).
 */
const REQUIRED_ONE_OF: ReadonlyArray<readonly string[]> = [
  ['DATABASE_URL', 'POSTGRES_URL'],
];

/**
 * Validates that all required environment variables are set.
 * Throws an Error with a clear message listing any missing variables.
 *
 * Call this at the start of critical API handlers to fail fast.
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const name of REQUIRED_VARS) {
    if (!process.env[name]) {
      missing.push(name);
    }
  }

  for (const group of REQUIRED_ONE_OF) {
    const found = group.some((name) => !!process.env[name]);
    if (!found) {
      missing.push(group.join(' or '));
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Check .env.example for the full list of required variables.'
    );
  }
}
