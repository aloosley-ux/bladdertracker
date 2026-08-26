import { beforeEach, describe, expect, it, vi } from 'vitest';

const sqlMock = vi.fn();

vi.mock('../../../api/_lib/db.js', () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
}));

vi.mock('../../../api/_lib/auth.js', () => ({
  getSessionFromRequest: async () => ({ userId: 'user-1', email: 'user@example.com', role: 'parent' }),
  generateId: () => 'generated-id',
  cors: () => {},
}));

function createResponse() {
  let statusCode = 0;
  let jsonBody: unknown;
  return {
    res: {
      status(code: number) { statusCode = code; return this; },
      json(body: unknown) { jsonBody = body; return this; },
      end() { return this; },
      setHeader() { return this; },
    },
    get statusCode() { return statusCode; },
    get jsonBody() { return jsonBody; },
  };
}

// Postgres drivers return DATE columns as JS Date objects at UTC midnight.
function utcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

describe('API children handler — DOB as DATE column', () => {
  beforeEach(() => {
    sqlMock.mockReset();
  });

  it('maps a DATE column value (JS Date) back to YYYY-MM-DD strings', async () => {
    sqlMock.mockResolvedValueOnce({
      rows: [{
        id: 'child-1',
        name: 'Alex',
        date_of_birth: utcDate('2024-02-29'),
        due_date: '',
        avatar: null,
        created_by: 'user-1',
        last_updated_at: new Date(),
        parent_ids: ['user-1'],
        caregivers: [],
      }],
    });
    const mod = await import('../../../api/children');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler({ method: 'GET', query: {}, headers: {} }, response.res);

    expect(response.statusCode).toBe(200);
    const { children } = response.jsonBody as { children: Array<{ dateOfBirth: string }> };
    expect(children[0].dateOfBirth).toBe('2024-02-29');
  });

  it('stores NULL for an empty or missing dateOfBirth on create', async () => {
    sqlMock.mockResolvedValue({ rows: [] });
    const mod = await import('../../../api/children');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler(
      { method: 'POST', body: { name: 'Baby' }, query: {}, headers: {} },
      response.res,
    );

    expect(response.statusCode).toBe(201);
    const insertCall = sqlMock.mock.calls.find((call) => String(call[0]).includes('INSERT INTO children'));
    expect(insertCall).toBeTruthy();
    // The interpolated DOB parameter must be null, not ''
    expect(insertCall![3]).toBeNull();
    expect(response.jsonBody).toMatchObject({ child: { dateOfBirth: '' } });
  });

  it('round-trips a valid ISO DOB through create and echoes YYYY-MM-DD', async () => {
    sqlMock.mockResolvedValue({ rows: [] });
    const mod = await import('../../../api/children');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler(
      { method: 'POST', body: { name: 'Baby', dateOfBirth: '2025-12-01' }, query: {}, headers: {} },
      response.res,
    );

    expect(response.statusCode).toBe(201);
    expect(response.jsonBody).toMatchObject({ child: { dateOfBirth: '2025-12-01' } });
  });

  it('rejects impossible calendar dates instead of storing garbage', async () => {
    sqlMock.mockResolvedValue({ rows: [] });
    const mod = await import('../../../api/children');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler(
      { method: 'POST', body: { name: 'Baby', dateOfBirth: '2025-02-30' }, query: {}, headers: {} },
      response.res,
    );

    expect(response.statusCode).toBe(201);
    const insertCall = sqlMock.mock.calls.find((call) => String(call[0]).includes('INSERT INTO children'));
    expect(insertCall![3]).toBeNull();
    expect(response.jsonBody).toMatchObject({ child: { dateOfBirth: '' } });
  });

  it('ignores a malformed DOB on update (keeps the existing value)', async () => {
    sqlMock
      .mockResolvedValueOnce({ rows: [{ id: 'child-1' }] }) // access check
      .mockResolvedValueOnce({ rows: [] }); // UPDATE
    const mod = await import('../../../api/children');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler(
      { method: 'PUT', body: { id: 'child-1', name: 'Alex', dateOfBirth: 'not-a-date' }, query: {}, headers: {} },
      response.res,
    );

    expect(response.statusCode).toBe(200);
    const updateCall = sqlMock.mock.calls.find((call) => String(call[0]).includes('UPDATE children'));
    expect(updateCall).toBeTruthy();
    // date_of_birth param stays NULL so COALESCE keeps the stored value
    expect(updateCall![2]).toBeNull();
  });
});
