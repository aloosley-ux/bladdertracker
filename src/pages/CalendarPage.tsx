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
import { ChevronLeft, ChevronRight, Droplets, CloudRain, Stethoscope } from 'lucide-react';
import { useApp } from '../context/useApp';

export default function CalendarPage() {
  const { drinks, urineEntries, bowelEntries, selectedChildId, selectedChild } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayData = useMemo(() => {
    const map = new Map<string, { drinks: number; urine: number; bowel: number }>();
    drinks
      .filter((d) => d.childId === selectedChildId)
      .forEach((d) => {
        const key = d.date;
        const existing = map.get(key) ?? { drinks: 0, urine: 0, bowel: 0 };
        existing.drinks++;
        map.set(key, existing);
      });
    urineEntries
      .filter((u) => u.childId === selectedChildId)
      .forEach((u) => {
        const key = u.date;
        const existing = map.get(key) ?? { drinks: 0, urine: 0, bowel: 0 };
        existing.urine++;
        map.set(key, existing);
      });
    bowelEntries
      .filter((b) => b.childId === selectedChildId)
      .forEach((b) => {
        const key = b.date;
        const existing = map.get(key) ?? { drinks: 0, urine: 0, bowel: 0 };
        existing.bowel++;
        map.set(key, existing);
      });
    return map;
  }, [drinks, urineEntries, bowelEntries, selectedChildId]);

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
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-lavender-50"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-sm font-bold text-gray-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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
              const hasEntries = data && (data.drinks > 0 || data.urine > 0 || data.bowel > 0);

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
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" /> Drinks
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400" /> Urine
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" /> Bowel
            </span>
          </div>
        </div>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="px-4 mt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          {selectedDrinks.length === 0 && selectedUrine.length === 0 && selectedBowel.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl">📋</span>
              <p className="text-gray-400 text-sm mt-2">No entries for this date</p>
            </div>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
