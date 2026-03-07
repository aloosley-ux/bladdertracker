import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex justify-between gap-1 px-2 py-3">
      {days.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[44px] ${
              isSelected
                ? 'bg-lavender-500 text-white shadow-lg shadow-lavender-200'
                : isToday
                  ? 'bg-lavender-50 text-lavender-600'
                  : 'text-gray-500 hover:bg-lavender-50'
            }`}
          >
            <span className="text-[10px] font-medium uppercase">
              {format(day, 'EEE')}
            </span>
            <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>
              {format(day, 'd')}
            </span>
          </button>
        );
      })}
    </div>
  );
}
