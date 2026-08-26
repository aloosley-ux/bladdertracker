import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { URINE_COPY } from '../../content/presentation';
import { FormStep } from './FormStep';
import type { SleepEventType } from '../../types';

// SleepForm — entry form for sleep events with bedtime, duration, quality, and night activity.
export default function SleepForm() {
  const { addSleepEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventType, setEventType] = useState<SleepEventType>('onset');
  const [bedtime, setBedtime] = useState('');
  const [sleepOnsetMinutes, setSleepOnsetMinutes] = useState('');
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState<number | null>(null);
  const [nighttimeEvent, setNighttimeEvent] = useState(false);
  const [nightActivity, setNightActivity] = useState(false);
  const [notes, setNotes] = useState('');

  const sleepEvents: { value: SleepEventType; label: string; emoji: string }[] = [
    { value: 'onset', label: 'Sleep onset', emoji: '😴' },
    { value: 'wake', label: 'Wake up', emoji: '☀️' },
    { value: 'nap_start', label: 'Nap start', emoji: '💤' },
    { value: 'nap_end', label: 'Nap end', emoji: '⏰' },
  ];

  const qualityLabels = [
    { value: 1, label: 'Poor', emoji: '😫' },
    { value: 2, label: 'Fair', emoji: '😕' },
    { value: 3, label: 'OK', emoji: '😐' },
    { value: 4, label: 'Good', emoji: '🙂' },
    { value: 5, label: 'Great', emoji: '😊' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    addSleepEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      eventType,
      bedtime: bedtime || null,
      sleepOnsetMinutes: sleepOnsetMinutes ? Number(sleepOnsetMinutes) : null,
      durationMinutes: duration ? Number(duration) : null,
      quality: (quality ?? null) as 1 | 2 | 3 | 4 | 5 | null,
      nighttimeEvent,
      nightActivity,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[var(--card)] p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
        <Moon size={18} className="text-indigo-500" /> Log Sleep Event
      </h2>

      <HelpPanel title="Logging a Sleep Event">
        <p><strong>Event type:</strong> onset (going to sleep), wake (waking up), nap (daytime sleep), or disturbed (interrupted sleep).</p>
        <p><strong>Bedtime:</strong> When child was put to bed (before falling asleep). Helps track sleep onset latency.</p>
        <p><strong>Sleep onset delay:</strong> Minutes from bedtime until child actually fell asleep.</p>
        <p><strong>Duration:</strong> How long they slept in minutes (optional but helpful for patterns).</p>
        <p><strong>Quality 1–5:</strong> How restful was the sleep? 1 = very poor, 5 = excellent.</p>
        <p><strong>Night bladder/bowel activity disrupted sleep:</strong> Tick if a nighttime bladder/bowel event interrupted sleep.</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="Details">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">{URINE_COPY.eventLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            {sleepEvents.map((se) => (
              <button key={se.value} type="button" onClick={() => setEventType(se.value)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  eventType === se.value
                    ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-indigo-50'
                }`}>
                {se.emoji} {se.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep start fields shown only for 'onset' events (#16) */}
        {eventType === 'onset' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Bedtime <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Onset delay (mins) <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <input type="number" value={sleepOnsetMinutes} onChange={(e) => setSleepOnsetMinutes(e.target.value)}
                placeholder="e.g. 20"
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]"
                min="0" max="360" />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600">Duration (minutes) <span className="text-gray-400 font-normal">— optional</span></label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 480 for 8 hours"
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]"
            min="0" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Quality <span className="text-gray-400 font-normal">— optional</span></label>
          <div className="flex gap-1.5">
            {qualityLabels.map((q) => (
              <button key={q.value} type="button" onClick={() => setQuality(quality === q.value ? null : q.value)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  quality === q.value
                    ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300'
                    : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-indigo-50'
                }`}>
                <span className="text-lg">{q.emoji}</span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={nighttimeEvent} onChange={(e) => setNighttimeEvent(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-indigo-500 focus:ring-indigo-200" />
            <span className="text-sm font-medium text-[var(--foreground)]">🌙 Nighttime event (10pm–6am)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={nightActivity} onChange={(e) => setNightActivity(e.target.checked)}
              className="h-5 w-5 rounded border-[var(--border)] text-indigo-500 focus:ring-indigo-200" />
            <span className="text-sm font-medium text-[var(--foreground)]">🚽 Night bladder/bowel activity disrupted sleep</span>
          </label>
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          aria-label="Sleep notes"
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)] resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200">
        Save Sleep Entry 🌙
      </button>
    </form>
  );
}
