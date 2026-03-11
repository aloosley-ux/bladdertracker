import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';
import type { SensoryResponseType } from '../../types';

export default function SensoryForm() {
  const { addSensoryEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sensoryType, setSensoryType] = useState('auditory');
  const [response, setResponse] = useState<SensoryResponseType>('neutral');
  const [intensity, setIntensity] = useState<1|2|3|4|5>(3);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !user) return;
    addSensoryEntry({ id: generateId(), childId: selectedChildId, date, time, sensoryType, response, intensity, notes, createdBy: user.id, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">🎨 Log Sensory Event</h2>
      <HelpPanel title="Logging a Sensory Event">
        <p><strong>Sensory type:</strong> Which sense was involved — touch (tactile), sound (auditory), sight (visual), taste (gustatory), smell (olfactory), movement (vestibular), body position (proprioceptive), or other.</p>
        <p><strong>Response:</strong> How they responded — seeking (wanted more), avoiding (moved away/covered ears etc.), or neutral.</p>
        <p><strong>Intensity 1–5:</strong> How strong was the sensory event? 1 = barely noticeable, 5 = overwhelming.</p>
      </HelpPanel>
      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
        </div>
      </FormStep>
      <FormStep step={2} title="Details">
        <div>
          <label className="text-xs font-medium text-gray-600">Sensory Type</label>
          <select value={sensoryType} onChange={(e) => setSensoryType(e.target.value)} className={inputCls}>
            {['auditory','tactile','visual','vestibular','proprioceptive','olfactory','gustatory'].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Response</label>
          <div className="flex gap-2 mt-1">{(['seeking','neutral','avoiding'] as SensoryResponseType[]).map((r) => (
            <button key={r} type="button" onClick={() => setResponse(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${response === r ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
              {r === 'seeking' ? '🔍' : r === 'avoiding' ? '🚫' : '😐'} {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}</div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Intensity (1–5)</label>
          <div className="flex gap-2 mt-1">{([1,2,3,4,5] as (1|2|3|4|5)[]).map((i) => (
            <button key={i} type="button" onClick={() => setIntensity(i)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${intensity === i ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>{i}</button>
          ))}</div>
        </div>
      </FormStep>
      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the sensory event..." aria-label="Sensory notes" className={inputCls + " resize-none"} rows={2} />
      </FormStep>
      <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-teal-200">Save Sensory Entry 🎨</button>
    </form>
  );
}
