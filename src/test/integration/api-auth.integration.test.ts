import { describe, it, expect } from 'vitest';

const BASE_URL = 'https://bladdertracker-git-testing-aloosley-uxs-projects.vercel.app/api';
// This test intentionally reaches a deployed environment and may fail in isolated
// CI or sandbox environments where that hostname is unavailable.

// Helper to make requests
async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

describe('API Integration: /api/auth', () => {
  it('should return 401 when not authenticated', async () => {
    const { status, data } = await apiRequest('/auth', { method: 'GET' });
    expect(status).toBe(401);
    if (typeof data === 'object' && data !== null) {
      // JSON error response
      expect(data).toHaveProperty('error');
      expect(String(data.error).toLowerCase()).toMatch(/not authenticated|access denied/);
    } else if (typeof data === 'string') {
      // HTML error page
      expect(data).toMatch(/<!doctype html>|<html/i);
    } else {
      throw new Error('Unexpected error response format');
    }
  });

  // Add more integration tests here as needed
});
