import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';
import type { MoodLevel } from '../../types';

// MoodForm — entry form for mood level (1–5 scale) and triggers.
export default function MoodForm() {
  const { addMoodEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [level, setLevel] = useState<MoodLevel>(3);
  const [triggers, setTriggers] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !user) return;
    addMoodEntry({ id: generateId(), childId: selectedChildId, date, time, level, triggers, notes, createdBy: user.id, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">😊 Log Mood</h2>
      <HelpPanel title="Logging Mood">
        <p><strong>Level 1–5:</strong> Overall emotional state. 1 = very distressed, 2 = upset, 3 = neutral/calm, 4 = happy, 5 = very happy/excited.</p>
        <p><strong>Triggers:</strong> What may have caused this mood — e.g., "transition to school", "new sensory input", "slept well".</p>
        <p><strong>Notes:</strong> Any additional context about behaviour or environment.</p>
      </HelpPanel>
      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
        </div>
      </FormStep>
      <FormStep step={2} title="Mood">
        <div>
          <label className="text-xs font-medium text-gray-600">Mood Level (1–5)</label>
          <div className="flex gap-2 mt-1">{([1,2,3,4,5] as MoodLevel[]).map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${level === l ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
              {l === 1 ? '😢' : l === 2 ? '😟' : l === 3 ? '😐' : l === 4 ? '🙂' : '😁'} {l}
            </button>
          ))}</div>
        </div>
        <div><label className="text-xs font-medium text-gray-600">Triggers</label><input value={triggers} onChange={(e) => setTriggers(e.target.value)} placeholder="What triggered this mood..." className={inputCls} /></div>
      </FormStep>
      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional observations..." aria-label="Mood notes" className={inputCls + " resize-none"} rows={2} />
      </FormStep>
      <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-200">Save Mood Entry 😊</button>
    </form>
  );
}
