import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';

// RoutineForm — entry form for daily routine activities with duration in minutes.
export default function RoutineForm() {
  const { addRoutineEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [routineName, setRoutineName] = useState('');
  const [completed, setCompleted] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !user || !routineName) return;
    addRoutineEntry({ id: generateId(), childId: selectedChildId, date, time, routineName, completed, durationMinutes: durationMinutes || null, notes, createdBy: user.id, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">📋 Log Routine</h2>
      <HelpPanel title="Logging a Routine">
        <p><strong>Routine name:</strong> A short label for this routine step — e.g., "Morning teeth brushing", "Getting dressed", "School pickup".</p>
        <p><strong>Completed:</strong> Tick if the routine was completed as expected.</p>
        <p><strong>Duration:</strong> How long the routine took in minutes (optional).</p>
        <p><strong>Notes:</strong> Any challenges, adaptations needed, or successes worth noting.</p>
      </HelpPanel>
      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
        </div>
      </FormStep>
      <FormStep step={2} title="Details">
        <div><label className="text-xs font-medium text-gray-600">Routine Name</label><input value={routineName} onChange={(e) => setRoutineName(e.target.value)} placeholder="e.g. Morning brushing teeth" className={inputCls} required /></div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-lime-500 focus:ring-lime-400" />
          Completed
        </label>
        <div><label className="text-xs font-medium text-gray-600">Duration (minutes, optional)</label><input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')} min={1} className={inputCls} /></div>
      </FormStep>
      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations about the routine..." aria-label="Routine notes" className={inputCls + " resize-none"} rows={2} />
      </FormStep>
      <button type="submit" className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lime-200">Save Routine Entry 📋</button>
    </form>
  );
}
