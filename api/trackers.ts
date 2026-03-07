import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, getAccessibleChildIds } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';

type TrackerType = 'sleep' | 'toilet_attempt' | 'food';

const VALID_TYPES = new Set<TrackerType>(['sleep', 'toilet_attempt', 'food']);

function tableFor(type: TrackerType): string {
  if (type === 'sleep') return 'sleep_entries';
  if (type === 'toilet_attempt') return 'toilet_attempt_entries';
  return 'food_entries';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  if (req.method === 'GET') return handleGet(req, res, session.userId);
  if (req.method === 'POST') return handlePost(req, res, session.userId);
  if (req.method === 'PUT') return handlePut(req, res, session.userId);
  if (req.method === 'DELETE') return handleDelete(req, res, session.userId);

  res.status(405).json({ error: 'Method not allowed' });
}

async function handleGet(req: VercelRequest, res: VercelResponse, userId: string) {
  const type = req.query.type as string;
  if (!type || !VALID_TYPES.has(type as TrackerType)) {
    res.status(400).json({ error: 'Valid type required: sleep, toilet_attempt, or food' });
    return;
  }
  const trackerType = type as TrackerType;

  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.length) { res.status(200).json({ entries: [] }); return; }

  let result;
  if (trackerType === 'sleep') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, event_type AS "eventType",
             duration_minutes AS "durationMinutes", quality, nighttime_event AS "nighttimeEvent",
             notes, created_by AS "createdBy", created_at AS "createdAt"
      FROM sleep_entries
      WHERE child_id = ANY(${childIds})
      ORDER BY date DESC, time DESC
    `;
  } else if (trackerType === 'toilet_attempt') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, outcome, supervised, prompted,
             duration_minutes AS "durationMinutes", notes, created_by AS "createdBy", created_at AS "createdAt"
      FROM toilet_attempt_entries
      WHERE child_id = ANY(${childIds})
      ORDER BY date DESC, time DESC
    `;
  } else {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, meal_type AS "mealType",
             description, portions, notes, created_by AS "createdBy", created_at AS "createdAt"
      FROM food_entries
      WHERE child_id = ANY(${childIds})
      ORDER BY date DESC, time DESC
    `;
  }

  res.status(200).json({ entries: result.rows });
}

async function handlePost(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const { trackerType, childId, date, time, notes = '' } = body;

  if (!trackerType || !VALID_TYPES.has(trackerType as TrackerType)) {
    res.status(400).json({ error: 'Valid trackerType required: sleep, toilet_attempt, or food' });
    return;
  }
  if (!childId || !date || !time) {
    res.status(400).json({ error: 'childId, date, and time are required' });
    return;
  }

  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

  const id = generateId();
  const type = trackerType as TrackerType;
  const table = tableFor(type);

  if (type === 'sleep') {
    const { eventType = 'onset', durationMinutes = null, quality = null, nighttimeEvent = false } = body;
    await sql`
      INSERT INTO sleep_entries (id, child_id, date, time, event_type, duration_minutes, quality, nighttime_event, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${eventType}, ${durationMinutes}, ${quality}, ${nighttimeEvent}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added sleep entry', ${childId}, ${`Sleep ${eventType} at ${time} on ${date}`})
    `;
  } else if (type === 'toilet_attempt') {
    const { outcome = 'no_event', supervised = false, prompted = false, durationMinutes = null } = body;
    await sql`
      INSERT INTO toilet_attempt_entries (id, child_id, date, time, outcome, supervised, prompted, duration_minutes, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${outcome}, ${supervised}, ${prompted}, ${durationMinutes}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added toilet attempt', ${childId}, ${`Toilet attempt (${outcome}) at ${time} on ${date}`})
    `;
  } else {
    const { mealType = 'snack', description = '', portions = null } = body;
    await sql`
      INSERT INTO food_entries (id, child_id, date, time, meal_type, description, portions, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${mealType}, ${description}, ${portions}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added food entry', ${childId}, ${`${mealType}: ${description} at ${time} on ${date}`})
    `;
  }

  res.status(201).json({ id });
}

async function handlePut(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const { trackerType, id, date, time, notes = '' } = body;

  if (!trackerType || !VALID_TYPES.has(trackerType as TrackerType)) {
    res.status(400).json({ error: 'Valid trackerType required: sleep, toilet_attempt, or food' });
    return;
  }
  if (!id) { res.status(400).json({ error: 'id is required' }); return; }
  if (!date || !time) { res.status(400).json({ error: 'date and time are required' }); return; }

  // Verify the entry belongs to a child the user can access
  const childIds = await getAccessibleChildIds(userId);
  const type = trackerType as TrackerType;

  if (type === 'sleep') {
    const existing = await sql`SELECT child_id FROM sleep_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { eventType, durationMinutes = null, quality = null, nighttimeEvent = false } = body;
    await sql`
      UPDATE sleep_entries
      SET date = ${date}, time = ${time}, event_type = ${eventType}, duration_minutes = ${durationMinutes},
          quality = ${quality}, nighttime_event = ${nighttimeEvent}, notes = ${notes}
      WHERE id = ${id}
    `;
  } else if (type === 'toilet_attempt') {
    const existing = await sql`SELECT child_id FROM toilet_attempt_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { outcome, supervised = false, prompted = false, durationMinutes = null } = body;
    await sql`
      UPDATE toilet_attempt_entries
      SET date = ${date}, time = ${time}, outcome = ${outcome}, supervised = ${supervised},
          prompted = ${prompted}, duration_minutes = ${durationMinutes}, notes = ${notes}
      WHERE id = ${id}
    `;
  } else {
    const existing = await sql`SELECT child_id FROM food_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { mealType, description = '', portions = null } = body;
    await sql`
      UPDATE food_entries
      SET date = ${date}, time = ${time}, meal_type = ${mealType}, description = ${description},
          portions = ${portions}, notes = ${notes}
      WHERE id = ${id}
    `;
  }

  res.status(200).json({ ok: true });
}

async function handleDelete(req: VercelRequest, res: VercelResponse, userId: string) {
  const type = req.query.type as string;
  const id = req.query.id as string;

  if (!type || !VALID_TYPES.has(type as TrackerType)) {
    res.status(400).json({ error: 'Valid type required: sleep, toilet_attempt, or food' });
    return;
  }
  if (!id) { res.status(400).json({ error: 'id is required' }); return; }

  const childIds = await getAccessibleChildIds(userId);
  const trackerType = type as TrackerType;

  if (trackerType === 'sleep') {
    const existing = await sql`SELECT child_id FROM sleep_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    await sql`DELETE FROM sleep_entries WHERE id = ${id}`;
  } else if (trackerType === 'toilet_attempt') {
    const existing = await sql`SELECT child_id FROM toilet_attempt_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    await sql`DELETE FROM toilet_attempt_entries WHERE id = ${id}`;
  } else {
    const existing = await sql`SELECT child_id FROM food_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    await sql`DELETE FROM food_entries WHERE id = ${id}`;
  }

  res.status(200).json({ ok: true });
}
