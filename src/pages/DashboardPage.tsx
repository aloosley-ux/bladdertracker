import { useMemo, type ReactNode } from 'react';
import { format } from 'date-fns';
import { Apple, BarChart3, BookOpen, CloudRain, ClipboardList, Droplets, Moon, Palette, Pill, Plus, Puzzle, Smile, Star, Stethoscope, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import EntryCard from '../components/EntryCard';

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

  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const todayLabel = format(today, 'EEEE, MMMM d');

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
  const urineSub = totalOutput > 0 ? `${totalOutput}ml output` : `${wetCount} wet · ${passCount} pass`;

  const hasEntries =
    dayDrinks.length + dayUrine.length + dayBowel.length + daySleep.length +
    dayToilet.length + dayFood.length + dayMood.length + daySensory.length +
    dayMedication.length + dayTherapy.length + dayRoutine.length > 0;

  if (!selectedChild) {
    return (
      <div className="pb-20 bg-white min-h-screen">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-bold text-gray-900">No child profile yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add a child in Settings or accept a caregiver invite to start tracking.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white" to="/settings">
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
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white pb-4">
        <div className="flex flex-col gap-1 px-4 pt-6">
          <h1 className="text-xl font-bold leading-snug text-gray-900" aria-label="Dashboard heading">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">Today&apos;s overview for {selectedChild.name}</p>
          <p className="text-xs text-gray-400">{todayLabel}</p>
        </div>

        {children.length > 1 && (
          <select
            aria-label="Select child"
            value={selectedChildId ?? ''}
            onChange={(event) => selectChild(event.target.value)}
            className="mx-4 mt-3 mb-2 w-[calc(100%-2rem)] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        )}

        {/* Quick nav links */}
        <nav aria-label="Quick navigation" className="mt-3 flex gap-2 px-4">
          <Link
            to="/log"
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <BookOpen size={14} />
            View Log
          </Link>
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <BarChart3 size={14} />
            Reports
          </Link>
          <Link
            to="/add"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={14} />
            Add Entry
          </Link>
        </nav>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* Quick-add buttons */}
        <section aria-label="Quick add buttons" className="grid grid-cols-3 gap-3 md:grid-cols-4">
          <Link
            to="/add" state={{ tab: 'drink' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🥤</span>
            <span className="text-xs font-semibold text-gray-700">Drink</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'urine' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">💦</span>
            <span className="text-xs font-semibold text-gray-700">Urine</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'bowel' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🚽</span>
            <span className="text-xs font-semibold text-gray-700">Bowel</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'sleep' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🌙</span>
            <span className="text-xs font-semibold text-gray-700">Sleep</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'toilet' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🎯</span>
            <span className="text-xs font-semibold text-gray-700">Attempt</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'food' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🍽️</span>
            <span className="text-xs font-semibold text-gray-700">Food</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'mood' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">😊</span>
            <span className="text-xs font-semibold text-gray-700">Mood</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'sensory' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🎨</span>
            <span className="text-xs font-semibold text-gray-700">Sensory</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'medication' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">💊</span>
            <span className="text-xs font-semibold text-gray-700">Meds</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'therapy' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🧩</span>
            <span className="text-xs font-semibold text-gray-700">Therapy</span>
          </Link>
          <Link
            to="/add" state={{ tab: 'routine' }}
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">📋</span>
            <span className="text-xs font-semibold text-gray-700">Routine</span>
          </Link>
          <Link
            to="/add"
            className="relative flex flex-col items-center gap-2 rounded-2xl bg-white py-4 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[11px] font-bold leading-none text-white shadow-sm">⭐</span>
            <span className="text-2xl">⭐</span>
            <span className="text-xs font-semibold text-gray-700">Milestones</span>
          </Link>
        </section>

        {/* Summary stat cards */}
        <section aria-label="Today's summary" className="grid grid-cols-3 gap-3 md:grid-cols-4">
          <SummaryCard icon={<Droplets size={18} className="text-sky-500" />} label="Drinks" value={`${totalMl}ml`} sub={`${dayDrinks.length} entries`} />
          <SummaryCard icon={<CloudRain size={18} className="text-amber-500" />} label="Urine" value={`${wetCount + passCount}`} sub={urineSub} />
          <SummaryCard icon={<Stethoscope size={18} className="text-emerald-500" />} label="Bowel" value={`${bowelCount}`} sub="events" />
          <SummaryCard icon={<Moon size={18} className="text-indigo-500" />} label="Sleep" value={`${sleepCount}`} sub="events" />
          <SummaryCard icon={<Target size={18} className="text-purple-500" />} label="Attempts" value={`${toiletCount}`} sub="logged" />
          <SummaryCard icon={<Apple size={18} className="text-orange-500" />} label="Food" value={`${foodCount}`} sub="meals" />
          <SummaryCard icon={<Smile size={18} className="text-pink-500" />} label="Mood" value={`${moodCount}`} sub="entries" />
          <SummaryCard icon={<Palette size={18} className="text-teal-500" />} label="Sensory" value={`${sensoryCount}`} sub="events" />
          <SummaryCard icon={<Pill size={18} className="text-red-500" />} label="Meds" value={`${medicationCount}`} sub="doses" />
          <SummaryCard icon={<Puzzle size={18} className="text-cyan-500" />} label="Therapy" value={`${therapyCount}`} sub="sessions" />
          <SummaryCard icon={<ClipboardList size={18} className="text-lime-600" />} label="Routine" value={`${routineCount}`} sub="entries" />
          <SummaryCard icon={<Star size={18} className="text-yellow-500" />} label="Milestones" value={`${milestoneAchieved}`} sub={`of ${childMilestones.length}`} />
        </section>

        {/* Today's entries feed */}
        <div aria-label="Today's entries" className="space-y-3">
          {!hasEntries && (
            <div className="rounded-2xl bg-white py-12 text-center shadow-sm ring-1 ring-black/5">
              <span className="text-4xl">📋</span>
              <p className="mt-2 text-sm text-gray-400">No entries yet today. Tap a quick-add button to begin.</p>
            </div>
          )}

          {dayDrinks.map((drink) => (
            <EntryCard
              key={drink.id}
              icon={<Droplets size={18} className="text-sky-500" />}
              title={`${drink.amountMl}ml - ${drink.type}`}
              subtitle={drink.notes}
              time={drink.time}
              color="bg-sky-light"
              onDelete={() => deleteDrink(drink.id)}
            />
          ))}

          {dayUrine.map((entry) => {
            const parts = [entry.wet ? 'Wet' : '', entry.pass ? 'Pass' : ''].filter(Boolean).join(' · ') || 'Event';
            const details = [
              entry.volumeMl ? `${entry.volumeMl}ml` : '',
              entry.urgency ? `Urgency ${entry.urgency}/5` : '',
              entry.leakageAmount && entry.leakageAmount !== 'none' ? `Leak: ${entry.leakageAmount}` : '',
            ].filter(Boolean).join(' · ');
            return (
              <EntryCard
                key={entry.id}
                icon={<CloudRain size={18} className="text-amber-500" />}
                title={`Urine: ${parts}`}
                subtitle={[details, entry.notes].filter(Boolean).join(' — ')}
                time={entry.time}
                color="bg-peach"
                onDelete={() => deleteUrineEntry(entry.id)}
              />
            );
          })}

          {dayBowel.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Stethoscope size={18} className="text-emerald-500" />}
              title={`Bowel: ${entry.location} - ${entry.amount} (Type ${entry.bristolType})`}
              subtitle={`${entry.laxativesGiven ? '💊 Laxatives given. ' : ''}${entry.notes}`}
              time={entry.time}
              color="bg-mint"
              onDelete={() => deleteBowelEntry(entry.id)}
            />
          ))}

          {daySleep.map((entry) => (
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
            />
          ))}

          {dayToilet.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Target size={18} className="text-purple-500" />}
              title={`Toilet: ${entry.outcome === 'success' ? '✅ Success' : entry.outcome === 'failure' ? '❌ No result' : '🚫 Refused'}`}
              subtitle={[
                entry.supervised ? '👀 Supervised' : '',
                entry.prompted ? '🔔 Prompted' : '',
                entry.durationMinutes ? `${entry.durationMinutes} min` : '',
                entry.notes,
              ].filter(Boolean).join(' · ')}
              time={entry.time}
              color="bg-[#f3eeff]"
              onDelete={() => deleteToiletAttemptEntry(entry.id)}
            />
          ))}

          {dayFood.map((entry) => (
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
            />
          ))}

          {dayMood.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Smile size={18} className="text-pink-500" />}
              title={`Mood: Level ${entry.level}/5`}
              subtitle={[entry.triggers ? `Triggers: ${entry.triggers}` : '', entry.notes].filter(Boolean).join(' · ')}
              time={entry.time}
              color="bg-[#fce4ec]"
              onDelete={() => deleteMoodEntry(entry.id)}
            />
          ))}

          {daySensory.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Palette size={18} className="text-teal-500" />}
              title={`Sensory: ${entry.sensoryType} (${entry.response})`}
              subtitle={[`Intensity ${entry.intensity}/5`, entry.notes].filter(Boolean).join(' · ')}
              time={entry.time}
              color="bg-[#e0f2f1]"
              onDelete={() => deleteSensoryEntry(entry.id)}
            />
          ))}

          {dayMedication.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Pill size={18} className="text-red-500" />}
              title={`${entry.name} ${entry.dosage}`}
              subtitle={entry.notes}
              time={entry.time}
              color="bg-[#ffebee]"
              onDelete={() => deleteMedicationEntry(entry.id)}
            />
          ))}

          {dayTherapy.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<Puzzle size={18} className="text-cyan-500" />}
              title={`${entry.therapyType} therapy (${entry.durationMinutes}min)`}
              subtitle={[entry.provider ? `Provider: ${entry.provider}` : '', entry.goals ? `Goals: ${entry.goals}` : '', entry.notes].filter(Boolean).join(' · ')}
              time={entry.time}
              color="bg-[#e0f7fa]"
              onDelete={() => deleteTherapyEntry(entry.id)}
            />
          ))}

          {dayRoutine.map((entry) => (
            <EntryCard
              key={entry.id}
              icon={<ClipboardList size={18} className="text-lime-600" />}
              title={`${entry.routineName} ${entry.completed ? '✅' : '❌'}`}
              subtitle={[entry.durationMinutes ? `${entry.durationMinutes} min` : '', entry.notes].filter(Boolean).join(' · ')}
              time={entry.time}
              color="bg-[#f0f4c3]"
              onDelete={() => deleteRoutineEntry(entry.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-black/5">
      <div className="mb-1 flex justify-center">{icon}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
      <div className="text-[10px] font-semibold uppercase text-gray-600">{label}</div>
      <div className="text-[10px] text-gray-400">{sub}</div>
    </div>
  );
}
