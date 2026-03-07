import { useState, useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { Droplets, CloudRain, Stethoscope, Download, Bell } from 'lucide-react';
import { useApp } from '../context/useApp';
import CalendarStrip from '../components/CalendarStrip';
import EntryCard from '../components/EntryCard';

export default function DashboardPage() {
  const {
    user,
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
  const [showTips, setShowTips] = useState(true);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const dayDrinks = useMemo(
    () => drinks.filter((d) => d.childId === selectedChildId && d.date === dateStr),
    [drinks, selectedChildId, dateStr]
  );
  const dayUrine = useMemo(
    () => urineEntries.filter((u) => u.childId === selectedChildId && u.date === dateStr),
    [urineEntries, selectedChildId, dateStr]
  );
  const dayBowel = useMemo(
    () => bowelEntries.filter((b) => b.childId === selectedChildId && b.date === dateStr),
    [bowelEntries, selectedChildId, dateStr]
  );

  const totalMl = dayDrinks.reduce((sum, d) => sum + d.amountMl, 0);
  const wetCount = dayUrine.filter((u) => u.wet).length;
  const passCount = dayUrine.filter((u) => u.pass).length;
  const bowelCount = dayBowel.length;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white rounded-b-3xl shadow-sm px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">Hello {user?.name} 👋</p>
            <h1 className="text-lg font-bold text-gray-800">
              {selectedChild?.name}&apos;s Diary
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {children.length > 1 && (
              <select
                value={selectedChildId ?? ''}
                onChange={(e) => selectChild(e.target.value)}
                className="text-xs bg-lavender-50 text-lavender-700 px-3 py-1.5 rounded-full border-0 font-medium"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={exportData}
              className="w-9 h-9 rounded-full bg-lavender-50 flex items-center justify-center text-lavender-600 hover:bg-lavender-100 transition-colors"
              title="Export diary"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* Summary Cards */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard
            icon={<Droplets size={18} className="text-blue-500" />}
            label="Drinks"
            value={`${totalMl}ml`}
            sub={`${dayDrinks.length} entries`}
            bg="bg-sky-light"
          />
          <SummaryCard
            icon={<CloudRain size={18} className="text-yellow-500" />}
            label="Urine"
            value={`${wetCount + passCount}`}
            sub={`${wetCount} wet · ${passCount} pass`}
            bg="bg-peach"
          />
          <SummaryCard
            icon={<Stethoscope size={18} className="text-green-500" />}
            label="Bowel"
            value={`${bowelCount}`}
            sub="events"
            bg="bg-mint"
          />
        </div>
      </div>

      {/* Clinical Tips */}
      {showTips && (
        <div className="px-4 mt-4">
          <div className="bg-lavender-50 border border-lavender-100 rounded-2xl p-4 relative">
            <button
              onClick={() => setShowTips(false)}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-xs"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-lavender-100 flex items-center justify-center shrink-0">
                <Bell size={14} className="text-lavender-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Daily Reminders</h3>
                <ul className="text-xs text-gray-500 mt-1 space-y-1">
                  <li>💧 Aim for 6-8 drinks per day for children</li>
                  <li>🚽 Regular toilet visits every 2-3 hours</li>
                  <li>🍎 High-fibre foods help prevent constipation</li>
                  <li>📝 Record entries promptly for accuracy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's label */}
      <div className="px-4 mt-5 mb-3">
        <h2 className="text-sm font-bold text-gray-700">
          {isSameDay(selectedDate, new Date()) ? "Today's" : format(selectedDate, 'EEE, MMM d')} Entries
        </h2>
      </div>

      {/* Entries */}
      <div className="px-4 space-y-3">
        {dayDrinks.length === 0 && dayUrine.length === 0 && dayBowel.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">📋</span>
            <p className="text-gray-400 text-sm mt-2">No entries yet for this day</p>
            <p className="text-gray-300 text-xs mt-1">Tap &quot;Add Entry&quot; to get started</p>
          </div>
        )}

        {dayDrinks.map((d) => (
          <EntryCard
            key={d.id}
            icon={<Droplets size={18} className="text-blue-500" />}
            title={`${d.amountMl}ml - ${d.type}`}
            subtitle={d.notes}
            time={d.time}
            color="bg-sky-light"
            onDelete={() => deleteDrink(d.id)}
          />
        ))}

        {dayUrine.map((u) => (
          <EntryCard
            key={u.id}
            icon={<CloudRain size={18} className="text-yellow-500" />}
            title={`Urine: ${u.wet ? 'Wet' : ''} ${u.pass ? 'Pass' : ''}`}
            subtitle={u.notes}
            time={u.time}
            color="bg-peach"
            onDelete={() => deleteUrineEntry(u.id)}
          />
        ))}

        {dayBowel.map((b) => (
          <EntryCard
            key={b.id}
            icon={<Stethoscope size={18} className="text-green-500" />}
            title={`Bowel: ${b.location} - ${b.amount} (Type ${b.bristolType})`}
            subtitle={`${b.laxativesGiven ? '💊 Laxatives given. ' : ''}${b.notes}`}
            time={b.time}
            color="bg-mint"
            onDelete={() => deleteBowelEntry(b.id)}
          />
        ))}
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
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-3 text-center`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
      <div className="text-[10px] font-semibold text-gray-600 uppercase">{label}</div>
      <div className="text-[10px] text-gray-400">{sub}</div>
    </div>
  );
}
