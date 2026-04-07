import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import BristolStoolPicker from '../BristolStoolPicker';
import HelpPanel from '../HelpPanel';
import { BRISTOL_GUIDANCE_TEXT } from '../../content/presentation';
import { FormStep } from './FormStep';
import type { BristolStoolType, BowelAmount } from '../../types';

// BowelForm — entry form for bowel movements with Bristol chart, amount, and laxative tracking.
export default function BowelForm() {
  const { addBowelEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [location, setLocation] = useState<'toilet' | 'nappy'>('toilet');
  const [amount, setAmount] = useState<BowelAmount>('M');
  const [bristolType, setBristolType] = useState<BristolStoolType | null>(null);
  const [laxatives, setLaxatives] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !bristolType) return;
    addBowelEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      location,
      amount,
      bristolType,
      laxativesGiven: laxatives,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-mint p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Stethoscope size={18} className="text-green-500" /> Log a poo
      </h2>

      <HelpPanel title="Logging a poo">
        <p><strong>Poo consistency:</strong> Use the Bristol chart below if you want to note whether things were firm, comfortable, or loose.</p>
        <p><strong>Amount:</strong> Choose the best estimate — small, medium, or large.</p>
        <p><strong>Location:</strong> Note whether it happened in the toilet or nappy.</p>
        <p><strong>Laxatives today:</strong> Tick this if laxatives were given the same day.</p>
        <p>{BRISTOL_GUIDANCE_TEXT}</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="Details">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Location</label>
          <div className="flex gap-3">
            {(['toilet', 'nappy'] as const).map((loc) => (
              <button key={loc} type="button" onClick={() => setLocation(loc)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  location === loc
                    ? 'bg-lavender-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-lavender-50'
                }`}>
                {loc === 'toilet' ? '🚽 Toilet' : '👶 Nappy'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Amount</label>
          <div className="flex gap-3">
            {(['S', 'M', 'L'] as const).map((size) => (
              <button key={size} type="button" onClick={() => setAmount(size)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  amount === size
                    ? 'bg-lavender-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-lavender-50'
                }`}>
                {size === 'S' ? '🔹 Small' : size === 'M' ? '🔸 Medium' : '🔶 Large'}
              </button>
            ))}
          </div>
        </div>

        <BristolStoolPicker value={bristolType} onChange={setBristolType} />

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Laxatives Given?</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setLaxatives(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                laxatives ? 'bg-lavender-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-lavender-50'
              }`}>
              💊 Yes
            </button>
            <button type="button" onClick={() => setLaxatives(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                !laxatives ? 'bg-lavender-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-lavender-50'
              }`}>
              ❌ No
            </button>
          </div>
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          aria-label="Bowel notes"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200"
        disabled={!bristolType}>
        Save poo log 📋
      </button>
    </form>
  );
}
