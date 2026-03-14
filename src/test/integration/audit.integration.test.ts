import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the auth and db modules used by the API handlers before importing them
const capturedSqlCalls: Array<{ query: string; values: any[] }> = [];

vi.mock('../../../api/_lib/auth.js', () => ({
  getSessionFromRequest: async () => ({ userId: 'test-user', email: 'test@example.com', role: 'parent' }),
  generateId: () => 'fixed-id',
  cors: () => {},
}));

vi.mock('../../../api/_lib/db.js', () => ({
  sql: async (parts: TemplateStringsArray, ...values: any[]) => {
    const text = parts.join('${v}');
    capturedSqlCalls.push({ query: text, values });

    // Simulate SELECT for existing drink entry
    if (text.includes('SELECT date, time, type, amount_ml, notes FROM drink_entries')) {
      return { rows: [{ date: '2026-03-14', time: '09:00', type: 'cup', amount_ml: 100, notes: '' }] };
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
    const req: any = { method: 'POST', body: { childId: 'child-1', date: '2026-03-14', time: '09:00', type: 'cup', amountMl: 150, notes: 'Test' }, headers: {} };
    let statusCode = 0;
    let responseBody: any;
    const res: any = {
      status(code: number) { statusCode = code; return this; },
      json(body: any) { responseBody = body; return this; },
      end() { return this; },
      setHeader() { return; },
    };

    await handler(req, res);

    expect(statusCode).toBe(201);
    expect(responseBody).toHaveProperty('id');

    // Ensure an INSERT into audit_events was called
    const hasAuditInsert = capturedSqlCalls.some((c) => c.query.includes('INSERT INTO audit_events'));
    expect(hasAuditInsert).toBe(true);
  });

  it('inserts an audit event on PUT /api/drinks when changes occur', async () => {
    const mod = await import('../../../api/drinks');
    const handler = mod.default;

    const req: any = { method: 'PUT', body: { id: 'existing-id', date: '2026-03-15', time: '10:00', type: 'cup', amountMl: 200, notes: 'Updated' }, headers: {} };
    let statusCode = 0;
    let responseBody: any;
    const res: any = {
      status(code: number) { statusCode = code; return this; },
      json(body: any) { responseBody = body; return this; },
      end() { return this; },
      setHeader() { return; },
    };

    await handler(req, res);

    expect(statusCode).toBe(200);
    expect(responseBody).toHaveProperty('ok', true);

    const auditCalls = capturedSqlCalls.filter((c) => c.query.includes('INSERT INTO audit_events'));
    expect(auditCalls.length).toBeGreaterThanOrEqual(1);
    const detailCall = auditCalls[auditCalls.length - 1];
    expect(detailCall.query).toContain('INSERT INTO audit_events');
  });
});
