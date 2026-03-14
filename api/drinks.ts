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
    if (ids.length === 0) { res.status(200).json({ drinks: [] }); return; }

    const result = await sql`
      SELECT id, child_id, date, time, type, amount_ml, notes, created_by, created_at
      FROM drink_entries WHERE child_id = ANY(${ids})
      ORDER BY date DESC, time DESC
    `;

    const drinks = result.rows.map((r) => ({
      id: r.id, childId: r.child_id, date: r.date, time: r.time,
      type: r.type, amountMl: r.amount_ml, notes: r.notes || '',
      createdBy: r.created_by, createdAt: r.created_at,
    }));

    res.status(200).json({ drinks });
    return;
  }

  if (req.method === 'POST') {
    const { childId, date, time, type, amountMl, notes } = req.body ?? {};
    if (!childId || !date || !time) { res.status(400).json({ error: 'childId, date, time required' }); return; }

    const id = generateId();
    await sql`
      INSERT INTO drink_entries (id, child_id, date, time, type, amount_ml, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${type || 'cup'}, ${amountMl || 0}, ${notes || ''}, ${session.userId})
    `;

    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Added drink entry', ${id}, ${`${amountMl || 0}ml recorded at ${time}.`})
    `;

    res.status(201).json({ id });
    return;
  }

  if (req.method === 'PUT') {
    const { id, date, time, type, amountMl, notes } = req.body ?? {};
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    // Fetch existing for audit
    const existing = await sql`SELECT date, time, type, amount_ml, notes FROM drink_entries WHERE id = ${id}`;
    if (!existing.rows.length) { res.status(404).json({ error: 'Not found' }); return; }
    const prev = existing.rows[0];

    await sql`
      UPDATE drink_entries SET date=${date}, time=${time}, type=${type}, amount_ml=${amountMl}, notes=${notes || ''}
      WHERE id = ${id}
    `;

    // Build change detail
    const changes: string[] = [];
    if (prev.date !== date) changes.push(`date: ${prev.date} -> ${date}`);
    if (prev.time !== time) changes.push(`time: ${prev.time} -> ${time}`);
    if (prev.type !== type) changes.push(`type: ${prev.type} -> ${type}`);
    if ((prev.amount_ml ?? null) !== (amountMl ?? null)) changes.push(`amountMl: ${prev.amount_ml} -> ${amountMl}`);
    if ((prev.notes || '') !== (notes || '')) changes.push(`notes: ${prev.notes || ''} -> ${notes || ''}`);

    if (changes.length > 0) {
      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${session.userId}, 'Updated drink entry', ${id}, ${changes.join('; ')})
      `;
    }

    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || req.body?.id) as string;
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    await sql`DELETE FROM drink_entries WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
