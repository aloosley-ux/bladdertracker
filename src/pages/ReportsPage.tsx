import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { format, startOfDay, subDays } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalendarDays, ChevronRight, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';
import EmptyState from '../components/EmptyState';
import { getModuleLabel, TOILET_OUTCOME_LABELS } from '../content/presentation';
import { DEFAULT_MODULES } from '../types';

type Period = '7d' | '14d' | '30d';

const ALL_EVENT_FILTERS = [
  { key: 'drinks', label: `💧 ${getModuleLabel('drinks', 'report')}`, color: '#0ea5e9' },
  { key: 'urine', label: `💦 ${getModuleLabel('urine', 'report')}`, color: '#f59e0b' },
  { key: 'bowel', label: `🚽 ${getModuleLabel('bowel', 'report')}`, color: '#22c55e' },
  { key: 'sleep', label: '🌙 Sleep', color: '#6366f1' },
  { key: 'toilet', label: `🎯 ${getModuleLabel('toilet', 'report')}`, color: '#a855f7' },
  { key: 'food', label: `🍽️ ${getModuleLabel('food', 'report')}`, color: '#f97316' },
  { key: 'mood', label: '😊 Mood', color: '#ec4899' },
  { key: 'sensory', label: '🎨 Sensory', color: '#14b8a6' },
  { key: 'medication', label: '💊 Medication', color: '#64748b' },
  { key: 'therapy', label: '🧩 Therapy', color: '#8b5cf6' },
  { key: 'routine', label: '📋 Routine', color: '#78716c' },
] as const;

type FilterKey = typeof ALL_EVENT_FILTERS[number]['key'];

export default function ReportsPage() {
  const {
    drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries,
    moodEntries, sensoryEntries, medicationEntries, therapyEntries, routineEntries,
    milestones, selectedChildId, selectedChild, enabledModules, exportData,
  } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('7d');
  const [confirmExport, setConfirmExport] = useState(false);

  // Derive which filter keys are currently enabled
  const enabledFilterKeys = useMemo<Set<FilterKey>>(() => {
    const src = enabledModules.length > 0
      ? enabledModules
      : DEFAULT_MODULES.filter((m) => m.defaultEnabled).map((m) => m.id);
    const srcSet = new Set(src);
    return new Set(ALL_EVENT_FILTERS.map((f) => f.key).filter((k) => srcSet.has(k)) as FilterKey[]);
  }, [enabledModules]);

  // Visible filter chips = only enabled module filters
  const EVENT_FILTERS = useMemo(
    () => ALL_EVENT_FILTERS.filter((f) => enabledFilterKeys.has(f.key)),
    [enabledFilterKeys],
  );

  const [storedActiveFilters, setStoredActiveFilters] = useState<Set<FilterKey>>(
    () => new Set(ALL_EVENT_FILTERS.map((f) => f.key).filter((k) => enabledFilterKeys.has(k))),
  );
  const activeFilters = useMemo(
    () => new Set([...storedActiveFilters].filter((key) => enabledFilterKeys.has(key))),
    [storedActiveFilters, enabledFilterKeys],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;

  const toggleFilter = (key: FilterKey) => {
    setStoredActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const fluidData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayDrinks = drinks.filter((d) => d.childId === selectedChildId && d.date === dateStr);
      return {
        date: format(date, 'dd/MM'),
        totalMl: dayDrinks.reduce((sum, d) => sum + d.amountMl, 0),
      };
    });
  }, [days, drinks, selectedChildId]);

  const eventData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      const forChild = <T extends { childId: string; date: string }>(arr: T[]) =>
        arr.filter((e) => e.childId === selectedChildId && e.date === dateStr).length;
      return {
        date: format(date, 'dd/MM'),
        wet: urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr && e.wet).length,
        pass: urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr && e.pass).length,
        bowel: forChild(bowelEntries),
        sleep: forChild(sleepEntries),
        toilet: forChild(toiletAttemptEntries),
        food: forChild(foodEntries),
        mood: forChild(moodEntries),
        sensory: forChild(sensoryEntries),
        medication: forChild(medicationEntries),
        therapy: forChild(therapyEntries),
        routine: forChild(routineEntries),
      };
    });
  }, [days, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries,
    moodEntries, sensoryEntries, medicationEntries, therapyEntries, routineEntries, selectedChildId]);

  const stoolTypeData = useMemo(() => {
    const childBowel = bowelEntries.filter((e) => e.childId === selectedChildId);
    return [1, 2, 3, 4, 5, 6, 7].map((type) => ({
      type: `Type ${type}`,
      count: childBowel.filter((e) => e.bristolType === type).length,
    }));
  }, [bowelEntries, selectedChildId]);

  const toiletOutcomeData = useMemo(() => {
    const childAttempts = toiletAttemptEntries.filter((e) => e.childId === selectedChildId);
    return [
      { outcome: TOILET_OUTCOME_LABELS.success, count: childAttempts.filter((e) => e.outcome === 'success').length },
      { outcome: TOILET_OUTCOME_LABELS.failure, count: childAttempts.filter((e) => e.outcome === 'failure').length },
      { outcome: TOILET_OUTCOME_LABELS.no_event, count: childAttempts.filter((e) => e.outcome === 'no_event').length },
    ];
  }, [toiletAttemptEntries, selectedChildId]);

  const moodTrendData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEntries = moodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr);
      const avg = dayEntries.length
        ? Math.round((dayEntries.reduce((s, e) => s + e.level, 0) / dayEntries.length) * 10) / 10
        : null;
      return { date: format(date, 'dd/MM'), avgMood: avg, count: dayEntries.length };
    });
  }, [days, moodEntries, selectedChildId]);

  const milestoneTrendData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: format(date, 'dd/MM'),
        achieved: milestones.filter((entry) => entry.childId === selectedChildId && entry.status === 'achieved' && entry.dateAchieved === dateStr).length,
      };
    });
  }, [days, milestones, selectedChildId]);

  const stats = useMemo(() => {
    const childDrinks = drinks.filter((d) => d.childId === selectedChildId);
    const childUrine = urineEntries.filter((e) => e.childId === selectedChildId);
    const childBowel = bowelEntries.filter((e) => e.childId === selectedChildId);
    const childSleep = sleepEntries.filter((e) => e.childId === selectedChildId);
    const childToilet = toiletAttemptEntries.filter((e) => e.childId === selectedChildId);
    const childFood = foodEntries.filter((e) => e.childId === selectedChildId);
    const childMood = moodEntries.filter((e) => e.childId === selectedChildId);
    const childSensory = sensoryEntries.filter((e) => e.childId === selectedChildId);
    const childMedication = medicationEntries.filter((e) => e.childId === selectedChildId);
    const childTherapy = therapyEntries.filter((e) => e.childId === selectedChildId);
    const childRoutine = routineEntries.filter((e) => e.childId === selectedChildId);
    const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const inPeriod = (date: string) => date >= cutoff;

    const recentMood = childMood.filter((e) => inPeriod(e.date));

    return {
      drinks: childDrinks.filter((d) => inPeriod(d.date)).length,
      avgMl: Math.round(childDrinks.filter((d) => inPeriod(d.date)).reduce((s, d) => s + d.amountMl, 0) / days),
      urineEvents: childUrine.filter((e) => inPeriod(e.date)).length,
      bowelEvents: childBowel.filter((e) => inPeriod(e.date)).length,
      sleepEvents: childSleep.filter((e) => inPeriod(e.date)).length,
      toiletAttempts: childToilet.filter((e) => inPeriod(e.date)).length,
      toiletSuccess: childToilet.filter((e) => inPeriod(e.date) && e.outcome === 'success').length,
      meals: childFood.filter((e) => inPeriod(e.date)).length,
      newFoods: childFood.filter((e) => inPeriod(e.date) && e.isTrying).length,
      moodLogs: recentMood.length,
      avgMood: recentMood.length
        ? Math.round((recentMood.reduce((s, e) => s + e.level, 0) / recentMood.length) * 10) / 10
        : null,
      sensoryLogs: childSensory.filter((e) => inPeriod(e.date)).length,
      medicationLogs: childMedication.filter((e) => inPeriod(e.date)).length,
      therapySessions: childTherapy.filter((e) => inPeriod(e.date)).length,
      routineChecks: childRoutine.filter((e) => inPeriod(e.date)).length,
      routineCompleted: childRoutine.filter((e) => inPeriod(e.date) && e.completed).length,
    };
  }, [drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries,
    moodEntries, sensoryEntries, medicationEntries, therapyEntries, routineEntries, selectedChildId, days]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Trends &mdash; Reports</h1>
        <p className="mt-1 text-sm text-gray-500">
          A calm visual summary for {selectedChild?.name ?? 'your selected child'}.
        </p>
      </div>

      {/* Period selector & calendar link */}
      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <div className="flex-1 grid grid-cols-3 gap-2 rounded-2xl bg-gray-50 p-1 text-sm ring-1 ring-black/5">
          {(['7d', '14d', '30d'] as Period[]).map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-2xl px-3 py-2 font-medium transition-all ${
                period === item ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              {item === '7d' ? '7 Days' : item === '14d' ? '14 Days' : '30 Days'}
            </button>
          ))}
        </div>
        <Link
          to="/calendar"
          className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-black/5 whitespace-nowrap"
        >
          <CalendarDays size={14} /> Calendar <ChevronRight size={14} />
        </Link>
      </div>

      <div className="space-y-4 px-4">
        <NhsCard>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-700">Shareable summaries</h3>
              <p className="text-xs text-gray-500">Exports are de-identified unless your role allows named sharing.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmExport(true)} className="rounded-full bg-lavender-500 px-3 py-2 text-xs font-semibold text-white">Download CSV</button>
              <button onClick={() => window.print()} className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">Print / PDF</button>
            </div>
          </div>
        </NhsCard>

        {/* Event filter toggles — only enabled modules [2] */}
        {EVENT_FILTERS.length > 0 && (
          <NhsCard>
            <h3 className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-3">
              <Filter size={12} /> Show/hide event types
            </h3>
            <div className="flex flex-wrap gap-2">
              {EVENT_FILTERS.map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  aria-pressed={activeFilters.has(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFilters.has(key)
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={activeFilters.has(key) ? { backgroundColor: color } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </NhsCard>
        )}

        {/* Module summary — filtered to enabled modules */}
        <NhsCard>
          <h3 className="text-sm font-bold text-gray-700 mb-3">📈 {days}-day summary for {selectedChild?.name ?? 'child'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {enabledFilterKeys.has('drinks') && <StatTile emoji="💧" text={`${stats.drinks} drinks · avg ${stats.avgMl}ml/day`} bg="bg-sky-50" />}
            {enabledFilterKeys.has('urine') && <StatTile emoji="💦" text={`${stats.urineEvents} wee updates`} bg="bg-amber-50" />}
            {enabledFilterKeys.has('bowel') && <StatTile emoji="🚽" text={`${stats.bowelEvents} poo updates`} bg="bg-emerald-50" />}
            {enabledFilterKeys.has('sleep') && <StatTile emoji="🌙" text={`${stats.sleepEvents} sleep events`} bg="bg-indigo-50" />}
            {enabledFilterKeys.has('toilet') && <StatTile emoji="🎯" text={`${stats.toiletAttempts} toilet visits (${stats.toiletSuccess} successful)`} bg="bg-purple-50" />}
            {enabledFilterKeys.has('food') && <StatTile emoji="🍽️" text={`${stats.meals} meals · ${stats.newFoods} new foods tried`} bg="bg-orange-50" />}
            {enabledFilterKeys.has('mood') && (
              <StatTile emoji="😊" text={`${stats.moodLogs} mood logs${stats.avgMood !== null ? ` · avg ${stats.avgMood}/5` : ''}`} bg="bg-pink-50" />
            )}
            {enabledFilterKeys.has('sensory') && <StatTile emoji="🎨" text={`${stats.sensoryLogs} sensory observations`} bg="bg-teal-50" />}
            {enabledFilterKeys.has('medication') && <StatTile emoji="💊" text={`${stats.medicationLogs} medication logs`} bg="bg-slate-50" />}
            {enabledFilterKeys.has('therapy') && <StatTile emoji="🧩" text={`${stats.therapySessions} therapy sessions`} bg="bg-violet-50" />}
            {enabledFilterKeys.has('routine') && (
              <StatTile emoji="📋" text={`${stats.routineChecks} routines · ${stats.routineCompleted} completed`} bg="bg-stone-50" />
            )}
          </div>
        </NhsCard>

        {/* Charts in responsive grid */}
        {activeFilters.size === 0 ? (
          <NhsCard>
            <EmptyState
              icon="📊"
              title="No report data to show"
              description="Enable some event filters above, or add entries to see charts and trends."
              actionLabel="Add an entry"
              onAction={() => navigate('/add')}
            />
          </NhsCard>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enabledFilterKeys.has('drinks') && activeFilters.has('drinks') && (
            <ChartCard title="💧 Fluid intake">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fluidData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} label={{ value: 'Date', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'ml', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} formatter={(v) => [`${v} ml`, 'Fluid intake']} />
                  <Bar dataKey="totalMl" fill="#8b4dff" radius={[10, 10, 0, 0]} name="Fluid intake (ml)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Events timeline — only if at least one event module is enabled */}
          {(enabledFilterKeys.has('urine') || enabledFilterKeys.has('bowel') || enabledFilterKeys.has('sleep') || enabledFilterKeys.has('toilet') || enabledFilterKeys.has('food')) && (
            <ChartCard title="📊 Events timeline">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={eventData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} label={{ value: 'Date', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
                  <Legend />
                  {enabledFilterKeys.has('urine') && activeFilters.has('urine') && <>
                    <Line type="monotone" dataKey="wet" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Wet clothes" />
                    <Line type="monotone" dataKey="pass" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Used toilet" />
                  </>}
                  {enabledFilterKeys.has('bowel') && activeFilters.has('bowel') && <Line type="monotone" dataKey="bowel" stroke="#8b4dff" strokeWidth={2} dot={{ r: 3 }} name="Poo" />}
                  {enabledFilterKeys.has('sleep') && activeFilters.has('sleep') && <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Sleep" />}
                  {enabledFilterKeys.has('toilet') && activeFilters.has('toilet') && <Line type="monotone" dataKey="toilet" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Toilet visits" />}
                  {enabledFilterKeys.has('food') && activeFilters.has('food') && <Line type="monotone" dataKey="food" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Meals" />}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Extended module charts (#17) */}
          {(enabledFilterKeys.has('mood') || enabledFilterKeys.has('sensory') || enabledFilterKeys.has('medication') || enabledFilterKeys.has('therapy') || enabledFilterKeys.has('routine')) && (
            <ChartCard title="📊 Extended modules timeline">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={eventData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
                  <Legend />
                  {enabledFilterKeys.has('mood') && activeFilters.has('mood') && <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} name="Mood" />}
                  {enabledFilterKeys.has('sensory') && activeFilters.has('sensory') && <Line type="monotone" dataKey="sensory" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} name="Sensory" />}
                  {enabledFilterKeys.has('medication') && activeFilters.has('medication') && <Line type="monotone" dataKey="medication" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} name="Medication" />}
                  {enabledFilterKeys.has('therapy') && activeFilters.has('therapy') && <Line type="monotone" dataKey="therapy" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Therapy" />}
                  {enabledFilterKeys.has('routine') && activeFilters.has('routine') && <Line type="monotone" dataKey="routine" stroke="#78716c" strokeWidth={2} dot={{ r: 3 }} name="Routine" />}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {enabledFilterKeys.has('mood') && activeFilters.has('mood') && (
            <ChartCard title="😊 Mood trend (avg per day)">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodTrendData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} label={{ value: '1–5', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
                  <Line type="monotone" dataKey="avgMood" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} name="Avg mood" connectNulls />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-gray-400">Average daily mood rating (1 = very low, 5 = excellent). Gaps indicate no data for that day.</p>
            </ChartCard>
          )}

          {enabledFilterKeys.has('bowel') && activeFilters.has('bowel') && (
            <ChartCard title="💩 Bristol stool distribution">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stoolTypeData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                  <XAxis dataKey="type" tick={{ fontSize: 10 }} label={{ value: 'Stool type', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} formatter={(v) => [v, 'Occurrences']} />
                  <Bar dataKey="count" fill="#22c55e" radius={[10, 10, 0, 0]} name="Occurrences" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-gray-400">Types 3–4 are usually ideal. Use this alongside clinical advice and your care team&apos;s guidance.</p>
            </ChartCard>
          )}

          {enabledFilterKeys.has('toilet') && activeFilters.has('toilet') && (
            <ChartCard title="🎯 Toilet attempt outcomes">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={toiletOutcomeData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                  <XAxis dataKey="outcome" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
                  <Bar dataKey="count" fill="#a855f7" radius={[10, 10, 0, 0]} name="Toilet visits" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          <ChartCard title="⭐ Milestones achieved trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={milestoneTrendData} margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="achieved" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Achieved milestones" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        )}
      </div>

      {confirmExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5">
            <h3 className="text-base font-bold text-gray-900">Confirm export</h3>
            <p className="mt-2 text-sm text-gray-600">
              Please confirm you have consent to export this child&apos;s data. Exporting should only be used for agreed care/school workflows.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmExport(false)} className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button
                onClick={() => {
                  exportData();
                  setConfirmExport(false);
                }}
                className="rounded-full bg-lavender-500 px-4 py-2 text-xs font-semibold text-white"
              >
                Confirm CSV export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NhsCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      {children}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-3 text-sm font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function StatTile({ emoji, text, bg }: { emoji: string; text: string; bg: string }) {
  return (
    <div className={`rounded-xl ${bg} px-3 py-2`}>
      {emoji} {text}
    </div>
  );
}
