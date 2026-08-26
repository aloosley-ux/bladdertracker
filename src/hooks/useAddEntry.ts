import { useEffect, useMemo, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { DEFAULT_MODULES } from '../types';
import type { ModuleId } from '../types';

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

export function useAddEntry() {
  const location = useLocation();
  const { enabledModules } = useApp();

  const enabledSet = useMemo(() => (
    enabledModules.length > 0
      ? new Set(enabledModules)
      : new Set(DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id))
  ), [enabledModules]);

  const requestedTab: EntryType = (location.state as { tab?: EntryType } | null)?.tab ?? 'drink';

  const tabs = useMemo(() => {
    const ALL_TABS: { type: EntryType; label: string }[] = [
      { type: 'drink',      label: 'Drink' },
      { type: 'urine',      label: 'Urine' },
      { type: 'bowel',      label: 'Bowel' },
      { type: 'sleep',      label: 'Sleep' },
      { type: 'toilet',     label: 'Toilet' },
      { type: 'food',       label: 'Food' },
      { type: 'mood',       label: 'Mood' },
      { type: 'sensory',    label: 'Sensory' },
      { type: 'medication', label: 'Meds' },
      { type: 'therapy',    label: 'Therapy' },
      { type: 'routine',    label: 'Routine' },
    ];
    return ALL_TABS.filter((t) => enabledSet.has(MODULE_ID_MAP[t.type]));
  }, [enabledSet]);

  const resolveTab = useCallback((req: EntryType): EntryType => {
    if (enabledSet.has(MODULE_ID_MAP[req])) return req;
    return tabs[0]?.type ?? req;
  }, [enabledSet, tabs]);

  const [activeTab, setActiveTab] = useState<EntryType>(() => resolveTab(requestedTab));

  useEffect(() => {
    Promise.resolve().then(() => setActiveTab((prev) => resolveTab(prev)));
  }, [resolveTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return {
    tabs,
    activeTab,
    setActiveTab,
    hasTabs: tabs.length > 0,
  };
}
