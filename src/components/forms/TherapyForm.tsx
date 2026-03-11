import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';
import type { TherapyType } from '../../types';

export default function TherapyForm() {
  const { addTherapyEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [therapyType, setTherapyType] = useState<TherapyType>('speech');
  const [provider, setProvider] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [goals, setGoals] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !user) return;
    addTherapyEntry({ id: generateId(), childId: selectedChildId, date, time, therapyType, provider, durationMinutes, goals, notes, createdBy: user.id, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">🧩 Log Therapy Session</h2>
      <HelpPanel title="Logging a Therapy Session">
        <p><strong>Therapy type:</strong> Speech & Language (SALT), Occupational Therapy (OT), Physiotherapy (PT), Applied Behaviour Analysis (ABA), Behavioural, Music, Art, or Other.</p>
        <p><strong>Provider:</strong> The therapist's name or organisation (optional but useful for multi-provider families).</p>
        <p><strong>Duration:</strong> Length of the session in minutes.</p>
        <p><strong>Goals worked on:</strong> Brief notes on what was targeted, e.g., "requesting using PECS", "hand washing routine".</p>
      </HelpPanel>
      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
        </div>
      </FormStep>
      <FormStep step={2} title="Session">
        <div>
          <label className="text-xs font-medium text-gray-600">Therapy Type</label>
          <select value={therapyType} onChange={(e) => setTherapyType(e.target.value as TherapyType)} className={inputCls}>
            {(['speech','occupational','physical','behavioral','other'] as TherapyType[]).map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div><label className="text-xs font-medium text-gray-600">Provider</label><input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Therapist name..." className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Duration (minutes)</label><input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} min={1} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Goals</label><textarea value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Session goals..." className={inputCls + " resize-none"} rows={2} /></div>
      </FormStep>
      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Progress, observations..." aria-label="Therapy notes" className={inputCls + " resize-none"} rows={2} />
      </FormStep>
      <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-cyan-200">Save Therapy Entry 🧩</button>
    </form>
  );
}
