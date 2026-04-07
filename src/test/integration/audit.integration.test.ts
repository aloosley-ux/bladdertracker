import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the auth and db modules used by the API handlers before importing them
type CapturedCall = { query: string; values: unknown[] };
const capturedSqlCalls: CapturedCall[] = [];

vi.mock('../../../api/_lib/auth.js', () => ({
  getSessionFromRequest: async () => ({ userId: 'test-user', email: 'test@example.com', role: 'parent' }),
  generateId: () => 'fixed-id',
  cors: () => {},
}));

vi.mock('../../../api/_lib/db.js', () => ({
  sql: async (parts: TemplateStringsArray, ...values: unknown[]) => {
    const text = parts.join('${v}');
    capturedSqlCalls.push({ query: text, values });

    // Simulate SELECT for existing drink entry (includes child_id for ownership check)
    if (text.includes('SELECT date, time, type, amount_ml, notes') && text.includes('FROM drink_entries')) {
      return { rows: [{ date: '2026-03-14', time: '09:00', type: 'cup', amount_ml: 100, notes: '', child_id: 'child-1' }] };
    }

    // Default empty result
    return { rows: [] };
  },
  getAccessibleChildIds: async () => ['child-1'],
}));

describe('API audit integration (mocked DB/auth)', () => {
  beforeEach(() => {
    capturedSqlCalls.length = 0;
    vi.resetModules();
  });

  it('inserts an audit event on POST /api/drinks', async () => {
    // Import handler after mocks
    const mod = await import('../../../api/drinks');
    const handler = mod.default;

    // Create mock req/res
    const req = { method: 'POST', body: { childId: 'child-1', date: '2026-03-14', time: '09:00', type: 'cup', amountMl: 150, notes: 'Test' }, headers: {} } as const;
    let statusCode = 0;
    let responseBody: unknown;
    const res = {
      status(code: number) { statusCode = code; return this; },
      json(body: unknown) { responseBody = body; return this; },
      end() { return this; },
      setHeader() { return; },
    };

    const fn = handler as unknown as (r: unknown, s: unknown) => Promise<void>;
    await fn(req, res);

    expect(statusCode).toBe(201);
    // responseBody is unknown; ensure it has an id property when treated as record
    expect(typeof (responseBody as Record<string, unknown>)?.['id']).toBe('string');

    // Ensure an INSERT into audit_events was called
    const hasAuditInsert = capturedSqlCalls.some((c) => c.query.includes('INSERT INTO audit_events'));
    expect(hasAuditInsert).toBe(true);
  });

  it('inserts an audit event on PUT /api/drinks when changes occur', async () => {
    const mod2 = await import('../../../api/drinks');
    const handler2 = mod2.default;

    const req2 = { method: 'PUT', body: { id: 'existing-id', date: '2026-03-15', time: '10:00', type: 'cup', amountMl: 200, notes: 'Updated' }, headers: {} } as const;
    let statusCode2 = 0;
    let responseBody2: unknown;
    const res2 = {
      status(code: number) { statusCode2 = code; return this; },
      json(body: unknown) { responseBody2 = body; return this; },
      end() { return this; },
      setHeader() { return; },
    };

    const fn2 = handler2 as unknown as (r: unknown, s: unknown) => Promise<void>;
    await fn2(req2, res2);

    expect(statusCode2).toBe(200);
    expect((responseBody2 as Record<string, unknown>)?.['ok']).toBe(true);

    const auditCalls = capturedSqlCalls.filter((c) => c.query.includes('INSERT INTO audit_events'));
    expect(auditCalls.length).toBeGreaterThanOrEqual(1);
    const detailCall = auditCalls[auditCalls.length - 1];
    expect(detailCall.query).toContain('INSERT INTO audit_events');
  });
});
