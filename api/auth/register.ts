import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { sql } from '../_lib/db.js';
import { createSessionToken, setSessionCookie, generateId, cors } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { name, email, password, role } = req.body ?? {};

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters.' });
    return;
  }

  const normalEmail = email.trim().toLowerCase();

  const existing = await sql`SELECT id FROM accounts WHERE email = ${normalEmail}`;
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = generateId();
  const userRole = role || 'parent';

  await sql`
    INSERT INTO accounts (id, name, email, password_hash, role)
    VALUES (${id}, ${name.trim()}, ${normalEmail}, ${passwordHash}, ${userRole})
  `;

  const token = await createSessionToken({ userId: id, email: normalEmail, role: userRole });
  setSessionCookie(res, token);

  res.status(201).json({
    user: { id, name: name.trim(), email: normalEmail, role: userRole, createdAt: new Date().toISOString() },
  });
}
