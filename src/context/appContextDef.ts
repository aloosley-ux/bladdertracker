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
  LeapSymptomLog,
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
  moodEntries: MoodEntry[];
  sensoryEntries: SensoryEntry[];
  medicationEntries: MedicationEntry[];
  therapyEntries: TherapyEntry[];
  routineEntries: RoutineEntry[];
  milestones: Milestone[];
  leapSymptomLogs: LeapSymptomLog[];
  enabledModules: ModuleId[];
  invites: CaregiverInvite[];
  notifications: NotificationItem[];
  reminderPreferences: ReminderPreference[];
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
  addMoodEntry: (entry: MoodEntry) => void | Promise<void>;
  updateMoodEntry: (entry: MoodEntry) => void | Promise<void>;
  deleteMoodEntry: (id: string) => void | Promise<void>;
  addSensoryEntry: (entry: SensoryEntry) => void | Promise<void>;
  updateSensoryEntry: (entry: SensoryEntry) => void | Promise<void>;
  deleteSensoryEntry: (id: string) => void | Promise<void>;
  addMedicationEntry: (entry: MedicationEntry) => void | Promise<void>;
  updateMedicationEntry: (entry: MedicationEntry) => void | Promise<void>;
  deleteMedicationEntry: (id: string) => void | Promise<void>;
  addTherapyEntry: (entry: TherapyEntry) => void | Promise<void>;
  updateTherapyEntry: (entry: TherapyEntry) => void | Promise<void>;
  deleteTherapyEntry: (id: string) => void | Promise<void>;
  addRoutineEntry: (entry: RoutineEntry) => void | Promise<void>;
  updateRoutineEntry: (entry: RoutineEntry) => void | Promise<void>;
  deleteRoutineEntry: (id: string) => void | Promise<void>;
  addMilestone: (milestone: Milestone) => void | Promise<void>;
  updateMilestone: (milestone: Milestone) => void | Promise<void>;
  deleteMilestone: (id: string) => void | Promise<void>;
  addLeapSymptomLog: (log: LeapSymptomLog) => void | Promise<void>;
  updateLeapSymptomLog: (log: LeapSymptomLog) => void | Promise<void>;
  deleteLeapSymptomLog: (id: string) => void | Promise<void>;
  setEnabledModules: (modules: ModuleId[]) => void | Promise<void>;
  exportData: () => void | Promise<void>;
  createInvite: (email: string, role: UserRole, childId: string) => CaregiverInvite | null | Promise<CaregiverInvite | null>;
  acceptInvite: (token: string) => boolean | Promise<boolean>;
  importDiaryData: (payload: ImportedDiaryPayload, childId: string) => ImportSummary | Promise<ImportSummary>;
  markNotificationRead: (id: string) => void | Promise<void>;
  setReminderPreferences: (childId: string, reminders: Array<Partial<ReminderPreference> & { moduleId: ReminderPreference['moduleId'] }>) => void | Promise<void>;
  clearAllData: () => void;
  selectedChild: Child | null;
}

export const AppContext = createContext<AppContextType | null>(null);
