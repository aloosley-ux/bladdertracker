import { useState } from 'react';
import { format } from 'date-fns';
import { Bell, BellOff } from 'lucide-react';
import { useApp } from '../../context/useApp';
import type { Child } from '../../types';
import {
  getLeapReferenceDate,
  getCurrentLeap,
  getNextLeap,
} from '../../data/leapData';

export default function LeapNotifications({ child }: { child: Child }) {
  const { user, reminderPreferences, setReminderPreferences } = useApp();

  const leapPref = reminderPreferences.find(
    (p) => p.childId === child.id && p.moduleId === 'leaps',
  );

  const [enabled, setEnabled] = useState(leapPref?.enabled ?? false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(leapPref?.frequency ?? 'daily');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    await setReminderPreferences(child.id, [{ moduleId: 'leaps', frequency, enabled }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, new Date());
  const nextLeap = getNextLeap(refDate, new Date());

  // Compute when next reminder would fire
  const nextAt = leapPref?.nextReminderAt
    ? new Date(leapPref.nextReminderAt)
    : null;

  return (
    <section aria-labelledby="notifications-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="notifications-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Bell size={22} aria-hidden="true" />
        Leap Reminders
      </h2>

      {/* Status banner */}
      {currentLeap && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="status">
          ⛈️ <strong>Leap {currentLeap.leap.number}</strong> ({currentLeap.leap.title}) is currently active.
          {currentLeap.status === 'stormy' ? ' Stormy phase in progress.' : ' Sunny phase — skills emerging!'}
        </div>
      )}
      {!currentLeap && nextLeap && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800" role="status">
          🔜 Next leap: <strong>Leap {nextLeap.leap.number}</strong> ({nextLeap.leap.title}) starts around{' '}
          {format(nextLeap.stormyStart, 'd MMM yyyy')}.
        </div>
      )}

      {/* Toggle & frequency */}
      <div className="space-y-4">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {enabled ? <Bell size={16} className="text-lavender-600" aria-hidden="true" /> : <BellOff size={16} className="text-gray-400" aria-hidden="true" />}
            Enable leap reminders
          </span>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-400 ${
              enabled ? 'bg-lavender-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>

        {enabled && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Reminder frequency</p>
            <div className="flex gap-2" role="group" aria-label="Notification frequency">
              {(['daily', 'weekly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  aria-pressed={frequency === f}
                  className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all ${
                    frequency === f
                      ? 'bg-lavender-600 text-white border-lavender-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
                  }`}
                >
                  {f === 'daily' ? '📅 Daily' : '📆 Weekly'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-lavender-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lavender-700 transition-colors"
        >
          {saved ? '✅ Saved!' : 'Save notification settings'}
        </button>

        {nextAt && (
          <p className="text-xs text-gray-400 text-center">
            Next reminder: {format(nextAt, 'd MMM yyyy')}
          </p>
        )}
      </div>

      {/* How reminders work */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-xs font-semibold text-gray-600 mb-1">How reminders work</p>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>Reminders appear as in-app notifications in your notification centre.</li>
          <li>Daily reminders fire every day; weekly reminders fire once per week.</li>
          <li>Use them to keep a habit of checking the leap tracker regularly.</li>
          <li>The next reminder date is shown below the save button when set.</li>
        </ul>
      </div>
    </section>
  );
}
