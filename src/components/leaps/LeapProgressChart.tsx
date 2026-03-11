import { useMemo } from 'react';
import type { Child } from '../../types';
import {
  predictLeaps,
  getLeapReferenceDate,
  type LeapStatus,
} from '../../data/leapData';

export default function LeapProgressChart({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);

  const total = predictions.length;
  const completedCount = predictions.filter((p) => p.status === 'past').length;
  const activeCount = predictions.filter((p) => p.status === 'stormy' || p.status === 'current').length;
  const progressPct = Math.round((completedCount / total) * 100);

  const statusColors: Record<LeapStatus, string> = {
    past: 'bg-gray-300',
    stormy: 'bg-amber-400',
    current: 'bg-emerald-400',
    upcoming: 'bg-sky-300',
    // 'future' uses a border in addition to the fill to remain visible on white backgrounds
    future: 'bg-lavender-100 border border-lavender-200',
  };

  return (
    <section aria-labelledby="leap-progress-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="leap-progress-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        📈 Leap Progress Overview
      </h2>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-gray-700">{completedCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Completed</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-amber-600">{activeCount}</div>
          <div className="text-xs text-amber-500 mt-0.5">Active</div>
        </div>
        <div className="rounded-xl bg-sky-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-sky-600">{total - completedCount - activeCount}</div>
          <div className="text-xs text-sky-500 mt-0.5">Remaining</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span>Overall progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-label="Leap progress" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Per-leap status strip */}
      <div className="flex gap-1" role="list" aria-label="Leap status indicators">
        {predictions.map((p) => (
          <div
            key={p.leap.number}
            role="listitem"
            title={`Leap ${p.leap.number}: ${p.leap.title} (${p.status})`}
            aria-label={`Leap ${p.leap.number} — ${p.status}`}
            className={`flex-1 h-6 rounded-sm ${statusColors[p.status]} transition-colors`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Leap 1</span>
        <span>Leap {total}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
        {([
          { status: 'past', label: 'Completed', color: 'bg-gray-300' },
          { status: 'stormy', label: 'Stormy', color: 'bg-amber-400' },
          { status: 'current', label: 'In progress', color: 'bg-emerald-400' },
          { status: 'upcoming', label: 'Upcoming', color: 'bg-sky-300' },
          { status: 'future', label: 'Future', color: 'bg-lavender-100 border border-lavender-200' },
        ] as const).map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${color}`} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
