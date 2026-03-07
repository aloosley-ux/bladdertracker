import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
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
  location?: string;
  bristolType?: number;
  laxativesGiven?: boolean;
  notes?: string;
  entryType?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  // GET → export CSV
  if (req.method === 'GET') {
    return handleExport(req, res);
  }

  // POST → import data
  if (req.method === 'POST') {
    return handleImport(req, res, session.userId);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

async function handleExport(req: VercelRequest, res: VercelResponse) {
  const childId = req.query.childId as string;
  if (!childId) { res.status(400).json({ error: 'childId is required' }); return; }

  const childResult = await sql`SELECT name FROM children WHERE id = ${childId}`;
  const childName = childResult.rows[0]?.name || 'Child';

  const drinks = await sql`
    SELECT date, time, type, amount_ml, notes FROM drink_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const urine = await sql`
    SELECT date, time, wet, pass, notes FROM urine_entries WHERE child_id = ${childId} ORDER BY date, time
  `;
  const bowel = await sql`
    SELECT date, time, location, amount, bristol_type, laxatives_given, notes FROM bowel_entries WHERE child_id = ${childId} ORDER BY date, time
  `;

  let csv = `Bladder & Bowel Diary Export for ${childName}\n`;
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  csv += 'DRINKS\nDate,Time,Type,Amount (ml),Notes\n';
  drinks.rows.forEach((r) => { csv += `${r.date},${r.time},${r.type},${r.amount_ml},"${r.notes}"\n`; });

  csv += '\nURINE EVENTS\nDate,Time,Wet,Pass,Notes\n';
  urine.rows.forEach((r) => { csv += `${r.date},${r.time},${r.wet},${r.pass},"${r.notes}"\n`; });

  csv += '\nBOWEL EVENTS\nDate,Time,Location,Amount,Bristol Type,Laxatives,Notes\n';
  bowel.rows.forEach((r) => { csv += `${r.date},${r.time},${r.location},${r.amount},Type ${r.bristol_type},${r.laxatives_given},"${r.notes}"\n`; });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="bladder-diary-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`);
  res.status(200).send(csv);
}

async function handleImport(req: VercelRequest, res: VercelResponse, userId: string) {
  const { childId, drinks, urineEntries, bowelEntries } = req.body ?? {};
  if (!childId) { res.status(400).json({ error: 'childId is required' }); return; }

  const summary = { drinks: 0, urineEntries: 0, bowelEntries: 0, errors: [] as string[] };

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
        INSERT INTO urine_entries (id, child_id, date, time, wet, pass, notes, created_by)
        VALUES (${generateId()}, ${childId}, ${entry.date}, ${entry.time}, ${Boolean(entry.wet)}, ${Boolean(entry.pass)}, ${entry.notes || ''}, ${userId})
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

  const total = summary.drinks + summary.urineEntries + summary.bowelEntries;
  await sql`
    INSERT INTO audit_events (id, user_id, action, subject, detail)
    VALUES (${generateId()}, ${userId}, 'Imported diary data', ${childId}, ${`Imported ${total} records.`})
  `;

  res.status(200).json({ summary });
}
