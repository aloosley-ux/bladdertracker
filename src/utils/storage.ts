import type {
  AccountRecord,
  AuditEvent,
  BowelEntry,
  CaregiverInvite,
  Child,
  DrinkEntry,
  ImportSummary,
  ImportedDiaryPayload,
  NotificationItem,
  UrineEntry,
  User,
} from '../types';

const STORAGE_KEYS = {
  USER: 'bt_user',
  ACCOUNTS: 'bt_accounts',
  CHILDREN: 'bt_children',
  DRINKS: 'bt_drinks',
  URINE: 'bt_urine',
  BOWEL: 'bt_bowel',
  INVITES: 'bt_invites',
  NOTIFICATIONS: 'bt_notifications',
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

function normaliseEmail(email: string): string {
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
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
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
    link: `${window.location.origin}${window.location.pathname}?invite=${token}`,
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

// Import & export
export function importDiaryPayload(payload: ImportedDiaryPayload, childId: string, userId: string): ImportSummary {
  const summary: ImportSummary = {
    drinks: 0,
    urineEntries: 0,
    bowelEntries: 0,
    errors: [],
  };

  payload.drinks?.forEach((entry, index) => {
    if (!entry.date || !entry.time || typeof entry.amountMl !== 'number') {
      summary.errors.push(`Drink row ${index + 1} is missing date, time, or amount.`);
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
      summary.errors.push(`Urine row ${index + 1} is missing date or time.`);
      return;
    }

    addUrineEntry({
      id: generateId(),
      childId,
      date: entry.date,
      time: entry.time,
      wet: Boolean(entry.wet),
      pass: Boolean(entry.pass),
      notes: entry.notes ?? '',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    summary.urineEntries += 1;
  });

  payload.bowelEntries?.forEach((entry, index) => {
    if (!entry.date || !entry.time) {
      summary.errors.push(`Bowel row ${index + 1} is missing date or time.`);
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

  return summary;
}

export function exportToCSV(childId: string, childName: string): string {
  const drinks = getDrinks(childId);
  const urine = getUrineEntries(childId);
  const bowel = getBowelEntries(childId);

  let csv = `Bladder & Bowel Diary Export for ${childName}\n`;
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  csv += 'DRINKS\n';
  csv += 'Date,Time,Type,Amount (ml),Notes\n';
  drinks.forEach((drink) => {
    csv += `${drink.date},${drink.time},${drink.type},${drink.amountMl},"${drink.notes}"\n`;
  });

  csv += '\nURINE EVENTS\n';
  csv += 'Date,Time,Wet,Pass,Notes\n';
  urine.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.wet},${entry.pass},"${entry.notes}"\n`;
  });

  csv += '\nBOWEL EVENTS\n';
  csv += 'Date,Time,Location,Amount,Bristol Type,Laxatives,Notes\n';
  bowel.forEach((entry) => {
    csv += `${entry.date},${entry.time},${entry.location},${entry.amount},Type ${entry.bristolType},${entry.laxativesGiven},"${entry.notes}"\n`;
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
