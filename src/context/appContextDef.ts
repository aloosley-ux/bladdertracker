import { createContext } from 'react';
import type {
  AuditEvent,
  BowelEntry,
  CaregiverInvite,
  Child,
  DrinkEntry,
  FoodEntry,
  ImportSummary,
  ImportedDiaryPayload,
  NotificationItem,
  SleepEntry,
  ToiletAttemptEntry,
  UrineEntry,
  User,
  UserRole,
} from '../types';

interface AppState {
  user: User | null;
  children: Child[];
  selectedChildId: string | null;
  drinks: DrinkEntry[];
  urineEntries: UrineEntry[];
  bowelEntries: BowelEntry[];
  sleepEntries: SleepEntry[];
  toiletAttemptEntries: ToiletAttemptEntry[];
  foodEntries: FoodEntry[];
  invites: CaregiverInvite[];
  notifications: NotificationItem[];
  auditTrail: AuditEvent[];
}

export interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void | Promise<void>;
  addChild: (child: Child) => void | Promise<void>;
  removeChild: (childId: string) => void | Promise<void>;
  selectChild: (childId: string) => void;
  addDrink: (drink: DrinkEntry) => void | Promise<void>;
  updateDrink: (drink: DrinkEntry) => void | Promise<void>;
  deleteDrink: (id: string) => void | Promise<void>;
  addUrineEntry: (entry: UrineEntry) => void | Promise<void>;
  updateUrineEntry: (entry: UrineEntry) => void | Promise<void>;
  deleteUrineEntry: (id: string) => void | Promise<void>;
  addBowelEntry: (entry: BowelEntry) => void | Promise<void>;
  updateBowelEntry: (entry: BowelEntry) => void | Promise<void>;
  deleteBowelEntry: (id: string) => void | Promise<void>;
  addSleepEntry: (entry: SleepEntry) => void | Promise<void>;
  updateSleepEntry: (entry: SleepEntry) => void | Promise<void>;
  deleteSleepEntry: (id: string) => void | Promise<void>;
  addToiletAttemptEntry: (entry: ToiletAttemptEntry) => void | Promise<void>;
  updateToiletAttemptEntry: (entry: ToiletAttemptEntry) => void | Promise<void>;
  deleteToiletAttemptEntry: (id: string) => void | Promise<void>;
  addFoodEntry: (entry: FoodEntry) => void | Promise<void>;
  updateFoodEntry: (entry: FoodEntry) => void | Promise<void>;
  deleteFoodEntry: (id: string) => void | Promise<void>;
  exportData: () => void | Promise<void>;
  createInvite: (email: string, role: UserRole, childId: string) => CaregiverInvite | null | Promise<CaregiverInvite | null>;
  acceptInvite: (token: string) => boolean | Promise<boolean>;
  importDiaryData: (payload: ImportedDiaryPayload, childId: string) => ImportSummary | Promise<ImportSummary>;
  markNotificationRead: (id: string) => void | Promise<void>;
  clearAllData: () => void;
  selectedChild: Child | null;
}

export const AppContext = createContext<AppContextType | null>(null);
