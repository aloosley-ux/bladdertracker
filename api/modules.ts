import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, getAccessibleChildIds } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';

type NewTrackerType = 'mood' | 'sensory' | 'medication' | 'therapy' | 'routine' | 'milestones';
const VALID_TYPES = new Set<NewTrackerType>(['mood', 'sensory', 'medication', 'therapy', 'routine', 'milestones']);

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

// ── GET ─────────────────────────────────────────────────────────────
async function handleGet(req: VercelRequest, res: VercelResponse, userId: string) {
  const type = req.query.type as string;

  // Enabled modules for a specific child
  if (type === 'enabled_modules') {
    const childId = req.query.childId as string;
    if (!childId) { res.status(400).json({ error: 'childId required' }); return; }
    const childIds = await getAccessibleChildIds(userId);
    if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

    const result = await sql`SELECT module_id FROM enabled_modules WHERE child_id = ${childId}`;
    res.status(200).json({ modules: result.rows.map((r) => r.module_id) });
    return;
  }

  if (type === 'reminder_preferences') {
    const childIds = await getAccessibleChildIds(userId);
    if (!childIds.length) { res.status(200).json({ reminders: [] }); return; }
    const childId = req.query.childId as string | undefined;
    if (childId && !childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

    const result = childId
      ? await sql`
          SELECT id, user_id AS "userId", child_id AS "childId", module_id AS "moduleId",
                 frequency, enabled, snoozed_until AS "snoozedUntil",
                 next_reminder_at AS "nextReminderAt", created_at AS "createdAt", updated_at AS "updatedAt"
          FROM reminder_preferences
          WHERE user_id = ${userId} AND child_id = ${childId}
          ORDER BY module_id ASC
        `
      : await sql`
          SELECT id, user_id AS "userId", child_id AS "childId", module_id AS "moduleId",
                 frequency, enabled, snoozed_until AS "snoozedUntil",
                 next_reminder_at AS "nextReminderAt", created_at AS "createdAt", updated_at AS "updatedAt"
          FROM reminder_preferences
          WHERE user_id = ${userId} AND child_id = ANY(${childIds})
          ORDER BY updated_at DESC
        `;
    res.status(200).json({ reminders: result.rows });
    return;
  }

  if (!type || !VALID_TYPES.has(type as NewTrackerType)) {
    res.status(400).json({ error: 'Valid type required: mood, sensory, medication, therapy, routine, milestones, enabled_modules, reminder_preferences' });
    return;
  }

  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.length) { res.status(200).json({ entries: [] }); return; }

  const trackerType = type as NewTrackerType;
  let result;

  if (trackerType === 'mood') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, level, triggers, notes,
             created_by AS "createdBy", created_at AS "createdAt"
      FROM mood_entries WHERE child_id = ANY(${childIds}) ORDER BY date DESC, time DESC
    `;
  } else if (trackerType === 'sensory') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, sensory_type AS "sensoryType",
             response, intensity, notes, created_by AS "createdBy", created_at AS "createdAt"
      FROM sensory_entries WHERE child_id = ANY(${childIds}) ORDER BY date DESC, time DESC
    `;
  } else if (trackerType === 'medication') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, name, dosage, administered, notes,
             created_by AS "createdBy", created_at AS "createdAt"
      FROM medication_entries WHERE child_id = ANY(${childIds}) ORDER BY date DESC, time DESC
    `;
  } else if (trackerType === 'therapy') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, therapy_type AS "therapyType",
             provider, duration_minutes AS "durationMinutes", goals, notes,
             created_by AS "createdBy", created_at AS "createdAt"
      FROM therapy_entries WHERE child_id = ANY(${childIds}) ORDER BY date DESC, time DESC
    `;
  } else if (trackerType === 'routine') {
    result = await sql`
      SELECT id, child_id AS "childId", date, time, routine_name AS "routineName",
             completed, duration_minutes AS "durationMinutes", notes,
             created_by AS "createdBy", created_at AS "createdAt"
      FROM routine_entries WHERE child_id = ANY(${childIds}) ORDER BY date DESC, time DESC
    `;
  } else {
    // milestones
    result = await sql`
      SELECT id, child_id AS "childId", name, description, category, module_id AS "moduleId",
             milestone_type AS "milestoneType", status, date_achieved AS "dateAchieved", notes,
             source_role AS "sourceRole", created_by AS "createdBy", created_at AS "createdAt"
      FROM milestones WHERE child_id = ANY(${childIds}) ORDER BY created_at DESC
    `;
  }

  res.status(200).json({ entries: result.rows });
}

// ── POST ─────────────────────────────────────────────────────────────
async function handlePost(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};

  // Handle enabled_modules management
  if (body.action === 'set_enabled_modules') {
    const { childId, modules } = body;
    if (!childId || !Array.isArray(modules)) {
      res.status(400).json({ error: 'childId and modules array required' }); return;
    }
    const childIds = await getAccessibleChildIds(userId);
    if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

    // Delete existing and re-insert
    await sql`DELETE FROM enabled_modules WHERE child_id = ${childId}`;
    for (const moduleId of modules) {
      await sql`
        INSERT INTO enabled_modules (id, child_id, module_id)
        VALUES (${generateId()}, ${childId}, ${moduleId})
        ON CONFLICT (child_id, module_id) DO NOTHING
      `;
    }
    res.status(200).json({ ok: true });
    return;
  }

  if (body.action === 'set_reminder_preferences') {
    const { childId, reminders } = body;
    if (!childId || !Array.isArray(reminders)) {
      res.status(400).json({ error: 'childId and reminders array required' }); return;
    }
    const childIds = await getAccessibleChildIds(userId);
    if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

    await sql`DELETE FROM reminder_preferences WHERE user_id = ${userId} AND child_id = ${childId}`;
    for (const reminder of reminders) {
      const moduleId = reminder.moduleId ?? 'all';
      const frequency = reminder.frequency === 'weekly' ? 'weekly' : 'daily';
      const enabled = reminder.enabled !== false;
      const snoozedUntil = reminder.snoozedUntil ?? null;
      const nextReminderAt = enabled
        ? reminder.nextReminderAt ?? (frequency === 'daily'
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        : null;

      await sql`
        INSERT INTO reminder_preferences (
          id, user_id, child_id, module_id, frequency, enabled, snoozed_until, next_reminder_at
        )
        VALUES (${generateId()}, ${userId}, ${childId}, ${moduleId}, ${frequency}, ${enabled}, ${snoozedUntil}, ${nextReminderAt})
      `;
    }
    res.status(200).json({ ok: true });
    return;
  }

  const { trackerType, childId, date, time, notes = '' } = body;

  if (!trackerType || !VALID_TYPES.has(trackerType as NewTrackerType)) {
    res.status(400).json({ error: 'Valid trackerType required: mood, sensory, medication, therapy, routine, milestones' }); return;
  }

  // milestones don't require date/time
  const type = trackerType as NewTrackerType;
  if (type !== 'milestones' && (!childId || !date || !time)) {
    res.status(400).json({ error: 'childId, date, and time are required' }); return;
  }
  if (type === 'milestones' && !childId) {
    res.status(400).json({ error: 'childId is required' }); return;
  }

  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

  const id = generateId();

  if (type === 'mood') {
    const { level = 3, triggers = '' } = body;
    await sql`
      INSERT INTO mood_entries (id, child_id, date, time, level, triggers, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${level}, ${triggers}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added mood entry', ${childId}, ${`Mood ${level}/5 at ${time} on ${date}`})
    `;
  } else if (type === 'sensory') {
    const { sensoryType = 'other', response = 'neutral', intensity = 3 } = body;
    await sql`
      INSERT INTO sensory_entries (id, child_id, date, time, sensory_type, response, intensity, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${sensoryType}, ${response}, ${intensity}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added sensory entry', ${childId}, ${`${sensoryType} (${response}) at ${time} on ${date}`})
    `;
  } else if (type === 'medication') {
    const { name = '', dosage = '', administered = true } = body;
    if (!name || !name.trim()) { res.status(400).json({ error: 'Medication name is required' }); return; }
    await sql`
      INSERT INTO medication_entries (id, child_id, date, time, name, dosage, administered, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${name.trim()}, ${dosage}, ${administered}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added medication entry', ${childId}, ${`${name} ${dosage} at ${time} on ${date}`})
    `;
  } else if (type === 'therapy') {
    const { therapyType = 'other', provider = '', durationMinutes = 0, goals = '' } = body;
    await sql`
      INSERT INTO therapy_entries (id, child_id, date, time, therapy_type, provider, duration_minutes, goals, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${therapyType}, ${provider}, ${durationMinutes}, ${goals}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added therapy entry', ${childId}, ${`${therapyType} (${durationMinutes}min) at ${time} on ${date}`})
    `;
  } else if (type === 'routine') {
    const { routineName = '', completed = true, durationMinutes = null } = body;
    if (!routineName || !routineName.trim()) { res.status(400).json({ error: 'routineName is required' }); return; }
    await sql`
      INSERT INTO routine_entries (id, child_id, date, time, routine_name, completed, duration_minutes, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${routineName.trim()}, ${completed}, ${durationMinutes}, ${notes}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added routine entry', ${childId}, ${`${routineName} ${completed ? 'completed' : 'incomplete'} at ${time} on ${date}`})
    `;
  } else {
    // milestones
    const {
      name = '',
      description = '',
      category = 'other',
      moduleId = 'milestones',
      milestoneType = 'developmental',
      status = 'not_started',
      dateAchieved = null,
      sourceRole = null,
    } = body;
    if (!name || !name.trim()) { res.status(400).json({ error: 'Milestone name is required' }); return; }
    await sql`
      INSERT INTO milestones (id, child_id, name, description, category, module_id, milestone_type, status, date_achieved, notes, source_role, created_by)
      VALUES (${id}, ${childId}, ${name.trim()}, ${description}, ${category}, ${moduleId}, ${milestoneType}, ${status}, ${dateAchieved}, ${notes}, ${sourceRole}, ${userId})
    `;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${userId}, 'Added milestone', ${childId}, ${`"${name}" (${category}) created`})
    `;
  }

  res.status(201).json({ id });
}

// ── PUT ──────────────────────────────────────────────────────────────
async function handlePut(req: VercelRequest, res: VercelResponse, userId: string) {
  const body = req.body ?? {};
  const { trackerType, id, notes = '' } = body;

  if (!trackerType || !VALID_TYPES.has(trackerType as NewTrackerType)) {
    res.status(400).json({ error: 'Valid trackerType required' }); return;
  }
  if (!id) { res.status(400).json({ error: 'id is required' }); return; }

  const type = trackerType as NewTrackerType;
  const { date, time } = body;

  if (type !== 'milestones' && (!date || !time)) {
    res.status(400).json({ error: 'date and time are required' }); return;
  }

  const childIds = await getAccessibleChildIds(userId);

  if (type === 'mood') {
    const existing = await sql`SELECT child_id FROM mood_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { level = 3, triggers = '' } = body;
    await sql`
      UPDATE mood_entries SET date=${date}, time=${time}, level=${level}, triggers=${triggers}, notes=${notes}
      WHERE id = ${id}
    `;
  } else if (type === 'sensory') {
    const existing = await sql`SELECT child_id FROM sensory_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { sensoryType = 'other', response = 'neutral', intensity = 3 } = body;
    await sql`
      UPDATE sensory_entries SET date=${date}, time=${time}, sensory_type=${sensoryType},
        response=${response}, intensity=${intensity}, notes=${notes}
      WHERE id = ${id}
    `;
  } else if (type === 'medication') {
    const existing = await sql`SELECT child_id FROM medication_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { name = '', dosage = '', administered = true } = body;
    await sql`
      UPDATE medication_entries SET date=${date}, time=${time}, name=${name},
        dosage=${dosage}, administered=${administered}, notes=${notes}
      WHERE id = ${id}
    `;
  } else if (type === 'therapy') {
    const existing = await sql`SELECT child_id FROM therapy_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { therapyType = 'other', provider = '', durationMinutes = 0, goals = '' } = body;
    await sql`
      UPDATE therapy_entries SET date=${date}, time=${time}, therapy_type=${therapyType},
        provider=${provider}, duration_minutes=${durationMinutes}, goals=${goals}, notes=${notes}
      WHERE id = ${id}
    `;
  } else if (type === 'routine') {
    const existing = await sql`SELECT child_id FROM routine_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const { routineName = '', completed = true, durationMinutes = null } = body;
    await sql`
      UPDATE routine_entries SET date=${date}, time=${time}, routine_name=${routineName},
        completed=${completed}, duration_minutes=${durationMinutes}, notes=${notes}
      WHERE id = ${id}
    `;
  } else {
    // milestones
    const existing = await sql`SELECT child_id FROM milestones WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) {
      res.status(403).json({ error: 'Access denied' }); return;
    }
    const {
      name = '',
      description = '',
      category = 'other',
      moduleId = 'milestones',
      milestoneType = 'developmental',
      status = 'not_started',
      dateAchieved = null,
      sourceRole = null,
    } = body;
    await sql`
      UPDATE milestones SET name=${name}, description=${description}, category=${category},
        module_id=${moduleId}, milestone_type=${milestoneType}, status=${status},
        date_achieved=${dateAchieved}, notes=${notes}, source_role=${sourceRole}
      WHERE id = ${id}
    `;
  }

  res.status(200).json({ ok: true });
}

// ── DELETE ───────────────────────────────────────────────────────────
async function handleDelete(req: VercelRequest, res: VercelResponse, userId: string) {
  const type = req.query.type as string;
  const id = req.query.id as string;

  if (!type || !VALID_TYPES.has(type as NewTrackerType)) {
    res.status(400).json({ error: 'Valid type required' }); return;
  }
  if (!id) { res.status(400).json({ error: 'id is required' }); return; }

  const childIds = await getAccessibleChildIds(userId);
  const trackerType = type as NewTrackerType;

  if (trackerType === 'mood') {
    const existing = await sql`SELECT child_id FROM mood_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM mood_entries WHERE id = ${id}`;
  } else if (trackerType === 'sensory') {
    const existing = await sql`SELECT child_id FROM sensory_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM sensory_entries WHERE id = ${id}`;
  } else if (trackerType === 'medication') {
    const existing = await sql`SELECT child_id FROM medication_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM medication_entries WHERE id = ${id}`;
  } else if (trackerType === 'therapy') {
    const existing = await sql`SELECT child_id FROM therapy_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM therapy_entries WHERE id = ${id}`;
  } else if (trackerType === 'routine') {
    const existing = await sql`SELECT child_id FROM routine_entries WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM routine_entries WHERE id = ${id}`;
  } else {
    // milestones
    const existing = await sql`SELECT child_id FROM milestones WHERE id = ${id}`;
    if (!existing.rows.length || !childIds.includes(existing.rows[0].child_id)) { res.status(403).json({ error: 'Access denied' }); return; }
    await sql`DELETE FROM milestones WHERE id = ${id}`;
  }

  res.status(200).json({ ok: true });
}
