import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db.js';
import { getSessionFromRequest, cors } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(200).json({ user: null });
    return;
  }

  const result = await sql`
    SELECT id, name, email, role, avatar, created_at
    FROM accounts WHERE id = ${session.userId}
  `;

  if (result.rows.length === 0) {
    res.status(200).json({ user: null });
    return;
  }

  const account = result.rows[0];
  res.status(200).json({
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      createdAt: account.created_at,
    },
  });
}
