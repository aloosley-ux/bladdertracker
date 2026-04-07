import type { VercelResponse } from '@vercel/node';

/** Maximum lengths for user-supplied text fields. */
export const MAX_LENGTHS = {
  name: 100,
  email: 254,
  password: 128,
  notes: 1000,
  description: 500,
  triggers: 500,
  goals: 500,
  provider: 200,
  dosage: 100,
  shortText: 50,
} as const;

/**
 * Validate that string fields do not exceed their allowed lengths.
 * Pass an array of `[fieldName, value, maxLength]` tuples.
 *
 * Returns `true` if all fields pass. Returns `false` and sends a 400 response
 * if any field exceeds its limit.
 */
export function validateLengths(
  res: VercelResponse,
  fields: ReadonlyArray<readonly [field: string, value: unknown, max: number]>,
): boolean {
  for (const [field, value, max] of fields) {
    if (typeof value === 'string' && value.length > max) {
      res.status(400).json({ error: `${field} must be ${max} characters or fewer.` });
      return false;
    }
  }
  return true;
}
