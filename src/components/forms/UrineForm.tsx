import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CloudRain } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { URINE_COPY } from '../../content/presentation';
import { FormStep } from './FormStep';
import type { UrineEntry } from '../../types';

// UrineForm — entry form for urine entries with outcome, volume, urgency, and leakage.
export default function UrineForm() {
  const { addUrineEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [wet, setWet] = useState(false);
  const [pass, setPass] = useState(false);
  const [volumeMl, setVolumeMl] = useState('');
  const [urgency, setUrgency] = useState<number | null>(null);
  const [leakageAmount, setLeakageAmount] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const quickVolumes = [50, 100, 150, 200, 250, 300];

  const urgencyLabels = [
    { value: 1, label: 'None', emoji: '😌' },
    { value: 2, label: 'Mild', emoji: '🙂' },
    { value: 3, label: 'Moderate', emoji: '😐' },
    { value: 4, label: 'Strong', emoji: '😣' },
    { value: 5, label: 'Severe', emoji: '🆘' },
  ];

  const leakageOptions = [
    { value: 'none', label: 'None', emoji: '✅' },
    { value: 'small', label: 'Small', emoji: '💧' },
    { value: 'medium', label: 'Medium', emoji: '💦' },
    { value: 'large', label: 'Large', emoji: '🌊' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    addUrineEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      wet,
      pass,
      volumeMl: volumeMl ? Number(volumeMl) : null,
      urgency: (urgency ?? null) as UrineEntry['urgency'],
      leakageAmount: (leakageAmount ?? null) as UrineEntry['leakageAmount'],
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-orange-50 p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <CloudRain size={18} className="text-yellow-500" /> {URINE_COPY.heading}
      </h2>

      <HelpPanel title={URINE_COPY.helpTitle}>
        <p><strong>{URINE_COPY.wetLabel}:</strong> Tick if there was urine in clothes, a pull-up, or bedding.</p>
        <p><strong>{URINE_COPY.passLabel}:</strong> Tick if the wee reached the toilet or potty.</p>
        <p><strong>{URINE_COPY.volumeLabel}:</strong> Add a measured amount if you have one.</p>
        <p><strong>{URINE_COPY.urgencyLabel}:</strong> 1 = not urgent, 5 = very urgent.</p>
        <p><strong>{URINE_COPY.leakageLabel}:</strong> Choose how much escaped if there was a leak.</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="What happened">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">{URINE_COPY.eventLabel}</label>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 cursor-pointer transition-all ${
              wet ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200'
            }`}>
              <input type="checkbox" checked={wet} onChange={(e) => setWet(e.target.checked)} className="sr-only" />
              <span className="text-2xl">💦</span>
              <div className="text-sm font-medium text-gray-700">{URINE_COPY.wetLabel}</div>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 cursor-pointer transition-all ${
              pass ? 'border-green-400 bg-green-50 shadow-md' : 'border-gray-100 bg-white hover:border-green-200'
            }`}>
              <input type="checkbox" checked={pass} onChange={(e) => setPass(e.target.checked)} className="sr-only" />
              <span className="text-2xl">🚽</span>
              <div className="text-sm font-medium text-gray-700">{URINE_COPY.passLabel}</div>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">{URINE_COPY.volumeLabel} <span className="text-gray-400 font-normal">— optional</span></label>
          <input type="number" value={volumeMl} onChange={(e) => setVolumeMl(e.target.value)}
            placeholder={URINE_COPY.volumePlaceholder}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
            min="0" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {quickVolumes.map((v) => (
              <button key={v} type="button" onClick={() => setVolumeMl(String(v))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  volumeMl === String(v) ? 'bg-amber-100 text-amber-700' : 'bg-white text-gray-500 hover:bg-amber-50'
                }`}>
                {v}ml
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">{URINE_COPY.urgencyLabel} <span className="text-gray-400 font-normal">— optional</span></label>
          <div className="flex gap-1.5">
            {urgencyLabels.map((u) => (
              <button key={u.value} type="button" onClick={() => setUrgency(urgency === u.value ? null : u.value)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  urgency === u.value
                    ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                    : 'bg-white text-gray-500 hover:bg-amber-50'
                }`}>
                <span className="text-lg">{u.emoji}</span>
                <span>{u.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">{URINE_COPY.leakageLabel} <span className="text-gray-400 font-normal">— optional</span></label>
          <div className="flex gap-2">
            {leakageOptions.map((l) => (
              <button key={l.value} type="button" onClick={() => setLeakageAmount(leakageAmount === l.value ? null : l.value)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  leakageAmount === l.value
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                    : 'bg-white text-gray-500 hover:bg-blue-50'
                }`}>
                {l.emoji} {l.label}
              </button>
            ))}
          </div>
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          aria-label="Urine notes"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-200">
        {URINE_COPY.submitLabel} 🚿
      </button>
    </form>
  );
}
