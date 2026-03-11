import { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import type { Child } from '../../types';
import {
  predictLeaps,
  getLeapReferenceDate,
  getCurrentLeap,
  getNextLeap,
} from '../../data/leapData';
import { STATUS_COLOURS, STATUS_LABELS } from './leapConstants';
import generateICS from './generateICS';

export default function LeapCalendarWidget({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);
  const currentLeap = getCurrentLeap(refDate, new Date());
  const nextLeap = getNextLeap(refDate, new Date());

  const upcomingLeaps = predictions.filter(
    (p) => p.status === 'upcoming' || p.status === 'stormy' || p.status === 'current',
  ).slice(0, 3);

  const handleExportICS = () => {
    const ics = generateICS(predictions, child.name);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${child.name.toLowerCase().replace(/\s+/g, '-')}-leaps-calendar.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="calendar-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="calendar-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Calendar size={22} aria-hidden="true" />
        Calendar &amp; Widget
      </h2>

      {/* Mini widget card */}
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-lavender-500 to-purple-600 p-5 text-white shadow-md" role="region" aria-label="Leap summary widget">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">{child.name}</p>
        {currentLeap ? (
          <>
            <p className="text-lg font-extrabold">
              {currentLeap.status === 'stormy' ? '⛈️' : '🌟'} Leap {currentLeap.leap.number}: {currentLeap.leap.title}
            </p>
            <p className="text-sm opacity-90 mt-1">{currentLeap.leap.description}</p>
            <p className="text-xs opacity-70 mt-2">
              {currentLeap.status === 'stormy' ? 'Stormy phase' : 'Sunny / skill phase'} — ends ~{format(currentLeap.sunnyDate, 'd MMM yyyy')}
            </p>
          </>
        ) : nextLeap ? (
          <>
            <p className="text-lg font-extrabold">🔜 Next: Leap {nextLeap.leap.number}</p>
            <p className="text-sm opacity-90 mt-1">{nextLeap.leap.title}</p>
            <p className="text-xs opacity-70 mt-2">Starts around {format(nextLeap.stormyStart, 'd MMM yyyy')}</p>
          </>
        ) : (
          <p className="text-base font-semibold opacity-90">🎉 All developmental leaps complete!</p>
        )}
      </div>

      {/* Upcoming leaps */}
      {upcomingLeaps.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Upcoming &amp; active leaps</h3>
          <div className="space-y-2">
            {upcomingLeaps.map((p) => (
              <div key={p.leap.number} className={`rounded-xl border-2 p-3 ${STATUS_COLOURS[p.status]}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Leap {p.leap.number}: {p.leap.title}</span>
                  <span className="text-xs font-medium">{STATUS_LABELS[p.status]}</span>
                </div>
                <p className="text-xs mt-1 opacity-80">
                  {format(p.stormyStart, 'd MMM')} – {format(p.sunnyDate, 'd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar export */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">📅 Export to Calendar</p>
        <p className="text-xs text-gray-500 mb-3">
          Download an ICS file with all upcoming leap periods to add to Google Calendar, Apple Calendar, or Outlook.
        </p>
        <button
          onClick={handleExportICS}
          className="w-full rounded-lg border-2 border-lavender-300 bg-white px-4 py-2.5 text-sm font-semibold text-lavender-700 hover:bg-lavender-50 transition-colors"
          aria-label="Export leap calendar as ICS file"
        >
          📥 Download Leap Calendar (.ics)
        </button>
      </div>
    </section>
  );
}
