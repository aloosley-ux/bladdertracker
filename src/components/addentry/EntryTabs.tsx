import { Droplets, CloudRain, Stethoscope, Moon, Target, Apple, Smile, Palette, Pill, Puzzle, ClipboardList } from 'lucide-react';

type EntryType = 'drink' | 'urine' | 'bowel' | 'sleep' | 'toilet' | 'food' | 'mood' | 'sensory' | 'medication' | 'therapy' | 'routine';

const TAB_META: { type: EntryType; icon: typeof Droplets; label: string; color: string }[] = [
  { type: 'drink',      icon: Droplets,      label: 'Drink',   color: 'text-blue-500'   },
  { type: 'urine',      icon: CloudRain,     label: 'Urine',   color: 'text-yellow-500' },
  { type: 'bowel',      icon: Stethoscope,   label: 'Bowel',   color: 'text-green-500'  },
  { type: 'sleep',      icon: Moon,          label: 'Sleep',   color: 'text-indigo-500' },
  { type: 'toilet',     icon: Target,        label: 'Toilet',  color: 'text-purple-500' },
  { type: 'food',       icon: Apple,         label: 'Food',    color: 'text-orange-500' },
  { type: 'mood',       icon: Smile,         label: 'Mood',    color: 'text-pink-500'   },
  { type: 'sensory',    icon: Palette,       label: 'Sensory', color: 'text-teal-500'   },
  { type: 'medication', icon: Pill,          label: 'Meds',    color: 'text-red-500'    },
  { type: 'therapy',    icon: Puzzle,        label: 'Therapy', color: 'text-cyan-500'   },
  { type: 'routine',    icon: ClipboardList, label: 'Routine', color: 'text-lime-600'   },
];

interface EntryTabsProps {
  tabs: { type: EntryType; label: string }[];
  activeTab: EntryType;
  setActiveTab: (t: EntryType) => void;
}

export default function EntryTabs({ tabs, activeTab, setActiveTab }: EntryTabsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 pb-1 sm:grid-cols-6 md:grid-cols-8">
      {tabs.map(({ type, label }) => {
        const meta = TAB_META.find((m) => m.type === type);
        const Icon = meta?.icon ?? Droplets;
        const color = meta?.color ?? 'text-gray-500';
        return (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all sm:w-auto ${
              activeTab === type
                ? 'bg-lavender-500 text-white shadow-md'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-[var(--bg-input)]'
            }`}
          >
            <Icon size={14} className={activeTab === type ? 'text-white' : color} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
