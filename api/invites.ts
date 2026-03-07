import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method === 'GET') {
    const result = await sql`
      SELECT id, child_id, child_name, email, role, status, invited_by, token, link, accepted_by, created_at
      FROM invites
      WHERE invited_by = ${session.userId} OR email = ${session.email}
      ORDER BY created_at DESC
    `;

    const invites = result.rows.map((r) => ({
      id: r.id, childId: r.child_id, childName: r.child_name, email: r.email,
      role: r.role, status: r.status, invitedBy: r.invited_by, token: r.token,
      link: r.link, acceptedBy: r.accepted_by, createdAt: r.created_at,
    }));

    res.status(200).json({ invites });
    return;
  }

  if (req.method === 'POST') {
    const action = req.body?.action;

    if (action === 'accept') {
      const { token } = req.body;
      if (!token) { res.status(400).json({ error: 'Token is required' }); return; }

      const inviteResult = await sql`
        SELECT id, child_id, child_name, email, role, status FROM invites
        WHERE token = ${token} AND status = 'pending'
      `;
      if (inviteResult.rows.length === 0) { res.status(404).json({ error: 'Invite not found or already used' }); return; }

      const invite = inviteResult.rows[0];
      if (invite.email !== session.email) { res.status(403).json({ error: 'This invite is not for your account' }); return; }

      const accessType = invite.role === 'parent' ? 'parent' : 'caregiver';
      await sql`
        INSERT INTO child_access (id, child_id, user_id, access_type)
        VALUES (${generateId()}, ${invite.child_id}, ${session.userId}, ${accessType})
        ON CONFLICT (child_id, user_id) DO NOTHING
      `;

      await sql`UPDATE invites SET status = 'accepted', accepted_by = ${session.userId} WHERE id = ${invite.id}`;

      const nameResult = await sql`SELECT name FROM accounts WHERE id = ${session.userId}`;
      const userName = nameResult.rows[0]?.name || 'User';

      await sql`
        INSERT INTO notifications (id, user_id, title, message)
        VALUES (${generateId()}, ${invite.invited_by}, 'Invite accepted', ${`${userName} can now access ${invite.child_name}'s diary as a ${invite.role}.`})
      `;
      await sql`
        INSERT INTO notifications (id, user_id, title, message)
        VALUES (${generateId()}, ${session.userId}, 'Diary shared', ${`You can now access ${invite.child_name}'s diary.`})
      `;

      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${session.userId}, 'Accepted invite', ${invite.child_name}, ${`Accepted ${invite.role} access to the diary.`})
      `;

      res.status(200).json({ ok: true, childName: invite.child_name });
      return;
    }

    // Create invite
    const { childId, email, role } = req.body ?? {};
    if (!childId || !email || !role) { res.status(400).json({ error: 'childId, email, and role are required' }); return; }

    const childResult = await sql`SELECT name FROM children WHERE id = ${childId}`;
    if (childResult.rows.length === 0) { res.status(404).json({ error: 'Child not found' }); return; }
    const childName = childResult.rows[0].name;

    const normalEmail = email.trim().toLowerCase();
    const token = generateId();
    const id = generateId();
    const link = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/?invite=${token}`;

    await sql`
      INSERT INTO invites (id, child_id, child_name, email, role, invited_by, token, link)
      VALUES (${id}, ${childId}, ${childName}, ${normalEmail}, ${role}, ${session.userId}, ${token}, ${link})
    `;

    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Created secure invite', ${childName}, ${`Shared a ${role} invite with ${normalEmail}.`})
    `;

    const invite = { id, childId, childName, email: normalEmail, role, status: 'pending', invitedBy: session.userId, token, link, createdAt: new Date().toISOString() };
    res.status(201).json({ invite });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
