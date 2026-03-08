import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Droplets, CloudRain, Stethoscope, Moon, Target, Apple, ArrowLeft, Smile, Palette, Pill, Puzzle, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { generateId } from '../utils/storage';
import BristolStoolPicker from '../components/BristolStoolPicker';
import BrandIcon from '../components/BrandIcon';
import HelpPanel from '../components/HelpPanel';
import { DEFAULT_MODULES } from '../types';
import type { ModuleId, BristolStoolType, BowelAmount, UrineEntry, SleepEventType, ToiletAttemptOutcome, MealType, FoodTexture, FoodAcceptance, MoodLevel, SensoryResponseType, TherapyType } from '../types';

type EntryType = 'drink' | 'urine' | 'bowel' | 'sleep' | 'toilet' | 'food' | 'mood' | 'sensory' | 'medication' | 'therapy' | 'routine';

const MODULE_ID_MAP: Record<EntryType, ModuleId> = {
  drink:      'drinks',
  urine:      'urine',
  bowel:      'bowel',
  sleep:      'sleep',
  toilet:     'toilet',
  food:       'food',
  mood:       'mood',
  sensory:    'sensory',
  medication: 'medication',
  therapy:    'therapy',
  routine:    'routine',
};

const ALL_TABS: { type: EntryType; icon: typeof Droplets; label: string; color: string }[] = [
  { type: 'drink',      icon: Droplets,      label: 'Drink',   color: 'text-blue-500'   },
  { type: 'urine',      icon: CloudRain,     label: 'Urine',   color: 'text-yellow-500' },
  { type: 'bowel',      icon: Stethoscope,   label: 'Bowel',   color: 'text-green-500'  },
  { type: 'sleep',      icon: Moon,          label: 'Sleep',   color: 'text-indigo-500' },
  { type: 'toilet',     icon: Target,        label: 'Attempt', color: 'text-purple-500' },
  { type: 'food',       icon: Apple,         label: 'Food',    color: 'text-orange-500' },
  { type: 'mood',       icon: Smile,         label: 'Mood',    color: 'text-pink-500'   },
  { type: 'sensory',    icon: Palette,       label: 'Sensory', color: 'text-teal-500'   },
  { type: 'medication', icon: Pill,          label: 'Meds',    color: 'text-red-500'    },
  { type: 'therapy',    icon: Puzzle,        label: 'Therapy', color: 'text-cyan-500'   },
  { type: 'routine',    icon: ClipboardList, label: 'Routine', color: 'text-lime-600'   },
];

export default function AddEntryPage() {
  const location = useLocation();
  const requestedTab: EntryType = (location.state as { tab?: EntryType } | null)?.tab ?? 'drink';
  const navigate = useNavigate();
  const { enabledModules } = useApp();

  // Derive enabled tabs; fall back to default-enabled set during startup
  const enabledSet = enabledModules.length > 0
    ? new Set(enabledModules)
    : new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id));

  const tabs = ALL_TABS.filter((t) => enabledSet.has(MODULE_ID_MAP[t.type]));

  // Select the first enabled tab that matches the request; fall back to first available
  const resolveTab = (req: EntryType): EntryType => {
    if (enabledSet.has(MODULE_ID_MAP[req])) return req;
    return tabs[0]?.type ?? req;
  };

  const [activeTab, setActiveTab] = useState<EntryType>(() => resolveTab(requestedTab));

  // When enabledModules changes, correct activeTab if it is now disabled
  useEffect(() => {
    setActiveTab((prev) => resolveTab(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledModules]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Edge case: all modules disabled
  if (tabs.length === 0) {
    return (
      <div className="pb-20">
        <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] px-4 pt-4 pb-3">
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50"
            >
              <ArrowLeft size={18} />
            </button>
            <BrandIcon width={110} />
          </div>
        </div>
        <div className="px-4 mt-8 text-center">
          <p className="text-3xl mb-3">🔧</p>
          <p className="text-sm font-semibold text-gray-700">No modules enabled</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Enable at least one tracker module in Settings to start logging.</p>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full bg-lavender-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lavender-600"
          >
            Open Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] px-4 pt-4 pb-3">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50"
          >
            <ArrowLeft size={18} />
          </button>
          <BrandIcon width={110} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === type
                  ? 'bg-lavender-500 text-white shadow-md'
                  : 'bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50'
              }`}
            >
              <Icon size={14} className={activeTab === type ? 'text-white' : color} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {activeTab === 'drink' && <DrinkForm />}
        {activeTab === 'urine' && <UrineForm />}
        {activeTab === 'bowel' && <BowelForm />}
        {activeTab === 'sleep' && <SleepForm />}
        {activeTab === 'toilet' && <ToiletAttemptForm />}
        {activeTab === 'food' && <FoodForm />}
        {activeTab === 'mood' && <MoodForm />}
        {activeTab === 'sensory' && <SensoryForm />}
        {activeTab === 'medication' && <MedicationForm />}
        {activeTab === 'therapy' && <TherapyForm />}
        {activeTab === 'routine' && <RoutineForm />}
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

      <HelpPanel title="Logging a Drink">
        <p><strong>Amount (ml):</strong> How many millilitres was consumed. A standard cup is ~200ml, a bottle ~500ml.</p>
        <p><strong>Type:</strong> Choose the vessel or drink category — cup, beaker, bottle, sippy cup, or other.</p>
        <p><strong>Time:</strong> The time the drink was consumed or offered (defaults to now).</p>
        <p><strong>Notes:</strong> Optional — e.g., "refused half", "added squash".</p>
      </HelpPanel>

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

      <HelpPanel title="Logging a Urine Event">
        <p><strong>Wet:</strong> Tick if there was any urine in the pad/pants/toilet.</p>
        <p><strong>Pass:</strong> Tick if urine was passed into the toilet successfully.</p>
        <p><strong>Volume (ml):</strong> Measured output if a collection device or scales are used (optional).</p>
        <p><strong>Urgency 1–5:</strong> How urgently did they need to go? 1 = none, 5 = desperate.</p>
        <p><strong>Leakage:</strong> Amount of leakage if any — none, small, moderate, or large.</p>
      </HelpPanel>

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

      <HelpPanel title="Logging a Bowel Movement">
        <p><strong>Bristol Type 1–7:</strong> The Bristol Stool Scale describes stool consistency. Types 1–2 are hard (constipation), Types 3–4 are ideal, Types 5–7 are loose (potential diarrhoea).</p>
        <p><strong>Amount:</strong> Estimated quantity — small, medium, or large.</p>
        <p><strong>Location:</strong> Where it happened — toilet, pad, or pants.</p>
        <p><strong>Laxatives given:</strong> Tick if a laxative was administered today.</p>
      </HelpPanel>

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

function SleepForm() {
  const { addSleepEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [eventType, setEventType] = useState<SleepEventType>('onset');
  const [bedtime, setBedtime] = useState('');
  const [sleepOnsetMinutes, setSleepOnsetMinutes] = useState('');
  const [duration, setDuration] = useState('');
  const [quality, setQuality] = useState<number | null>(null);
  const [nighttimeEvent, setNighttimeEvent] = useState(false);
  const [nightActivity, setNightActivity] = useState(false);
  const [notes, setNotes] = useState('');

  const sleepEvents: { value: SleepEventType; label: string; emoji: string }[] = [
    { value: 'onset', label: 'Sleep onset', emoji: '😴' },
    { value: 'wake', label: 'Wake up', emoji: '☀️' },
    { value: 'nap_start', label: 'Nap start', emoji: '💤' },
    { value: 'nap_end', label: 'Nap end', emoji: '⏰' },
  ];

  const qualityLabels = [
    { value: 1, label: 'Poor', emoji: '😫' },
    { value: 2, label: 'Fair', emoji: '😕' },
    { value: 3, label: 'OK', emoji: '😐' },
    { value: 4, label: 'Good', emoji: '🙂' },
    { value: 5, label: 'Great', emoji: '😊' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    addSleepEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      eventType,
      bedtime: bedtime || null,
      sleepOnsetMinutes: sleepOnsetMinutes ? Number(sleepOnsetMinutes) : null,
      durationMinutes: duration ? Number(duration) : null,
      quality: (quality ?? null) as 1 | 2 | 3 | 4 | 5 | null,
      nighttimeEvent,
      nightActivity,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#eee8ff] p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Moon size={18} className="text-indigo-500" /> Log Sleep Event
      </h2>

      <HelpPanel title="Logging a Sleep Event">
        <p><strong>Event type:</strong> onset (going to sleep), wake (waking up), nap (daytime sleep), or disturbed (interrupted sleep).</p>
        <p><strong>Bedtime:</strong> When child was put to bed (before falling asleep). Helps track sleep onset latency.</p>
        <p><strong>Sleep onset delay:</strong> Minutes from bedtime until child actually fell asleep.</p>
        <p><strong>Duration:</strong> How long they slept in minutes (optional but helpful for patterns).</p>
        <p><strong>Quality 1–5:</strong> How restful was the sleep? 1 = very poor, 5 = excellent.</p>
        <p><strong>Night activity:</strong> Tick if there was a nighttime bladder/bowel event that disrupted sleep.</p>
      </HelpPanel>

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
        <div className="grid grid-cols-2 gap-2">
          {sleepEvents.map((se) => (
            <button key={se.value} type="button" onClick={() => setEventType(se.value)}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                eventType === se.value
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-indigo-50'
              }`}>
              {se.emoji} {se.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep start fields shown only for 'onset' events (#16) */}
      {eventType === 'onset' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">
              Bedtime <span className="text-gray-400 font-normal">— optional</span>
            </label>
            <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Onset delay (mins) <span className="text-gray-400 font-normal">— optional</span>
            </label>
            <input type="number" value={sleepOnsetMinutes} onChange={(e) => setSleepOnsetMinutes(e.target.value)}
              placeholder="e.g. 20"
              className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
              min="0" max="360" />
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-600">Duration (minutes) <span className="text-gray-400 font-normal">— optional</span></label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 480 for 8 hours"
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          min="0" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">Quality <span className="text-gray-400 font-normal">— optional</span></label>
        <div className="flex gap-1.5">
          {qualityLabels.map((q) => (
            <button key={q.value} type="button" onClick={() => setQuality(quality === q.value ? null : q.value)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
                quality === q.value
                  ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300'
                  : 'bg-white text-gray-500 hover:bg-indigo-50'
              }`}>
              <span className="text-lg">{q.emoji}</span>
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={nighttimeEvent} onChange={(e) => setNighttimeEvent(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-200" />
          <span className="text-sm font-medium text-gray-700">🌙 Nighttime event (10pm–6am)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={nightActivity} onChange={(e) => setNightActivity(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-200" />
          <span className="text-sm font-medium text-gray-700">🚽 Night bladder/bowel activity disrupted sleep</span>
        </label>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200">
        Save Sleep Entry 🌙
      </button>
    </form>
  );
}

function ToiletAttemptForm() {
  const { addToiletAttemptEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [outcome, setOutcome] = useState<ToiletAttemptOutcome>('success');
  const [supervised, setSupervised] = useState(true);
  const [prompted, setPrompted] = useState(false);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const outcomes: { value: ToiletAttemptOutcome; label: string; emoji: string }[] = [
    { value: 'success', label: 'Success', emoji: '✅' },
    { value: 'failure', label: 'No result', emoji: '❌' },
    { value: 'no_event', label: 'Refused', emoji: '🚫' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) return;
    addToiletAttemptEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      outcome,
      supervised,
      prompted,
      durationMinutes: duration ? Number(duration) : null,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#f3eeff] p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Target size={18} className="text-purple-500" /> Log Toilet Attempt
      </h2>

      <HelpPanel title="Logging a Toilet Attempt">
        <p><strong>Outcome:</strong> Success (produced something), failure (sat but nothing happened), or refused (would not attempt).</p>
        <p><strong>Prompted:</strong> Tick if you reminded or asked them to try.</p>
        <p><strong>Supervised:</strong> Tick if a carer was present during the attempt.</p>
        <p><strong>Duration:</strong> How many minutes they sat on the toilet (optional).</p>
      </HelpPanel>

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
        <label className="text-xs font-medium text-gray-600 block mb-2">Outcome</label>
        <div className="flex gap-3">
          {outcomes.map((o) => (
            <button key={o.value} type="button" onClick={() => setOutcome(o.value)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                outcome === o.value
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}>
              {o.emoji} {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input type="checkbox" checked={supervised} onChange={(e) => setSupervised(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-purple-500 focus:ring-purple-200" />
          <span className="text-sm font-medium text-gray-700">👀 Supervised</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <input type="checkbox" checked={prompted} onChange={(e) => setPrompted(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-purple-500 focus:ring-purple-200" />
          <span className="text-sm font-medium text-gray-700">🔔 Prompted</span>
        </label>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Duration (minutes) <span className="text-gray-400 font-normal">— optional</span></label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
          placeholder="Time on toilet in minutes"
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          min="0" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-200">
        Save Toilet Attempt 🎯
      </button>
    </form>
  );
}

function FoodForm() {
  const { addFoodEntry, selectedChildId, user } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<MealType>('snack');
  const [description, setDescription] = useState('');
  const [portions, setPortions] = useState('');
  const [isTrying, setIsTrying] = useState(false);
  const [texture, setTexture] = useState<FoodTexture | ''>('');
  const [accepted, setAccepted] = useState<FoodAcceptance | ''>('');
  const [notes, setNotes] = useState('');

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' },
  ];

  const textures: { value: FoodTexture; label: string }[] = [
    { value: 'pureed', label: 'Puréed' },
    { value: 'mashed', label: 'Mashed' },
    { value: 'soft', label: 'Soft' },
    { value: 'chopped', label: 'Chopped' },
    { value: 'whole', label: 'Whole' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const acceptanceOptions: { value: FoodAcceptance; label: string; emoji: string }[] = [
    { value: 'accepted', label: 'Accepted', emoji: '✅' },
    { value: 'refused', label: 'Refused', emoji: '❌' },
    { value: 'partial', label: 'Partial', emoji: '🔶' },
    { value: 'first_try', label: 'First try!', emoji: '⭐' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !description.trim()) return;
    addFoodEntry({
      id: generateId(),
      childId: selectedChildId,
      date,
      time,
      mealType,
      description: description.trim(),
      portions: portions ? Number(portions) : null,
      isTrying,
      texture: texture || null,
      accepted: accepted || null,
      notes,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-[#fff5eb] p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
        <Apple size={18} className="text-orange-500" /> Log Food
      </h2>

      <HelpPanel title="Logging a Meal or Snack">
        <p><strong>Meal type:</strong> Breakfast, lunch, dinner, or snack.</p>
        <p><strong>Description:</strong> What was eaten — keep it brief, e.g., "pasta with tomato sauce".</p>
        <p><strong>New food:</strong> Toggle on if this is the first time trying this food.</p>
        <p><strong>Texture &amp; Acceptance:</strong> Track texture and whether child accepted it (helpful for feeding therapy).</p>
        <p><strong>Portions:</strong> Estimated portions eaten — 0.25, 0.5, 0.75, 1, or 1.5+.</p>
        <p><strong>Notes:</strong> Any observations — e.g., "refused vegetables", "ate well".</p>
      </HelpPanel>

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
        <label className="text-xs font-medium text-gray-600 block mb-2">Meal Type</label>
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((m) => (
            <button key={m.value} type="button" onClick={() => setMealType(m.value)}
              className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                mealType === m.value
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-50'
              }`}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Food description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Pasta with vegetables, yoghurt"
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          required />
      </div>

      {/* Food Trying Tracker fields (#15) */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isTrying} onChange={(e) => setIsTrying(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-200" />
          <span className="text-sm font-medium text-gray-700">⭐ New food — trying for the first time</span>
        </label>
      </div>

      {isTrying && (
        <>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Texture <span className="text-gray-400 font-normal">— optional</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {textures.map((t) => (
                <button key={t.value} type="button" onClick={() => setTexture(texture === t.value ? '' : t.value)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    texture === t.value
                      ? 'bg-orange-400 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Acceptance <span className="text-gray-400 font-normal">— optional</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {acceptanceOptions.map((a) => (
                <button key={a.value} type="button" onClick={() => setAccepted(accepted === a.value ? '' : a.value)}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                    accepted === a.value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-orange-50'
                  }`}>
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <label className="text-xs font-medium text-gray-600">Portions <span className="text-gray-400 font-normal">— optional</span></label>
        <input type="number" value={portions} onChange={(e) => setPortions(e.target.value)}
          placeholder="Number of portions"
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm"
          min="0" step="0.5" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Dietary notes, allergies, reactions..."
          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm resize-none"
          rows={2} />
      </div>

      <button type="submit"
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-200">
        Save Food Entry 🍽️
      </button>
    </form>
  );
}

function MoodForm() {
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

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">😊 Log Mood</h2>
      <HelpPanel title="Logging Mood">
        <p><strong>Level 1–5:</strong> Overall emotional state. 1 = very distressed, 2 = upset, 3 = neutral/calm, 4 = happy, 5 = very happy/excited.</p>
        <p><strong>Triggers:</strong> What may have caused this mood — e.g., "transition to school", "new sensory input", "slept well".</p>
        <p><strong>Notes:</strong> Any additional context about behaviour or environment.</p>
      </HelpPanel>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
      </div>
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
      <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional observations..." className={inputCls + " resize-none"} rows={2} /></div>
      <button type="submit" className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-200">Save Mood Entry 😊</button>
    </form>
  );
}

function SensoryForm() {
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">🎨 Log Sensory Event</h2>
      <HelpPanel title="Logging a Sensory Event">
        <p><strong>Sensory type:</strong> Which sense was involved — touch (tactile), sound (auditory), sight (visual), taste (gustatory), smell (olfactory), movement (vestibular), body position (proprioceptive), or other.</p>
        <p><strong>Response:</strong> How they responded — seeking (wanted more), avoiding (moved away/covered ears etc.), or neutral.</p>
        <p><strong>Intensity 1–5:</strong> How strong was the sensory event? 1 = barely noticeable, 5 = overwhelming.</p>
      </HelpPanel>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
      </div>
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
      <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the sensory event..." className={inputCls + " resize-none"} rows={2} /></div>
      <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-teal-200">Save Sensory Entry 🎨</button>
    </form>
  );
}

function MedicationForm() {
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

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">💊 Log Medication</h2>
      <HelpPanel title="Logging a Medication">
        <p><strong>Medication name:</strong> The name of the medication as prescribed.</p>
        <p><strong>Dosage:</strong> The dose given — e.g., "5mg", "1 tablet", "10ml".</p>
        <p><strong>Administered:</strong> Tick if the medication was successfully given. Untick if the dose was missed or refused.</p>
      </HelpPanel>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
      </div>
      <div><label className="text-xs font-medium text-gray-600">Medication Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Melatonin" className={inputCls} required /></div>
      <div><label className="text-xs font-medium text-gray-600">Dosage</label><input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 1mg" className={inputCls} /></div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={administered} onChange={(e) => setAdministered(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400" />
        Administered
      </label>
      <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Side effects, observations..." className={inputCls + " resize-none"} rows={2} /></div>
      <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-200">Save Medication Entry 💊</button>
    </form>
  );
}

function TherapyForm() {
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">🧩 Log Therapy Session</h2>
      <HelpPanel title="Logging a Therapy Session">
        <p><strong>Therapy type:</strong> Speech & Language (SALT), Occupational Therapy (OT), Physiotherapy (PT), Applied Behaviour Analysis (ABA), Behavioural, Music, Art, or Other.</p>
        <p><strong>Provider:</strong> The therapist's name or organisation (optional but useful for multi-provider families).</p>
        <p><strong>Duration:</strong> Length of the session in minutes.</p>
        <p><strong>Goals worked on:</strong> Brief notes on what was targeted, e.g., "requesting using PECS", "hand washing routine".</p>
      </HelpPanel>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
      </div>
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
      <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Progress, observations..." className={inputCls + " resize-none"} rows={2} /></div>
      <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-cyan-200">Save Therapy Entry 🧩</button>
    </form>
  );
}

function RoutineForm() {
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

  const inputCls = "w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-lavender-400 focus:ring-2 focus:ring-lavender-100 outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_24px_70px_rgba(139,77,255,0.08)]">
      <h2 className="text-lg font-bold text-gray-900">📋 Log Routine</h2>
      <HelpPanel title="Logging a Routine">
        <p><strong>Routine name:</strong> A short label for this routine step — e.g., "Morning teeth brushing", "Getting dressed", "School pickup".</p>
        <p><strong>Completed:</strong> Tick if the routine was completed as expected.</p>
        <p><strong>Duration:</strong> How long the routine took in minutes (optional).</p>
        <p><strong>Notes:</strong> Any challenges, adaptations needed, or successes worth noting.</p>
      </HelpPanel>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></div>
        <div><label className="text-xs font-medium text-gray-600">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} /></div>
      </div>
      <div><label className="text-xs font-medium text-gray-600">Routine Name</label><input value={routineName} onChange={(e) => setRoutineName(e.target.value)} placeholder="e.g. Morning brushing teeth" className={inputCls} required /></div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-lime-500 focus:ring-lime-400" />
        Completed
      </label>
      <div><label className="text-xs font-medium text-gray-600">Duration (minutes, optional)</label><input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')} min={1} className={inputCls} /></div>
      <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations about the routine..." className={inputCls + " resize-none"} rows={2} /></div>
      <button type="submit" className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-lime-200">Save Routine Entry 📋</button>
    </form>
  );
}
