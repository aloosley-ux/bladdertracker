import type { VercelRequest, VercelResponse } from '@vercel/node';
import { migrate } from './_lib/db.js';
import { cors, getSessionFromRequest } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  // Require an authenticated admin session to run migrations
  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }
  if (session.role !== 'admin') { res.status(403).json({ error: 'Admin access required' }); return; }

  try {
    const log = await migrate();
    res.status(200).json({ ok: true, log });
  } catch (error) {
    res.status(500).json({ error: 'Migration failed', detail: String(error) });
  }
}
