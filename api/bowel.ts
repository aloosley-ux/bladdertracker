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
      SELECT id, child_id, date, time, location, amount, bristol_type, laxatives_given, notes, image_url, created_by, created_at
      FROM bowel_entries WHERE child_id = ANY(${ids})
      ORDER BY date DESC, time DESC
    `;

    const entries = result.rows.map((r) => ({
      id: r.id, childId: r.child_id, date: r.date, time: r.time,
      location: r.location, amount: r.amount, bristolType: r.bristol_type,
      laxativesGiven: r.laxatives_given, notes: r.notes || '',
      imageUrl: r.image_url, createdBy: r.created_by, createdAt: r.created_at,
    }));

    res.status(200).json({ entries });
    return;
  }

  if (req.method === 'POST') {
    const { childId, date, time, location, amount, bristolType, laxativesGiven, notes } = req.body ?? {};
    if (!childId || !date || !time) { res.status(400).json({ error: 'childId, date, time required' }); return; }

    const id = generateId();
    await sql`
      INSERT INTO bowel_entries (id, child_id, date, time, location, amount, bristol_type, laxatives_given, notes, created_by)
      VALUES (${id}, ${childId}, ${date}, ${time}, ${location || 'toilet'}, ${amount || 'M'}, ${bristolType || 4}, ${Boolean(laxativesGiven)}, ${notes || ''}, ${session.userId})
    `;

    await sql`
      INSERT INTO audit_events (id, user_id, action, subject, detail)
      VALUES (${generateId()}, ${session.userId}, 'Added bowel entry', ${id}, ${`Bowel event logged at ${time}.`})
    `;

    res.status(201).json({ id });
    return;
  }

  if (req.method === 'PUT') {
    const { id, date, time, location, amount, bristolType, laxativesGiven, notes } = req.body ?? {};
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    const existing = await sql`SELECT date, time, location, amount, bristol_type, laxatives_given, notes FROM bowel_entries WHERE id = ${id}`;
    if (!existing.rows.length) { res.status(404).json({ error: 'Not found' }); return; }
    const prev = existing.rows[0];

    await sql`
      UPDATE bowel_entries SET date=${date}, time=${time}, location=${location}, amount=${amount},
        bristol_type=${bristolType}, laxatives_given=${Boolean(laxativesGiven)}, notes=${notes || ''}
      WHERE id = ${id}
    `;

    const changes: string[] = [];
    if (prev.date !== date) changes.push(`date: ${prev.date} -> ${date}`);
    if (prev.time !== time) changes.push(`time: ${prev.time} -> ${time}`);
    if (prev.location !== location) changes.push(`location: ${prev.location} -> ${location}`);
    if (prev.amount !== amount) changes.push(`amount: ${prev.amount} -> ${amount}`);
    if (prev.bristol_type !== bristolType) changes.push(`bristolType: ${prev.bristol_type} -> ${bristolType}`);
    if (prev.laxatives_given !== Boolean(laxativesGiven)) changes.push(`laxativesGiven: ${prev.laxatives_given} -> ${Boolean(laxativesGiven)}`);
    if ((prev.notes || '') !== (notes || '')) changes.push(`notes: ${prev.notes || ''} -> ${notes || ''}`);

    if (changes.length > 0) {
      await sql`
        INSERT INTO audit_events (id, user_id, action, subject, detail)
        VALUES (${generateId()}, ${session.userId}, 'Updated bowel entry', ${id}, ${changes.join('; ')})
      `;
    }

    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || req.body?.id) as string;
    if (!id) { res.status(400).json({ error: 'id required' }); return; }

    await sql`DELETE FROM bowel_entries WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
