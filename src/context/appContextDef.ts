import { createContext } from 'react';
import type {
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
  UserRole,
} from '../types';

interface AppState {
  user: User | null;
  children: Child[];
  selectedChildId: string | null;
  drinks: DrinkEntry[];
  urineEntries: UrineEntry[];
  bowelEntries: BowelEntry[];
  invites: CaregiverInvite[];
  notifications: NotificationItem[];
  auditTrail: AuditEvent[];
}

export interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addChild: (child: Child) => void;
  selectChild: (childId: string) => void;
  addDrink: (drink: DrinkEntry) => void;
  updateDrink: (drink: DrinkEntry) => void;
  deleteDrink: (id: string) => void;
  addUrineEntry: (entry: UrineEntry) => void;
  updateUrineEntry: (entry: UrineEntry) => void;
  deleteUrineEntry: (id: string) => void;
  addBowelEntry: (entry: BowelEntry) => void;
  updateBowelEntry: (entry: BowelEntry) => void;
  deleteBowelEntry: (id: string) => void;
  exportData: () => void;
  createInvite: (email: string, role: UserRole, childId: string) => CaregiverInvite | null;
  acceptInvite: (token: string) => boolean;
  importDiaryData: (payload: ImportedDiaryPayload, childId: string) => ImportSummary;
  markNotificationRead: (id: string) => void;
  clearAllData: () => void;
  selectedChild: Child | null;
}

export const AppContext = createContext<AppContextType | null>(null);
