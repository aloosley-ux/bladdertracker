import { useEffect, useState, useMemo, useCallback } from 'react';
import { Droplets, CloudRain, Stethoscope, Moon, Target, Apple, ArrowLeft, Smile, Palette, Pill, Puzzle, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import BrandIcon from '../components/BrandIcon';
import { getModuleLabel } from '../content/presentation';
import { DEFAULT_MODULES } from '../types';
import type { ModuleId } from '../types';
import {
  DrinkForm,
  UrineForm,
  BowelForm,
  SleepForm,
  ToiletAttemptForm,
  FoodForm,
  MoodForm,
  SensoryForm,
  MedicationForm,
  TherapyForm,
  RoutineForm,
} from '../components/forms';

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
  { type: 'drink',      icon: Droplets,      label: getModuleLabel('drinks', 'quickAction'), color: 'text-blue-500'   },
  { type: 'urine',      icon: CloudRain,     label: getModuleLabel('urine', 'quickAction'), color: 'text-yellow-500' },
  { type: 'bowel',      icon: Stethoscope,   label: getModuleLabel('bowel', 'quickAction'), color: 'text-green-500'  },
  { type: 'sleep',      icon: Moon,          label: 'Sleep',   color: 'text-indigo-500' },
  { type: 'toilet',     icon: Target,        label: getModuleLabel('toilet', 'quickAction'), color: 'text-purple-500' },
  { type: 'food',       icon: Apple,         label: getModuleLabel('food', 'quickAction'), color: 'text-orange-500' },
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
  const enabledSet = useMemo(() => (
    enabledModules.length > 0
      ? new Set(enabledModules)
      : new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id))
  ), [enabledModules]);

  const tabs = ALL_TABS.filter((t) => enabledSet.has(MODULE_ID_MAP[t.type]));

  // Select the first enabled tab that matches the request; fall back to first available
  const resolveTab = useCallback((req: EntryType): EntryType => {
    if (enabledSet.has(MODULE_ID_MAP[req])) return req;
    return tabs[0]?.type ?? req;
  }, [enabledSet, tabs]);

  const [activeTab, setActiveTab] = useState<EntryType>(() => resolveTab(requestedTab));

  // When enabledModules changes, correct activeTab if it is now disabled
  useEffect(() => {
    // Schedule state update to next tick to avoid setState directly in effect
    Promise.resolve().then(() => setActiveTab((prev) => resolveTab(prev)));
  }, [resolveTab]);

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
              aria-label="Back to dashboard"
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
          <p className="text-xs text-gray-400 mt-1 mb-4">Turn on at least one module in Settings to start logging.</p>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-full bg-lavender-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lavender-600"
          >
            Open settings
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
            aria-label="Back to dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-black/5 hover:bg-lavender-50"
          >
            <ArrowLeft size={18} />
          </button>
          <BrandIcon width={110} />
        </div>

        <div className="mb-3 px-1">
          <h1 className="text-lg font-bold text-gray-900">Add an update</h1>
          <p className="mt-1 text-sm text-gray-500">Choose the quickest thing you want to log.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex min-h-12 items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-medium transition-all whitespace-nowrap ${
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
