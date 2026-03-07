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
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import CalendarStrip from '../components/CalendarStrip';
import EntryCard from '../components/EntryCard';

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

const MODULE_META: { key: ModuleKey; label: string; emoji: string }[] = [
  { key: 'drinks', label: 'Drinks', emoji: '🥤' },
  { key: 'urine', label: 'Urine', emoji: '💦' },
  { key: 'bowel', label: 'Bowel', emoji: '🚽' },
  { key: 'sleep', label: 'Sleep', emoji: '🌙' },
  { key: 'toilet', label: 'Toilet', emoji: '🎯' },
  { key: 'food', label: 'Food', emoji: '🍽️' },
  { key: 'mood', label: 'Mood', emoji: '😊' },
  { key: 'sensory', label: 'Sensory', emoji: '🎨' },
  { key: 'medication', label: 'Medication', emoji: '💊' },
  { key: 'therapy', label: 'Therapy', emoji: '🧩' },
  { key: 'routine', label: 'Routine', emoji: '📋' },
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<Set<ModuleKey>>(
    () => new Set(MODULE_META.map((m) => m.key)),
  );

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const toggleFilter = (key: ModuleKey) => {
    setActiveFilters((prev) => {
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
            />
          ),
        });
      }
    }

    if (activeFilters.has('urine')) {
      for (const e of dayUrine) {
        const parts =
          [e.wet ? 'Wet' : '', e.pass ? 'Pass' : ''].filter(Boolean).join(' · ') || 'Event';
        const details = [
          e.volumeMl ? `${e.volumeMl}ml` : '',
          e.urgency ? `Urgency ${e.urgency}/5` : '',
          e.leakageAmount && e.leakageAmount !== 'none' ? `Leak: ${e.leakageAmount}` : '',
        ]
          .filter(Boolean)
          .join(' · ');
        list.push({
          key: `urine-${e.id}`,
          time: e.time,
          node: (
            <EntryCard
              icon={<CloudRain size={18} className="text-amber-500" />}
              title={`Urine: ${parts}`}
              subtitle={[details, e.notes].filter(Boolean).join(' — ')}
              time={e.time}
              color="bg-peach"
              onDelete={() => deleteUrineEntry(e.id)}
            />
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
              title={`Bowel: ${e.location} – ${e.amount} (Type ${e.bristolType})`}
              subtitle={`${e.laxativesGiven ? '💊 Laxatives given. ' : ''}${e.notes}`}
              time={e.time}
              color="bg-mint"
              onDelete={() => deleteBowelEntry(e.id)}
            />
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
            />
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
              title={`Toilet: ${e.outcome === 'success' ? '✅ Success' : e.outcome === 'failure' ? '❌ No result' : '🚫 Refused'}`}
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
            />
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
            />
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
            />
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
            />
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
            />
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
            />
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
            />
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
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <h1 className="text-2xl font-bold text-gray-900">No child profile yet</h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a child in Settings or accept a caregiver invite to start logging.
            </p>
            <Link
              className="mt-4 inline-block rounded-full bg-lavender-500 px-5 py-3 text-sm font-semibold text-white"
              to="/profile"
            >
              Open settings
            </Link>
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
        <h1 className="text-xl font-bold text-gray-900">Log / History</h1>
        <p className="mt-0.5 text-sm text-gray-500">View and manage all recorded entries</p>
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

      {/* Module filters */}
      <div className="px-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {MODULE_META.map((m) => {
            const active = activeFilters.has(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleFilter(m.key)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-lavender-500 focus-visible:ring-offset-2 ${
                  active
                    ? 'bg-lavender-500 text-white shadow-sm'
                    : 'bg-white text-gray-500 ring-1 ring-black/5 hover:bg-gray-50'
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
          {dateLabel} Entries for {selectedChild.name}
        </h2>
        <span className="text-xs text-gray-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Entry list */}
      <div className="space-y-3 px-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-3xl">📭</p>
            <p className="mt-2 text-sm font-semibold text-gray-700">No entries found</p>
            <p className="mt-1 text-xs text-gray-400">
              {activeFilters.size === 0
                ? 'Enable some filters above to see entries.'
                : 'Nothing recorded for this date and the selected filters.'}
            </p>
            <Link
              to="/add"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-lavender-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lavender-600"
            >
              <Plus size={16} />
              Add entry
            </Link>
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
