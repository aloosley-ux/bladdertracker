import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { sql } from './_lib/db.js';
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromRequest,
  generateId,
  cors,
} from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // GET → session check
  if (req.method === 'GET') {
    return handleSession(req, res);
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const action = (req.body?.action || req.query.action) as string | undefined;

  switch (action) {
    case 'register': return handleRegister(req, res);
    case 'login':    return handleLogin(req, res);
    case 'logout':   return handleLogout(req, res);
    case 'reset':    return handleReset(req, res);
    default:
      res.status(400).json({ error: 'Unknown action. Use action: register|login|logout|reset' });
  }
}

async function handleSession(req: VercelRequest, res: VercelResponse) {
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

async function handleLogin(req: VercelRequest, res: VercelResponse) {
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

async function handleLogout(_req: VercelRequest, res: VercelResponse) {
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
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

async function handleReset(req: VercelRequest, res: VercelResponse) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: 'Email and new password are required.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters.' });
    return;
  }

  const normalEmail = email.trim().toLowerCase();

  const result = await sql`SELECT id, name, role, avatar, created_at FROM accounts WHERE email = ${normalEmail}`;
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'No account exists with that email.' });
    return;
  }

  const account = result.rows[0];
  const passwordHash = await bcrypt.hash(password, 12);

  await sql`UPDATE accounts SET password_hash = ${passwordHash} WHERE id = ${account.id}`;

  const token = await createSessionToken({ userId: account.id, email: normalEmail, role: account.role });
  setSessionCookie(res, token);

  res.status(200).json({
    user: {
      id: account.id,
      name: account.name,
      email: normalEmail,
      role: account.role,
      avatar: account.avatar,
      createdAt: account.created_at,
    },
  });
}
