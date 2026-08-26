import { parseISO, format } from 'date-fns';
import { Baby } from 'lucide-react';
import type { Child } from '../../types';
import {
  computeChildAge,
  getLeapReferenceDate,
  getCurrentLeap,
  getNextLeap,
} from '../../data/leapData';

// AgeCalculator — displays child's age in months and predicts current/next developmental leap.
export default function AgeCalculator({ child }: { child: Child }) {
  const now = new Date();
  const birthDate = parseISO(child.dateOfBirth);
  const age = computeChildAge(birthDate, now);
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, now);
  const nextLeap = getNextLeap(refDate, now);

  return (
    <section aria-labelledby="age-calc-heading" className="rounded-2xl bg-white border border-violet-100 shadow-sm p-5">
      <h2 id="age-calc-heading" className="flex items-center gap-2 text-lg font-bold text-violet-700 mb-4">
        <Baby size={22} aria-hidden="true" />
        Baby Age &amp; Leap Prediction
      </h2>

      {/* Age display */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-pink-600">{age.months}</div>
          <div className="text-xs font-medium text-pink-500 mt-1">months</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-cyan-600">{age.weeks}</div>
          <div className="text-xs font-medium text-cyan-500 mt-1">weeks</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-amber-600">{age.totalDays}</div>
          <div className="text-xs font-medium text-amber-500 mt-1">days</div>
        </div>
      </div>

      {/* Current & next leap summary */}
      {currentLeap && (
        <div className="mb-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4" role="status" aria-live="polite">
          <div className="text-sm font-semibold text-emerald-700 mb-1">
            {currentLeap.status === 'stormy' ? '⛈️ Stormy phase' : '🌟 Currently in'} — Leap {currentLeap.leap.number}
          </div>
          <div className="text-base font-bold text-emerald-800">{currentLeap.leap.title}</div>
          <p className="text-sm text-emerald-700 mt-1">{currentLeap.leap.description}</p>
        </div>
      )}
      {nextLeap && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-sm font-semibold text-sky-600 mb-1">🔜 Next leap</div>
          <div className="text-base font-bold text-sky-700">
            Leap {nextLeap.leap.number}: {nextLeap.leap.title}
          </div>
          <p className="text-sm text-sky-600 mt-1">
            Starts around {format(nextLeap.stormyStart, 'd MMM yyyy')}
          </p>
        </div>
      )}
      {!currentLeap && !nextLeap && (
        <p className="text-sm text-gray-500 italic">All developmental leaps are in the past for this child.</p>
      )}
    </section>
  );
}
