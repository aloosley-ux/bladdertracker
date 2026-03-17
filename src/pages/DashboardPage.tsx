import { useMemo, type ReactNode } from 'react';
import { format } from 'date-fns';
import { Apple, CloudRain, ClipboardList, Droplets, Moon, Palette, Pill, Puzzle, Smile, Stethoscope, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import EntryCard from '../components/EntryCard';
import EntryDetail from '../components/EntryDetail';
import CelebrationBanner from '../components/CelebrationBanner';
import PageShell from '../components/PageShell';
import TodayCombined from '../components/TodayCombined';
import { getDashboardCelebration, getModuleLabel, TOILET_OUTCOME_LABELS, URINE_COPY } from '../content/presentation';
import { DEFAULT_MODULES } from '../types';

/** Fallback used during the brief loading window before enabledModules is populated. */
const DEFAULT_ENABLED = new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id));
const SNOOZE_DURATION_MS = 60 * 60 * 1000;

export default function DashboardPage() {
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

  // Use default-enabled set as fallback during the brief startup loading window
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
    (on('drinks') && dayDrinks.length > 0) ||
    (on('urine') && dayUrine.length > 0) ||
    (on('bowel') && dayBowel.length > 0) ||
    (on('sleep') && daySleep.length > 0) ||
    (on('toilet') && dayToilet.length > 0) ||
    (on('food') && dayFood.length > 0) ||
    (on('mood') && dayMood.length > 0) ||
    (on('sensory') && daySensory.length > 0) ||
    (on('medication') && dayMedication.length > 0) ||
    (on('therapy') && dayTherapy.length > 0) ||
    (on('routine') && dayRoutine.length > 0);

  if (!selectedChild) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl font-bold text-gray-900">No family profile yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Add a child profile or accept a shared invite to start tracking.
              </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link className="rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white" to="/settings">
                Open settings
              </Link>
              <Link className="rounded-full bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700" to="/profiles">
                View profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-[var(--bg-primary)] min-h-screen">
      <PageShell
        heroAssetKey="pageDashboardHero"
        heroContent={(
          <div className="pb-4">
            <div className="flex flex-col gap-1 px-4 pt-6">
              <h1 className="text-xl font-bold leading-snug text-[var(--text-primary)]" aria-label="Dashboard heading">
                Home
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">Quickly capture and review drinks, sleeps, visits and meals for {selectedChild.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{todayLabel}</p>
            </div>

            {children.length > 1 && (
              <select
                aria-label="Select child"
                value={selectedChildId ?? ''}
                onChange={(event) => selectChild(event.target.value)}
                className="mx-4 mt-3 mb-2 w-[calc(100%-2rem)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] shadow-sm outline-none"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      >
      <div className="space-y-4 px-4 pt-4">
        {dueReminders.length > 0 && selectedChildId && (
          <section aria-label="Reminders" className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <h2 className="text-sm font-bold text-violet-900">Reminders</h2>
            <p className="mt-1 text-xs text-violet-700">
              {dueReminders.length} reminder{dueReminders.length > 1 ? 's are' : ' is'} active for {selectedChild.name}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/settings" className="rounded-full bg-violet-700 px-4 py-2 text-xs font-semibold text-white">
                Review reminders
              </Link>
              <button
                type="button"
                onClick={() =>
                  setReminderPreferences(
                    selectedChildId,
                    dueReminders.map((entry) => ({
                      ...entry,
                      snoozedUntil: new Date(Date.now() + SNOOZE_DURATION_MS).toISOString(),
                    })),
                  )
                }
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-800"
              >
                Snooze 1 hour
              </button>
            </div>
          </section>
        )}

        <CelebrationBanner
          emoji={celebration.emoji}
          title={celebration.title}
          message={celebration.message}
          tone={celebration.tone}
          dismissible
          action={(
            <Link to="/add" className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
              Add a quick update
            </Link>
          )}
        />

        <TodayCombined
          summary={(
            <section aria-label="Home summary">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Home snapshot</h2>
                <p className="text-xs text-[var(--text-secondary)]">At-a-glance totals</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {on('drinks') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🥤</span>}
                    label={getModuleLabel('drinks', 'summary')}
                    value={`${totalMl}ml`}
                    sub={`${dayDrinks.length} entries`}
                    accent="#0ea5e9"
                    addTo="/add"
                    addTab="drink"
                  />
                )}
                {on('urine') && (
                  <SummaryCard
                    icon={<span className="text-2xl">💦</span>}
                    label={getModuleLabel('urine', 'summary')}
                    value={`${wetCount + passCount}`}
                    sub={urineSub}
                    accent="#f59e0b"
                    addTo="/add"
                    addTab="urine"
                  />
                )}
                {on('bowel') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🚽</span>}
                    label={getModuleLabel('bowel', 'summary')}
                    value={`${bowelCount}`}
                    sub="entries"
                    accent="#22c55e"
                    addTo="/add"
                    addTab="bowel"
                  />
                )}
                {on('sleep') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🌙</span>}
                    label="Sleep"
                    value={`${sleepCount}`}
                    sub="events"
                    accent="#6366f1"
                    addTo="/add"
                    addTab="sleep"
                  />
                )}
                {on('toilet') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🎯</span>}
                    label={getModuleLabel('toilet', 'summary')}
                    value={`${toiletCount}`}
                    sub="logged"
                    accent="#a855f7"
                    addTo="/add"
                    addTab="toilet"
                  />
                )}
                {on('food') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🍽️</span>}
                    label={getModuleLabel('food', 'summary')}
                    value={`${foodCount}`}
                    sub="logged"
                    accent="#f97316"
                    addTo="/add"
                    addTab="food"
                  />
                )}
                {on('mood') && (
                  <SummaryCard
                    icon={<span className="text-2xl">😊</span>}
                    label="Mood"
                    value={`${moodCount}`}
                    sub="entries"
                    accent="#ec4899"
                    addTo="/add"
                    addTab="mood"
                  />
                )}
                {on('sensory') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🎨</span>}
                    label="Sensory"
                    value={`${sensoryCount}`}
                    sub="events"
                    accent="#14b8a6"
                    addTo="/add"
                    addTab="sensory"
                  />
                )}
                {on('medication') && (
                  <SummaryCard
                    icon={<span className="text-2xl">💊</span>}
                    label="Meds"
                    value={`${medicationCount}`}
                    sub="doses"
                    accent="#ef4444"
                    addTo="/add"
                    addTab="medication"
                  />
                )}
                {on('therapy') && (
                  <SummaryCard
                    icon={<span className="text-2xl">🧩</span>}
                    label="Therapy"
                    value={`${therapyCount}`}
                    sub="sessions"
                    accent="#06b6d4"
                    addTo="/add"
                    addTab="therapy"
                  />
                )}
                {on('routine') && (
                  <SummaryCard
                    icon={<span className="text-2xl">📋</span>}
                    label="Routine"
                    value={`${routineCount}`}
                    sub="entries"
                    accent="#84cc16"
                    addTo="/add"
                    addTab="routine"
                  />
                )}
                {on('milestones') && (
                  <SummaryCard
                    icon={<span className="text-2xl">⭐</span>}
                    label="Milestones"
                    value={`${milestoneAchieved}`}
                    sub={`of ${childMilestones.length}`}
                    accent="#eab308"
                    addTo="/milestones#top"
                    addTab={undefined}
                  />
                )}
              </div>
            </section>
          )}
          quickAdd={null}
        />

        {/* ── Today's entries feed ──────────────────────────────────── */}
        <div aria-label="Home entries" className="space-y-3">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Home entries</h2>
          {!hasEntries && (
            <div className="rounded-2xl bg-[var(--bg-card)] py-12 text-center shadow-sm ring-1 ring-[var(--border-color)]">
              <span className="text-4xl">📋</span>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Nothing logged yet today. Start with the quickest update above.</p>
            </div>
          )}

          {on('drinks') && dayDrinks.map((drink) => (
            <EntryCard
              key={drink.id}
              icon={<Droplets size={18} className="text-sky-500" />}
              title={`${drink.amountMl}ml - ${drink.type}`}
              subtitle={drink.notes}
              time={drink.time}
              color="bg-sky-light"
              onDelete={() => deleteDrink(drink.id)}
              entryType="drinks"
              entryData={drink as unknown}
            >
              <EntryDetail type="drinks" entry={drink} />
            </EntryCard>
          ))}

          {on('urine') && dayUrine.map((entry) => {
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
                color="bg-peach"
                onDelete={() => deleteUrineEntry(entry.id)}
                entryType="urine"
                entryData={entry as unknown}
              >
                <EntryDetail type="urine" entry={entry} />
              </EntryCard>
            );
          })}

          {on('bowel') && dayBowel.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Stethoscope size={18} className="text-emerald-500" />}
               title={`${getModuleLabel('bowel')}: ${entry.location === 'nappy' ? 'Nappy' : 'Toilet'} · ${entry.amount} · Type ${entry.bristolType}`}
               subtitle={`${entry.laxativesGiven ? '💊 Laxatives today. ' : ''}${entry.notes}`}
              time={entry.time}
              color="bg-mint"
              onDelete={() => deleteBowelEntry(entry.id)}
              entryType="bowel"
              entryData={entry as unknown}
            >
              <EntryDetail type="bowel" entry={entry} />
            </EntryCard>
          ))}

          {on('sleep') && daySleep.map((entry) => (
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

          {on('toilet') && dayToilet.map((entry) => (
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

          {on('food') && dayFood.map((entry) => (
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

          {on('mood') && dayMood.map((entry) => (
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

          {on('sensory') && daySensory.map((entry) => (
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

          {on('medication') && dayMedication.map((entry) => (
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

          {on('therapy') && dayTherapy.map((entry) => (
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

          {on('routine') && dayRoutine.map((entry) => (
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
      </div>
      </PageShell>
    </div>
  );
}

/* QuickAddBtn removed — quick-add functionality merged into SummaryCard */

/** Summary stat card with coloured top border [3] high-contrast */
function SummaryCard({ icon, label, value, sub, accent, addTo, addTab }: { icon: ReactNode; label: string; value: string; sub: string; accent: string; addTo?: string; addTab?: string | undefined }) {
  const CardWrapper = (addTo ? Link : 'div') as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    <CardWrapper
      to={addTo}
      state={addTab ? { tab: addTab } : undefined}
      aria-label={addTo ? `Add ${label} entry` : undefined}
      className="rounded-2xl bg-[var(--bg-card)] pt-6 pb-3 px-3 pr-12 shadow-sm ring-1 ring-[var(--border-color)] overflow-hidden relative block min-h-[72px]"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <span
        className="absolute right-5 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold leading-none text-white shadow-sm"
        style={{ background: accent }}
        aria-hidden="true"
      >
        +
      </span>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-full p-2 bg-[var(--bg-secondary)] flex items-center justify-center">{icon}</div>
          <div className="text-sm font-semibold text-[var(--text-secondary)]">{label}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-base font-bold text-[var(--text-primary)] leading-tight">{value}</div>
          <div className="text-[10px] text-[var(--text-secondary)]">{sub}</div>
        </div>
      </div>
    </CardWrapper>
  );
}
