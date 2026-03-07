import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, getAccessibleChildIds } from './_lib/db.js';
import { getSessionFromRequest, generateId, cors } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const session = await getSessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const childIds = await getAccessibleChildIds(session.userId);

  if (req.method === 'GET') {
    const childFilter = req.query.childId as string | undefined;
    const ids = childFilter ? [childFilter].filter((id) => childIds.includes(id)) : childIds;
    if (ids.length === 0) { res.status(200).json({ entries: [] }); return; }

    const result = await sql`
      SELECT id, child_id, date, time, wet, pass, volume_ml, urgency, leakage_amount, notes, created_by, created_at
      FROM urine_entries WHERE child_id = ANY(${ids})
      ORDER BY date DESC, time DESC
    `;

    const entries = result.rows.map((r) => ({
      id: r.id, childId: r.child_id, date: r.date, time: r.time,
      wet: r.wet, pass: r.pass, volumeMl: r.volume_ml ?? null,
      urgency: r.urgency ?? null, leakageAmount: r.leakage_amount ?? null,
      notes: r.notes || '',
      createdBy: r.created_by, createdAt: r.created_at,
    }));

    res.status(200).json({ entries });
    return;
  }

  if (req.method === 'POST') {
    const { childId, date, time, wet, pass, volumeMl, urgency, leakageAmount, notes } = req.body ?? {};
    if (!childId || !date || !time) { res.status(400).json({ error: 'childId, date, time required' }); return; }

    const id = generateId();
    await sql`
      INSERT INTO urine_entries (id, child_id, date, time, wet, pass, volume_ml, urgency, leakage_amount, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${Boolean(wet)}, ${Boolean(pass)}, ${volumeMl ?? null}, ${urgency ?? null}, ${leakageAmount ?? null}, ${notes || ''}, ${session.userId})
    `;

    const detail = volumeMl ? `Urine event logged at ${time} — ${volumeMl}ml.` : `Urine event logged at ${time}.`;
    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Added urine entry', ${childId}, ${detail})
    `;

    res.status(201).json({ id });
    return;
  }

  if (req.method === 'PUT') {
    const { id, date, time, wet, pass, volumeMl, urgency, leakageAmount, notes } = req.body ?? {};
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    await sql`
      UPDATE urine_entries SET date=${date}, time=${time}, wet=${Boolean(wet)}, pass=${Boolean(pass)},
        volume_ml=${volumeMl ?? null}, urgency=${urgency ?? null}, leakage_amount=${leakageAmount ?? null},
        notes=${notes || ''}
      WHERE id = ${id}
    `;
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || req.body?.id) as string;
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    await sql`DELETE FROM urine_entries WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
