import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import HelpPanel from '../HelpPanel';
import { FormStep } from './FormStep';

// DrinkForm — entry form for drinks with type (cup, bottle, sippy) and volume in ml.
export default function DrinkForm() {
  const { addDrink, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'cup' | 'beaker' | 'bottle' | 'sippy' | 'other'>('cup');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const drinkTypes = [
    { value: 'cup' as const, label: '🥤 Cup' },
    { value: 'beaker' as const, label: '🍶 Beaker' },
    { value: 'bottle' as const, label: '🍼 Bottle' },
    { value: 'sippy' as const, label: '🧃 Sippy' },
    { value: 'other' as const, label: '🫗 Other' },
  ];

  const quickAmounts = [50, 100, 150, 200, 250, 300];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !amount) return;
    addDrink({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      type,
      amountMl: Number(amount),
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[var(--card)] p-5 shadow-sm space-y-5">
      <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
        <Droplets size={18} className="text-blue-500" /> Log a Drink
      </h2>

      <HelpPanel title="Logging a Drink">
        <p><strong>Amount (ml):</strong> How many millilitres was consumed. A standard cup is ~200ml, a bottle ~500ml.</p>
        <p><strong>Type:</strong> Choose the vessel or drink category — cup, beaker, bottle, sippy cup, or other.</p>
        <p><strong>Time:</strong> The time the drink was consumed or offered (defaults to now).</p>
        <p><strong>Notes:</strong> Optional — e.g., "refused half", "added squash".</p>
      </HelpPanel>

      <FormStep step={1} title="When">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Date</label>
            <input aria-label="Drink date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Time</label>
            <input aria-label="Drink time" type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]" />
          </div>
        </div>
      </FormStep>

      <FormStep step={2} title="What">
        <div>
          <label className="text-xs font-medium text-gray-600">Drink Type</label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {drinkTypes.map((dt) => (
              <button key={dt.value} type="button" onClick={() => setType(dt.value)}
                className={`px-3 py-2 rounded-xl text-sm transition-all ${
                  type === dt.value
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-violet-50'
                }`}>
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Amount (ml)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ml"
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)]"
            min="0" required />
          <div className="flex gap-2 mt-2 flex-wrap">
            {quickAmounts.map((qa) => (
              <button key={qa} type="button" onClick={() => setAmount(String(qa))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  amount === String(qa) ? 'bg-sky-200 text-sky-800' : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-sky-50'
                }`}>
                {qa}ml
              </button>
            ))}
          </div>
        </div>
      </FormStep>

      <FormStep step={3} title="Notes (optional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          aria-label="Drink notes"
          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-[var(--foreground)] resize-none"
          rows={2} />
      </FormStep>

      <button type="submit"
        className="w-full py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-200">
        Save Drink Entry 💧
      </button>
    </form>
  );
}
