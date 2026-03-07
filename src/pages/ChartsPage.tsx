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
import { CalendarDays, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import BrandBanner from '../components/BrandBanner';

type Period = '7d' | '14d' | '30d';

export default function ChartsPage() {
  const { drinks, urineEntries, bowelEntries, selectedChildId, selectedChild } = useApp();
  const [period, setPeriod] = useState<Period>('7d');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;

  const fluidData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayDrinks = drinks.filter((drink) => drink.childId === selectedChildId && drink.date === dateStr);

      return {
        date: format(date, 'dd/MM'),
        totalMl: dayDrinks.reduce((sum, drink) => sum + drink.amountMl, 0),
      };
    });
  }, [days, drinks, selectedChildId]);

  const eventData = useMemo(() => {
    return Array.from({ length: days }, (_, index) => {
      const date = startOfDay(subDays(new Date(), days - index - 1));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayUrine = urineEntries.filter((entry) => entry.childId === selectedChildId && entry.date === dateStr);
      const dayBowel = bowelEntries.filter((entry) => entry.childId === selectedChildId && entry.date === dateStr);

      return {
        date: format(date, 'dd/MM'),
        wet: dayUrine.filter((entry) => entry.wet).length,
        pass: dayUrine.filter((entry) => entry.pass).length,
        bowel: dayBowel.length,
      };
    });
  }, [days, urineEntries, bowelEntries, selectedChildId]);

  const stoolTypeData = useMemo(() => {
    const childBowel = bowelEntries.filter((entry) => entry.childId === selectedChildId);
    return [1, 2, 3, 4, 5, 6, 7].map((type) => ({
      type: `Type ${type}`,
      count: childBowel.filter((entry) => entry.bristolType === type).length,
    }));
  }, [bowelEntries, selectedChildId]);

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

        <ChartCard title="📊 Events timeline">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={eventData} margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede7f7" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} label={{ value: 'Date', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 32px rgba(28, 25, 63, 0.12)' }} />
              <Legend />
              <Line type="monotone" dataKey="wet" stroke="#f4b52c" strokeWidth={2} dot={{ r: 3 }} name="Wet" />
              <Line type="monotone" dataKey="pass" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Pass" />
              <Line type="monotone" dataKey="bowel" stroke="#8b4dff" strokeWidth={2} dot={{ r: 3 }} name="Bowel" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

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
