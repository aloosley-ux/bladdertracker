import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Droplets, CloudRain, Stethoscope, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import BristolStoolPicker from '../components/BristolStoolPicker';
import BrandIcon from '../components/BrandIcon';
import type { BristolStoolType, BowelAmount, UrineEntry } from '../types';

type EntryType = 'drink' | 'urine' | 'bowel';

export default function AddEntryPage() {
  const location = useLocation();
  const initialTab: EntryType = (location.state as { tab?: EntryType } | null)?.tab ?? 'drink';
  const [activeTab, setActiveTab] = useState<EntryType>(initialTab);
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tabs: { type: EntryType; icon: typeof Droplets; label: string; color: string }[] = [
    { type: 'drink', icon: Droplets, label: 'Drink', color: 'text-blue-500' },
    { type: 'urine', icon: CloudRain, label: 'Urine', color: 'text-yellow-500' },
    { type: 'bowel', icon: Stethoscope, label: 'Bowel', color: 'text-green-500' },
  ];

  return (
    <div className="pb-20">
      {/* Brand header */}
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] px-4 pt-5 pb-3">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <BrandIcon size={36} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-lavender-500">Add Entry</p>
              <h1 className="text-base font-bold text-gray-800">Log a new event</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all ${
                activeTab === type
                  ? 'bg-lavender-500 text-white shadow-md'
                  : 'bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50'
              }`}
            >
              <Icon size={16} className={activeTab === type ? 'text-white' : color} />
              {label}
            </button>
          ))}
        </div>
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
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#eef8ff] p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Droplets size={18} className="text-blue-500" /> Log a Drink
      </h2>

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

      <div>
        <label className="text-xs font-medium text-gray-600">Drink Type</label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {drinkTypes.map((dt) => (
            <button key={dt.value} type="button" onClick={() => setType(dt.value)}
              className={`px-3 py-2 rounded-xl text-sm transition-all ${
                type === dt.value
                  ? 'bg-lavender-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-lavender-50'
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
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          min="0" required />
        <div className="flex gap-2 mt-2 flex-wrap">
          {quickAmounts.map((qa) => (
            <button key={qa} type="button" onClick={() => setAmount(String(qa))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                amount === String(qa) ? 'bg-sky-200 text-sky-800' : 'bg-white text-gray-500 hover:bg-sky-50'
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
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
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
    <form onSubmit={handleSubmit} className="rounded-3xl bg-peach p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <CloudRain size={18} className="text-yellow-500" /> Log Urine Event
      </h2>

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
        <label className="text-xs font-medium text-gray-600">Volume (ml) <span className="text-gray-400 font-normal">— optional</span></label>
        <input type="number" value={volumeMl} onChange={(e) => setVolumeMl(e.target.value)}
          placeholder="Measured output in ml"
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
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
        <label className="text-xs font-medium text-gray-600 block mb-2">Urgency <span className="text-gray-400 font-normal">— optional</span></label>
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
        <label className="text-xs font-medium text-gray-600 block mb-2">Leakage <span className="text-gray-400 font-normal">— optional</span></label>
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

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
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
    <form onSubmit={handleSubmit} className="rounded-3xl bg-mint p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Stethoscope size={18} className="text-green-500" /> Log Bowel Event
      </h2>

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

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
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
