import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { sql } from '../_lib/db.js';
import { createSessionToken, setSessionCookie, cors } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalEmail = email.trim().toLowerCase();

  const result = await sql`
    SELECT id, name, email, password_hash, role, avatar, created_at
    FROM accounts WHERE email = ${normalEmail}
  `;

  if (result.rows.length === 0) {
    res.status(401).json({ error: 'No account exists with that email.' });
    return;
  }

  const account = result.rows[0];
  const valid = await bcrypt.compare(password, account.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Incorrect password.' });
    return;
  }

  const token = await createSessionToken({ userId: account.id, email: account.email, role: account.role });
  setSessionCookie(res, token);

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
