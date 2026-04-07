import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { getSessionFromRequest, cors, generateId } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method === 'GET') {
    const result = await sql`
      SELECT id, user_id, title, message, read, created_at
      FROM notifications WHERE user_id = ${session.userId}
      ORDER BY created_at DESC LIMIT 50
    `;

    const notifications = result.rows.map((r) => ({
      id: r.id, userId: r.user_id, title: r.title, message: r.message,
      read: r.read, createdAt: r.created_at,
    }));

    res.status(200).json({ notifications });
    return;
  }

  if (req.method === 'POST') {
    const { action, token, platform } = req.body ?? {};

    if (action === 'register-device') {
      if (!token || typeof token !== 'string') {
        res.status(400).json({ error: 'Device token is required' });
        return;
      }
      const plat = platform === 'ios' || platform === 'android' ? platform : 'unknown';

      // Upsert: update created_at if same user+token already exists
      await sql`
        INSERT INTO device_tokens (id, user_id, token, platform, created_at)
        VALUES (${generateId()}, ${session.userId}, ${token}, ${plat}, NOW())
        ON CONFLICT (user_id, token) DO UPDATE SET platform = ${plat}, created_at = NOW()
      `;

      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'Unknown action' });
    return;
  }

  if (req.method === 'PUT') {
    const { id } = req.body ?? {};
    if (!id) { res.status(400).json({ error: 'Notification id is required' }); return; }

    await sql`UPDATE notifications SET read = TRUE WHERE id = ${id} AND user_id = ${session.userId}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
