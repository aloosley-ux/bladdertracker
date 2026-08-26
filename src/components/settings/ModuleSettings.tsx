import { useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';
import { DEFAULT_MODULES } from '../../types';
import type { ModuleId } from '../../types';
import { Switch } from '../ui/switch';

// ── Module accent colours ─────────────────────────────────────────────
const MODULE_ACCENT: Record<string, string> = {
  drinks:     '#0ea5e9', // sky-500
  urine:      '#f59e0b', // amber-500
  bowel:      '#22c55e', // green-500
  sleep:      '#6366f1', // indigo-500
  toilet:     '#a855f7', // purple-500
  food:       '#f97316', // orange-500
  mood:       '#ec4899', // pink-500
  sensory:    '#14b8a6', // teal-500
  medication: '#ef4444', // red-500
  therapy:    '#06b6d4', // cyan-500
  routine:    '#84cc16', // lime-500
  milestones: '#eab308', // yellow-500
};

// ── Module Settings subcomponent ─────────────────────────────────────
// Keyed by child so state resets naturally when the selected child changes.
interface ModuleSettingsProps {
  childName: string;
  initialModules: ModuleId[];
  onSave: (modules: ModuleId[]) => void | Promise<void>;
}

// ModuleSettings — toggleable module selector for enabling/disabling tracker modules per child.
export default function ModuleSettings({ childName, initialModules, onSave }: ModuleSettingsProps) {
  // Use a ref to track the most-recently applied module list so that rapid
  // consecutive toggles (before the parent re-renders) compose correctly.
  const latestRef = useRef(initialModules);
  // When the parent provides a fresh value (e.g. after cloud load or child switch),
  // update the ref so the next toggle works against the correct base.
  useEffect(() => {
    latestRef.current = initialModules;
  }, [initialModules]);

  const enabled = new Set(initialModules);

  const toggle = (modId: ModuleId, checked: boolean) => {
    const base = latestRef.current;
    const next = checked
      ? [...base, modId]
      : base.filter((m) => m !== modId);
    // Update ref immediately so the next rapid click uses the new list
    latestRef.current = next;
    onSave(next);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-700">
        <Settings size={16} className="text-violet-500" /> Tracker Modules for {childName}
      </h3>
      <p className="mb-3 text-xs text-gray-400">
        Toggles apply instantly — only enabled modules appear on Dashboard, Log, Reports, and Add Entry.
      </p>
      <div className="space-y-2">
        {DEFAULT_MODULES.map((mod) => {
          const isOn = enabled.has(mod.id);
          const accent = MODULE_ACCENT[mod.id] ?? '#8b4dff';
          return (
            <div
              key={mod.id}
              className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-3 py-3 transition-colors hover:bg-violet-50"
              onClick={() => toggle(mod.id, !isOn)}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ background: `${accent}22` }}
                >
                  {mod.icon}
                </span>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{mod.label}</span>
                  <p className="text-[10px] text-gray-400">{mod.description}</p>
                </div>
              </div>
              <Switch
                checked={isOn}
                onCheckedChange={(checked) => toggle(mod.id, checked)}
                aria-label={`Toggle ${mod.label}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
