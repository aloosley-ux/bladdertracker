import type {
  AuditEvent,
  BowelEntry,
  CaregiverInvite,
  Child,
  DrinkEntry,
  FoodEntry,
  ImportedDiaryPayload,
  ImportSummary,
  MedicationEntry,
  Milestone,
  ModuleId,
  MoodEntry,
  NotificationItem,
  RoutineEntry,
  ReminderPreference,
  SensoryEntry,
  SleepEntry,
  TherapyEntry,
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

export async function apiPromoteToAdmin(key: string): Promise<User> {
  const { user } = await request<{ user: User }>('/auth', {
    method: 'POST',
    body: JSON.stringify({ action: 'promote', key }),
  });
  return user;
}

// Children
export async function apiGetChildren(): Promise<Child[]> {
  const { children } = await request<{ children: Child[] }>('/children');
  return children;
}

export async function apiAddChild(name: string, dateOfBirth?: string, dueDate?: string): Promise<Child> {
  const { child } = await request<{ child: Child }>('/children', {
    method: 'POST',
    body: JSON.stringify({ name, dateOfBirth, dueDate }),
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
export async function apiGetAuditEvents(subject?: string): Promise<AuditEvent[]> {
  const path = subject ? `/audit?subject=${encodeURIComponent(subject)}` : '/audit';
  const { events } = await request<{ events: AuditEvent[] }>(path);
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

// ── New Modules (mood, sensory, medication, therapy, routine, milestones) ──

// Mood
export async function apiGetMoodEntries(): Promise<MoodEntry[]> {
  const { entries } = await request<{ entries: MoodEntry[] }>('/modules?type=mood');
  return entries;
}

export async function apiAddMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'mood' }),
  });
  return id;
}

export async function apiUpdateMoodEntry(entry: MoodEntry): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'mood' }) });
}

export async function apiDeleteMoodEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=mood&id=${id}`, { method: 'DELETE' });
}

// Sensory
export async function apiGetSensoryEntries(): Promise<SensoryEntry[]> {
  const { entries } = await request<{ entries: SensoryEntry[] }>('/modules?type=sensory');
  return entries;
}

export async function apiAddSensoryEntry(entry: Omit<SensoryEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'sensory' }),
  });
  return id;
}

export async function apiUpdateSensoryEntry(entry: SensoryEntry): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'sensory' }) });
}

export async function apiDeleteSensoryEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=sensory&id=${id}`, { method: 'DELETE' });
}

// Medication
export async function apiGetMedicationEntries(): Promise<MedicationEntry[]> {
  const { entries } = await request<{ entries: MedicationEntry[] }>('/modules?type=medication');
  return entries;
}

export async function apiAddMedicationEntry(entry: Omit<MedicationEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'medication' }),
  });
  return id;
}

export async function apiUpdateMedicationEntry(entry: MedicationEntry): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'medication' }) });
}

export async function apiDeleteMedicationEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=medication&id=${id}`, { method: 'DELETE' });
}

// Therapy
export async function apiGetTherapyEntries(): Promise<TherapyEntry[]> {
  const { entries } = await request<{ entries: TherapyEntry[] }>('/modules?type=therapy');
  return entries;
}

export async function apiAddTherapyEntry(entry: Omit<TherapyEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'therapy' }),
  });
  return id;
}

export async function apiUpdateTherapyEntry(entry: TherapyEntry): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'therapy' }) });
}

export async function apiDeleteTherapyEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=therapy&id=${id}`, { method: 'DELETE' });
}

// Routine
export async function apiGetRoutineEntries(): Promise<RoutineEntry[]> {
  const { entries } = await request<{ entries: RoutineEntry[] }>('/modules?type=routine');
  return entries;
}

export async function apiAddRoutineEntry(entry: Omit<RoutineEntry, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...entry, trackerType: 'routine' }),
  });
  return id;
}

export async function apiUpdateRoutineEntry(entry: RoutineEntry): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...entry, trackerType: 'routine' }) });
}

export async function apiDeleteRoutineEntry(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=routine&id=${id}`, { method: 'DELETE' });
}

// Milestones
export async function apiGetMilestones(): Promise<Milestone[]> {
  const { entries } = await request<{ entries: Milestone[] }>('/modules?type=milestones');
  return entries;
}

export async function apiAddMilestone(milestone: Omit<Milestone, 'id' | 'createdBy' | 'createdAt'>): Promise<string> {
  const { id } = await request<{ id: string }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ ...milestone, trackerType: 'milestones' }),
  });
  return id;
}

export async function apiUpdateMilestone(milestone: Milestone): Promise<void> {
  await request<{ ok: boolean }>('/modules', { method: 'PUT', body: JSON.stringify({ ...milestone, trackerType: 'milestones' }) });
}

export async function apiDeleteMilestone(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/modules?type=milestones&id=${id}`, { method: 'DELETE' });
}

// Enabled Modules
export async function apiGetEnabledModules(childId: string): Promise<ModuleId[]> {
  const { modules } = await request<{ modules: ModuleId[] }>(`/modules?type=enabled_modules&childId=${childId}`);
  return modules;
}

export async function apiSetEnabledModules(childId: string, modules: ModuleId[]): Promise<void> {
  await request<{ ok: boolean }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ action: 'set_enabled_modules', childId, modules }),
  });
}

export async function apiGetReminderPreferences(childId?: string): Promise<ReminderPreference[]> {
  const suffix = childId ? `&childId=${childId}` : '';
  const { reminders } = await request<{ reminders: ReminderPreference[] }>(`/modules?type=reminder_preferences${suffix}`);
  return reminders;
}

export async function apiSetReminderPreferences(childId: string, reminders: Array<Partial<ReminderPreference> & { moduleId: ReminderPreference['moduleId'] }>): Promise<void> {
  await request<{ ok: boolean }>('/modules', {
    method: 'POST',
    body: JSON.stringify({ action: 'set_reminder_preferences', childId, reminders }),
  });
}

export async function apiDeleteAccount(): Promise<void> {
  await request<{ ok: boolean }>('/auth', { method: 'DELETE' });
}
