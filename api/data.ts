import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, getAccessibleChildIds } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';

interface EntryPayload {
  date?: string;
  time?: string;
  type?: string;
  drinkType?: string;
  amountMl?: number;
  amount?: string;
  wet?: boolean;
  pass?: boolean;
  volumeMl?: number;
  urgency?: number;
  leakageAmount?: string;
  location?: string;
  bristolType?: number;
  laxativesGiven?: boolean;
  notes?: string;
  entryType?: string;
  // Sleep
  eventType?: string;
  durationMinutes?: number;
  quality?: number;
  nighttimeEvent?: boolean;
  bedtime?: string;
  sleepOnsetMinutes?: number;
  nightActivity?: boolean;
  // Toilet attempt
  outcome?: string;
  supervised?: boolean;
  prompted?: boolean;
  // Food
  mealType?: string;
  description?: string;
  portions?: number;
  isTrying?: boolean;
  texture?: string;
  accepted?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  // GET → export CSV
  if (req.method === 'GET') {
    return handleExport(req, res, session.userId);
  }

  // POST → import data
  if (req.method === 'POST') {
    return handleImport(req, res, session.userId);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

async function handleExport(req: VercelRequest, res: VercelResponse, userId: string) {
  const childId = req.query.childId as string;
  if (!childId) { res.status(400).json({ error: 'childId is required' }); return; }
  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

  const childResult = await sql`SELECT name FROM children WHERE id = ${childId}`;
  const childName = childResult.rows[0]?.name || 'Child';

  const drinks = await sql`
    SELECT date, time, type, amount_ml, notes FROM drink_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const urine = await sql`
    SELECT date, time, wet, pass, volume_ml, urgency, leakage_amount, notes FROM urine_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const bowel = await sql`
    SELECT date, time, location, amount, bristol_type, laxatives_given, notes FROM bowel_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const sleep = await sql`
    SELECT date, time, event_type, duration_minutes, quality, nighttime_event,
           bedtime, sleep_onset_minutes, night_activity, notes FROM sleep_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const toiletAttempts = await sql`
    SELECT date, time, outcome, supervised, prompted, duration_minutes, notes FROM toilet_attempt_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const food = await sql`
    SELECT date, time, meal_type, description, portions, is_trying, texture, accepted, notes FROM food_entries WHERE child_id = ${childId} ORDER BY date, time
  `;

  let csv = `Bladder & Bowel Diary Export for ${escapeCsvField(childName)}\n`;
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  csv += 'DRINKS\nDate,Time,Type,Amount (ml),Notes\n';
  drinks.rows.forEach((r) => { csv += `${r.date},${r.time},${r.type},${r.amount_ml},${escapeCsvField(r.notes)}\n`; });

  csv += '\nURINE EVENTS\nDate,Time,Wet,Pass,Volume (ml),Urgency,Leakage,Notes\n';
  urine.rows.forEach((r) => { csv += `${r.date},${r.time},${r.wet},${r.pass},${r.volume_ml ?? ''},${r.urgency ?? ''},${r.leakage_amount ?? ''},${escapeCsvField(r.notes)}\n`; });

  csv += '\nBOWEL EVENTS\nDate,Time,Location,Amount,Bristol Type,Laxatives,Notes\n';
  bowel.rows.forEach((r) => { csv += `${r.date},${r.time},${r.location},${r.amount},Type ${r.bristol_type},${r.laxatives_given},${escapeCsvField(r.notes)}\n`; });

  csv += '\nSLEEP EVENTS\nDate,Time,Event Type,Duration (min),Quality (1-5),Nighttime,Bedtime,Sleep Onset (min),Night Activity,Notes\n';
  sleep.rows.forEach((r) => { csv += `${r.date},${r.time},${r.event_type},${r.duration_minutes ?? ''},${r.quality ?? ''},${r.nighttime_event},${r.bedtime ?? ''},${r.sleep_onset_minutes ?? ''},${r.night_activity ?? false},${escapeCsvField(r.notes)}\n`; });

  csv += '\nTOILET ATTEMPTS\nDate,Time,Outcome,Supervised,Prompted,Duration (min),Notes\n';
  toiletAttempts.rows.forEach((r) => { csv += `${r.date},${r.time},${r.outcome},${r.supervised},${r.prompted},${r.duration_minutes ?? ''},${escapeCsvField(r.notes)}\n`; });

  csv += '\nFOOD ENTRIES\nDate,Time,Meal Type,Description,Portions,Trying,Texture,Accepted,Notes\n';
  food.rows.forEach((r) => { csv += `${r.date},${r.time},${r.meal_type},${escapeCsvField(r.description)},${r.portions ?? ''},${r.is_trying ?? false},${r.texture ?? ''},${r.accepted ?? ''},${escapeCsvField(r.notes)}\n`; });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="bladder-diary-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`);
  res.status(200).send(csv);
}

async function handleImport(req: VercelRequest, res: VercelResponse, userId: string) {
  const { childId, drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries } = req.body ?? {};
  if (!childId) { res.status(400).json({ error: 'childId is required' }); return; }
  const childIds = await getAccessibleChildIds(userId);
  if (!childIds.includes(childId)) { res.status(403).json({ error: 'Access denied' }); return; }

  const summary = { drinks: 0, urineEntries: 0, bowelEntries: 0, sleepEntries: 0, toiletAttemptEntries: 0, foodEntries: 0, errors: [] as string[] };

  if (drinks) {
    for (const [i, entry] of (drinks as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time || typeof entry.amountMl !== 'number') {
        summary.errors.push(`Drink row ${i + 1} missing date, time, or amount.`);
        continue;
      }
      await sql`
        INSERT INTO drink_entries (id, child_id, date, time, type, amount_ml, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${entry.type || entry.drinkType || 'cup'}, ${entry.amountMl}, ${entry.notes || ''}, ${userId})
      `;
      summary.drinks++;
    }
  }

  if (urineEntries) {
    for (const [i, entry] of (urineEntries as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time) {
        summary.errors.push(`Urine row ${i + 1} missing date or time.`);
        continue;
      }
      await sql`
        INSERT INTO urine_entries (id, child_id, date, time, wet, pass, volume_ml, urgency, leakage_amount, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${Boolean(entry.wet)}, ${Boolean(entry.pass)}, ${entry.volumeMl ?? null}, ${entry.urgency ?? null}, ${entry.leakageAmount ?? null}, ${entry.notes || ''}, ${userId})
      `;
      summary.urineEntries++;
    }
  }

  if (bowelEntries) {
    for (const [i, entry] of (bowelEntries as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time) {
        summary.errors.push(`Bowel row ${i + 1} missing date or time.`);
        continue;
      }
      await sql`
        INSERT INTO bowel_entries (id, child_id, date, time, location, amount, bristol_type, laxatives_given, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${entry.location || 'toilet'}, ${entry.amount || 'M'}, ${entry.bristolType || 4}, ${Boolean(entry.laxativesGiven)}, ${entry.notes || ''}, ${userId})
      `;
      summary.bowelEntries++;
    }
  }

  if (sleepEntries) {
    for (const [i, entry] of (sleepEntries as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time) {
        summary.errors.push(`Sleep row ${i + 1} missing date or time.`);
        continue;
      }
      await sql`
        INSERT INTO sleep_entries (id, child_id, date, time, event_type, duration_minutes, quality, nighttime_event, bedtime, sleep_onset_minutes, night_activity, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${entry.eventType || 'onset'}, ${entry.durationMinutes ?? null}, ${entry.quality ?? null}, ${Boolean(entry.nighttimeEvent)}, ${entry.bedtime ?? null}, ${entry.sleepOnsetMinutes ?? null}, ${Boolean(entry.nightActivity)}, ${entry.notes || ''}, ${userId})
      `;
      summary.sleepEntries++;
    }
  }

  if (toiletAttemptEntries) {
    for (const [i, entry] of (toiletAttemptEntries as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time) {
        summary.errors.push(`Toilet attempt row ${i + 1} missing date or time.`);
        continue;
      }
      await sql`
        INSERT INTO toilet_attempt_entries (id, child_id, date, time, outcome, supervised, prompted, duration_minutes, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${entry.outcome || 'no_event'}, ${Boolean(entry.supervised)}, ${Boolean(entry.prompted)}, ${entry.durationMinutes ?? null}, ${entry.notes || ''}, ${userId})
      `;
      summary.toiletAttemptEntries++;
    }
  }

  if (foodEntries) {
    for (const [i, entry] of (foodEntries as EntryPayload[]).entries()) {
      if (!entry.date || !entry.time) {
        summary.errors.push(`Food row ${i + 1} missing date or time.`);
        continue;
      }
      await sql`
        INSERT INTO food_entries (id, child_id, date, time, meal_type, description, portions, is_trying, texture, accepted, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${entry.mealType || 'snack'}, ${entry.description || ''}, ${entry.portions ?? null}, ${Boolean(entry.isTrying)}, ${entry.texture ?? null}, ${entry.accepted ?? null}, ${entry.notes || ''}, ${userId})
      `;
      summary.foodEntries++;
    }
  }

  const total = summary.drinks + summary.urineEntries + summary.bowelEntries + summary.sleepEntries + summary.toiletAttemptEntries + summary.foodEntries;
  await sql`
    INSERT INTO audit_events (id, user_id, action, subject, detail)
    VALUES (${generateId()}, ${userId}, 'Imported diary data', ${childId}, ${`Imported ${total} records.`})
  `;

  res.status(200).json({ summary });
}

function escapeCsvField(value: string | null | undefined): string {
  const str = value ?? '';
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}
