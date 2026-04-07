import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, getAccessibleChildIds } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';
import { validateLengths, MAX_LENGTHS } from './_lib/validation.js';

type TrackerType = 'sleep' | 'toilet_attempt' | 'food';

const VALID_TYPES = new Set<TrackerType>(['sleep', 'toilet_attempt', 'food']);

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
             bedtime, sleep_onset_minutes AS "sleepOnsetMinutes", night_activity AS "nightActivity",
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
             description, portions, is_trying AS "isTrying", texture, accepted,
             notes, created_by AS "createdBy", created_at AS "createdAt"
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
  if (!validateLengths(res, [['notes', notes, MAX_LENGTHS.notes]])) return;

  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

  const id = generateId();
  const type = trackerType as TrackerType;

  if (type === 'sleep') {
    const { eventType = 'onset', durationMinutes = null, quality = null, nighttimeEvent = false,
            bedtime = null, sleepOnsetMinutes = null, nightActivity = false } = body;
    await sql`
      INSERT INTO sleep_entries (id, child_id, date, time, event_type, duration_minutes, quality, nighttime_event, bedtime, sleep_onset_minutes, night_activity, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${eventType}, ${durationMinutes}, ${quality}, ${nighttimeEvent}, ${bedtime}, ${sleepOnsetMinutes}, ${nightActivity}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added sleep entry', ${id}, ${`Sleep ${eventType} at ${time} on ${date}`})
    `;
  } else if (type === 'toilet_attempt') {
    const { outcome = 'no_event', supervised = false, prompted = false, durationMinutes = null } = body;
    await sql`
      INSERT INTO toilet_attempt_entries (id, child_id, date, time, outcome, supervised, prompted, duration_minutes, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${outcome}, ${supervised}, ${prompted}, ${durationMinutes}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added toilet attempt', ${id}, ${`Toilet attempt (${outcome}) at ${time} on ${date}`})
    `;
  } else {
    const { mealType = 'snack', description = '', portions = null,
            isTrying = false, texture = null, accepted = null } = body;
    if (!validateLengths(res, [['description', description, MAX_LENGTHS.description]])) return;
    await sql`
      INSERT INTO food_entries (id, child_id, date, time, meal_type, description, portions, is_trying, texture, accepted, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${mealType}, ${description}, ${portions}, ${isTrying}, ${texture}, ${accepted}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added food entry', ${id}, ${`${mealType}: ${description} at ${time} on ${date}`})
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
  if (!validateLengths(res, [['notes', notes, MAX_LENGTHS.notes]])) return;

  // Verify the entry belongs to a child the user can access
  const childIds = await getAccessibleChildIds(userId);
  const type = trackerType as TrackerType;

    if (type === 'sleep') {
    const existing = await sql`SELECT date, time, event_type, duration_minutes, quality, nighttime_event, bedtime, sleep_onset_minutes, night_activity, notes FROM sleep_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const prev = existing.rows[0];
    const { eventType, durationMinutes = null, quality = null, nighttimeEvent = false,
            bedtime = null, sleepOnsetMinutes = null, nightActivity = false } = body;
    await sql`
      UPDATE sleep_entries
      SET date = ${date}, time = ${time}, event_type = ${eventType}, duration_minutes = ${durationMinutes},
          quality = ${quality}, nighttime_event = ${nighttimeEvent},
          bedtime = ${bedtime}, sleep_onset_minutes = ${sleepOnsetMinutes}, night_activity = ${nightActivity},
          notes = ${notes}
      WHERE id = ${id}
    `;
    const changes: string[] = [];
    if (prev.date !== date) changes.push(`date: ${prev.date} -> ${date}`);
    if (prev.time !== time) changes.push(`time: ${prev.time} -> ${time}`);
    if (prev.event_type !== eventType) changes.push(`eventType: ${prev.event_type} -> ${eventType}`);
    if ((prev.duration_minutes ?? null) !== (durationMinutes ?? null)) changes.push(`durationMinutes: ${prev.duration_minutes} -> ${durationMinutes}`);
    if ((prev.quality ?? null) !== (quality ?? null)) changes.push(`quality: ${prev.quality} -> ${quality}`);
    if (prev.nighttime_event !== nighttimeEvent) changes.push(`nighttimeEvent: ${prev.nighttime_event} -> ${nighttimeEvent}`);
    if ((prev.notes || '') !== (notes || '')) changes.push(`notes: ${prev.notes || ''} -> ${notes || ''}`);
    if (changes.length > 0) {
      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${userId}, 'Updated sleep entry', ${id}, ${changes.join('; ')})
      `;
    }
  } else if (type === 'toilet_attempt') {
    const existing = await sql`SELECT date, time, outcome, supervised, prompted, duration_minutes, notes, child_id FROM toilet_attempt_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const prev = existing.rows[0];
    const { outcome, supervised = false, prompted = false, durationMinutes = null } = body;
    await sql`
      UPDATE toilet_attempt_entries
      SET date = ${date}, time = ${time}, outcome = ${outcome}, supervised = ${supervised},
          prompted = ${prompted}, duration_minutes = ${durationMinutes}, notes = ${notes}
      WHERE id = ${id}
    `;
    const changes: string[] = [];
    if (prev.date !== date) changes.push(`date: ${prev.date} -> ${date}`);
    if (prev.time !== time) changes.push(`time: ${prev.time} -> ${time}`);
    if (prev.outcome !== outcome) changes.push(`outcome: ${prev.outcome} -> ${outcome}`);
    if (prev.supervised !== supervised) changes.push(`supervised: ${prev.supervised} -> ${supervised}`);
    if (prev.prompted !== prompted) changes.push(`prompted: ${prev.prompted} -> ${prompted}`);
    if ((prev.duration_minutes ?? null) !== (durationMinutes ?? null)) changes.push(`durationMinutes: ${prev.duration_minutes} -> ${durationMinutes}`);
    if ((prev.notes || '') !== (notes || '')) changes.push(`notes: ${prev.notes || ''} -> ${notes || ''}`);
    if (changes.length > 0) {
      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${userId}, 'Updated toilet attempt', ${id}, ${changes.join('; ')})
      `;
    }
  } else {
    const existing = await sql`SELECT date, time, meal_type, description, portions, is_trying, texture, accepted, notes, child_id FROM food_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const prev = existing.rows[0];
    const { mealType, description = '', portions = null,
            isTrying = false, texture = null, accepted = null } = body;
    await sql`
      UPDATE food_entries
      SET date = ${date}, time = ${time}, meal_type = ${mealType}, description = ${description},
          portions = ${portions}, is_trying = ${isTrying}, texture = ${texture}, accepted = ${accepted},
          notes = ${notes}
      WHERE id = ${id}
    `;
    const changes: string[] = [];
    if (prev.date !== date) changes.push(`date: ${prev.date} -> ${date}`);
    if (prev.time !== time) changes.push(`time: ${prev.time} -> ${time}`);
    if (prev.meal_type !== mealType) changes.push(`mealType: ${prev.meal_type} -> ${mealType}`);
    if (prev.description !== description) changes.push(`description: ${prev.description} -> ${description}`);
    if ((prev.portions ?? null) !== (portions ?? null)) changes.push(`portions: ${prev.portions} -> ${portions}`);
    if (prev.is_trying !== isTrying) changes.push(`isTrying: ${prev.is_trying} -> ${isTrying}`);
    if (prev.texture !== texture) changes.push(`texture: ${prev.texture} -> ${texture}`);
    if (prev.accepted !== accepted) changes.push(`accepted: ${prev.accepted} -> ${accepted}`);
    if ((prev.notes || '') !== (notes || '')) changes.push(`notes: ${prev.notes || ''} -> ${notes || ''}`);
    if (changes.length > 0) {
      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${userId}, 'Updated food entry', ${id}, ${changes.join('; ')})
      `;
    }
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
