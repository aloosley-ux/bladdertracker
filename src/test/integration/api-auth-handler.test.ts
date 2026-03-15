import { beforeEach, describe, expect, it, vi } from 'vitest';

const sqlMock = vi.fn();

vi.mock('../../../api/_lib/db.js', () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
}));

vi.mock('../../../api/_lib/auth.js', () => ({
  createSessionToken: async () => 'session-token',
  setSessionCookie: () => {},
  clearSessionCookie: () => {},
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

describe('API auth handler', () => {
  beforeEach(() => {
    sqlMock.mockReset();
  });

  it('rejects self-registration for admin role', async () => {
    sqlMock.mockResolvedValue({ rows: [] });
    const mod = await import('../../../api/auth');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler({
      method: 'POST',
      body: {
        action: 'register',
        name: 'Test User',
        email: 'test@example.com',
        password: 'very-secure-password',
        role: 'admin',
      },
      query: {},
      headers: {},
    }, response.res);

    expect(response.statusCode).toBe(400);
    expect(response.jsonBody).toEqual({ error: 'Invalid role for self-registration.' });
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });
});
