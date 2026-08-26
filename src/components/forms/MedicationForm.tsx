import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';

// MedicationForm — entry form for medication name, dosage, and administration status.
export default function MedicationForm() {
  const { addMedicationEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [administered, setAdministered] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !user || !name) return;
    addMedicationEntry({ id: generateId(), childId: selectedChildId, date, time, name, dosage, administered, notes, createdBy: user.id, createdAt: new Date().toISOString() });
    navigate('/');
  };

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">💊 Log Medication</h2>
      <HelpPanel title="Logging a Medication">
        <p><strong>Medication name:</strong> The name of the medication as prescribed.</p>
        <p><strong>Dosage:</strong> The dose given — e.g., "5mg", "1 tablet", "10ml".</p>
        <p><strong>Administered:</strong> Tick if the medication was successfully given. Untick if the dose was missed or refused.</p>
      </HelpPanel>
      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
        </div>
      </FormStep>
      <FormStep step={2} title="What">
        <div><label className="text-xs font-medium text-gray-600">Medication Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Melatonin" className={inputCls} required /></div>
        <div><label className="text-xs font-medium text-gray-600">Dosage</label><input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 1mg" className={inputCls} /></div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={administered} onChange={(e) => setAdministered(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400" />
          Administered
        </label>
      </FormStep>
      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Side effects, observations..." aria-label="Medication notes" className={inputCls + " resize-none"} rows={2} />
      </FormStep>
      <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-200">Save Medication Entry 💊</button>
    </form>
  );
}
