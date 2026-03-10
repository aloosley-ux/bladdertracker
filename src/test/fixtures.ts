import type {
  AccountRecord,
  AuditEvent,
  BowelEntry,
  Child,
  DrinkEntry,
  FoodEntry,
  LeapDiaryEntry,
  LeapSymptomLog,
  MedicationEntry,
  Milestone,
  MoodEntry,
  ModuleId,
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

export const TODAY = '2026-03-10';
export const NOW = '2026-03-10T10:00:00.000Z';
export const USER_ID = 'user-1';
export const CHILD_ID = 'child-1';

export const baseUser: User = {
  id: USER_ID,
  name: 'Taylor Parent',
  email: 'taylor@example.com',
  role: 'parent',
  createdAt: NOW,
};

export const adminUser: User = {
  ...baseUser,
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'admin',
};

export const baseAccount: AccountRecord = {
  ...baseUser,
  passwordHash: 'hash',
  passwordSalt: 'salt',
};

export const adminAccount: AccountRecord = {
  ...adminUser,
  passwordHash: 'hash',
  passwordSalt: 'salt',
};

export const baseChild: Child = {
  id: CHILD_ID,
  name: 'Alex',
  dateOfBirth: '2025-12-01',
  dueDate: '2025-12-20',
  caregivers: [],
  parentIds: [USER_ID],
  createdBy: USER_ID,
  lastUpdatedAt: NOW,
};

export const drinkEntry: DrinkEntry = {
  id: 'drink-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '08:30',
  type: 'cup',
  amountMl: 200,
  notes: 'Morning drink',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const urineEntry: UrineEntry = {
  id: 'urine-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '09:00',
  wet: false,
  pass: true,
  volumeMl: 150,
  urgency: 2,
  leakageAmount: 'none',
  notes: 'Good toilet use',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const bowelEntry: BowelEntry = {
  id: 'bowel-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '09:30',
  location: 'toilet',
  amount: 'M',
  bristolType: 4,
  laxativesGiven: false,
  notes: 'Comfortable',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const sleepEntry: SleepEntry = {
  id: 'sleep-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '07:00',
  eventType: 'wake',
  durationMinutes: 600,
  quality: 4,
  bedtime: '20:00',
  sleepOnsetMinutes: 20,
  nighttimeEvent: false,
  nightActivity: false,
  notes: 'Slept well',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const toiletEntry: ToiletAttemptEntry = {
  id: 'toilet-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '10:00',
  outcome: 'success',
  supervised: true,
  prompted: true,
  durationMinutes: 4,
  notes: 'Prompted visit',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const foodEntry: FoodEntry = {
  id: 'food-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '12:00',
  mealType: 'lunch',
  description: 'Pasta',
  portions: 1,
  isTrying: false,
  texture: 'soft',
  accepted: 'accepted',
  notes: 'Ate well',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const moodEntry: MoodEntry = {
  id: 'mood-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '13:00',
  level: 4,
  triggers: 'Calm routine',
  notes: 'Happy afternoon',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const sensoryEntry: SensoryEntry = {
  id: 'sensory-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '14:00',
  sensoryType: 'auditory',
  response: 'avoiding',
  intensity: 3,
  notes: 'Busy room',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const medicationEntry: MedicationEntry = {
  id: 'medication-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '15:00',
  name: 'Vitamin D',
  dosage: '1 tablet',
  administered: true,
  notes: 'Taken with snack',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const therapyEntry: TherapyEntry = {
  id: 'therapy-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '16:00',
  therapyType: 'speech',
  provider: 'SALT',
  durationMinutes: 30,
  goals: 'Turn taking',
  notes: 'Strong engagement',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const routineEntry: RoutineEntry = {
  id: 'routine-1',
  childId: CHILD_ID,
  date: TODAY,
  time: '17:00',
  routineName: 'Bedtime routine',
  completed: true,
  durationMinutes: 15,
  notes: 'Smooth evening',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const milestone: Milestone = {
  id: 'milestone-1',
  childId: CHILD_ID,
  name: 'Stayed dry at nursery',
  description: 'Dry all morning',
  category: 'self_care',
  moduleId: 'toilet',
  milestoneType: 'custom',
  status: 'achieved',
  dateAchieved: TODAY,
  targetDate: TODAY,
  notes: 'Great progress',
  sourceRole: 'parent',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const leapSymptomLog: LeapSymptomLog = {
  id: 'leap-log-1',
  childId: CHILD_ID,
  leapNumber: 1,
  date: TODAY,
  time: '06:30',
  symptoms: ['clingy', 'crying'],
  notes: 'A bit unsettled',
  createdBy: USER_ID,
  createdAt: NOW,
};

export const leapDiaryEntry: LeapDiaryEntry = {
  id: 'leap-diary-1',
  childId: CHILD_ID,
  leapNumber: 1,
  date: TODAY,
  title: 'Wonder week note',
  body: 'More alert today.',
  mood: 'curious',
  createdBy: USER_ID,
  createdAt: NOW,
  updatedAt: NOW,
};

export const reminderPreference: ReminderPreference = {
  id: 'reminder-1',
  userId: USER_ID,
  childId: CHILD_ID,
  moduleId: 'drinks',
  frequency: 'daily',
  enabled: true,
  snoozedUntil: null,
  nextReminderAt: `${TODAY}T09:00:00.000Z`,
  createdAt: NOW,
  updatedAt: NOW,
};

export const notificationItem: NotificationItem = {
  id: 'notification-1',
  userId: USER_ID,
  title: 'Reminder',
  message: 'Time for a quick drink update.',
  read: false,
  createdAt: NOW,
};

export const auditEvent: AuditEvent = {
  id: 'audit-1',
  userId: USER_ID,
  action: 'Created child profile',
  subject: baseChild.name,
  detail: 'Added a new child profile.',
  createdAt: NOW,
};

export const allModuleIds: ModuleId[] = [
  'drinks',
  'urine',
  'bowel',
  'sleep',
  'toilet',
  'food',
  'mood',
  'sensory',
  'medication',
  'therapy',
  'routine',
  'milestones',
  'leaps',
];

export const authenticatedStorageState: Record<string, unknown> = {
  bt_user: baseUser,
  bt_accounts: [baseAccount],
  bt_children: [baseChild],
  bt_drinks: [drinkEntry],
  bt_urine: [urineEntry],
  bt_bowel: [bowelEntry],
  bt_sleep: [sleepEntry],
  bt_toilet_attempts: [toiletEntry],
  bt_food: [foodEntry],
  bt_mood: [moodEntry],
  bt_sensory: [sensoryEntry],
  bt_medication: [medicationEntry],
  bt_therapy: [therapyEntry],
  bt_routine: [routineEntry],
  bt_milestones: [milestone],
  bt_leap_symptom_logs: [leapSymptomLog],
  bt_leap_diary: [leapDiaryEntry],
  bt_enabled_modules: [{ childId: CHILD_ID, modules: allModuleIds }],
  bt_invites: [],
  bt_notifications: [notificationItem],
  bt_reminder_preferences: [reminderPreference],
  bt_audit: [auditEvent],
};

export const adminStorageState: Record<string, unknown> = {
  ...authenticatedStorageState,
  bt_user: adminUser,
  bt_accounts: [adminAccount, baseAccount],
  bt_children: [baseChild],
};
