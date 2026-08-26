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

vi.mock('../../../api/_lib/validateEnv.js', () => ({
  validateEnv: () => {},
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

const PROMOTED_ACCOUNT = {
  id: 'user-1',
  name: 'Test User',
  email: 'user@example.com',
  role: 'admin',
  avatar: null,
  created_at: new Date('2026-01-01T00:00:00Z'),
};

describe('API auth handler', () => {
  beforeEach(() => {
    sqlMock.mockReset();
    process.env.ADMIN_ACCESS_KEY = 'secret-admin-key';
  });

  it.each(['admin', 'therapist', 'specialist'])('rejects self-registration for unsupported role %s', async (role) => {
    sqlMock.mockResolvedValue({ rows: [] });
    const mod = await import('../../../api/auth');
    const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
    const response = createResponse();

    await handler({
      method: 'POST',
      body: {
        action: 'register',
        name: 'Test User',
        email: `test-${role}@example.com`,
        password: 'very-secure-password',
        role,
      },
      query: {},
      headers: {},
    }, response.res);

    expect(response.statusCode).toBe(400);
    expect(response.jsonBody).toEqual({ error: 'Invalid role for self-registration.' });
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  describe('promote action', () => {
    const promoteReq = {
      method: 'POST',
      body: { action: 'promote' },
      query: {},
    };

    it('accepts the admin key via the x-admin-key request header', async () => {
      sqlMock.mockResolvedValue({ rows: [PROMOTED_ACCOUNT] });
      const mod = await import('../../../api/auth');
      const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
      const response = createResponse();

      await handler({ ...promoteReq, headers: { 'x-admin-key': 'secret-admin-key' } }, response.res);

      expect(response.statusCode).toBe(200);
      expect(response.jsonBody).toMatchObject({ user: { role: 'admin' } });
    });

    it('rejects promotion when the key is sent only in the body', async () => {
      const mod = await import('../../../api/auth');
      const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
      const response = createResponse();

      await handler(
        { ...promoteReq, body: { action: 'promote', key: 'secret-admin-key' }, headers: {} },
        response.res,
      );

      expect(response.statusCode).toBe(403);
      expect(response.jsonBody).toEqual({ error: 'Invalid admin access key.' });
      expect(sqlMock).not.toHaveBeenCalled();
    });

    it('rejects an incorrect header key', async () => {
      const mod = await import('../../../api/auth');
      const handler = mod.default as unknown as (req: unknown, res: unknown) => Promise<void>;
      const response = createResponse();

      await handler({ ...promoteReq, headers: { 'x-admin-key': 'wrong-key' } }, response.res);

      expect(response.statusCode).toBe(403);
      expect(response.jsonBody).toEqual({ error: 'Invalid admin access key.' });
      expect(sqlMock).not.toHaveBeenCalled();
    });
  });
});
