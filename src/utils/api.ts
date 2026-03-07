import type {
  AuditEvent,
  BowelEntry,
  CaregiverInvite,
  Child,
  DrinkEntry,
  FoodEntry,
  ImportedDiaryPayload,
  ImportSummary,
  NotificationItem,
  SleepEntry,
  ToiletAttemptEntry,
  UrineEntry,
  User,
  UserRole,
} from '../types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Request failed (${res.status})`, res.status);
  }
  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Auth
export async function apiRegister(name: string, email: string, password: string, role: UserRole): Promise<User> {
  const { user } = await request<{ user: User }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'register', name, email, password, role }),
  });
  return user;
}

export async function apiLogin(email: string, password: string): Promise<User> {
  const { user } = await request<{ user: User }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  });
  return user;
}

export async function apiLogout(): Promise<void> {
  await request<{ ok: boolean }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'logout' }),
  });
}

export async function apiGetSession(): Promise<User | null> {
  const { user } = await request<{ user: User | null }>('/auth');
  return user;
}

export async function apiResetPassword(email: string, password: string): Promise<User> {
  const { user } = await request<{ user: User }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'reset', email, password }),
  });
  return user;
}

// Children
export async function apiGetChildren(): Promise<Child[]> {
  const { children } = await request<{ children: Child[] }>('/children');
  return children;
}

export async function apiAddChild(name: string, dateOfBirth?: string): Promise<Child> {
  const { child } = await request<{ child: Child }>('/children', {
    method: 'POST',
    body: JSON.stringify({ name, dateOfBirth }),
  });
  return child;
}

export async function apiUpdateChild(child: Partial<Child> & { id: string }): Promise<void> {
  await request<{ ok: boolean }>('/children', {
    method: 'PUT',
    body: JSON.stringify(child),
  });
}

export async function apiDeleteChild(childId: string): Promise<void> {
  await request<{ ok: boolean }>(`/children?id=${childId}`, { method: 'DELETE' });
}

// Drinks
export async function apiGetDrinks(): Promise<DrinkEntry[]> {
  const { drinks } = await request<{ drinks: DrinkEntry[] }>('/drinks');
  return drinks;
}

export async function apiAddDrink(drink: Omit<DrinkEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/drinks', {
    method: 'POST',
    body: JSON.stringify(drink),
  });
  return id;
}

export async function apiUpdateDrink(drink: DrinkEntry): Promise<void> {
  await request<{ ok: boolean }>('/drinks', { method: 'PUT', body: JSON.stringify(drink) });
}

export async function apiDeleteDrink(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/drinks?id=${id}`, { method: 'DELETE' });
}

// Urine
export async function apiGetUrineEntries(): Promise<UrineEntry[]> {
  const { entries } = await request<{ entries: UrineEntry[] }>('/urine');
  return entries;
}

export async function apiAddUrineEntry(entry: Omit<UrineEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/urine', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return id;
}

export async function apiUpdateUrineEntry(entry: UrineEntry): Promise<void> {
  await request<{ ok: boolean }>('/urine', { method: 'PUT', body: JSON.stringify(entry) });
}

export async function apiDeleteUrineEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/urine?id=${id}`, { method: 'DELETE' });
}

// Bowel
export async function apiGetBowelEntries(): Promise<BowelEntry[]> {
  const { entries } = await request<{ entries: BowelEntry[] }>('/bowel');
  return entries;
}

export async function apiAddBowelEntry(entry: Omit<BowelEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/bowel', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
  return id;
}

export async function apiUpdateBowelEntry(entry: BowelEntry): Promise<void> {
  await request<{ ok: boolean }>('/bowel', { method: 'PUT', body: JSON.stringify(entry) });
}

export async function apiDeleteBowelEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/bowel?id=${id}`, { method: 'DELETE' });
}

// Sleep (via consolidated /trackers endpoint — stays within 12 serverless function limit)
export async function apiGetSleepEntries(): Promise<SleepEntry[]> {
  const { entries } = await request<{ entries: SleepEntry[] }>('/trackers?type=sleep');
  return entries;
}

export async function apiAddSleepEntry(entry: Omit<SleepEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/trackers', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'sleep' }),
  });
  return id;
}

export async function apiUpdateSleepEntry(entry: SleepEntry): Promise<void> {
  await request<{ ok: boolean }>('/trackers', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'sleep' }) });
}

export async function apiDeleteSleepEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/trackers?type=sleep&id=${id}`, { method: 'DELETE' });
}

// Toilet Attempts
export async function apiGetToiletAttemptEntries(): Promise<ToiletAttemptEntry[]> {
  const { entries } = await request<{ entries: ToiletAttemptEntry[] }>('/trackers?type=toilet_attempt');
  return entries;
}

export async function apiAddToiletAttemptEntry(entry: Omit<ToiletAttemptEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/trackers', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'toilet_attempt' }),
  });
  return id;
}

export async function apiUpdateToiletAttemptEntry(entry: ToiletAttemptEntry): Promise<void> {
  await request<{ ok: boolean }>('/trackers', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'toilet_attempt' }) });
}

export async function apiDeleteToiletAttemptEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/trackers?type=toilet_attempt&id=${id}`, { method: 'DELETE' });
}

// Food
export async function apiGetFoodEntries(): Promise<FoodEntry[]> {
  const { entries } = await request<{ entries: FoodEntry[] }>('/trackers?type=food');
  return entries;
}

export async function apiAddFoodEntry(entry: Omit<FoodEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/trackers', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'food' }),
  });
  return id;
}

export async function apiUpdateFoodEntry(entry: FoodEntry): Promise<void> {
  await request<{ ok: boolean }>('/trackers', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'food' }) });
}

export async function apiDeleteFoodEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/trackers?type=food&id=${id}`, { method: 'DELETE' });
}

// Invites
export async function apiGetInvites(): Promise<CaregiverInvite[]> {
  const { invites } = await request<{ invites: CaregiverInvite[] }>('/invites');
  return invites;
}

export async function apiCreateInvite(childId: string, email: string, role: UserRole): Promise<CaregiverInvite> {
  const { invite } = await request<{ invite: CaregiverInvite }>('/invites', {
    method: 'POST',
    body: JSON.stringify({ childId, email, role }),
  });
  return invite;
}

export async function apiAcceptInvite(token: string): Promise<{ ok: boolean; childName: string }> {
  return request<{ ok: boolean; childName: string }>('/invites', {
    method: 'POST',
    body: JSON.stringify({ action: 'accept', token }),
  });
}

// Notifications
export async function apiGetNotifications(): Promise<NotificationItem[]> {
  const { notifications } = await request<{ notifications: NotificationItem[] }>('/notifications');
  return notifications;
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await request<{ ok: boolean }>('/notifications', { method: 'PUT', body: JSON.stringify({ id }) });
}

// Audit
export async function apiGetAuditEvents(): Promise<AuditEvent[]> {
  const { events } = await request<{ events: AuditEvent[] }>('/audit');
  return events;
}

// Export
export async function apiExportCSV(childId: string, childName: string): Promise<void> {
  const res = await fetch(`${API_BASE}/data?childId=${childId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `bladder-diary-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// Import
export async function apiImportData(childId: string, payload: ImportedDiaryPayload): Promise<ImportSummary> {
  const { summary } = await request<{ summary: ImportSummary }>('/data', {
    method: 'POST',
    body: JSON.stringify({ childId, ...payload }),
  });
  return summary;
}
