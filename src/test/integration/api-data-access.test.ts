import { beforeEach, describe, expect, it, vi } from 'vitest';

const sqlMock = vi.fn();
const getAccessibleChildIdsMock = vi.fn();

vi.mock('../../../api/_lib/db.js', () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
  getAccessibleChildIds: (...args: unknown[]) => getAccessibleChildIdsMock(...args),
}));

vi.mock('../../../api/_lib/auth.js', () => ({
  getSessionFromRequest: async () => ({ userId: 'user-1', email: 'user@example.com', role: 'parent' }),
  generateId: () => 'generated-id',
  cors: () => {},
}));

function createResponse() {
  let statusCode = 0;
  let jsonBody: unknown;
  const headers = new Map<string, string>();
  return {
    res: {
      status(code: number) { statusCode = code; return this; },
      json(body: unknown) { jsonBody = body; return this; },
      send(body: unknown) { jsonBody = body; return this; },
      end() { return this; },
      setHeader(name: string, value: string) { headers.set(name, value); return this; },
    },
    get statusCode() { return statusCode; },
    get jsonBody() { return jsonBody; },
    headers,
  };
}

describe('API data handler access control', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    getAccessibleChildIdsMock.mockReset();
    getAccessibleChildIdsMock.mockResolvedValue(['child-1']);
  });

  it('rejects CSV export for an inaccessible child', async () => {
    const mod = await import('../../../api/data');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler({
      method: 'GET',
      query: { childId: 'child-2' },
      headers: {},
    }, response.res);

    expect(response.statusCode).toBe(403);
    expect(response.jsonBody).toEqual({ error: 'Access denied' });
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it('rejects bulk import for an inaccessible child', async () => {
    const mod = await import('../../../api/data');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler({
      method: 'POST',
      body: { childId: 'child-2', drinks: [] },
      headers: {},
    }, response.res);

    expect(response.statusCode).toBe(403);
    expect(response.jsonBody).toEqual({ error: 'Access denied' });
    expect(sqlMock).not.toHaveBeenCalled();
  });
});
