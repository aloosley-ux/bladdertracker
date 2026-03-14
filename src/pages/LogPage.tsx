import { useMemo, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import {
  Apple,
  ClipboardList,
  CloudRain,
  Droplets,
  Moon,
  Palette,
  Pill,
  Plus,
  Puzzle,
  Smile,
  Stethoscope,
  Target,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import EmptyState from '../components/EmptyState';
import CalendarStrip from '../components/CalendarStrip';
import EntryCard from '../components/EntryCard';
import EntryDetail from '../components/EntryDetail';
import { getModuleLabel, TOILET_OUTCOME_LABELS, URINE_COPY } from '../content/presentation';
import { DEFAULT_MODULES } from '../types';

type ModuleKey =
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

// Module accent colours for filter chips [2]
const MODULE_CHIP_COLOURS: Record<ModuleKey, string> = {
  drinks:     'bg-sky-100 text-sky-700',
  urine:      'bg-amber-100 text-amber-700',
  bowel:      'bg-emerald-100 text-emerald-700',
  sleep:      'bg-indigo-100 text-indigo-700',
  toilet:     'bg-purple-100 text-purple-700',
  food:       'bg-orange-100 text-orange-700',
  mood:       'bg-pink-100 text-pink-700',
  sensory:    'bg-teal-100 text-teal-700',
  medication: 'bg-red-100 text-red-700',
  therapy:    'bg-cyan-100 text-cyan-700',
  routine:    'bg-lime-100 text-lime-700',
};
const MODULE_CHIP_ACTIVE: Record<ModuleKey, string> = {
  drinks:     'bg-sky-500 text-white',
  urine:      'bg-amber-500 text-white',
  bowel:      'bg-emerald-500 text-white',
  sleep:      'bg-indigo-500 text-white',
  toilet:     'bg-purple-500 text-white',
  food:       'bg-orange-500 text-white',
  mood:       'bg-pink-500 text-white',
  sensory:    'bg-teal-500 text-white',
  medication: 'bg-red-500 text-white',
  therapy:    'bg-cyan-500 text-white',
  routine:    'bg-lime-500 text-white',
};

const ALL_MODULE_KEYS = DEFAULT_MODULES
  .filter((m) => m.id !== 'milestones')
  .map((m) => m.id) as ModuleKey[];

const MODULE_META: { key: ModuleKey; label: string; emoji: string }[] = [
  { key: 'drinks', label: getModuleLabel('drinks'), emoji: '🥤' },
  { key: 'urine', label: getModuleLabel('urine'), emoji: '💦' },
  { key: 'bowel', label: getModuleLabel('bowel'), emoji: '🚽' },
  { key: 'sleep', label: 'Sleep', emoji: '🌙' },
  { key: 'toilet', label: getModuleLabel('toilet', 'short'), emoji: '🎯' },
  { key: 'food', label: getModuleLabel('food'), emoji: '🍽️' },
  { key: 'mood', label: 'Mood', emoji: '😊' },
  { key: 'sensory', label: 'Sensory', emoji: '🎨' },
  { key: 'medication', label: 'Medication', emoji: '💊' },
  { key: 'therapy', label: 'Therapy', emoji: '🧩' },
  { key: 'routine', label: getModuleLabel('routine'), emoji: '📋' },
];

export default function LogPage() {
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

  // Visible filter chips = only enabled modules
  const visibleModules = useMemo(
    () => MODULE_META.filter((m) => enabledKeys.has(m.key)),
    [enabledKeys],
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  // Initialize activeFilters from enabled modules; sync when enabledModules changes
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

  // --- filtered day entries ---
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

  // Build a unified, time-sorted list of visible entries
  const entries = useMemo(() => {
    const list: { key: string; time: string; node: React.ReactNode }[] = [];

    if (activeFilters.has('drinks')) {
      for (const d of dayDrinks) {
        list.push({
          key: `drink-${d.id}`,
          time: d.time,
          node: (
            <EntryCard
              icon={<Droplets size={18} className="text-sky-500" />}
              title={`${d.amountMl}ml – ${d.type}`}
              subtitle={d.notes}
              time={d.time}
              color="bg-sky-light"
              onDelete={() => deleteDrink(d.id)}
              entryType="drinks"
              entryData={d as unknown}
            >
              <EntryDetail type="drinks" entry={d} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('urine')) {
      for (const e of dayUrine) {
        const parts =
          [e.wet ? URINE_COPY.wetLabel : '', e.pass ? URINE_COPY.passLabel : ''].filter(Boolean).join(' · ') || 'Update';
        const details = [
          e.volumeMl ? `${e.volumeMl}ml` : '',
          e.urgency ? `${URINE_COPY.urgencyLabel} ${e.urgency}/5` : '',
          e.leakageAmount && e.leakageAmount !== 'none' ? `${URINE_COPY.leakageLabel}: ${e.leakageAmount}` : '',
        ]
          .filter(Boolean)
          .join(' · ');
        list.push({
          key: `urine-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<CloudRain size={18} className="text-amber-500" />}
              title={`${getModuleLabel('urine')}: ${parts}`}
              subtitle={[details, e.notes].filter(Boolean).join(' — ')}
              time={e.time}
              color="bg-peach"
              onDelete={() => deleteUrineEntry(e.id)}
              entryType="urine"
              entryData={e as unknown}
            >
              <EntryDetail type="urine" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('bowel')) {
      for (const e of dayBowel) {
        list.push({
          key: `bowel-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Stethoscope size={18} className="text-emerald-500" />}
              title={`${getModuleLabel('bowel')}: ${e.location === 'nappy' ? 'Nappy' : 'Toilet'} · ${e.amount} · Type ${e.bristolType}`}
              subtitle={`${e.laxativesGiven ? '💊 Laxatives today. ' : ''}${e.notes}`}
              time={e.time}
              color="bg-mint"
              onDelete={() => deleteBowelEntry(e.id)}
              entryType="bowel"
              entryData={e as unknown}
            >
              <EntryDetail type="bowel" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('sleep')) {
      for (const e of daySleep) {
        list.push({
          key: `sleep-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Moon size={18} className="text-indigo-500" />}
              title={`Sleep: ${e.eventType.replaceAll('_', ' ')}${e.nighttimeEvent ? ' 🌙' : ''}`}
              subtitle={[
                e.durationMinutes ? `${e.durationMinutes} min` : '',
                e.quality ? `Quality ${e.quality}/5` : '',
                e.notes,
              ]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#eee8ff]"
              onDelete={() => deleteSleepEntry(e.id)}
              entryType="sleep"
              entryData={e as unknown}
            >
              <EntryDetail type="sleep" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('toilet')) {
      for (const e of dayToilet) {
        list.push({
          key: `toilet-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Target size={18} className="text-purple-500" />}
              title={`${getModuleLabel('toilet', 'short')}: ${TOILET_OUTCOME_LABELS[e.outcome]}`}
              subtitle={[
                e.supervised ? '👀 Supervised' : '',
                e.prompted ? '🔔 Prompted' : '',
                e.durationMinutes ? `${e.durationMinutes} min` : '',
                e.notes,
              ]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#f3eeff]"
              onDelete={() => deleteToiletAttemptEntry(e.id)}
              entryType="toilet"
              entryData={e as unknown}
            >
              <EntryDetail type="toilet" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('food')) {
      for (const e of dayFood) {
        list.push({
          key: `food-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Apple size={18} className="text-orange-500" />}
              title={`${e.mealType}: ${e.description}`}
              subtitle={[e.portions ? `${e.portions} portions` : '', e.notes]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#fff5eb]"
              onDelete={() => deleteFoodEntry(e.id)}
              entryType="food"
              entryData={e as unknown}
            >
              <EntryDetail type="food" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('mood')) {
      for (const e of dayMood) {
        list.push({
          key: `mood-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Smile size={18} className="text-pink-500" />}
              title={`Mood: ${e.level === 1 ? '😢' : e.level === 2 ? '😟' : e.level === 3 ? '😐' : e.level === 4 ? '🙂' : '😁'} ${e.level}/5`}
              subtitle={[e.triggers ? `Triggers: ${e.triggers}` : '', e.notes]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#fce4ec]"
              onDelete={() => deleteMoodEntry(e.id)}
              entryType="mood"
              entryData={e as unknown}
            >
              <EntryDetail type="mood" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('sensory')) {
      for (const e of daySensory) {
        list.push({
          key: `sensory-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Palette size={18} className="text-teal-500" />}
              title={`Sensory: ${e.sensoryType} (${e.response})`}
              subtitle={[`Intensity ${e.intensity}/5`, e.notes].filter(Boolean).join(' · ')}
              time={e.time}
              color="bg-[#e0f2f1]"
              onDelete={() => deleteSensoryEntry(e.id)}
              entryType="sensory"
              entryData={e as unknown}
            >
              <EntryDetail type="sensory" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('medication')) {
      for (const e of dayMedication) {
        list.push({
          key: `medication-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Pill size={18} className="text-red-500" />}
              title={`${e.name} ${e.dosage}${e.administered ? '' : ' (not administered)'}`}
              subtitle={e.notes}
              time={e.time}
              color="bg-[#ffebee]"
              onDelete={() => deleteMedicationEntry(e.id)}
              entryType="medication"
              entryData={e as unknown}
            >
              <EntryDetail type="medication" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('therapy')) {
      for (const e of dayTherapy) {
        list.push({
          key: `therapy-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<Puzzle size={18} className="text-cyan-500" />}
              title={`${e.therapyType} therapy (${e.durationMinutes}min)`}
              subtitle={[
                e.provider ? `Provider: ${e.provider}` : '',
                e.goals ? `Goals: ${e.goals}` : '',
                e.notes,
              ]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#e0f7fa]"
              onDelete={() => deleteTherapyEntry(e.id)}
              entryType="therapy"
              entryData={e as unknown}
            >
              <EntryDetail type="therapy" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    if (activeFilters.has('routine')) {
      for (const e of dayRoutine) {
        list.push({
          key: `routine-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<ClipboardList size={18} className="text-lime-600" />}
              title={`${e.routineName} ${e.completed ? '✅' : '❌'}`}
              subtitle={[e.durationMinutes ? `${e.durationMinutes} min` : '', e.notes]
                .filter(Boolean)
                .join(' · ')}
              time={e.time}
              color="bg-[#f0f4c3]"
              onDelete={() => deleteRoutineEntry(e.id)}
              entryType="routine"
              entryData={e as unknown}
            >
              <EntryDetail type="routine" entry={e} />
            </EntryCard>
          ),
        });
      }
    }

    list.sort((a, b) => a.time.localeCompare(b.time));
    return list;
  }, [
    activeFilters,
    dayDrinks, dayUrine, dayBowel, daySleep, dayToilet, dayFood,
    dayMood, daySensory, dayMedication, dayTherapy, dayRoutine,
    deleteDrink, deleteUrineEntry, deleteBowelEntry, deleteSleepEntry,
    deleteToiletAttemptEntry, deleteFoodEntry, deleteMoodEntry,
    deleteSensoryEntry, deleteMedicationEntry, deleteTherapyEntry,
    deleteRoutineEntry,
  ]);

  // --- no child selected ---
  if (!selectedChild) {
    return (
      <div className="pb-20">
        <div className="px-4 pt-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <EmptyState
              icon="👶"
              title="No family profile yet"
              description="Add a child profile or accept a shared invite to start logging."
              actionLabel="Open settings"
              onAction={() => navigate('/settings')}
            />
          </div>
        </div>
      </div>
    );
  }

  const dateLabel = isSameDay(selectedDate, new Date())
    ? "Today's"
    : format(selectedDate, 'EEE, MMM d');

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900">Diary</h1>
        <p className="mt-0.5 text-sm text-gray-500">Review daily updates and tidy up anything you need to change.</p>
      </div>

      {/* Child selector */}
      {children.length > 1 && (
        <div className="px-4 pb-2">
          <select
            value={selectedChildId ?? ''}
            onChange={(e) => selectChild(e.target.value)}
            className="w-full rounded-2xl border border-lavender-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none ring-1 ring-black/5"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Calendar strip */}
      <div className="rounded-2xl bg-white mx-4 shadow-sm ring-1 ring-black/5">
        <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* Module filters — only enabled modules shown as chips [2] */}
      <div className="px-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {visibleModules.map((m) => {
            const active = activeFilters.has(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleFilter(m.key)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-lavender-500 focus-visible:ring-offset-2 ${
                  active
                    ? MODULE_CHIP_ACTIVE[m.key]
                    : MODULE_CHIP_COLOURS[m.key]
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Entry heading */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <h2 className="text-sm font-bold text-gray-700">
          {dateLabel} updates for {selectedChild.name}
        </h2>
        <span className="text-xs text-gray-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Entry list */}
      <div className="space-y-3 px-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <EmptyState
              icon="📭"
              title="No updates found"
              description={activeFilters.size === 0
                ? 'Turn on some filters above to see updates.'
                : 'Nothing has been recorded for this date and filter combination.'}
              actionLabel="Add an update"
              onAction={() => navigate('/add')}
            />
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.key} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              {e.node}
            </div>
          ))
        )}
      </div>

      {/* Floating add entry button */}
      <div className="fixed bottom-24 right-4 z-30">
        <Link
          to="/add"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender-500 text-white shadow-lg shadow-lavender-200 transition hover:bg-lavender-600 active:scale-95"
          aria-label="Add new entry"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  );
}
