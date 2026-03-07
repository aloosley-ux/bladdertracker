import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSessionCookie, cors } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
