import type {
  AccountRecord,
  AuditEvent,
  BowelEntry,
  CaregiverInvite,
  Child,
  DrinkEntry,
  EnabledModules,
  FoodEntry,
  ImportSummary,
  ImportedDiaryPayload,
  MedicationEntry,
  Milestone,
  ModuleId,
  MoodEntry,
  NotificationItem,
  ReminderPreference,
  RoutineEntry,
  SensoryEntry,
  SleepEntry,
  TherapyEntry,
  ToiletAttemptEntry,
  UrineEntry,
  User,
} from '../types';
import { DEFAULT_MODULES } from '../types';

const STORAGE_KEYS = {
  USER: 'bt_user',
  ACCOUNTS: 'bt_accounts',
  CHILDREN: 'bt_children',
  DRINKS: 'bt_drinks',
  URINE: 'bt_urine',
  BOWEL: 'bt_bowel',
  SLEEP: 'bt_sleep',
  TOILET_ATTEMPTS: 'bt_toilet_attempts',
  FOOD: 'bt_food',
  MOOD: 'bt_mood',
  SENSORY: 'bt_sensory',
  MEDICATION: 'bt_medication',
  THERAPY: 'bt_therapy',
  ROUTINE: 'bt_routine',
  MILESTONES: 'bt_milestones',
  ENABLED_MODULES: 'bt_enabled_modules',
  INVITES: 'bt_invites',
  NOTIFICATIONS: 'bt_notifications',
  REMINDER_PREFERENCES: 'bt_reminder_preferences',
  AUDIT: 'bt_audit',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function matchesChildId(childIds: string[] | undefined, childId: string): boolean {
  return !childIds || childIds.includes(childId);
}

function getAccessibleChildIds(userId?: string): string[] {
  if (!userId) return [];
  return getChildren(userId).map((child) => child.id);
}

export function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function clearAllAppData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// Accounts & session
export function getAccounts(): AccountRecord[] {
  return getItem<AccountRecord[]>(STORAGE_KEYS.ACCOUNTS, []);
}

export function setAccounts(accounts: AccountRecord[]): void {
  setItem(STORAGE_KEYS.ACCOUNTS, accounts);
}

export function findAccountByEmail(email: string): AccountRecord | null {
  const account = getAccounts().find((item) => normaliseEmail(item.email) === normaliseEmail(email));
  return account ?? null;
}

export function getAccountById(userId: string): AccountRecord | null {
  const account = getAccounts().find((item) => item.id === userId);
  return account ?? null;
}

export function registerAccount(account: AccountRecord): void {
  const accounts = getAccounts();
  accounts.push({ ...account, email: normaliseEmail(account.email) });
  setAccounts(accounts);
}

export function updateAccountPassword(userId: string, passwordHash: string, passwordSalt: string): User | null {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex((account) => account.id === userId);
  if (accountIndex === -1) return null;

  accounts[accountIndex] = {
    ...accounts[accountIndex],
    passwordHash,
    passwordSalt,
  };
  setAccounts(accounts);
  return toUser(accounts[accountIndex]);
}

export function toUser(account: AccountRecord): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatar: account.avatar,
    createdAt: account.createdAt,
  };
}

export function getUser(): User | null {
  const sessionUser = getItem<User | null>(STORAGE_KEYS.USER, null);
  if (!sessionUser) return null;

  const account = getAccountById(sessionUser.id);
  if (!account) {
    clearUser();
    return null;
  }

  return toUser(account);
}

export function setUser(user: User): void {
  setItem(STORAGE_KEYS.USER, user);
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Children
export function getChildren(userId?: string): Child[] {
  const children = getItem<Child[]>(STORAGE_KEYS.CHILDREN, []);
  if (!userId) return children;

  return children.filter(
    (child) =>
      child.createdBy === userId ||
      child.parentIds.includes(userId) ||
      child.caregivers.includes(userId)
  );
}

export function setChildren(children: Child[]): void {
  setItem(STORAGE_KEYS.CHILDREN, children);
}

export function addChild(child: Child): void {
  const children = getChildren();
  children.push(child);
  setChildren(children);
}

export function updateChild(child: Child): void {
  const children = getChildren();
  const index = children.findIndex((item) => item.id === child.id);
  if (index !== -1) {
    children[index] = child;
    setChildren(children);
  }
}

// Diary entries
export function getDrinks(childFilter?: string | string[]): DrinkEntry[] {
  const drinks = getItem<DrinkEntry[]>(STORAGE_KEYS.DRINKS, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return drinks.filter((drink) => matchesChildId(childIds, drink.childId));
}

export function addDrink(drink: DrinkEntry): void {
  const drinks = getDrinks();
  drinks.push(drink);
  setItem(STORAGE_KEYS.DRINKS, drinks);
}

export function updateDrink(drink: DrinkEntry): void {
  const drinks = getDrinks();
  const index = drinks.findIndex((entry) => entry.id === drink.id);
  if (index !== -1) {
    drinks[index] = drink;
    setItem(STORAGE_KEYS.DRINKS, drinks);
  }
}

export function deleteDrink(id: string): void {
  setItem(STORAGE_KEYS.DRINKS, getDrinks().filter((drink) => drink.id !== id));
}

export function getUrineEntries(childFilter?: string | string[]): UrineEntry[] {
  const entries = getItem<UrineEntry[]>(STORAGE_KEYS.URINE, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addUrineEntry(entry: UrineEntry): void {
  const entries = getUrineEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.URINE, entries);
}

export function updateUrineEntry(entry: UrineEntry): void {
  const entries = getUrineEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.URINE, entries);
  }
}

export function deleteUrineEntry(id: string): void {
  setItem(STORAGE_KEYS.URINE, getUrineEntries().filter((entry) => entry.id !== id));
}

export function getBowelEntries(childFilter?: string | string[]): BowelEntry[] {
  const entries = getItem<BowelEntry[]>(STORAGE_KEYS.BOWEL, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addBowelEntry(entry: BowelEntry): void {
  const entries = getBowelEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.BOWEL, entries);
}

export function updateBowelEntry(entry: BowelEntry): void {
  const entries = getBowelEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.BOWEL, entries);
  }
}

export function deleteBowelEntry(id: string): void {
  setItem(STORAGE_KEYS.BOWEL, getBowelEntries().filter((entry) => entry.id !== id));
}

// Sleep entries
export function getSleepEntries(childFilter?: string | string[]): SleepEntry[] {
  const entries = getItem<SleepEntry[]>(STORAGE_KEYS.SLEEP, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addSleepEntry(entry: SleepEntry): void {
  const entries = getSleepEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.SLEEP, entries);
}

export function updateSleepEntry(entry: SleepEntry): void {
  const entries = getSleepEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.SLEEP, entries);
  }
}

export function deleteSleepEntry(id: string): void {
  setItem(STORAGE_KEYS.SLEEP, getSleepEntries().filter((entry) => entry.id !== id));
}

// Toilet attempt entries
export function getToiletAttemptEntries(childFilter?: string | string[]): ToiletAttemptEntry[] {
  const entries = getItem<ToiletAttemptEntry[]>(STORAGE_KEYS.TOILET_ATTEMPTS, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addToiletAttemptEntry(entry: ToiletAttemptEntry): void {
  const entries = getToiletAttemptEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.TOILET_ATTEMPTS, entries);
}

export function updateToiletAttemptEntry(entry: ToiletAttemptEntry): void {
  const entries = getToiletAttemptEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.TOILET_ATTEMPTS, entries);
  }
}

export function deleteToiletAttemptEntry(id: string): void {
  setItem(STORAGE_KEYS.TOILET_ATTEMPTS, getToiletAttemptEntries().filter((entry) => entry.id !== id));
}

// Food entries
export function getFoodEntries(childFilter?: string | string[]): FoodEntry[] {
  const entries = getItem<FoodEntry[]>(STORAGE_KEYS.FOOD, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addFoodEntry(entry: FoodEntry): void {
  const entries = getFoodEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.FOOD, entries);
}

export function updateFoodEntry(entry: FoodEntry): void {
  const entries = getFoodEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.FOOD, entries);
  }
}

export function deleteFoodEntry(id: string): void {
  setItem(STORAGE_KEYS.FOOD, getFoodEntries().filter((entry) => entry.id !== id));
}

// Mood entries
export function getMoodEntries(childFilter?: string | string[]): MoodEntry[] {
  const entries = getItem<MoodEntry[]>(STORAGE_KEYS.MOOD, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.MOOD, entries);
}

export function updateMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.MOOD, entries);
  }
}

export function deleteMoodEntry(id: string): void {
  setItem(STORAGE_KEYS.MOOD, getMoodEntries().filter((entry) => entry.id !== id));
}

// Sensory entries
export function getSensoryEntries(childFilter?: string | string[]): SensoryEntry[] {
  const entries = getItem<SensoryEntry[]>(STORAGE_KEYS.SENSORY, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addSensoryEntry(entry: SensoryEntry): void {
  const entries = getSensoryEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.SENSORY, entries);
}

export function updateSensoryEntry(entry: SensoryEntry): void {
  const entries = getSensoryEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.SENSORY, entries);
  }
}

export function deleteSensoryEntry(id: string): void {
  setItem(STORAGE_KEYS.SENSORY, getSensoryEntries().filter((entry) => entry.id !== id));
}

// Medication entries
export function getMedicationEntries(childFilter?: string | string[]): MedicationEntry[] {
  const entries = getItem<MedicationEntry[]>(STORAGE_KEYS.MEDICATION, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addMedicationEntry(entry: MedicationEntry): void {
  const entries = getMedicationEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.MEDICATION, entries);
}

export function updateMedicationEntry(entry: MedicationEntry): void {
  const entries = getMedicationEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.MEDICATION, entries);
  }
}

export function deleteMedicationEntry(id: string): void {
  setItem(STORAGE_KEYS.MEDICATION, getMedicationEntries().filter((entry) => entry.id !== id));
}

// Therapy entries
export function getTherapyEntries(childFilter?: string | string[]): TherapyEntry[] {
  const entries = getItem<TherapyEntry[]>(STORAGE_KEYS.THERAPY, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addTherapyEntry(entry: TherapyEntry): void {
  const entries = getTherapyEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.THERAPY, entries);
}

export function updateTherapyEntry(entry: TherapyEntry): void {
  const entries = getTherapyEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.THERAPY, entries);
  }
}

export function deleteTherapyEntry(id: string): void {
  setItem(STORAGE_KEYS.THERAPY, getTherapyEntries().filter((entry) => entry.id !== id));
}

// Routine entries
export function getRoutineEntries(childFilter?: string | string[]): RoutineEntry[] {
  const entries = getItem<RoutineEntry[]>(STORAGE_KEYS.ROUTINE, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return entries.filter((entry) => matchesChildId(childIds, entry.childId));
}

export function addRoutineEntry(entry: RoutineEntry): void {
  const entries = getRoutineEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.ROUTINE, entries);
}

export function updateRoutineEntry(entry: RoutineEntry): void {
  const entries = getRoutineEntries();
  const index = entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    setItem(STORAGE_KEYS.ROUTINE, entries);
  }
}

export function deleteRoutineEntry(id: string): void {
  setItem(STORAGE_KEYS.ROUTINE, getRoutineEntries().filter((entry) => entry.id !== id));
}

// Milestones
export function getMilestones(childFilter?: string | string[]): Milestone[] {
  const milestones = getItem<Milestone[]>(STORAGE_KEYS.MILESTONES, []);
  const childIds = typeof childFilter === 'string' ? [childFilter] : childFilter;
  return milestones.filter((m) => matchesChildId(childIds, m.childId));
}

export function addMilestone(milestone: Milestone): void {
  const milestones = getMilestones();
  milestones.push(milestone);
  setItem(STORAGE_KEYS.MILESTONES, milestones);
}

export function updateMilestone(milestone: Milestone): void {
  const milestones = getMilestones();
  const index = milestones.findIndex((m) => m.id === milestone.id);
  if (index !== -1) {
    milestones[index] = milestone;
    setItem(STORAGE_KEYS.MILESTONES, milestones);
  }
}

export function deleteMilestone(id: string): void {
  setItem(STORAGE_KEYS.MILESTONES, getMilestones().filter((m) => m.id !== id));
}

// Module registry — per-child enabled modules
export function getEnabledModules(childId: string): ModuleId[] {
  const all = getItem<EnabledModules[]>(STORAGE_KEYS.ENABLED_MODULES, []);
  const record = all.find((r) => r.childId === childId);
  if (record) return record.modules;
  return DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id);
}

export function setEnabledModules(childId: string, modules: ModuleId[]): void {
  const all = getItem<EnabledModules[]>(STORAGE_KEYS.ENABLED_MODULES, []);
  const index = all.findIndex((r) => r.childId === childId);
  if (index !== -1) {
    all[index] = { childId, modules };
  } else {
    all.push({ childId, modules });
  }
  setItem(STORAGE_KEYS.ENABLED_MODULES, all);
}

// Remove child
export function removeChild(childId: string): void {
  const children = getChildren();
  setChildren(children.filter((child) => child.id !== childId));
  // Remove associated entries
  setItem(STORAGE_KEYS.DRINKS, getDrinks().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.URINE, getUrineEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.BOWEL, getBowelEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.SLEEP, getSleepEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.TOILET_ATTEMPTS, getToiletAttemptEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.FOOD, getFoodEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.MOOD, getMoodEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.SENSORY, getSensoryEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.MEDICATION, getMedicationEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.THERAPY, getTherapyEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.ROUTINE, getRoutineEntries().filter((e) => e.childId !== childId));
  setItem(STORAGE_KEYS.MILESTONES, getMilestones().filter((m) => m.childId !== childId));
}

// Invites
export function getInvites(user?: User | null): CaregiverInvite[] {
  const invites = getItem<CaregiverInvite[]>(STORAGE_KEYS.INVITES, []);
  if (!user) return invites;

  return invites.filter(
    (invite) =>
      invite.invitedBy === user.id || normaliseEmail(invite.email) === normaliseEmail(user.email)
  );
}

export function getPendingInvitesByEmail(email: string): CaregiverInvite[] {
  return getInvites().filter(
    (invite) =>
      invite.status === 'pending' && normaliseEmail(invite.email) === normaliseEmail(email)
  );
}

export function createInvite({
  childId,
  childName,
  email,
  role,
  invitedBy,
}: {
  childId: string;
  childName: string;
  email: string;
  role: User['role'];
  invitedBy: string;
}): CaregiverInvite {
  const token = generateId();
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;

  const invite: CaregiverInvite = {
    id: generateId(),
    childId,
    childName,
    email: normaliseEmail(email),
    role,
    status: 'pending',
    invitedBy,
    createdAt: new Date().toISOString(),
    token,
    link: `${window.location.origin}${basePath || ''}/?invite=${token}`,
  };

  const invites = getInvites();
  invites.unshift(invite);
  setItem(STORAGE_KEYS.INVITES, invites);
  return invite;
}

export function acceptInvite(token: string, user: User): CaregiverInvite | null {
  const invites = getInvites();
  const inviteIndex = invites.findIndex(
    (invite) => invite.token === token && invite.status === 'pending'
  );
  if (inviteIndex === -1) return null;

  const invite = invites[inviteIndex];
  if (normaliseEmail(invite.email) !== normaliseEmail(user.email)) return null;

  const allChildren = getChildren();
  const childIndex = allChildren.findIndex((child) => child.id === invite.childId);
  if (childIndex === -1) return null;

  const child = allChildren[childIndex];
  const updatedChild: Child = {
    ...child,
    parentIds:
      invite.role === 'parent'
        ? Array.from(new Set([...child.parentIds, user.id]))
        : child.parentIds,
    caregivers:
      invite.role === 'parent'
        ? child.caregivers
        : Array.from(new Set([...child.caregivers, user.id])),
    lastUpdatedAt: new Date().toISOString(),
  };

  allChildren[childIndex] = updatedChild;
  setChildren(allChildren);

  const updatedInvite: CaregiverInvite = {
    ...invite,
    status: 'accepted',
    acceptedBy: user.id,
  };
  invites[inviteIndex] = updatedInvite;
  setItem(STORAGE_KEYS.INVITES, invites);

  addNotification({
    userId: invite.invitedBy,
    title: 'Invite accepted',
    message: `${user.name} can now access ${child.name}'s diary as a ${invite.role}.`,
  });
  addNotification({
    userId: user.id,
    title: 'Diary shared',
    message: `You can now access ${child.name}'s diary.`,
  });

  return updatedInvite;
}

// Notifications & audit
export function getNotifications(userId?: string): NotificationItem[] {
  const notifications = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  if (!userId) return notifications;
  return notifications.filter((notification) => notification.userId === userId);
}

export function addNotification({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}): NotificationItem {
  const notification: NotificationItem = {
    id: generateId(),
    userId,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const notifications = getNotifications();
  notifications.unshift(notification);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return notification;
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications();
  const index = notifications.findIndex((notification) => notification.id === id);
  if (index !== -1) {
    notifications[index] = { ...notifications[index], read: true };
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

export function getReminderPreferences(userId?: string): ReminderPreference[] {
  const entries = getItem<ReminderPreference[]>(STORAGE_KEYS.REMINDER_PREFERENCES, []);
  if (!userId) return entries;
  return entries.filter((entry) => entry.userId === userId);
}

export function setReminderPreferences(preferences: ReminderPreference[]): void {
  setItem(STORAGE_KEYS.REMINDER_PREFERENCES, preferences);
}

export function upsertReminderPreference(entry: ReminderPreference): void {
  const preferences = getReminderPreferences();
  const index = preferences.findIndex((item) => item.id === entry.id);
  if (index >= 0) {
    preferences[index] = entry;
  } else {
    preferences.push(entry);
  }
  setReminderPreferences(preferences);
}

export function getAuditEvents(userId?: string): AuditEvent[] {
  const events = getItem<AuditEvent[]>(STORAGE_KEYS.AUDIT, []);
  if (!userId) return events;
  return events.filter((event) => event.userId === userId);
}

export function addAuditEvent({
  userId,
  action,
  subject,
  detail,
}: {
  userId: string;
  action: string;
  subject: string;
  detail: string;
}): AuditEvent {
  const event: AuditEvent = {
    id: generateId(),
    userId,
    action,
    subject,
    detail,
    createdAt: new Date().toISOString(),
  };

  const events = getAuditEvents();
  events.unshift(event);
  setItem(STORAGE_KEYS.AUDIT, events);
  return event;
}

// Admin management
export function getAllAccounts(): AccountRecord[] {
  return getAccounts();
}

export function updateAccountRole(userId: string, newRole: User['role']): User | null {
  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return null;
  accounts[index] = { ...accounts[index], role: newRole };
  setAccounts(accounts);
  return toUser(accounts[index]);
}

export function deleteAccount(userId: string): boolean {
  const accounts = getAccounts();
  const filtered = accounts.filter((a) => a.id !== userId);
  if (filtered.length === accounts.length) return false;
  setAccounts(filtered);
  return true;
}

export function promoteToAdmin(userId: string): User | null {
  return updateAccountRole(userId, 'admin');
}

// Import & export
export function importDiaryPayload(payload: ImportedDiaryPayload, childId: string, userId: string): ImportSummary {
  const summary: ImportSummary = {
    drinks: 0,
    urineEntries: 0,
    bowelEntries: 0,
    sleepEntries: 0,
    toiletAttemptEntries: 0,
    foodEntries: 0,
    moodEntries: 0,
    sensoryEntries: 0,
    medicationEntries: 0,
    therapyEntries: 0,
    routineEntries: 0,
    errors: [],
  };

  payload.drinks?.forEach((entry, index) => {
    if (!entry.date || !entry.time || typeof entry.amountMl !== 'number') {
      summary.errors.push(`Drink data row ${index + 1} is missing date, time, or amount.`);
      return;
    }

    addDrink({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      type: entry.type ?? 'cup',
      amountMl: entry.amountMl,
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.drinks += 1;
  });

  payload.urineEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Urine data row ${index + 1} is missing date or time.`);
      return;
    }

    addUrineEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      wet: Boolean(entry.wet),
      pass: Boolean(entry.pass),
      volumeMl: entry.volumeMl ?? null,
      urgency: entry.urgency ?? null,
      leakageAmount: entry.leakageAmount ?? null,
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.urineEntries += 1;
  });

  payload.bowelEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Bowel data row ${index + 1} is missing date or time.`);
      return;
    }

    addBowelEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      location: entry.location ?? 'toilet',
      amount: entry.amount ?? 'M',
      bristolType: entry.bristolType ?? 4,
      laxativesGiven: Boolean(entry.laxativesGiven),
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.bowelEntries += 1;
  });

  payload.sleepEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Sleep data row ${index + 1} is missing date or time.`);
      return;
    }

    addSleepEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      eventType: entry.eventType ?? 'onset',
      durationMinutes: entry.durationMinutes ?? null,
      quality: entry.quality ?? null,
      nighttimeEvent: Boolean(entry.nighttimeEvent),
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.sleepEntries += 1;
  });

  payload.toiletAttemptEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Toilet attempt row ${index + 1} is missing date or time.`);
      return;
    }

    addToiletAttemptEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      outcome: entry.outcome ?? 'no_event',
      supervised: Boolean(entry.supervised),
      prompted: Boolean(entry.prompted),
      durationMinutes: entry.durationMinutes ?? null,
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.toiletAttemptEntries += 1;
  });

  payload.foodEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Food data row ${index + 1} is missing date or time.`);
      return;
    }

    addFoodEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      mealType: entry.mealType ?? 'snack',
      description: entry.description ?? '',
      portions: entry.portions ?? null,
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.foodEntries += 1;
  });

  return summary;
}

export function exportToCSV(childId: string, childName: string): string {
  const drinks = getDrinks(childId);
  const urine = getUrineEntries(childId);
  const bowel = getBowelEntries(childId);
  const sleep = getSleepEntries(childId);
  const toiletAttempts = getToiletAttemptEntries(childId);
  const food = getFoodEntries(childId);
  const mood = getMoodEntries(childId);
  const sensory = getSensoryEntries(childId);
  const medication = getMedicationEntries(childId);
  const therapy = getTherapyEntries(childId);
  const routine = getRoutineEntries(childId);
  const milestones = getMilestones(childId);

  let csv = `Development Tracker Export for ${childName}\n`;
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  csv += 'DRINKS\n';
  csv += 'Date,Time,Type,Amount (ml),Notes\n';
  drinks.forEach((drink) => {
    csv += `${drink.date},${drink.time},${drink.type},${drink.amountMl},"${drink.notes}"\n`;
  });

  csv += '\nURINE EVENTS\n';
  csv += 'Date,Time,Wet,Pass,Volume (ml),Urgency,Leakage,Notes\n';
  urine.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.wet},${entry.pass},${entry.volumeMl ?? ''},${entry.urgency ?? ''},${entry.leakageAmount ?? ''},"${entry.notes}"\n`;
  });

  csv += '\nBOWEL EVENTS\n';
  csv += 'Date,Time,Location,Amount,Bristol Type,Laxatives,Notes\n';
  bowel.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.location},${entry.amount},Type ${entry.bristolType},${entry.laxativesGiven},"${entry.notes}"\n`;
  });

  csv += '\nSLEEP EVENTS\n';
  csv += 'Date,Time,Event Type,Duration (min),Quality,Nighttime Event,Notes\n';
  sleep.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.eventType},${entry.durationMinutes ?? ''},${entry.quality ?? ''},${entry.nighttimeEvent ?? ''},"${entry.notes}"\n`;
  });

  csv += '\nTOILET ATTEMPTS\n';
  csv += 'Date,Time,Outcome,Supervised,Prompted,Duration (min),Notes\n';
  toiletAttempts.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.outcome},${entry.supervised},${entry.prompted},${entry.durationMinutes ?? ''},"${entry.notes}"\n`;
  });

  csv += '\nFOOD ENTRIES\n';
  csv += 'Date,Time,Meal Type,Description,Portions,Notes\n';
  food.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.mealType},"${entry.description}",${entry.portions ?? ''},"${entry.notes}"\n`;
  });

  csv += '\nMOOD ENTRIES\n';
  csv += 'Date,Time,Level (1-5),Triggers,Notes\n';
  mood.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.level},"${entry.triggers}","${entry.notes}"\n`;
  });

  csv += '\nSENSORY ENTRIES\n';
  csv += 'Date,Time,Type,Response,Intensity (1-5),Notes\n';
  sensory.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.sensoryType},${entry.response},${entry.intensity},"${entry.notes}"\n`;
  });

  csv += '\nMEDICATION ENTRIES\n';
  csv += 'Date,Time,Name,Dosage,Administered,Notes\n';
  medication.forEach((entry) => {
    csv += `${entry.date},${entry.time},"${entry.name}","${entry.dosage}",${entry.administered},"${entry.notes}"\n`;
  });

  csv += '\nTHERAPY ENTRIES\n';
  csv += 'Date,Time,Type,Provider,Duration (min),Goals,Notes\n';
  therapy.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.therapyType},"${entry.provider}",${entry.durationMinutes},"${entry.goals}","${entry.notes}"\n`;
  });

  csv += '\nROUTINE ENTRIES\n';
  csv += 'Date,Time,Routine,Completed,Duration (min),Notes\n';
  routine.forEach((entry) => {
    csv += `${entry.date},${entry.time},"${entry.routineName}",${entry.completed},${entry.durationMinutes ?? ''},"${entry.notes}"\n`;
  });

  csv += '\nMILESTONES\n';
  csv += 'Name,Category,Status,Date Achieved,Description,Notes\n';
  milestones.forEach((m) => {
    csv += `"${m.name}",${m.category},${m.status},${m.dateAchieved ?? ''},"${m.description}","${m.notes}"\n`;
  });

  return csv;
}

export function downloadCSV(childId: string, childName: string): void {
  const csv = exportToCSV(childId, childName);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `bladder-diary-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function getAccessibleEntryCounts(userId?: string): { drinks: number; urineEntries: number; bowelEntries: number } {
  const childIds = getAccessibleChildIds(userId);
  return {
    drinks: getDrinks(childIds).length,
    urineEntries: getUrineEntries(childIds).length,
    bowelEntries: getBowelEntries(childIds).length,
  };
}
