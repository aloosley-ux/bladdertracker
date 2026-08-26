import { useMemo } from 'react';
import { CloudRain, Droplets, Moon, Stethoscope, Target, Apple, Smile, Palette, Pill, Puzzle, ClipboardList } from 'lucide-react';
import EntryCard from '../components/EntryCard';
import EntryDetail from '../components/EntryDetail';
import { getModuleLabel, TOILET_OUTCOME_LABELS, URINE_COPY } from '../content/presentation';
import type { ModuleKey } from './useLogPage';
import type { DrinkEntry, UrineEntry, BowelEntry, SleepEntry, ToiletAttemptEntry, FoodEntry, MoodEntry, SensoryEntry, MedicationEntry, TherapyEntry, RoutineEntry } from '../types';

export interface LogEntry {
  key: string;
  time: string;
  node: React.ReactNode;
}

interface UseLogEntryListParams {
  activeFilters: Set<ModuleKey>;
  dayDrinks: DrinkEntry[];
  dayUrine: UrineEntry[];
  dayBowel: BowelEntry[];
  daySleep: SleepEntry[];
  dayToilet: ToiletAttemptEntry[];
  dayFood: FoodEntry[];
  dayMood: MoodEntry[];
  daySensory: SensoryEntry[];
  dayMedication: MedicationEntry[];
  dayTherapy: TherapyEntry[];
  dayRoutine: RoutineEntry[];
  deleteDrink: (id: string) => void;
  deleteUrineEntry: (id: string) => void;
  deleteBowelEntry: (id: string) => void;
  deleteSleepEntry: (id: string) => void;
  deleteToiletAttemptEntry: (id: string) => void;
  deleteFoodEntry: (id: string) => void;
  deleteMoodEntry: (id: string) => void;
  deleteSensoryEntry: (id: string) => void;
  deleteMedicationEntry: (id: string) => void;
  deleteTherapyEntry: (id: string) => void;
  deleteRoutineEntry: (id: string) => void;
}

export function useLogEntryList(params: UseLogEntryListParams) {
  const {
    activeFilters,
    dayDrinks, dayUrine, dayBowel, daySleep, dayToilet,
    dayFood, dayMood, daySensory, dayMedication, dayTherapy, dayRoutine,
    deleteDrink, deleteUrineEntry, deleteBowelEntry, deleteSleepEntry,
    deleteToiletAttemptEntry, deleteFoodEntry, deleteMoodEntry,
    deleteSensoryEntry, deleteMedicationEntry, deleteTherapyEntry, deleteRoutineEntry,
  } = params;

  return useMemo(() => {
    const list: LogEntry[] = [];

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
              color="bg-sky-50"
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
              color="bg-orange-50"
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
              color="bg-emerald-50"
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
}
