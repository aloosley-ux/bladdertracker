import { useMemo } from 'react';
import { format } from 'date-fns';
import { useApp } from '../context/useApp';
import { getDashboardCelebration } from '../content/presentation';
import { DEFAULT_MODULES } from '../types';

const DEFAULT_ENABLED = new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id));
const SNOOZE_DURATION_MS = 60 * 60 * 1000;

export function useDashboard() {
  const {
    selectedChild,
    selectedChildId,
    children,
    selectChild,
    drinks,
    urineEntries,
    bowelEntries,
    sleepEntries,
    toiletAttemptEntries,
    foodEntries,
    moodEntries,
    sensoryEntries,
    medicationEntries,
    therapyEntries,
    routineEntries,
    milestones,
    reminderPreferences,
    setReminderPreferences,
    enabledModules,
    deleteDrink,
    deleteUrineEntry,
    deleteBowelEntry,
    deleteSleepEntry,
    deleteToiletAttemptEntry,
    deleteFoodEntry,
    deleteMoodEntry,
    deleteSensoryEntry,
    deleteMedicationEntry,
    deleteTherapyEntry,
    deleteRoutineEntry,
  } = useApp();

  const enabled = useMemo(
    () => (enabledModules.length > 0 ? new Set(enabledModules) : DEFAULT_ENABLED),
    [enabledModules]
  );
  const on = (id: string) => enabled.has(id as Parameters<typeof enabled.has>[0]);

  const today = useMemo(() => new Date(), []);
  const dateStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);
  const todayLabel = useMemo(() => format(today, 'EEEE, MMMM d'), [today]);

  const dayDrinks = useMemo(
    () => drinks.filter((d) => d.childId === selectedChildId && d.date === dateStr),
    [drinks, selectedChildId, dateStr]
  );
  const dayUrine = useMemo(
    () => urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [urineEntries, selectedChildId, dateStr]
  );
  const dayBowel = useMemo(
    () => bowelEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [bowelEntries, selectedChildId, dateStr]
  );
  const daySleep = useMemo(
    () => sleepEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [sleepEntries, selectedChildId, dateStr]
  );
  const dayToilet = useMemo(
    () => toiletAttemptEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [toiletAttemptEntries, selectedChildId, dateStr]
  );
  const dayFood = useMemo(
    () => foodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [foodEntries, selectedChildId, dateStr]
  );
  const dayMood = useMemo(
    () => moodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [moodEntries, selectedChildId, dateStr]
  );
  const daySensory = useMemo(
    () => sensoryEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [sensoryEntries, selectedChildId, dateStr]
  );
  const dayMedication = useMemo(
    () => medicationEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [medicationEntries, selectedChildId, dateStr]
  );
  const dayTherapy = useMemo(
    () => therapyEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [therapyEntries, selectedChildId, dateStr]
  );
  const dayRoutine = useMemo(
    () => routineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [routineEntries, selectedChildId, dateStr]
  );
  const childMilestones = useMemo(
    () => milestones.filter((m) => m.childId === selectedChildId),
    [milestones, selectedChildId]
  );
  const dueReminders = reminderPreferences.filter((item) =>
    item.childId === selectedChildId &&
    item.enabled &&
    (!item.snoozedUntil || new Date(item.snoozedUntil).getTime() < today.getTime())
  );

  const totalMl = dayDrinks.reduce((sum, d) => sum + d.amountMl, 0);
  const totalOutput = dayUrine.reduce((sum, e) => sum + (e.volumeMl || 0), 0);
  const wetCount = dayUrine.filter((e) => e.wet).length;
  const passCount = dayUrine.filter((e) => e.pass).length;
  const bowelCount = dayBowel.length;
  const sleepCount = daySleep.length;
  const toiletCount = dayToilet.length;
  const foodCount = dayFood.length;
  const moodCount = dayMood.length;
  const sensoryCount = daySensory.length;
  const medicationCount = dayMedication.length;
  const therapyCount = dayTherapy.length;
  const routineCount = dayRoutine.length;
  const milestoneAchieved = childMilestones.filter((m) => m.status === 'achieved').length;
  const urineSub = totalOutput > 0 ? `${totalOutput}ml logged` : `${wetCount} wet clothes · ${passCount} used toilet`;
  const todayEntryCount = dayDrinks.length + dayUrine.length + dayBowel.length + daySleep.length + dayToilet.length + dayFood.length + dayMood.length + daySensory.length + dayMedication.length + dayTherapy.length + dayRoutine.length;
  const celebration = useMemo(
    () => getDashboardCelebration(todayEntryCount, childMilestones.filter((m) => m.dateAchieved === dateStr).length, selectedChild?.name ?? 'your child'),
    [todayEntryCount, childMilestones, dateStr, selectedChild?.name],
  );

  const hasEntries =
    (enabled.has('drinks') && dayDrinks.length > 0) ||
    (enabled.has('urine') && dayUrine.length > 0) ||
    (enabled.has('bowel') && dayBowel.length > 0) ||
    (enabled.has('sleep') && daySleep.length > 0) ||
    (enabled.has('toilet') && dayToilet.length > 0) ||
    (enabled.has('food') && dayFood.length > 0) ||
    (enabled.has('mood') && dayMood.length > 0) ||
    (enabled.has('sensory') && daySensory.length > 0) ||
    (enabled.has('medication') && dayMedication.length > 0) ||
    (enabled.has('therapy') && dayTherapy.length > 0) ||
    (enabled.has('routine') && dayRoutine.length > 0);

  const snoozeReminders = () => {
    if (!selectedChildId) return;
    setReminderPreferences(
      selectedChildId,
      dueReminders.map((entry) => ({
        ...entry,
        snoozedUntil: new Date(Date.now() + SNOOZE_DURATION_MS).toISOString(),
      })),
    );
  };

  return {
    selectedChild,
    selectedChildId,
    children,
    selectChild,
    enabled,
    on,
    todayLabel,
    dateStr,
    dayDrinks,
    dayUrine,
    dayBowel,
    daySleep,
    dayToilet,
    dayFood,
    dayMood,
    daySensory,
    dayMedication,
    dayTherapy,
    dayRoutine,
    childMilestones,
    dueReminders,
    totalMl,
    totalOutput,
    wetCount,
    passCount,
    bowelCount,
    sleepCount,
    toiletCount,
    foodCount,
    moodCount,
    sensoryCount,
    medicationCount,
    therapyCount,
    routineCount,
    milestoneAchieved,
    urineSub,
    todayEntryCount,
    celebration,
    hasEntries,
    snoozeReminders,
    deleteDrink,
    deleteUrineEntry,
    deleteBowelEntry,
    deleteSleepEntry,
    deleteToiletAttemptEntry,
    deleteFoodEntry,
    deleteMoodEntry,
    deleteSensoryEntry,
    deleteMedicationEntry,
    deleteTherapyEntry,
    deleteRoutineEntry,
  };
}
