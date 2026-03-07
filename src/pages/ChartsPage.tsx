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
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import BrandBanner from '../components/BrandBanner';

type Period = '7d' | '14d' | '30d';

const EVENT_FILTERS = [
  { key: 'drinks', label: '💧 Drinks', color: '#8b4dff' },
  { key: 'urine', label: '💦 Urine', color: '#f4b52c' },
  { key: 'bowel', label: '🚽 Bowel', color: '#22c55e' },
  { key: 'sleep', label: '🌙 Sleep', color: '#6366f1' },
  { key: 'toilet', label: '🎯 Attempts', color: '#a855f7' },
  { key: 'food', label: '🍽️ Food', color: '#f97316' },
] as const;

type FilterKey = typeof EVENT_FILTERS[number]['key'];

export default function ChartsPage() {
  const { drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries, selectedChildId, selectedChild } = useApp();
  const [period, setPeriod] = useState<Period>('7d');
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set(['drinks', 'urine', 'bowel', 'sleep', 'toilet', 'food']));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
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
      return {
        date: format(date, 'dd/MM'),
        wet: urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr && e.wet).length,
        pass: urineEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr && e.pass).length,
        bowel: bowelEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr).length,
        sleep: sleepEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr).length,
        toilet: toiletAttemptEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr).length,
        food: foodEntries.filter((e) => e.childId === selectedChildId && e.date === dateStr).length,
      };
    });
  }, [days, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries, selectedChildId]);

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
      { outcome: 'Success', count: childAttempts.filter((e) => e.outcome === 'success').length },
      { outcome: 'No result', count: childAttempts.filter((e) => e.outcome === 'failure').length },
      { outcome: 'Refused', count: childAttempts.filter((e) => e.outcome === 'no_event').length },
    ];
  }, [toiletAttemptEntries, selectedChildId]);

  // Weekly/monthly stats summary
  const stats = useMemo(() => {
    const childDrinks = drinks.filter((d) => d.childId === selectedChildId);
    const childUrine = urineEntries.filter((e) => e.childId === selectedChildId);
    const childBowel = bowelEntries.filter((e) => e.childId === selectedChildId);
    const childSleep = sleepEntries.filter((e) => e.childId === selectedChildId);
    const childToilet = toiletAttemptEntries.filter((e) => e.childId === selectedChildId);
    const childFood = foodEntries.filter((e) => e.childId === selectedChildId);
    const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const inPeriod = (date: string) => date >= cutoff;

    return {
      drinks: childDrinks.filter((d) => inPeriod(d.date)).length,
      avgMl: Math.round(childDrinks.filter((d) => inPeriod(d.date)).reduce((s, d) => s + d.amountMl, 0) / days),
      urineEvents: childUrine.filter((e) => inPeriod(e.date)).length,
      bowelEvents: childBowel.filter((e) => inPeriod(e.date)).length,
      sleepEvents: childSleep.filter((e) => inPeriod(e.date)).length,
      toiletAttempts: childToilet.filter((e) => inPeriod(e.date)).length,
      toiletSuccess: childToilet.filter((e) => inPeriod(e.date) && e.outcome === 'success').length,
      meals: childFood.filter((e) => inPeriod(e.date)).length,
    };
  }, [drinks, urineEntries, bowelEntries, sleepEntries, toiletAttemptEntries, foodEntries, selectedChildId, days]);

  return (
    <div className="pb-20">
      <div className="bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4">
        <BrandBanner />
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="mt-1 text-base font-bold text-gray-900">Patterns and trends</h1>
          <p className="mt-0.5 text-xs text-gray-500">A calm, visual snapshot for {selectedChild?.name ?? 'your selected child'}.</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 px-4">
          <div className="flex-1 grid grid-cols-3 gap-2 rounded-2xl bg-[#f6f1ff] p-1 text-sm">
            {(['7d', '14d', '30d'] as Period[]).map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`rounded-2xl px-3 py-2 font-medium transition-all ${
                  period === item ? 'bg-white text-lavender-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                {item === '7d' ? '7 Days' : item === '14d' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <Link
            to="/calendar"
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-lavender-700 shadow-sm ring-1 ring-lavender-100 whitespace-nowrap"
          >
            <CalendarDays size={14} /> Calendar <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* Event filter toggles */}
        <div className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h3 className="text-xs font-bold text-gray-600 flex items-center gap-1.5 mb-3">
            <Filter size={12} /> Show/hide event types
          </h3>
          <div className="flex flex-wrap gap-2">
            {EVENT_FILTERS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeFilters.has(key)
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-400'
                }`}
                style={activeFilters.has(key) ? { backgroundColor: color } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Period summary stats */}
        <div className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📈 {days}-day summary for {selectedChild?.name ?? 'child'}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-[#eef8ff] px-3 py-2">💧 {stats.drinks} drinks · avg {stats.avgMl}ml/day</div>
            <div className="rounded-xl bg-peach px-3 py-2">💦 {stats.urineEvents} urine events</div>
            <div className="rounded-xl bg-mint px-3 py-2">🚽 {stats.bowelEvents} bowel events</div>
            <div className="rounded-xl bg-[#eee8ff] px-3 py-2">🌙 {stats.sleepEvents} sleep events</div>
            <div className="rounded-xl bg-[#f3eeff] px-3 py-2">🎯 {stats.toiletAttempts} attempts ({stats.toiletSuccess} ✅)</div>
            <div className="rounded-xl bg-[#fff5eb] px-3 py-2">🍽️ {stats.meals} meals logged</div>
          </div>
        </div>

        {activeFilters.has('drinks') && (
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

        {/* Events timeline — shows whichever filters are active */}
        <ChartCard title="📊 Events timeline">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={eventData} margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} label={{ value: 'Date', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
              <Legend />
              {activeFilters.has('urine') && <Line type="monotone" dataKey="wet" stroke="#f4b52c" strokeWidth={2} dot={{ r: 3 }} name="Wet" />}
              {activeFilters.has('urine') && <Line type="monotone" dataKey="pass" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Pass" />}
              {activeFilters.has('bowel') && <Line type="monotone" dataKey="bowel" stroke="#8b4dff" strokeWidth={2} dot={{ r: 3 }} name="Bowel" />}
              {activeFilters.has('sleep') && <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Sleep" />}
              {activeFilters.has('toilet') && <Line type="monotone" dataKey="toilet" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Attempts" />}
              {activeFilters.has('food') && <Line type="monotone" dataKey="food" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Food" />}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {activeFilters.has('bowel') && (
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

        {activeFilters.has('toilet') && (
          <ChartCard title="🎯 Toilet attempt outcomes">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={toiletOutcomeData} margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
                <XAxis dataKey="outcome" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
                <Bar dataKey="count" fill="#a855f7" radius={[10, 10, 0, 0]} name="Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-3 text-sm font-bold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}
