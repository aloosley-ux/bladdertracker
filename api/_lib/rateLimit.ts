import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 * Limit: 10 requests per 15-minute window, keyed by IP address.
 *
 * If UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured
 * (e.g. local dev), the limiter is disabled and all requests pass through.
 */

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(10, '15 m'),
    analytics: false,
    prefix: 'bt:auth',
  });
}

/**
 * Apply rate limiting based on the caller's IP.
 * Returns `true` if the request is allowed, `false` if it was rejected (429 already sent).
 */
export async function applyRateLimit(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  if (!ratelimit) return true; // Not configured — allow (local dev)

  const ip =
    (Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for']?.split(',')[0]?.trim()) ??
    req.socket?.remoteAddress ??
    'unknown';

  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    res.setHeader('Retry-After', String(retryAfterSeconds));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}
