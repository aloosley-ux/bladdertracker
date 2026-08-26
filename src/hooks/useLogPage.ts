import { useMemo, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { DEFAULT_MODULES } from '../types';

export type ModuleKey =
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
  | 'routine';

export interface LogEntry {
  key: string;
  time: string;
  node: React.ReactNode;
}

export function useLogPage() {
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
  const navigate = useNavigate();

  const enabledKeys = useMemo<Set<ModuleKey>>(() => {
    const src = enabledModules.length > 0
      ? enabledModules
      : DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id);
    return new Set(src.filter((id) => id !== 'milestones') as ModuleKey[]);
  }, [enabledModules]);

  const ALL_MODULE_KEYS = DEFAULT_MODULES
    .filter((m) => m.id !== 'milestones')
    .map((m) => m.id) as ModuleKey[];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [storedActiveFilters, setStoredActiveFilters] = useState<Set<ModuleKey>>(
    () => new Set(ALL_MODULE_KEYS.filter((k) => enabledKeys.has(k))),
  );
  const activeFilters = useMemo(
    () => new Set([...storedActiveFilters].filter((key) => enabledKeys.has(key))),
    [storedActiveFilters, enabledKeys],
  );

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const toggleFilter = (key: ModuleKey) => {
    setStoredActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const dayDrinks = useMemo(
    () => drinks.filter((d) => d.childId === selectedChildId && d.date === dateStr),
    [drinks, selectedChildId, dateStr],
  );
  const dayUrine = useMemo(
    () => urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [urineEntries, selectedChildId, dateStr],
  );
  const dayBowel = useMemo(
    () => bowelEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [bowelEntries, selectedChildId, dateStr],
  );
  const daySleep = useMemo(
    () => sleepEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [sleepEntries, selectedChildId, dateStr],
  );
  const dayToilet = useMemo(
    () => toiletAttemptEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [toiletAttemptEntries, selectedChildId, dateStr],
  );
  const dayFood = useMemo(
    () => foodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [foodEntries, selectedChildId, dateStr],
  );
  const dayMood = useMemo(
    () => moodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [moodEntries, selectedChildId, dateStr],
  );
  const daySensory = useMemo(
    () => sensoryEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [sensoryEntries, selectedChildId, dateStr],
  );
  const dayMedication = useMemo(
    () => medicationEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [medicationEntries, selectedChildId, dateStr],
  );
  const dayTherapy = useMemo(
    () => therapyEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [therapyEntries, selectedChildId, dateStr],
  );
  const dayRoutine = useMemo(
    () => routineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr),
    [routineEntries, selectedChildId, dateStr],
  );

  const dateLabel = isSameDay(selectedDate, new Date())
    ? "Today's"
    : format(selectedDate, 'EEE, MMM d');

  return {
    selectedChild,
    selectedChildId,
    children,
    selectChild,
    enabledKeys,
    ALL_MODULE_KEYS,
    selectedDate,
    setSelectedDate,
    activeFilters,
    dateStr,
    dateLabel,
    toggleFilter,
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
    navigate,
  };
}
