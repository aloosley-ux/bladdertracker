import * as storage from '../utils/storage';
import {
  CHILD_ID,
  USER_ID,
  adminAccount,
  auditEvent,
  baseAccount,
  baseChild,
  bowelEntry,
  drinkEntry,
  foodEntry,
  leapDiaryEntry,
  leapSymptomLog,
  medicationEntry,
  milestone,
  moodEntry,
  routineEntry,
  sensoryEntry,
  sleepEntry,
  therapyEntry,
  toiletEntry,
  urineEntry,
} from './fixtures';

function assertCrudCycle<T extends { id: string }>(
  getItems: (childFilter?: string | string[]) => T[],
  addItem: (item: T) => void,
  updateItem: (item: T) => void,
  deleteItem: (id: string) => void,
  sample: T,
  updated: T,
) {
  expect(getItems(CHILD_ID)).toEqual([]);

  addItem(sample);
  expect(getItems(CHILD_ID)).toHaveLength(1);
  expect(getItems(CHILD_ID)[0]).toMatchObject({ id: sample.id });

  updateItem(updated);
  expect(getItems(CHILD_ID)[0]).toMatchObject(updated);

  deleteItem(sample.id);
  expect(getItems(CHILD_ID)).toEqual([]);
}

describe('storage utilities', () => {
  beforeEach(() => {
    storage.clearAllAppData();
  });

  it('persists and clears the current user session', () => {
    expect(storage.getUser()).toBeNull();

    storage.setAccounts([baseAccount]);
    storage.setUser(baseAccount);
    expect(storage.getUser()).toMatchObject({ id: USER_ID, email: baseAccount.email });

    storage.clearUser();
    expect(storage.getUser()).toBeNull();
  });

  it('adds, updates, and filters children by accessible user', () => {
    storage.addChild(baseChild);
    expect(storage.getChildren()).toHaveLength(1);
    expect(storage.getChildren(USER_ID)).toHaveLength(1);

    storage.updateChild({ ...baseChild, name: 'Alex Updated' });
    expect(storage.getChildren(USER_ID)[0]).toMatchObject({ name: 'Alex Updated' });
    expect(storage.getChildren('another-user')).toHaveLength(0);
  });

  it('stores custom enabled modules per child and falls back to defaults', () => {
    expect(storage.getEnabledModules(CHILD_ID)).toEqual(
      expect.arrayContaining(['drinks', 'urine', 'bowel', 'sleep', 'toilet', 'food', 'milestones']),
    );

    storage.setEnabledModules(CHILD_ID, ['drinks', 'leaps']);
    expect(storage.getEnabledModules(CHILD_ID)).toEqual(['drinks', 'leaps']);
  });

  it('supports drinks CRUD', () => {
    assertCrudCycle(storage.getDrinks, storage.addDrink, storage.updateDrink, storage.deleteDrink, drinkEntry, { ...drinkEntry, notes: 'Updated drink note' });
  });

  it('supports urine CRUD', () => {
    assertCrudCycle(storage.getUrineEntries, storage.addUrineEntry, storage.updateUrineEntry, storage.deleteUrineEntry, urineEntry, { ...urineEntry, notes: 'Updated urine note', wet: true });
  });

  it('supports bowel CRUD', () => {
    assertCrudCycle(storage.getBowelEntries, storage.addBowelEntry, storage.updateBowelEntry, storage.deleteBowelEntry, bowelEntry, { ...bowelEntry, notes: 'Updated bowel note', amount: 'L' });
  });

  it('supports sleep CRUD', () => {
    assertCrudCycle(storage.getSleepEntries, storage.addSleepEntry, storage.updateSleepEntry, storage.deleteSleepEntry, sleepEntry, { ...sleepEntry, notes: 'Updated sleep note', quality: 5 });
  });

  it('supports toilet visit CRUD', () => {
    assertCrudCycle(storage.getToiletAttemptEntries, storage.addToiletAttemptEntry, storage.updateToiletAttemptEntry, storage.deleteToiletAttemptEntry, toiletEntry, { ...toiletEntry, notes: 'Updated toilet note', outcome: 'failure' });
  });

  it('supports food CRUD', () => {
    assertCrudCycle(storage.getFoodEntries, storage.addFoodEntry, storage.updateFoodEntry, storage.deleteFoodEntry, foodEntry, { ...foodEntry, notes: 'Updated meal note', description: 'Soup' });
  });

  it('supports mood CRUD', () => {
    assertCrudCycle(storage.getMoodEntries, storage.addMoodEntry, storage.updateMoodEntry, storage.deleteMoodEntry, moodEntry, { ...moodEntry, notes: 'Updated mood note', level: 5 });
  });

  it('supports sensory CRUD', () => {
    assertCrudCycle(storage.getSensoryEntries, storage.addSensoryEntry, storage.updateSensoryEntry, storage.deleteSensoryEntry, sensoryEntry, { ...sensoryEntry, notes: 'Updated sensory note', intensity: 4 });
  });

  it('supports medication CRUD', () => {
    assertCrudCycle(storage.getMedicationEntries, storage.addMedicationEntry, storage.updateMedicationEntry, storage.deleteMedicationEntry, medicationEntry, { ...medicationEntry, notes: 'Updated medication note', administered: false });
  });

  it('supports therapy CRUD', () => {
    assertCrudCycle(storage.getTherapyEntries, storage.addTherapyEntry, storage.updateTherapyEntry, storage.deleteTherapyEntry, therapyEntry, { ...therapyEntry, notes: 'Updated therapy note', durationMinutes: 40 });
  });

  it('supports routine CRUD', () => {
    assertCrudCycle(storage.getRoutineEntries, storage.addRoutineEntry, storage.updateRoutineEntry, storage.deleteRoutineEntry, routineEntry, { ...routineEntry, notes: 'Updated routine note', completed: false });
  });

  it('supports milestone CRUD', () => {
    assertCrudCycle(storage.getMilestones, storage.addMilestone, storage.updateMilestone, storage.deleteMilestone, milestone, { ...milestone, notes: 'Updated milestone note', status: 'in_progress' });
  });

  it('supports leap symptom log CRUD', () => {
    assertCrudCycle(storage.getLeapSymptomLogs, storage.addLeapSymptomLog, storage.updateLeapSymptomLog, storage.deleteLeapSymptomLog, leapSymptomLog, { ...leapSymptomLog, notes: 'Updated leap log note' });
  });

  it('supports leap diary CRUD', () => {
    assertCrudCycle(storage.getLeapDiaryEntries, storage.addLeapDiaryEntry, storage.updateLeapDiaryEntry, storage.deleteLeapDiaryEntry, leapDiaryEntry, { ...leapDiaryEntry, body: 'Updated leap diary note', updatedAt: '2026-03-10T11:00:00.000Z' });
  });

  it('updates account roles and keeps admin records accessible', () => {
    storage.setAccounts([baseAccount, adminAccount]);

    const promoted = storage.promoteToAdmin(USER_ID);
    expect(promoted).toMatchObject({ role: 'admin' });
    expect(storage.getAccounts()).toHaveLength(2);
  });

  it('rejects invalid DOB in local mode (parity with cloud toIsoDateOrNull)', () => {
    const invalidChild = { ...baseChild, dateOfBirth: '2025-02-30' };
    storage.addChild(invalidChild);
    expect(storage.getChildren()[0].dateOfBirth).toBe('');

    storage.updateChild({ ...baseChild, dateOfBirth: '2026-04-01' });
    expect(storage.getChildren()[0].dateOfBirth).toBe('2026-04-01');

    storage.updateChild({ ...baseChild, dateOfBirth: '2025-02-30' });
    expect(storage.getChildren()[0].dateOfBirth).toBe('');
  });

  it('isValidIsoDate validates calendar dates strictly', () => {
    expect(storage.isValidIsoDate('2026-04-01')).toBe(true);
    expect(storage.isValidIsoDate('2025-02-30')).toBe(false);
    expect(storage.isValidIsoDate('2021-02-29')).toBe(false);
    expect(storage.isValidIsoDate('not-a-date')).toBe(false);
    expect(storage.isValidIsoDate('')).toBe(false);
  });

  it('sanitizeDateOfBirth coerces invalid dates to empty string', () => {
    expect(storage.sanitizeDateOfBirth('2026-04-01')).toBe('2026-04-01');
    expect(storage.sanitizeDateOfBirth('2025-02-30')).toBe('');
    expect(storage.sanitizeDateOfBirth('')).toBe('');
    expect(storage.sanitizeDateOfBirth(null)).toBe('');
    expect(storage.sanitizeDateOfBirth(123)).toBe('');
  });

  it('stores notifications, reminders, and audit events for the active user', () => {
    storage.setAccounts([baseAccount]);
    storage.setUser(baseAccount);
    storage.addAuditEvent(auditEvent);
    storage.setReminderPreferences([{
      id: 'reminder-2',
      userId: USER_ID,
      childId: CHILD_ID,
      moduleId: 'food',
      frequency: 'weekly',
      enabled: true,
      snoozedUntil: null,
      nextReminderAt: null,
      createdAt: auditEvent.createdAt,
      updatedAt: auditEvent.createdAt,
    }]);
    storage.addNotification({
      userId: USER_ID,
      title: 'Heads up',
      message: 'A new milestone is due soon.',
    });

    expect(storage.getAuditEvents(USER_ID)).toHaveLength(1);
    expect(storage.getReminderPreferences(USER_ID)).toHaveLength(1);
    expect(storage.getNotifications(USER_ID)).toHaveLength(1);
  });
});
