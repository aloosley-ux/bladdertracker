import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, isSameDay } from 'date-fns';
import { Bell, CloudRain, Download, Droplets, Stethoscope, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import CalendarStrip from '../components/CalendarStrip';
import EntryCard from '../components/EntryCard';
import BrandBanner from '../components/BrandBanner';

export default function DashboardPage() {
  const {
    selectedChild,
    drinks,
    urineEntries,
    bowelEntries,
    selectedChildId,
    children,
    selectChild,
    deleteDrink,
    deleteUrineEntry,
    deleteBowelEntry,
    exportData,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goalDismissed, setGoalDismissed] = useState(false);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  // Scroll to top whenever this page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const dayDrinks = useMemo(
    () => drinks.filter((drink) => drink.childId === selectedChildId && drink.date === dateStr),
    [drinks, selectedChildId, dateStr]
  );
  const dayUrine = useMemo(
    () => urineEntries.filter((entry) => entry.childId === selectedChildId && entry.date === dateStr),
    [urineEntries, selectedChildId, dateStr]
  );
  const dayBowel = useMemo(
    () => bowelEntries.filter((entry) => entry.childId === selectedChildId && entry.date === dateStr),
    [bowelEntries, selectedChildId, dateStr]
  );

  const totalMl = dayDrinks.reduce((sum, drink) => sum + drink.amountMl, 0);
  const totalOutput = dayUrine.reduce((sum, entry) => sum + (entry.volumeMl || 0), 0);
  const wetCount = dayUrine.filter((entry) => entry.wet).length;
  const passCount = dayUrine.filter((entry) => entry.pass).length;
  const bowelCount = dayBowel.length;

  if (!selectedChild) {
    return (
      <div className="pb-20">
        <BrandBanner />
        <div className="px-4 pt-2">
          <div className="rounded-[2rem] bg-white p-6 text-center shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
            <h1 className="text-2xl font-bold text-gray-900">No child profile yet</h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a child in Settings or accept a caregiver invite to start journaling.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link className="rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white" to="/profile">
                Open settings
              </Link>
              <Link className="rounded-full bg-[#f7f1ff] px-4 py-3 text-sm font-semibold text-lavender-700" to="/caregiver">
                View caregiver portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Brand banner */}
      <div className="rounded-b-[2rem] bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4 shadow-sm">
        <BrandBanner />
        {/* Header row with title and export button */}
        <div className="flex items-start justify-between gap-2 px-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-base font-bold leading-snug text-gray-900">
              Your Journal for {selectedChild?.name}
            </h1>
            <p className="text-xs text-gray-500">Quickly capture entries, review progress, and be prepared for care discussions.</p>
          </div>
          <button
            onClick={exportData}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lavender-600 shadow-sm ring-1 ring-lavender-100 transition hover:bg-lavender-50"
            title="Export diary"
          >
            <Download size={16} />
          </button>
        </div>

        {children.length > 1 && (
          <select
            value={selectedChildId ?? ''}
            onChange={(event) => selectChild(event.target.value)}
            className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-2xl border border-lavender-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm outline-none"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        )}

        <div className="px-4">
          <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* Entries heading — near top for immediate visibility */}
        <div className="px-1">
          <h2 className="text-sm font-bold text-gray-700">
            {isSameDay(selectedDate, new Date()) ? "Today's" : format(selectedDate, 'EEE, MMM d')} Entries
          </h2>
        </div>

        {/* Quick action buttons — Drink, Urine, Bowel */}
        <section className="grid grid-cols-3 gap-3">
          <Link
            to="/add"
            state={{ tab: 'drink' }}
            className="relative flex flex-col items-center gap-2 rounded-[1.5rem] bg-[#eef8ff] py-4 shadow-sm ring-1 ring-sky-100 transition hover:bg-sky-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🥤</span>
            <span className="text-xs font-semibold text-sky-700">Drink</span>
          </Link>
          <Link
            to="/add"
            state={{ tab: 'urine' }}
            className="relative flex flex-col items-center gap-2 rounded-[1.5rem] bg-peach py-4 shadow-sm ring-1 ring-amber-100 transition hover:bg-amber-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">💦</span>
            <span className="text-xs font-semibold text-amber-700">Urine</span>
          </Link>
          <Link
            to="/add"
            state={{ tab: 'bowel' }}
            className="relative flex flex-col items-center gap-2 rounded-[1.5rem] bg-mint py-4 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-50 active:scale-95"
          >
            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold leading-none text-white shadow-sm">+</span>
            <span className="text-2xl">🚽</span>
            <span className="text-xs font-semibold text-emerald-700">Bowel</span>
          </Link>
        </section>

        {/* Summary stats */}
        <section className="grid grid-cols-3 gap-3">
          <SummaryCard icon={<Droplets size={18} className="text-sky-500" />} label="Drinks" value={`${totalMl}ml`} sub={`${dayDrinks.length} entries`} bg="bg-sky-light" />
          <SummaryCard icon={<CloudRain size={18} className="text-amber-500" />} label="Urine" value={`${wetCount + passCount}`} sub={totalOutput > 0 ? `${totalOutput}ml output` : `${wetCount} wet · ${passCount} pass`} bg="bg-peach" />
          <SummaryCard icon={<Stethoscope size={18} className="text-emerald-500" />} label="Bowel" value={`${bowelCount}`} sub="events" bg="bg-mint" />
        </section>

        {/* Fluid balance */}
        {totalOutput > 0 && (
          <section className="rounded-[1.75rem] bg-gradient-to-r from-sky-50 to-amber-50 p-4 shadow-sm ring-1 ring-white/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lavender-600 shadow-sm">⚖️</div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Daily Fluid Balance</h3>
                  <p className="text-xs text-gray-500">Intake vs measured output</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{totalMl > 0 ? `${Math.round((totalOutput / totalMl) * 100)}%` : '—'}</div>
                <div className="text-[10px] text-gray-500">{totalMl}ml in · {totalOutput}ml out</div>
              </div>
            </div>
          </section>
        )}

        {/* Today's goal — dismissable banner */}
        {!goalDismissed && (
          <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lavender-50 text-lavender-600">
                <Bell size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Today&apos;s goal</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-500">
                  <li>Spend quality time reviewing hydration before school pick-up.</li>
                  <li>Prompt toilet visits every 2–3 hours where appropriate.</li>
                  <li>Use the caregiver portal for bulk imports or shared notes.</li>
                </ul>
              </div>
              <button
                onClick={() => setGoalDismissed(true)}
                className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </section>
        )}

        {/* Entries feed */}
        <div className="space-y-3">
          {dayDrinks.length === 0 && dayUrine.length === 0 && dayBowel.length === 0 && (
            <div className="rounded-[1.75rem] bg-white py-12 text-center shadow-sm ring-1 ring-black/5">
              <span className="text-4xl">📋</span>
              <p className="mt-2 text-sm text-gray-400">No entries yet for this day</p>
              <p className="mt-1 text-xs text-gray-300">Tap Drink, Urine, or Bowel above to begin</p>
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
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  bg,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-[1.5rem] p-3 text-center shadow-sm ring-1 ring-white/80`}>
      <div className="mb-1 flex justify-center">{icon}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
      <div className="text-[10px] font-semibold uppercase text-gray-600">{label}</div>
      <div className="text-[10px] text-gray-400">{sub}</div>
    </div>
  );
}
