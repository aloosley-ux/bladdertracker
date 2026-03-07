import type { DrinkEntry, UrineEntry, BowelEntry, User, Child } from '../types';

const STORAGE_KEYS = {
  USER: 'bt_user',
  CHILDREN: 'bt_children',
  DRINKS: 'bt_drinks',
  URINE: 'bt_urine',
  BOWEL: 'bt_bowel',
  INVITES: 'bt_invites',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// User
export function getUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.USER, null);
}

export function setUser(user: User): void {
  setItem(STORAGE_KEYS.USER, user);
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Children
export function getChildren(): Child[] {
  return getItem<Child[]>(STORAGE_KEYS.CHILDREN, []);
}

export function setChildren(children: Child[]): void {
  setItem(STORAGE_KEYS.CHILDREN, children);
}

export function addChild(child: Child): void {
  const children = getChildren();
  children.push(child);
  setChildren(children);
}

// Drinks
export function getDrinks(childId?: string): DrinkEntry[] {
  const drinks = getItem<DrinkEntry[]>(STORAGE_KEYS.DRINKS, []);
  return childId ? drinks.filter(d => d.childId === childId) : drinks;
}

export function addDrink(drink: DrinkEntry): void {
  const drinks = getDrinks();
  drinks.push(drink);
  setItem(STORAGE_KEYS.DRINKS, drinks);
}

export function updateDrink(drink: DrinkEntry): void {
  const drinks = getDrinks();
  const idx = drinks.findIndex(d => d.id === drink.id);
  if (idx !== -1) {
    drinks[idx] = drink;
    setItem(STORAGE_KEYS.DRINKS, drinks);
  }
}

export function deleteDrink(id: string): void {
  const drinks = getDrinks().filter(d => d.id !== id);
  setItem(STORAGE_KEYS.DRINKS, drinks);
}

// Urine
export function getUrineEntries(childId?: string): UrineEntry[] {
  const entries = getItem<UrineEntry[]>(STORAGE_KEYS.URINE, []);
  return childId ? entries.filter(e => e.childId === childId) : entries;
}

export function addUrineEntry(entry: UrineEntry): void {
  const entries = getUrineEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.URINE, entries);
}

export function updateUrineEntry(entry: UrineEntry): void {
  const entries = getUrineEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx !== -1) {
    entries[idx] = entry;
    setItem(STORAGE_KEYS.URINE, entries);
  }
}

export function deleteUrineEntry(id: string): void {
  const entries = getUrineEntries().filter(e => e.id !== id);
  setItem(STORAGE_KEYS.URINE, entries);
}

// Bowel
export function getBowelEntries(childId?: string): BowelEntry[] {
  const entries = getItem<BowelEntry[]>(STORAGE_KEYS.BOWEL, []);
  return childId ? entries.filter(e => e.childId === childId) : entries;
}

export function addBowelEntry(entry: BowelEntry): void {
  const entries = getBowelEntries();
  entries.push(entry);
  setItem(STORAGE_KEYS.BOWEL, entries);
}

export function updateBowelEntry(entry: BowelEntry): void {
  const entries = getBowelEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx !== -1) {
    entries[idx] = entry;
    setItem(STORAGE_KEYS.BOWEL, entries);
  }
}

export function deleteBowelEntry(id: string): void {
  const entries = getBowelEntries().filter(e => e.id !== id);
  setItem(STORAGE_KEYS.BOWEL, entries);
}

// Export
export function exportToCSV(childId: string, childName: string): string {
  const drinks = getDrinks(childId);
  const urine = getUrineEntries(childId);
  const bowel = getBowelEntries(childId);

  let csv = `Bladder & Bowel Diary Export for ${childName}\n`;
  csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  csv += 'DRINKS\n';
  csv += 'Date,Time,Type,Amount (ml),Notes\n';
  drinks.forEach(d => {
    csv += `${d.date},${d.time},${d.type},${d.amountMl},"${d.notes}"\n`;
  });

  csv += '\nURINE EVENTS\n';
  csv += 'Date,Time,Wet,Pass,Notes\n';
  urine.forEach(u => {
    csv += `${u.date},${u.time},${u.wet},${u.pass},"${u.notes}"\n`;
  });

  csv += '\nBOWEL EVENTS\n';
  csv += 'Date,Time,Location,Amount,Bristol Type,Laxatives,Notes\n';
  bowel.forEach(b => {
    csv += `${b.date},${b.time},${b.location},${b.amount},Type ${b.bristolType},${b.laxativesGiven},"${b.notes}"\n`;
  });

  return csv;
}

export function downloadCSV(childId: string, childName: string): void {
  const csv = exportToCSV(childId, childName);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bladder-diary-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
