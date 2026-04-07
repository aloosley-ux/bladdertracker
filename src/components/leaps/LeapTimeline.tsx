import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { Child } from '../../types';
import {
  predictLeaps,
  getLeapReferenceDate,
  type LeapStatus,
} from '../../data/leapData';
import { STATUS_LABELS } from './leapConstants';
import LeapTimelineCard from './LeapTimelineCard';

// LeapTimeline — full timeline view of all leaps with status filtering and expand/collapse.
export default function LeapTimeline({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);
  const [expandedLeap, setExpandedLeap] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | LeapStatus>('all');

  const filtered = filter === 'all' ? predictions : predictions.filter((p) => p.status === filter);

  return (
    <section aria-labelledby="timeline-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="timeline-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Calendar size={22} aria-hidden="true" />
        Leap Timeline
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter leaps by status">
        {(['all', 'past', 'stormy', 'current', 'upcoming', 'future'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
              filter === f
                ? 'bg-lavender-600 text-white border-lavender-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
            }`}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3" role="list" aria-label="Developmental leaps timeline">
        {filtered.map((pred) => (
          <LeapTimelineCard
            key={pred.leap.number}
            prediction={pred}
            expanded={expandedLeap === pred.leap.number}
            onToggle={() => setExpandedLeap(expandedLeap === pred.leap.number ? null : pred.leap.number)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 italic py-4 text-center">No leaps match the selected filter.</p>
        )}
      </div>
    </section>
  );
}
