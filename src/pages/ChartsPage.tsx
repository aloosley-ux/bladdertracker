import { useMemo, useState } from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';

type Period = '7d' | '14d' | '30d';

export default function ChartsPage() {
  const { drinks, urineEntries, bowelEntries, selectedChildId, selectedChild } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('7d');

  const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;

  const fluidData = useMemo(() => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayDrinks = drinks.filter(
        (d) => d.childId === selectedChildId && d.date === dateStr
      );
      result.push({
        date: format(date, 'dd/MM'),
        fullDate: dateStr,
        totalMl: dayDrinks.reduce((sum, d) => sum + d.amountMl, 0),
        count: dayDrinks.length,
      });
    }
    return result;
  }, [drinks, selectedChildId, days]);

  const eventData = useMemo(() => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayUrine = urineEntries.filter(
        (u) => u.childId === selectedChildId && u.date === dateStr
      );
      const dayBowel = bowelEntries.filter(
        (b) => b.childId === selectedChildId && b.date === dateStr
      );
      result.push({
        date: format(date, 'dd/MM'),
        wet: dayUrine.filter((u) => u.wet).length,
        pass: dayUrine.filter((u) => u.pass).length,
        bowel: dayBowel.length,
      });
    }
    return result;
  }, [urineEntries, bowelEntries, selectedChildId, days]);

  const stoolTypeData = useMemo(() => {
    const types = [1, 2, 3, 4, 5, 6, 7];
    const childBowel = bowelEntries.filter((b) => b.childId === selectedChildId);
    return types.map((t) => ({
      type: `Type ${t}`,
      count: childBowel.filter((b) => b.bristolType === t).length,
    }));
  }, [bowelEntries, selectedChildId]);

  return (
    <div className="pb-20">
      <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-lavender-50"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Charts &amp; Insights</h1>
          <p className="text-xs text-gray-400">{selectedChild?.name}</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="px-4 mt-4 flex gap-2">
        {(['7d', '14d', '30d'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? 'bg-lavender-500 text-white shadow-md'
                : 'bg-white text-gray-500 hover:bg-lavender-50'
            }`}
          >
            {p === '7d' ? '7 Days' : p === '14d' ? '14 Days' : '30 Days'}
          </button>
        ))}
      </div>

      {/* Fluid intake chart */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">💧 Fluid Intake (ml)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fluidData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="totalMl" fill="#8b4dff" radius={[6, 6, 0, 0]} name="ml" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events timeline */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📊 Events Timeline</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="wet" stroke="#eab308" strokeWidth={2} name="Wet" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pass" stroke="#22c55e" strokeWidth={2} name="Pass" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bowel" stroke="#8b4dff" strokeWidth={2} name="Bowel" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bristol stool distribution */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">💩 Stool Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stoolTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2 italic">
            💡 Types 3-4 are ideal. Consult your healthcare provider if types 1-2 or 6-7 are frequent.
          </p>
        </div>
      </div>
    </div>
  );
}
