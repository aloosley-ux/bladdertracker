import { useState } from 'react';
import { format } from 'date-fns';
import { Droplets, CloudRain, Stethoscope, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import BristolStoolPicker from '../components/BristolStoolPicker';
import type { BristolStoolType, BowelAmount } from '../types';

type EntryType = 'drink' | 'urine' | 'bowel';

export default function AddEntryPage() {
  const [activeTab, setActiveTab] = useState<EntryType>('drink');
  const navigate = useNavigate();

  const tabs: { type: EntryType; icon: typeof Droplets; label: string; color: string }[] = [
    { type: 'drink', icon: Droplets, label: 'Drink', color: 'text-blue-500' },
    { type: 'urine', icon: CloudRain, label: 'Urine', color: 'text-yellow-500' },
    { type: 'bowel', icon: Stethoscope, label: 'Bowel', color: 'text-green-500' },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-lavender-50"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Add Entry</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3 flex gap-2">
        {tabs.map(({ type, icon: Icon, label, color }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === type
                ? 'bg-lavender-500 text-white shadow-md'
                : 'bg-white text-gray-500 hover:bg-lavender-50'
            }`}
          >
            <Icon size={16} className={activeTab === type ? 'text-white' : color} />
            {label}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="px-4 mt-4">
        {activeTab === 'drink' && <DrinkForm />}
        {activeTab === 'urine' && <UrineForm />}
        {activeTab === 'bowel' && <BowelForm />}
      </div>
    </div>
  );
}

function DrinkForm() {
  const { addDrink, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'cup' | 'beaker' | 'bottle' | 'sippy' | 'other'>('cup');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const drinkTypes = [
    { value: 'cup' as const, label: '🥤 Cup', emoji: '🥤' },
    { value: 'beaker' as const, label: '🍶 Beaker', emoji: '🍶' },
    { value: 'bottle' as const, label: '🍼 Bottle', emoji: '🍼' },
    { value: 'sippy' as const, label: '🧃 Sippy', emoji: '🧃' },
    { value: 'other' as const, label: '🫗 Other', emoji: '🫗' },
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Droplets size={18} className="text-blue-500" /> Log a Drink
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Drink Type</label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {drinkTypes.map((dt) => (
            <button key={dt.value} type="button" onClick={() => setType(dt.value)}
              className={`px-3 py-2 rounded-xl text-sm transition-all ${
                type === dt.value
                  ? 'bg-lavender-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
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
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          min="0" required />
        <div className="flex gap-2 mt-2 flex-wrap">
          {quickAmounts.map((qa) => (
            <button key={qa} type="button" onClick={() => setAmount(String(qa))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                amount === String(qa) ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500 hover:bg-blue-50'
              }`}>
              {qa}ml
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200">
        Save Drink Entry 💧
      </button>
    </form>
  );
}

function UrineForm() {
  const { addUrineEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [wet, setWet] = useState(false);
  const [pass, setPass] = useState(false);
  const [notes, setNotes] = useState('');

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
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <CloudRain size={18} className="text-yellow-500" /> Log Urine Event
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">Event Type</label>
        <div className="flex gap-3">
          <label className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 cursor-pointer transition-all ${
            wet ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200'
          }`}>
            <input type="checkbox" checked={wet} onChange={(e) => setWet(e.target.checked)} className="sr-only" />
            <span className="text-2xl">💦</span>
            <div className="text-sm font-medium text-gray-700">Wet</div>
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 cursor-pointer transition-all ${
            pass ? 'border-green-400 bg-green-50 shadow-md' : 'border-gray-100 bg-white hover:border-green-200'
          }`}>
            <input type="checkbox" checked={pass} onChange={(e) => setPass(e.target.checked)} className="sr-only" />
            <span className="text-2xl">🚽</span>
            <div className="text-sm font-medium text-gray-700">Pass</div>
          </label>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200">
        Save Urine Entry 🚿
      </button>
    </form>
  );
}

function BowelForm() {
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Stethoscope size={18} className="text-green-500" /> Log Bowel Event
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">Location</label>
        <div className="flex gap-3">
          {(['toilet', 'nappy'] as const).map((loc) => (
            <button key={loc} type="button" onClick={() => setLocation(loc)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                location === loc
                  ? 'bg-lavender-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
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
                  : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
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
              laxatives ? 'bg-lavender-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
            }`}>
            💊 Yes
          </button>
          <button type="button" onClick={() => setLaxatives(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              !laxatives ? 'bg-lavender-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-lavender-50'
            }`}>
            ❌ No
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lavender-200"
        disabled={!bristolType}>
        Save Bowel Entry 📋
      </button>
    </form>
  );
}
