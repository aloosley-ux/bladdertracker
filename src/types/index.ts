/**
 * User roles with ascending capability:
 * - admin: Full access to all features, user management, system config
 * - parent: Manage children, all trackers, invite caregivers
 * - caregiver: View/edit entries for shared children
 * - schoolAdmin: View entries, read-only management
 * - therapist: View/edit entries and milestones for assigned children
 * - specialist: View-only access for clinical review
 */
export type UserRole = 'admin' | 'parent' | 'caregiver' | 'schoolAdmin' | 'therapist' | 'specialist';

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

// ── Module Registry ──────────────────────────────────────────────────
export type ModuleId =
  | 'drinks'
  | 'urine'
  | 'bowel'
  | 'sleep'
  | 'toilet'
  | 'food'
  | 'mood'
  | 'sensory'
  | 'medication'
  | 'therapy'
  | 'routine'
  | 'milestones';

export interface TrackerModule {
  id: ModuleId;
  label: string;
  icon: string;          // emoji or lucide icon name
  description: string;
  builtIn: boolean;      // false for user-created custom modules
  defaultEnabled: boolean;
}

export interface EnabledModules {
  childId: string;
  modules: ModuleId[];
}

// ── Milestones ───────────────────────────────────────────────────────
export type MilestoneStatus = 'not_started' | 'in_progress' | 'achieved';
export type MilestoneCategory = 'speech' | 'motor' | 'social' | 'cognitive' | 'self_care' | 'routine' | 'sensory' | 'other';

export interface Milestone {
  id: string;
  childId: string;
  name: string;
  description: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  dateAchieved?: string | null;
  notes: string;
  createdBy: string;
  createdAt: string;
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

// ── New tracker entry types ──────────────────────────────────────────
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  level: MoodLevel;
  triggers: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type SensoryResponseType = 'seeking' | 'avoiding' | 'neutral';

export interface SensoryEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  sensoryType: string;          // e.g. 'auditory', 'tactile', 'visual', 'vestibular'
  response: SensoryResponseType;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface MedicationEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  name: string;
  dosage: string;
  administered: boolean;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type TherapyType = 'speech' | 'occupational' | 'physical' | 'behavioral' | 'other';

export interface TherapyEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  therapyType: TherapyType;
  provider: string;
  durationMinutes: number;
  goals: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface RoutineEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  routineName: string;
  completed: boolean;
  durationMinutes?: number | null;
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
  moodEntries: MoodEntry[];
  sensoryEntries: SensoryEntry[];
  medicationEntries: MedicationEntry[];
  therapyEntries: TherapyEntry[];
  routineEntries: RoutineEntry[];
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
  moodEntries?: Array<Partial<MoodEntry>>;
  sensoryEntries?: Array<Partial<SensoryEntry>>;
  medicationEntries?: Array<Partial<MedicationEntry>>;
  therapyEntries?: Array<Partial<TherapyEntry>>;
  routineEntries?: Array<Partial<RoutineEntry>>;
}

export interface ImportSummary {
  drinks: number;
  urineEntries: number;
  bowelEntries: number;
  sleepEntries: number;
  toiletAttemptEntries: number;
  foodEntries: number;
  moodEntries: number;
  sensoryEntries: number;
  medicationEntries: number;
  therapyEntries: number;
  routineEntries: number;
  errors: string[];
}

export const EMPTY_IMPORT_SUMMARY: ImportSummary = {
  drinks: 0, urineEntries: 0, bowelEntries: 0, sleepEntries: 0,
  toiletAttemptEntries: 0, foodEntries: 0, moodEntries: 0,
  sensoryEntries: 0, medicationEntries: 0, therapyEntries: 0,
  routineEntries: 0, errors: [],
};

// ── Default Module Registry ──────────────────────────────────────────
export const DEFAULT_MODULES: TrackerModule[] = [
  { id: 'drinks', label: 'Drinks', icon: '🥤', description: 'Track fluid intake', builtIn: true, defaultEnabled: true },
  { id: 'urine', label: 'Urine', icon: '💦', description: 'Track urination events', builtIn: true, defaultEnabled: true },
  { id: 'bowel', label: 'Bowel', icon: '🚽', description: 'Track bowel movements', builtIn: true, defaultEnabled: true },
  { id: 'sleep', label: 'Sleep', icon: '🌙', description: 'Track sleep patterns', builtIn: true, defaultEnabled: true },
  { id: 'toilet', label: 'Toilet Attempts', icon: '🎯', description: 'Track toilet training attempts', builtIn: true, defaultEnabled: true },
  { id: 'food', label: 'Food', icon: '🍽️', description: 'Track meals and nutrition', builtIn: true, defaultEnabled: true },
  { id: 'mood', label: 'Mood', icon: '😊', description: 'Track emotional states and triggers', builtIn: true, defaultEnabled: false },
  { id: 'sensory', label: 'Sensory', icon: '🎨', description: 'Track sensory responses and preferences', builtIn: true, defaultEnabled: false },
  { id: 'medication', label: 'Medication', icon: '💊', description: 'Track medications and dosages', builtIn: true, defaultEnabled: false },
  { id: 'therapy', label: 'Therapy', icon: '🧩', description: 'Track therapy sessions and goals', builtIn: true, defaultEnabled: false },
  { id: 'routine', label: 'Routine', icon: '📋', description: 'Track daily routines and schedules', builtIn: true, defaultEnabled: false },
  { id: 'milestones', label: 'Milestones', icon: '⭐', description: 'Track developmental milestones', builtIn: true, defaultEnabled: true },
];
