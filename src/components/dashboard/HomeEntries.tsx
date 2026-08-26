import { CloudRain, Droplets, Moon, Stethoscope, Target, Apple, Smile, Palette, Pill, Puzzle, ClipboardList } from 'lucide-react';
import EntryCard from '../EntryCard';
import EntryDetail from '../EntryDetail';
import { getModuleLabel, TOILET_OUTCOME_LABELS, URINE_COPY } from '../../content/presentation';
import type { DrinkEntry, UrineEntry, BowelEntry, SleepEntry, ToiletAttemptEntry, FoodEntry, MoodEntry, SensoryEntry, MedicationEntry, TherapyEntry, RoutineEntry } from '../../types';

interface HomeEntriesProps {
  enabled: Set<string>;
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

export default function HomeEntries(props: HomeEntriesProps) {
  const {
    enabled, dayDrinks, dayUrine, dayBowel, daySleep, dayToilet,
    dayFood, dayMood, daySensory, dayMedication, dayTherapy, dayRoutine,
    deleteDrink, deleteUrineEntry, deleteBowelEntry, deleteSleepEntry,
    deleteToiletAttemptEntry, deleteFoodEntry, deleteMoodEntry,
    deleteSensoryEntry, deleteMedicationEntry, deleteTherapyEntry, deleteRoutineEntry,
  } = props;

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

  return (
    <div aria-label="Home entries" className="space-y-3">
      <h2 className="text-sm font-bold text-[var(--foreground)]">Home entries</h2>
      {!hasEntries && (
        <div className="rounded-2xl bg-[var(--card)] py-12 text-center shadow-sm ring-1 ring-[var(--border)]">
          <span className="text-4xl">📋</span>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Nothing logged yet today. Start with the quickest update above.</p>
        </div>
      )}

      {enabled.has('drinks') && dayDrinks.map((drink) => (
        <EntryCard
          key={drink.id}
          icon={<Droplets size={18} className="text-sky-500" />}
          title={`${drink.amountMl}ml - ${drink.type}`}
          subtitle={drink.notes}
          time={drink.time}
          color="bg-sky-50"
          onDelete={() => deleteDrink(drink.id)}
          entryType="drinks"
          entryData={drink as unknown}
        >
          <EntryDetail type="drinks" entry={drink} />
        </EntryCard>
      ))}

      {enabled.has('urine') && dayUrine.map((entry) => {
        const parts = [entry.wet ? URINE_COPY.wetLabel : '', entry.pass ? URINE_COPY.passLabel : ''].filter(Boolean).join(' · ') || 'Update';
        const details = [
          entry.volumeMl ? `${entry.volumeMl}ml` : '',
          entry.urgency ? `${URINE_COPY.urgencyLabel} ${entry.urgency}/5` : '',
          entry.leakageAmount && entry.leakageAmount !== 'none' ? `${URINE_COPY.leakageLabel}: ${entry.leakageAmount}` : '',
        ].filter(Boolean).join(' · ');
        return (
          <EntryCard
            key={entry.id}
            icon={<CloudRain size={18} className="text-amber-500" />}
            title={`${getModuleLabel('urine')}: ${parts}`}
            subtitle={[details, entry.notes].filter(Boolean).join(' — ')}
            time={entry.time}
            color="bg-orange-50"
            onDelete={() => deleteUrineEntry(entry.id)}
            entryType="urine"
            entryData={entry as unknown}
          >
            <EntryDetail type="urine" entry={entry} />
          </EntryCard>
        );
      })}

      {enabled.has('bowel') && dayBowel.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Stethoscope size={18} className="text-emerald-500" />}
           title={`${getModuleLabel('bowel')}: ${entry.location === 'nappy' ? 'Nappy' : 'Toilet'} · ${entry.amount} · Type ${entry.bristolType}`}
           subtitle={`${entry.laxativesGiven ? '💊 Laxatives today. ' : ''}${entry.notes}`}
          time={entry.time}
          color="bg-emerald-50"
          onDelete={() => deleteBowelEntry(entry.id)}
          entryType="bowel"
          entryData={entry as unknown}
        >
          <EntryDetail type="bowel" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('sleep') && daySleep.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Moon size={18} className="text-indigo-500" />}
          title={`Sleep: ${entry.eventType.replaceAll('_', ' ')}${entry.nighttimeEvent ? ' 🌙' : ''}`}
          subtitle={[
            entry.durationMinutes ? `${entry.durationMinutes} min` : '',
            entry.quality ? `Quality ${entry.quality}/5` : '',
            entry.notes,
          ].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#eee8ff]"
          onDelete={() => deleteSleepEntry(entry.id)}
          entryType="sleep"
          entryData={entry as unknown}
        >
          <EntryDetail type="sleep" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('toilet') && dayToilet.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Target size={18} className="text-purple-500" />}
           title={`${getModuleLabel('toilet', 'short')}: ${TOILET_OUTCOME_LABELS[entry.outcome]}`}
          subtitle={[
            entry.supervised ? '👀 Supervised' : '',
            entry.prompted ? '🔔 Prompted' : '',
            entry.durationMinutes ? `${entry.durationMinutes} min` : '',
            entry.notes,
          ].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#f3eeff]"
          onDelete={() => deleteToiletAttemptEntry(entry.id)}
          entryType="toilet"
          entryData={entry as unknown}
        >
          <EntryDetail type="toilet" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('food') && dayFood.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Apple size={18} className="text-orange-500" />}
          title={`${entry.mealType}: ${entry.description}`}
          subtitle={[
            entry.portions ? `${entry.portions} portions` : '',
            entry.notes,
          ].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#fff5eb]"
          onDelete={() => deleteFoodEntry(entry.id)}
          entryType="food"
          entryData={entry as unknown}
        >
          <EntryDetail type="food" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('mood') && dayMood.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Smile size={18} className="text-pink-500" />}
          title={`Mood: Level ${entry.level}/5`}
          subtitle={[entry.triggers ? `Triggers: ${entry.triggers}` : '', entry.notes].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#fce4ec]"
          onDelete={() => deleteMoodEntry(entry.id)}
          entryType="mood"
          entryData={entry as unknown}
        >
          <EntryDetail type="mood" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('sensory') && daySensory.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Palette size={18} className="text-teal-500" />}
          title={`Sensory: ${entry.sensoryType} (${entry.response})`}
          subtitle={[`Intensity ${entry.intensity}/5`, entry.notes].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#e0f2f1]"
          onDelete={() => deleteSensoryEntry(entry.id)}
          entryType="sensory"
          entryData={entry as unknown}
        >
          <EntryDetail type="sensory" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('medication') && dayMedication.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Pill size={18} className="text-red-500" />}
          title={`${entry.name} ${entry.dosage}`}
          subtitle={entry.notes}
          time={entry.time}
          color="bg-[#ffebee]"
          onDelete={() => deleteMedicationEntry(entry.id)}
          entryType="medication"
          entryData={entry as unknown}
        >
          <EntryDetail type="medication" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('therapy') && dayTherapy.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<Puzzle size={18} className="text-cyan-500" />}
          title={`${entry.therapyType} therapy (${entry.durationMinutes}min)`}
          subtitle={[entry.provider ? `Provider: ${entry.provider}` : '', entry.goals ? `Goals: ${entry.goals}` : '', entry.notes].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#e0f7fa]"
          onDelete={() => deleteTherapyEntry(entry.id)}
          entryType="therapy"
          entryData={entry as unknown}
        >
          <EntryDetail type="therapy" entry={entry} />
        </EntryCard>
      ))}

      {enabled.has('routine') && dayRoutine.map((entry) => (
        <EntryCard
          key={entry.id}
          icon={<ClipboardList size={18} className="text-lime-600" />}
          title={`${entry.routineName} ${entry.completed ? '✅' : '❌'}`}
          subtitle={[entry.durationMinutes ? `${entry.durationMinutes} min` : '', entry.notes].filter(Boolean).join(' · ')}
          time={entry.time}
          color="bg-[#f0f4c3]"
          onDelete={() => deleteRoutineEntry(entry.id)}
          entryType="routine"
          entryData={entry as unknown}
        >
          <EntryDetail type="routine" entry={entry} />
        </EntryCard>
      ))}
    </div>
  );
}
