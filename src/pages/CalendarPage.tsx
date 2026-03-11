import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Apple, ChevronLeft, ChevronRight, CloudRain, Droplets, Moon, Stethoscope, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import EmptyState from '../components/EmptyState';

export default function CalendarPage() {
  const { drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries, selectedChildId, selectedChild } = useApp();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayData = useMemo(() => {
    const map = new Map<string, { drinks: number; urine: number; bowel: number; sleep: number; toilet: number; food: number }>();
    const getOrCreate = (key: string) => map.get(key) ?? { drinks: 0, urine: 0, bowel: 0, sleep: 0, toilet: 0, food: 0 };
    drinks.filter((d) => d.childId === selectedChildId).forEach((d) => { const e = getOrCreate(d.date); e.drinks++; map.set(d.date, e); });
    urineEntries.filter((u) => u.childId === selectedChildId).forEach((u) => { const e = getOrCreate(u.date); e.urine++; map.set(u.date, e); });
    bowelEntries.filter((b) => b.childId === selectedChildId).forEach((b) => { const e = getOrCreate(b.date); e.bowel++; map.set(b.date, e); });
    sleepEntries.filter((s) => s.childId === selectedChildId).forEach((s) => { const e = getOrCreate(s.date); e.sleep++; map.set(s.date, e); });
    toiletAttemptEntries.filter((t) => t.childId === selectedChildId).forEach((t) => { const e = getOrCreate(t.date); e.toilet++; map.set(t.date, e); });
    foodEntries.filter((f) => f.childId === selectedChildId).forEach((f) => { const e = getOrCreate(f.date); e.food++; map.set(f.date, e); });
    return map;
  }, [drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries, selectedChildId]);

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const selectedDrinks = selectedDateStr
    ? drinks.filter((d) => d.childId === selectedChildId && d.date === selectedDateStr)
    : [];
  const selectedUrine = selectedDateStr
    ? urineEntries.filter((u) => u.childId === selectedChildId && u.date === selectedDateStr)
    : [];
  const selectedBowel = selectedDateStr
    ? bowelEntries.filter((b) => b.childId === selectedChildId && b.date === selectedDateStr)
    : [];
  const selectedSleep = selectedDateStr
    ? sleepEntries.filter((s) => s.childId === selectedChildId && s.date === selectedDateStr)
    : [];
  const selectedToilet = selectedDateStr
    ? toiletAttemptEntries.filter((t) => t.childId === selectedChildId && t.date === selectedDateStr)
    : [];
  const selectedFood = selectedDateStr
    ? foodEntries.filter((f) => f.childId === selectedChildId && f.date === selectedDateStr)
    : [];

  return (
    <div className="pb-20">
      <div className="bg-white px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-gray-800">📅 Calendar</h1>
        <p className="text-xs text-gray-400">{selectedChild?.name}&apos;s diary review</p>
      </div>

      {/* Month navigation */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-lavender-50"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-gray-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-lavender-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const data = dayData.get(dateStr);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const hasEntries = data && (data.drinks > 0 || data.urine > 0 || data.bowel > 0 || data.sleep > 0 || data.toilet > 0 || data.food > 0);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all ${
                    !isCurrentMonth
                      ? 'text-gray-200'
                      : isSelected
                        ? 'bg-lavender-500 text-white shadow-md'
                        : isToday
                          ? 'bg-lavender-50 text-lavender-600 font-bold'
                          : 'text-gray-700 hover:bg-lavender-50'
                  }`}
                >
                  <span className="font-medium">{format(day, 'd')}</span>
                  {hasEntries && isCurrentMonth && !isSelected && (
                    <div className="flex gap-0.5 mt-0.5">
                      {data.drinks > 0 && <div className="w-1 h-1 rounded-full bg-blue-400" />}
                      {data.urine > 0 && <div className="w-1 h-1 rounded-full bg-yellow-400" />}
                      {data.bowel > 0 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                      {data.sleep > 0 && <div className="w-1 h-1 rounded-full bg-indigo-400" />}
                      {data.toilet > 0 && <div className="w-1 h-1 rounded-full bg-purple-400" />}
                      {data.food > 0 && <div className="w-1 h-1 rounded-full bg-orange-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center mt-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Drinks</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Urine</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400" /> Bowel</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400" /> Sleep</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400" /> Attempt</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400" /> Food</span>
          </div>
        </div>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="px-4 mt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          {selectedDrinks.length === 0 && selectedUrine.length === 0 && selectedBowel.length === 0 && selectedSleep.length === 0 && selectedToilet.length === 0 && selectedFood.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No entries for this date"
              description="Start tracking to see entries appear here."
              actionLabel="Add an entry"
              onAction={() => navigate('/add')}
            />
          ) : (
            <div className="space-y-2">
              {selectedDrinks.map((d) => (
                <div key={d.id} className="bg-sky-light rounded-xl p-3 flex items-center gap-3">
                  <Droplets size={16} className="text-blue-500" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{d.amountMl}ml</span> - {d.type}
                    {d.notes && <span className="text-gray-400 text-xs ml-2">{d.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{d.time}</span>
                </div>
              ))}
              {selectedUrine.map((u) => (
                <div key={u.id} className="bg-peach rounded-xl p-3 flex items-center gap-3">
                  <CloudRain size={16} className="text-yellow-500" />
                  <div className="flex-1 text-sm">
                    {u.wet && <span className="font-medium">Wet </span>}
                    {u.pass && <span className="font-medium">Pass </span>}
                    {u.volumeMl != null && u.volumeMl > 0 && <span className="font-medium text-amber-700">{u.volumeMl}ml </span>}
                    {u.urgency != null && <span className="text-xs text-amber-600">Urgency {u.urgency}/5 </span>}
                    {u.leakageAmount && u.leakageAmount !== 'none' && <span className="text-xs text-blue-600">Leak: {u.leakageAmount} </span>}
                    {u.notes && <span className="text-gray-400 text-xs ml-1">{u.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{u.time}</span>
                </div>
              ))}
              {selectedBowel.map((b) => (
                <div key={b.id} className="bg-mint rounded-xl p-3 flex items-center gap-3">
                  <Stethoscope size={16} className="text-green-500" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{b.location}</span> - {b.amount} (Type {b.bristolType})
                    {b.laxativesGiven && <span className="text-xs ml-1">💊</span>}
                    {b.notes && <span className="text-gray-400 text-xs ml-2">{b.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{b.time}</span>
                </div>
              ))}
              {selectedSleep.map((s) => (
                <div key={s.id} className="bg-[#eee8ff] rounded-xl p-3 flex items-center gap-3">
                  <Moon size={16} className="text-indigo-500" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">Sleep: {s.eventType.replace(/_/g, ' ')}</span>
                    {s.durationMinutes && <span className="text-xs text-gray-500 ml-1">({s.durationMinutes} min)</span>}
                    {s.quality && <span className="text-xs text-indigo-600 ml-1">Quality {s.quality}/5</span>}
                    {s.nighttimeEvent && <span className="text-xs ml-1">🌙</span>}
                    {s.notes && <span className="text-gray-400 text-xs ml-2">{s.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{s.time}</span>
                </div>
              ))}
              {selectedToilet.map((t) => (
                <div key={t.id} className="bg-[#f3eeff] rounded-xl p-3 flex items-center gap-3">
                  <Target size={16} className="text-purple-500" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">
                      {t.outcome === 'success' ? '✅ Success' : t.outcome === 'failure' ? '❌ No result' : '🚫 Refused'}
                    </span>
                    {t.supervised && <span className="text-xs ml-1">👀</span>}
                    {t.prompted && <span className="text-xs ml-1">🔔</span>}
                    {t.durationMinutes && <span className="text-xs text-gray-500 ml-1">({t.durationMinutes} min)</span>}
                    {t.notes && <span className="text-gray-400 text-xs ml-2">{t.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{t.time}</span>
                </div>
              ))}
              {selectedFood.map((f) => (
                <div key={f.id} className="bg-[#fff5eb] rounded-xl p-3 flex items-center gap-3">
                  <Apple size={16} className="text-orange-500" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{f.mealType}: {f.description}</span>
                    {f.portions && <span className="text-xs text-gray-500 ml-1">({f.portions} portions)</span>}
                    {f.notes && <span className="text-gray-400 text-xs ml-2">{f.notes}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{f.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
