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
import { logger } from './_lib/logger.js';
import { applyRateLimit } from './_lib/rateLimit.js';
import { validateLengths, MAX_LENGTHS } from './_lib/validation.js';
import { validateEnv } from './_lib/validateEnv.js';

const SELF_REGISTRATION_ROLES = new Set(['parent', 'caregiver', 'schoolAdmin']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Fail fast if required env vars are missing (see api/_lib/validateEnv.ts)
  validateEnv();

  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // GET → session check
  if (req.method === 'GET') {
    return handleSession(req, res);
  }

  // DELETE → account deletion
  if (req.method === 'DELETE') {
    return handleDeleteAccount(req, res);
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const action = (req.body?.action || req.query.action) as string | undefined;

  // Rate-limit login, register, and reset to prevent brute-force / credential-stuffing
  if (action === 'login' || action === 'register' || action === 'reset') {
    const allowed = await applyRateLimit(req, res);
    if (!allowed) return;
  }

  switch (action) {
    case 'register': return handleRegister(req, res);
    case 'login':    return handleLogin(req, res);
    case 'logout':   return handleLogout(req, res);
    case 'reset':    return handleReset(req, res);
    case 'promote':  return handlePromote(req, res);
    default:
      res.status(400).json({ error: 'Unknown action. Use action: register|login|logout|reset|promote' });
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
    // Use the same response as a wrong password to prevent email enumeration
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const account = result.rows[0];
  const valid = await bcrypt.compare(password, account.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password.' });
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

  if (!validateLengths(res, [
    ['name', name, MAX_LENGTHS.name],
    ['email', email, MAX_LENGTHS.email],
    ['password', password, MAX_LENGTHS.password],
  ])) return;

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
  const userRole = typeof role === 'string' && role ? role : 'parent';
  if (!SELF_REGISTRATION_ROLES.has(userRole)) {
    res.status(400).json({ error: 'Invalid role for self-registration.' });
    return;
  }

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
  // Password reset requires an active session — the user must be logged in to change
  // their own password. This prevents unauthenticated account takeover via email enumeration.
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'You must be signed in to change your password.' });
    return;
  }

  const { currentPassword, password } = req.body ?? {};

  if (!currentPassword || !password) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (!validateLengths(res, [
    ['password', password, MAX_LENGTHS.password],
  ])) return;

  if (password.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters.' });
    return;
  }

  const result = await sql`SELECT id, name, email, role, avatar, created_at, password_hash FROM accounts WHERE id = ${session.userId}`;
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Account not found.' });
    return;
  }

  const account = result.rows[0];

  // Verify current password before allowing the change
  const validCurrent = await bcrypt.compare(currentPassword, account.password_hash);
  if (!validCurrent) {
    res.status(401).json({ error: 'Current password is incorrect.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sql`UPDATE accounts SET password_hash = ${passwordHash} WHERE id = ${account.id}`;

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

async function handleDeleteAccount(req: VercelRequest, res: VercelResponse) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userId = session.userId;

    await sql`DELETE FROM notifications WHERE user_id = ${userId}`;
    await sql`DELETE FROM audit_events WHERE user_id = ${userId}`;
    await sql`DELETE FROM invites WHERE invited_by = ${userId}`;

    const childResult = await sql`SELECT id FROM children WHERE created_by = ${userId}`;
    const childIds = childResult.rows.map((r) => r.id);

    if (childIds.length > 0) {
      await sql`DELETE FROM drink_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM urine_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM bowel_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM sleep_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM toilet_attempt_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM food_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM mood_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM sensory_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM medication_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM therapy_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM routine_entries WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM milestones WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM enabled_modules WHERE child_id = ANY(${childIds})`;
      await sql`DELETE FROM child_access WHERE child_id = ANY(${childIds})`;
    }

    await sql`DELETE FROM children WHERE created_by = ${userId}`;
    await sql`DELETE FROM accounts WHERE id = ${userId}`;

    clearSessionCookie(res);
    res.status(200).json({ ok: true });
  } catch (err) {
    logger.error('handleDeleteAccount error:', err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
}

async function handlePromote(req: VercelRequest, res: VercelResponse) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const configuredKey = process.env.ADMIN_ACCESS_KEY;
  if (!configuredKey) {
    res.status(503).json({ error: 'Admin promotion is not configured.' });
    return;
  }

  // The key must arrive in the x-admin-key request header — never in a query
  // parameter or the JSON body, both of which leak into access logs and history.
  const headerValue = req.headers['x-admin-key'];
  const providedKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  if (typeof providedKey !== 'string' || providedKey !== configuredKey) {
    res.status(403).json({ error: 'Invalid admin access key.' });
    return;
  }

  await sql`
    UPDATE accounts
    SET role = 'admin'
    WHERE id = ${session.userId}
  `;

  const result = await sql`
    SELECT id, name, email, role, avatar, created_at
    FROM accounts
    WHERE id = ${session.userId}
  `;

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Account not found.' });
    return;
  }

  const account = result.rows[0];
  const token = await createSessionToken({ userId: account.id, email: account.email, role: account.role });
  setSessionCookie(res, token);

  await sql`
    INSERT INTO audit_events (id, user_id, action, subject, detail)
    VALUES (${generateId()}, ${account.id}, 'Promoted to admin', ${account.name}, 'Account promoted to admin via server-validated access key.')
  `;

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
