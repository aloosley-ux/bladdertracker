export type UserRole = 'admin' | 'parent' | 'caregiver' | 'schoolAdmin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  createdAt: string;
}

export interface AccountRecord extends User {
  passwordHash: string;
  passwordSalt: string;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  avatar?: string;
  caregivers: string[];
  parentIds: string[];
  createdBy: string;
  lastUpdatedAt: string;
}

export interface DrinkEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  type: 'cup' | 'beaker' | 'bottle' | 'sippy' | 'other';
  amountMl: number;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type LeakageAmount = 'none' | 'small' | 'medium' | 'large';
export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;

export interface UrineEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  wet: boolean;
  pass: boolean;
  volumeMl?: number | null;
  urgency?: UrgencyLevel | null;
  leakageAmount?: LeakageAmount | null;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type BristolStoolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BowelAmount = 'S' | 'M' | 'L';

export interface BowelEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  location: 'toilet' | 'nappy';
  amount: BowelAmount;
  bristolType: BristolStoolType;
  laxativesGiven: boolean;
  notes: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}

// Sleep tracking
export type SleepEventType = 'onset' | 'wake' | 'nap_start' | 'nap_end';

export interface SleepEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  eventType: SleepEventType;
  durationMinutes?: number | null;
  quality?: 1 | 2 | 3 | 4 | 5 | null;
  nighttimeEvent?: boolean;
  notes: string;
  createdBy: string;
  createdAt: string;
}

// Toilet attempt tracking
export type ToiletAttemptOutcome = 'success' | 'failure' | 'no_event';

export interface ToiletAttemptEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  outcome: ToiletAttemptOutcome;
  supervised: boolean;
  prompted: boolean;
  durationMinutes?: number | null;
  notes: string;
  createdBy: string;
  createdAt: string;
}

// Food tracking
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  mealType: MealType;
  description: string;
  portions?: number | null;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface DailyLog {
  date: string;
  childId: string;
  drinks: DrinkEntry[];
  urineEvents: UrineEntry[];
  bowelEvents: BowelEntry[];
  sleepEvents: SleepEntry[];
  toiletAttempts: ToiletAttemptEntry[];
  foodEntries: FoodEntry[];
}

export interface CaregiverInvite {
  id: string;
  childId: string;
  childName: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  createdAt: string;
  token: string;
  link: string;
  acceptedBy?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  subject: string;
  detail: string;
  createdAt: string;
}

export interface ImportedDiaryPayload {
  drinks?: Array<Partial<DrinkEntry>>;
  urineEntries?: Array<Partial<UrineEntry>>;
  bowelEntries?: Array<Partial<BowelEntry>>;
  sleepEntries?: Array<Partial<SleepEntry>>;
  toiletAttemptEntries?: Array<Partial<ToiletAttemptEntry>>;
  foodEntries?: Array<Partial<FoodEntry>>;
}

export interface ImportSummary {
  drinks: number;
  urineEntries: number;
  bowelEntries: number;
  sleepEntries: number;
  toiletAttemptEntries: number;
  foodEntries: number;
  errors: string[];
}
