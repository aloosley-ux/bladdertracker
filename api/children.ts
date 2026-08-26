import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';
import { validateLengths, MAX_LENGTHS } from './_lib/validation.js';

// date_of_birth is a DATE column; the API contract keeps it as 'YYYY-MM-DD'
// (or '' when not recorded) so local mode and CSV round-trips are unchanged.
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toIsoDateOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!ISO_DATE_RE.test(trimmed)) return null;
  // Reject impossible calendar dates (e.g. 2025-02-30) before hitting Postgres.
  const parsed = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) return null;
  return trimmed;
}

// DATE columns come back as JS Date objects from pg drivers; normalise to
// YYYY-MM-DD in UTC so no timezone shift can move the date by one day.
function toDateColumnString(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method === 'GET') {
    const result = await sql`
      SELECT c.id, c.name, c.date_of_birth, c.due_date, c.avatar, c.created_by, c.last_updated_at,
        COALESCE(
          (SELECT json_agg(ca.user_id) FILTER (WHERE ca.access_type = 'parent') FROM child_access ca WHERE ca.child_id = c.id),
          '[]'
        ) AS parent_ids,
        COALESCE(
          (SELECT json_agg(ca.user_id) FILTER (WHERE ca.access_type = 'caregiver') FROM child_access ca WHERE ca.child_id = c.id),
          '[]'
        ) AS caregivers
      FROM children c
      WHERE c.created_by = ${session.userId}
        OR c.id IN (SELECT child_id FROM child_access WHERE user_id = ${session.userId})
      ORDER BY c.name
    `;

    const children = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      dateOfBirth: toDateColumnString(row.date_of_birth),
      dueDate: row.due_date || '',
      avatar: row.avatar,
      parentIds: row.parent_ids || [],
      caregivers: row.caregivers || [],
      createdBy: row.created_by,
      lastUpdatedAt: row.last_updated_at,
    }));

    res.status(200).json({ children });
    return;
  }

    if (req.method === 'POST') {
    const { name, dateOfBirth, dueDate, avatar } = req.body ?? {};
    if (!name) { res.status(400).json({ error: 'Name is required' }); return; }
    if (!validateLengths(res, [['name', name, MAX_LENGTHS.name]])) return;

    const id = generateId();
    const accessType = session.role === 'parent' ? 'parent' : 'caregiver';
    const dob = toIsoDateOrNull(dateOfBirth);

    await sql`
      INSERT INTO children (id, name, date_of_birth, due_date, avatar, created_by)
      VALUES (${id}, ${name.trim()}, ${dob}, ${dueDate || ''}, ${avatar || null}, ${session.userId})
    `;
    await sql`
      INSERT INTO child_access (id, child_id, user_id, access_type)
      VALUES (${generateId()}, ${id}, ${session.userId}, ${accessType})
    `;

    const child = {
      id,
      name: name.trim(),
      dateOfBirth: dob || '',
      dueDate: dueDate || '',
      avatar: avatar || undefined,
      parentIds: accessType === 'parent' ? [session.userId] : [],
      caregivers: accessType === 'caregiver' ? [session.userId] : [],
      createdBy: session.userId,
      lastUpdatedAt: new Date().toISOString(),
    };

    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Created child profile', ${name.trim()}, 'Added a new child profile for diary tracking.')
    `;

    res.status(201).json({ child });
    return;
  }

  if (req.method === 'PUT') {
    const { id, name, dateOfBirth, dueDate, avatar } = req.body ?? {};
    if (!id) { res.status(400).json({ error: 'Child id is required' }); return; }
    if (!validateLengths(res, [['name', name, MAX_LENGTHS.name]])) return;

    // Only the child's creator may update the profile
    const access = await sql`SELECT id FROM children WHERE id = ${id} AND created_by = ${session.userId}`;
    if (!access.rows.length) { res.status(403).json({ error: 'Not found or access denied' }); return; }

    await sql`
      UPDATE children SET
        name = COALESCE(${name || null}, name),
        date_of_birth = COALESCE(${toIsoDateOrNull(dateOfBirth)}, date_of_birth),
        due_date = COALESCE(${dueDate || null}, due_date),
        avatar = COALESCE(${avatar || null}, avatar),
        last_updated_at = NOW()
      WHERE id = ${id}
    `;

    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const childId = req.query.id as string;
    if (!childId) { res.status(400).json({ error: 'Child id is required' }); return; }

    const childResult = await sql`SELECT name FROM children WHERE id = ${childId} AND created_by = ${session.userId}`;
    if (!childResult.rows.length) { res.status(403).json({ error: 'Not found or access denied' }); return; }
    const childName = childResult.rows[0].name;

    await sql`DELETE FROM drink_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM urine_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM bowel_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM sleep_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM toilet_attempt_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM food_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM mood_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM sensory_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM medication_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM therapy_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM routine_entries WHERE child_id = ${childId}`;
    await sql`DELETE FROM milestones WHERE child_id = ${childId}`;
    await sql`DELETE FROM enabled_modules WHERE child_id = ${childId}`;
    await sql`DELETE FROM reminder_preferences WHERE child_id = ${childId}`;
    await sql`DELETE FROM child_access WHERE child_id = ${childId}`;
    await sql`DELETE FROM children WHERE id = ${childId}`;

    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Removed child profile', ${childName}, 'Permanently removed child profile and all associated diary entries.')
    `;

    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
