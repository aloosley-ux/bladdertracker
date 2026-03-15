import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { TOILET_OUTCOME_LABELS } from '../../content/presentation';
import { FormStep } from './FormStep';
import type { ToiletAttemptOutcome } from '../../types';

export default function ToiletAttemptForm() {
  const { addToiletAttemptEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [outcome, setOutcome] = useState<ToiletAttemptOutcome>('success');
  const [supervised, setSupervised] = useState(true);
  const [prompted, setPrompted] = useState(false);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const outcomes: { value: ToiletAttemptOutcome; label: string; emoji: string }[] = [
    { value: 'success', label: TOILET_OUTCOME_LABELS.success, emoji: '✅' },
    { value: 'failure', label: TOILET_OUTCOME_LABELS.failure, emoji: '❌' },
    { value: 'no_event', label: TOILET_OUTCOME_LABELS.no_event, emoji: '🚫' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    addToiletAttemptEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      outcome,
      supervised,
      prompted,
      durationMinutes: duration ? Number(duration) : null,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[var(--bg-card)] p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Target size={18} className="text-purple-500" /> Log a toilet visit
      </h2>

      <HelpPanel title="Logging a toilet visit">
        <p><strong>Outcome:</strong> Successful, no result, or not ready.</p>
        <p><strong>Prompted:</strong> Tick if you reminded or invited them to try.</p>
        <p><strong>Supervised:</strong> Tick if an adult stayed nearby to help.</p>
        <p><strong>Duration:</strong> Add how long they sat for if it is useful.</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm text-[var(--text-primary)]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm text-[var(--text-primary)]" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="Details">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Outcome</label>
          <div className="flex gap-3">
            {outcomes.map((o) => (
              <button key={o.value} type="button" onClick={() => setOutcome(o.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  outcome === o.value
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-purple-50'
                }`}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input type="checkbox" checked={supervised} onChange={(e) => setSupervised(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border-color)] text-purple-500 focus:ring-purple-200" />
            <span className="text-sm font-medium text-[var(--text-primary)]">👀 Supervised</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input type="checkbox" checked={prompted} onChange={(e) => setPrompted(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border-color)] text-purple-500 focus:ring-purple-200" />
            <span className="text-sm font-medium text-[var(--text-primary)]">🔔 Prompted</span>
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Duration (minutes) <span className="text-gray-400 font-normal">— optional</span></label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
            placeholder="Time on toilet in minutes"
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm text-[var(--text-primary)]"
            min="0" />
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          aria-label="Toilet attempt notes"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-200">
        Save toilet visit 🎯
      </button>
    </form>
  );
}
