import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { getSessionFromRequest, cors } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const subject = req.query.subject as string | undefined;
  let result;
  if (subject) {
    result = await sql`
      SELECT id, user_id, action, subject, detail, created_at
      FROM audit_events WHERE subject = ${subject}
      ORDER BY created_at DESC LIMIT 100
    `;
  } else {
    // Default: return recent events by this user
    result = await sql`
      SELECT id, user_id, action, subject, detail, created_at
      FROM audit_events WHERE user_id = ${session.userId}
      ORDER BY created_at DESC LIMIT 50
    `;
  }

  const events = result.rows.map((r) => ({
    id: r.id, userId: r.user_id, action: r.action, subject: r.subject,
    detail: r.detail, createdAt: r.created_at,
  }));

  res.status(200).json({ events });
}
