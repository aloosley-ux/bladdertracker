import { useMemo } from 'react';
import { getModuleLabel } from '../../content/presentation';
import { DEFAULT_MODULES } from '../../types';
import type { ModuleKey } from '../../hooks/useLogPage';

const MODULE_CHIP_COLOURS: Record<ModuleKey, string> = {
  drinks:     'bg-sky-100 text-sky-700',
  urine:      'bg-amber-100 text-amber-700',
  bowel:      'bg-emerald-100 text-emerald-700',
  sleep:      'bg-indigo-100 text-indigo-700',
  toilet:     'bg-purple-100 text-purple-700',
  food:       'bg-orange-100 text-orange-700',
  mood:       'bg-pink-100 text-pink-700',
  sensory:    'bg-teal-100 text-teal-700',
  medication: 'bg-red-100 text-red-700',
  therapy:    'bg-cyan-100 text-cyan-700',
  routine:    'bg-lime-100 text-lime-700',
};
const MODULE_CHIP_ACTIVE: Record<ModuleKey, string> = {
  drinks:     'bg-sky-500 text-white',
  urine:      'bg-amber-500 text-white',
  bowel:      'bg-emerald-500 text-white',
  sleep:      'bg-indigo-500 text-white',
  toilet:     'bg-purple-500 text-white',
  food:       'bg-orange-500 text-white',
  mood:       'bg-pink-500 text-white',
  sensory:    'bg-teal-500 text-white',
  medication: 'bg-red-500 text-white',
  therapy:    'bg-cyan-500 text-white',
  routine:    'bg-lime-500 text-white',
};

const ALL_MODULE_KEYS = DEFAULT_MODULES
  .filter((m) => m.id !== 'milestones')
  .map((m) => m.id) as ModuleKey[];

interface ModuleFilterProps {
  enabledKeys: Set<ModuleKey>;
  activeFilters: Set<ModuleKey>;
  toggleFilter: (key: ModuleKey) => void;
}

export default function ModuleFilter({ enabledKeys, activeFilters, toggleFilter }: ModuleFilterProps) {
  const visibleModules = useMemo(
    () => ALL_MODULE_KEYS
      .filter((key) => enabledKeys.has(key))
      .map((key) => ({
        key,
        label: getModuleLabel(key as ModuleKey, key === 'toilet' ? 'short' : undefined),
        emoji: DEFAULT_MODULES.find((m) => m.id === key)?.icon ?? '',
      })),
    [enabledKeys],
  );

  return (
    <div className="px-4 pt-4">
      <div className="flex flex-wrap gap-2">
        {visibleModules.map((m) => {
          const active = activeFilters.has(m.key);
          return (
            <button
              key={m.key}
              onClick={() => toggleFilter(m.key)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                active
                  ? MODULE_CHIP_ACTIVE[m.key]
                  : MODULE_CHIP_COLOURS[m.key]
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
