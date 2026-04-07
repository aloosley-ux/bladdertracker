import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import type { LeapSymptomLog, Child } from '../../types';
import {
  getLeapReferenceDate,
  getCurrentLeap,
  SYMPTOM_OPTIONS,
} from '../../data/leapData';

// SymptomLogger — leap symptom tracker with date, symptom selection, notes, and filtering.
export default function SymptomLogger({ child }: { child: Child }) {
  const { user, leapSymptomLogs, addLeapSymptomLog, deleteLeapSymptomLog } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterSymptom, setFilterSymptom] = useState<string | 'all'>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  const now = new Date();
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, now);

  const childLogs = useMemo(() => {
    let logs = leapSymptomLogs.filter((l) => l.childId === child.id);
    if (filterSymptom !== 'all') {
      logs = logs.filter((l) => l.symptoms.includes(filterSymptom));
    }
    logs.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });
    return logs;
  }, [leapSymptomLogs, child.id, filterSymptom, sortOrder]);

  // Symptom frequency aggregation
  const symptomFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    leapSymptomLogs
      .filter((l) => l.childId === child.id)
      .forEach((l) => l.symptoms.forEach((s) => { freq[s] = (freq[s] || 0) + 1; }));
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [leapSymptomLogs, child.id]);

  const maxFreq = symptomFrequency.length > 0 ? symptomFrequency[0][1] : 1;

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!user || selectedSymptoms.length === 0) return;
    const nowDate = new Date();
    const log: LeapSymptomLog = {
      id: generateId(),
      childId: child.id,
      leapNumber: currentLeap?.leap.number ?? 0,
      date: format(nowDate, 'yyyy-MM-dd'),
      time: format(nowDate, 'HH:mm'),
      symptoms: selectedSymptoms,
      notes,
      createdBy: user.id,
      createdAt: nowDate.toISOString(),
    };
    addLeapSymptomLog(log);
    setSelectedSymptoms([]);
    setNotes('');
    setShowForm(false);
    setShowConfetti(true);
  };

  // Reset confetti animation
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  const handleExportCsv = () => {
    const rows = [['Date', 'Time', 'Leap', 'Symptoms', 'Notes']];
    childLogs.forEach((l) => {
      const symptomLabels = l.symptoms
        .map((s) => SYMPTOM_OPTIONS.find((o) => o.id === s)?.label ?? s)
        .join('; ');
      rows.push([l.date, l.time, String(l.leapNumber || '-'), symptomLabels, l.notes]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leap-symptoms-${child.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="symptoms-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="symptoms-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700">
          📝 Leap Symptoms &amp; Signs
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg bg-lavender-600 px-3 py-2 text-sm font-medium text-white hover:bg-lavender-700 transition-colors"
          aria-label={showForm ? 'Close log form' : 'Log a new symptom'}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close' : 'Log'}
        </button>
      </div>

      {/* Confetti feedback */}
      {showConfetti && (
        <div className="mb-3 rounded-xl bg-gradient-to-r from-pink-100 via-yellow-100 to-sky-100 p-3 text-center animate-pulse" role="status" aria-live="polite">
          <span className="text-lg">🎉</span>{' '}
          <span className="text-sm font-semibold text-gray-700">Symptom logged! Great job tracking.</span>
        </div>
      )}

      {/* Quick-add form */}
      {showForm && (
        <div className="mb-5 rounded-xl border border-lavender-200 bg-lavender-50/50 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Tap symptoms you&apos;re noticing:
          </p>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Select symptoms">
            {SYMPTOM_OPTIONS.map((opt) => {
              const active = selectedSymptoms.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleSymptom(opt.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-all ${
                    active
                      ? 'bg-lavender-600 text-white border-lavender-600 shadow-sm scale-105'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
                  }`}
                >
                  <span aria-hidden="true">{opt.emoji}</span> {opt.label}
                </button>
              );
            })}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes (optional)…"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200 mb-3"
            aria-label="Additional notes"
          />
          <button
            onClick={handleSubmit}
            disabled={selectedSymptoms.length === 0}
            className="w-full rounded-lg bg-lavender-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-lavender-700 transition-colors"
          >
            Save symptom log
          </button>
        </div>
      )}

      {/* Symptom frequency dashboard */}
      {symptomFrequency.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Most common symptoms</h3>
          <div className="space-y-1.5">
            {symptomFrequency.map(([id, count]) => {
              const opt = SYMPTOM_OPTIONS.find((o) => o.id === id);
              return (
                <div key={id} className="flex items-center gap-2">
                  <span className="w-6 text-center" aria-hidden="true">{opt?.emoji ?? '❓'}</span>
                  <span className="text-xs font-medium text-gray-700 w-24 truncate">{opt?.label ?? id}</span>
                  <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-500"
                      style={{ width: `${(count / maxFreq) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters & sort */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={filterSymptom}
          onChange={(e) => setFilterSymptom(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
          aria-label="Filter by symptom"
        >
          <option value="all">All symptoms</option>
          {SYMPTOM_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.emoji} {opt.label}</option>
          ))}
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
          aria-label={`Sort ${sortOrder === 'newest' ? 'oldest first' : 'newest first'}`}
        >
          {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
        </button>
        {childLogs.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="ml-auto rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
            aria-label="Export symptom logs as CSV"
          >
            📥 Export CSV
          </button>
        )}
      </div>

      {/* Log list */}
      <div className="space-y-2" role="list" aria-label="Symptom logs">
        {childLogs.map((log) => (
          <div key={log.id} role="listitem" className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1 mb-1">
                {log.symptoms.map((s) => {
                  const opt = SYMPTOM_OPTIONS.find((o) => o.id === s);
                  return (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-lavender-100 px-2 py-0.5 text-xs font-medium text-lavender-700">
                      <span aria-hidden="true">{opt?.emoji}</span> {opt?.label ?? s}
                    </span>
                  );
                })}
              </div>
              {log.notes && <p className="text-xs text-gray-600 mt-1">{log.notes}</p>}
              <div className="text-[11px] text-gray-400 mt-1">
                {log.date} at {log.time}
                {log.leapNumber > 0 && <span className="ml-2">• Leap {log.leapNumber}</span>}
              </div>
            </div>
            <button
              onClick={() => deleteLeapSymptomLog(log.id)}
              className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label={`Delete log from ${log.date}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {childLogs.length === 0 && (
          <p className="text-sm text-gray-400 italic py-4 text-center">
            No symptom logs yet. Tap &quot;Log&quot; to record what you&apos;re noticing.
          </p>
        )}
      </div>
    </section>
  );
}
