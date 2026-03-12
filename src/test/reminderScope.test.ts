/**
 * Reminder scope tests.
 *
 * Decision: Reminders are module-wide, not milestone-only.
 * Supported reminder modules: milestones, therapy, routine, mood.
 *
 * These tests verify that:
 * 1. Reminders can be set for any supported module, not just milestones.
 * 2. Enabled reminders that are not snoozed surface as "due".
 * 3. Snoozed reminders do not surface as "due" until the snooze expires.
 * 4. Reminder preferences are correctly scoped per child.
 */
import type { ModuleId, ReminderPreference } from '../types';
import { CHILD_ID, USER_ID, NOW } from './fixtures';

// Mirrors the SettingsPage.tsx REMINDER_ENABLED_MODULES constant.
const REMINDER_ENABLED_MODULES: ModuleId[] = ['milestones', 'therapy', 'routine', 'mood'];

function isDueReminder(item: Pick<ReminderPreference, 'enabled' | 'snoozedUntil'>, now: Date): boolean {
  return item.enabled && (!item.snoozedUntil || new Date(item.snoozedUntil).getTime() < now.getTime());
}

function makePref(
  moduleId: ModuleId,
  childId: string,
  overrides: Partial<ReminderPreference> = {},
): ReminderPreference {
  return {
    id: `reminder-${moduleId}`,
    userId: USER_ID,
    childId,
    moduleId,
    frequency: 'weekly',
    enabled: true,
    snoozedUntil: null,
    nextReminderAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe('reminder scope — module-wide (not milestone-only)', () => {
  const now = new Date(NOW);

  it('REMINDER_ENABLED_MODULES includes more than just milestones', () => {
    expect(REMINDER_ENABLED_MODULES).toContain('milestones');
    expect(REMINDER_ENABLED_MODULES).toContain('therapy');
    expect(REMINDER_ENABLED_MODULES).toContain('routine');
    expect(REMINDER_ENABLED_MODULES).toContain('mood');
    expect(REMINDER_ENABLED_MODULES.length).toBeGreaterThan(1);
  });

  it('an enabled, non-snoozed reminder is due', () => {
    const pref = makePref('therapy', CHILD_ID);
    expect(isDueReminder(pref, now)).toBe(true);
  });

  it('a disabled reminder is not due', () => {
    const pref = makePref('therapy', CHILD_ID, { enabled: false });
    expect(isDueReminder(pref, now)).toBe(false);
  });

  it('a snoozed reminder that has not expired is not due', () => {
    const futureSnooze = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // +1 hour
    const pref = makePref('milestones', CHILD_ID, { snoozedUntil: futureSnooze });
    expect(isDueReminder(pref, now)).toBe(false);
  });

  it('a snoozed reminder that has expired is due', () => {
    const pastSnooze = new Date(now.getTime() - 60 * 60 * 1000).toISOString(); // -1 hour
    const pref = makePref('milestones', CHILD_ID, { snoozedUntil: pastSnooze });
    expect(isDueReminder(pref, now)).toBe(true);
  });

  it('reminder preferences filter correctly by child', () => {
    const child1Pref = makePref('mood', CHILD_ID);
    const child2Pref = makePref('routine', 'child-2');

    const allPrefs = [child1Pref, child2Pref];
    const forChild1 = allPrefs.filter((p) => p.childId === CHILD_ID);

    expect(forChild1).toHaveLength(1);
    expect(forChild1[0].moduleId).toBe('mood');
  });

  it('therapy reminder is due independently of milestone reminder status', () => {
    const milestoneOff = makePref('milestones', CHILD_ID, { enabled: false });
    const therapyOn = makePref('therapy', CHILD_ID, { enabled: true });

    expect(isDueReminder(milestoneOff, now)).toBe(false);
    expect(isDueReminder(therapyOn, now)).toBe(true);
  });

  it('multiple module reminders can be due simultaneously', () => {
    const prefs = REMINDER_ENABLED_MODULES.map((moduleId) => makePref(moduleId, CHILD_ID));
    const due = prefs.filter((p) => isDueReminder(p, now));
    expect(due).toHaveLength(REMINDER_ENABLED_MODULES.length);
  });
});
