import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { getSessionFromRequest, cors } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

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
