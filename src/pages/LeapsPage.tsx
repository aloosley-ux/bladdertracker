import { useMemo, useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { Baby, Bell, BellOff, BookOpen, Calendar, ChevronDown, ChevronUp, Edit2, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/useApp';
import { generateId, updateChild } from '../utils/storage';
import type { LeapDiaryEntry, LeapSymptomLog, Child } from '../types';
import {
  computeChildAge,
  predictLeaps,
  getLeapReferenceDate,
  getCurrentLeap,
  getNextLeap,
  SYMPTOM_OPTIONS,
  LEAP_CHART,
  type LeapPrediction,
  type LeapStatus,
} from '../data/leapData';

// ── Helpers ──────────────────────────────────────────────────────────

const STATUS_COLOURS: Record<LeapStatus, string> = {
  past: 'bg-gray-100 text-gray-600 border-gray-200',
  stormy: 'bg-amber-100 text-amber-800 border-amber-300',
  current: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  upcoming: 'bg-sky-100 text-sky-800 border-sky-300',
  future: 'bg-lavender-50 text-lavender-700 border-lavender-200',
};

const STATUS_LABELS: Record<LeapStatus, string> = {
  past: 'Completed',
  stormy: '⛈️ Stormy phase',
  current: '🌟 In progress',
  upcoming: '🔜 Coming soon',
  future: 'Future',
};

function DueDateEditor({ child, onSave }: { child: Child; onSave: (dueDate: string) => void }) {
  const [dueDate, setDueDate] = useState(child.dueDate ?? '');
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label htmlFor="due-date-input" className="block text-sm font-medium text-gray-700 mb-1">
          Due date (for leap accuracy)
        </label>
        <input
          id="due-date-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
          aria-label="Child's due date"
        />
      </div>
      <button
        onClick={() => { if (dueDate) onSave(dueDate); }}
        disabled={!dueDate}
        className="rounded-lg bg-lavender-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-lavender-700 transition-colors"
        aria-label="Save due date"
      >
        Save
      </button>
    </div>
  );
}

// ── Section 1: Baby Age Calculator & Leap Prediction ─────────────────

function AgeCalculator({ child }: { child: Child }) {
  const now = new Date();
  const birthDate = parseISO(child.dateOfBirth);
  const age = computeChildAge(birthDate, now);
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, now);
  const nextLeap = getNextLeap(refDate, now);

  return (
    <section aria-labelledby="age-calc-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="age-calc-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Baby size={22} aria-hidden="true" />
        Baby Age &amp; Leap Prediction
      </h2>

      {/* Age display */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-rose-600">{age.months}</div>
          <div className="text-xs font-medium text-rose-500 mt-1">months</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-cyan-600">{age.weeks}</div>
          <div className="text-xs font-medium text-cyan-500 mt-1">weeks</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 p-4 text-center">
          <div className="text-3xl font-extrabold text-amber-600">{age.totalDays}</div>
          <div className="text-xs font-medium text-amber-500 mt-1">days</div>
        </div>
      </div>

      {/* Current & next leap summary */}
      {currentLeap && (
        <div className="mb-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4" role="status" aria-live="polite">
          <div className="text-sm font-semibold text-emerald-700 mb-1">
            {currentLeap.status === 'stormy' ? '⛈️ Stormy phase' : '🌟 Currently in'} — Leap {currentLeap.leap.number}
          </div>
          <div className="text-base font-bold text-emerald-800">{currentLeap.leap.title}</div>
          <p className="text-sm text-emerald-700 mt-1">{currentLeap.leap.description}</p>
        </div>
      )}
      {nextLeap && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-sm font-semibold text-sky-600 mb-1">🔜 Next leap</div>
          <div className="text-base font-bold text-sky-700">
            Leap {nextLeap.leap.number}: {nextLeap.leap.title}
          </div>
          <p className="text-sm text-sky-600 mt-1">
            Starts around {format(nextLeap.stormyStart, 'd MMM yyyy')}
          </p>
        </div>
      )}
      {!currentLeap && !nextLeap && (
        <p className="text-sm text-gray-500 italic">All developmental leaps are in the past for this child.</p>
      )}
    </section>
  );
}

// ── Section 2: Leap Timeline ─────────────────────────────────────────

function LeapTimeline({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);
  const [expandedLeap, setExpandedLeap] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | LeapStatus>('all');

  const filtered = filter === 'all' ? predictions : predictions.filter((p) => p.status === filter);

  return (
    <section aria-labelledby="timeline-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="timeline-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Calendar size={22} aria-hidden="true" />
        Leap Timeline
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter leaps by status">
        {(['all', 'past', 'stormy', 'current', 'upcoming', 'future'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
              filter === f
                ? 'bg-lavender-600 text-white border-lavender-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
            }`}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3" role="list" aria-label="Developmental leaps timeline">
        {filtered.map((pred) => (
          <LeapTimelineCard
            key={pred.leap.number}
            prediction={pred}
            expanded={expandedLeap === pred.leap.number}
            onToggle={() => setExpandedLeap(expandedLeap === pred.leap.number ? null : pred.leap.number)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 italic py-4 text-center">No leaps match the selected filter.</p>
        )}
      </div>
    </section>
  );
}

function LeapTimelineCard({
  prediction,
  expanded,
  onToggle,
}: {
  prediction: LeapPrediction;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { leap, stormyStart, peakDate, sunnyDate, status } = prediction;
  const isActive = status === 'stormy' || status === 'current';

  return (
    <div
      role="listitem"
      className={`rounded-xl border-2 p-4 transition-all duration-300 ${STATUS_COLOURS[status]} ${
        isActive ? 'shadow-md ring-2 ring-offset-1' : ''
      } ${isActive && status === 'stormy' ? 'ring-amber-300' : ''} ${
        isActive && status === 'current' ? 'ring-emerald-300' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
        aria-controls={`leap-detail-${leap.number}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-lg font-bold shadow-sm">
            {leap.number}
          </span>
          <div>
            <div className="font-bold text-sm">{leap.title}</div>
            <div className="text-xs opacity-80">
              {format(stormyStart, 'd MMM')} – {format(sunnyDate, 'd MMM yyyy')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{STATUS_LABELS[status]}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div id={`leap-detail-${leap.number}`} className="mt-3 pt-3 border-t border-current/10">
          <p className="text-sm mb-2">{leap.description}</p>
          <div className="text-xs mb-2">
            <strong>Peak:</strong> {format(peakDate, 'd MMM yyyy')}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {leap.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-white/50 px-2.5 py-0.5 text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
          {/* Parental tips (#45) */}
          {leap.parentalTips.length > 0 && (
            <div className="mt-2 rounded-lg bg-white/40 p-3">
              <p className="text-xs font-bold mb-1.5">💡 Parental tips</p>
              <ul className="space-y-1">
                {leap.parentalTips.map((tip, i) => (
                  <li key={i} className="text-xs flex gap-1.5">
                    <span aria-hidden="true">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section 3: Symptom & Signs Logging ───────────────────────────────

function SymptomLogger({ child }: { child: Child }) {
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
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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

// ── Section 4: Leap Diary / Notes ────────────────────────────────────

const MOOD_OPTIONS = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'hard', emoji: '😣', label: 'Hard day' },
  { id: 'rough', emoji: '😢', label: 'Rough' },
];

function LeapDiary({ child }: { child: Child }) {
  const { user, leapDiaryEntries, addLeapDiaryEntry, updateLeapDiaryEntry, deleteLeapDiaryEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LeapDiaryEntry | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('');
  const [filterLeap, setFilterLeap] = useState<number | 'all'>('all');

  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, new Date());

  const childEntries = useMemo(() => {
    let entries = leapDiaryEntries.filter((e) => e.childId === child.id);
    if (filterLeap !== 'all') entries = entries.filter((e) => e.leapNumber === filterLeap);
    return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [leapDiaryEntries, child.id, filterLeap]);

  const openNew = () => {
    setEditingEntry(null);
    setTitle('');
    setBody('');
    setMood('');
    setShowForm(true);
  };

  const openEdit = (entry: LeapDiaryEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setBody(entry.body);
    setMood(entry.mood ?? '');
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingEntry(null);
    setTitle('');
    setBody('');
    setMood('');
  };

  const handleSubmit = () => {
    if (!user || !title.trim() || !body.trim()) return;
    const now = new Date();
    if (editingEntry) {
      updateLeapDiaryEntry({
        ...editingEntry,
        title: title.trim(),
        body: body.trim(),
        mood: mood || undefined,
        updatedAt: now.toISOString(),
      });
    } else {
      const entry: LeapDiaryEntry = {
        id: generateId(),
        childId: child.id,
        leapNumber: currentLeap?.leap.number ?? 0,
        date: format(now, 'yyyy-MM-dd'),
        title: title.trim(),
        body: body.trim(),
        mood: mood || undefined,
        createdBy: user.id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      addLeapDiaryEntry(entry);
    }
    handleClose();
  };

  const leapsWithEntries = useMemo(() => {
    const used = new Set(leapDiaryEntries.filter((e) => e.childId === child.id).map((e) => e.leapNumber));
    return LEAP_CHART.filter((l) => used.has(l.number));
  }, [leapDiaryEntries, child.id]);

  return (
    <section aria-labelledby="diary-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 id="diary-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700">
          <BookOpen size={22} aria-hidden="true" />
          Leap Diary
        </h2>
        <button
          onClick={showForm ? handleClose : openNew}
          className="flex items-center gap-1.5 rounded-lg bg-lavender-600 px-3 py-2 text-sm font-medium text-white hover:bg-lavender-700 transition-colors"
          aria-label={showForm ? 'Close diary form' : 'Add a diary note'}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close' : 'Add note'}
        </button>
      </div>

      {/* Write/Edit form */}
      {showForm && (
        <div className="mb-5 rounded-xl border border-lavender-200 bg-lavender-50/50 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {editingEntry ? 'Edit diary note' : `New note${currentLeap ? ` — Leap ${currentLeap.leap.number}: ${currentLeap.leap.title}` : ''}`}
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            aria-label="Diary note title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write about what you observed today…"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            aria-label="Diary note body"
          />
          {/* Mood picker */}
          <div>
            <p id="diary-mood-label" className="text-xs font-medium text-gray-600 mb-2">Today&apos;s mood</p>
            <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="diary-mood-label">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(mood === m.id ? '' : m.id)}
                  aria-pressed={mood === m.id}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                    mood === m.id
                      ? 'bg-lavender-600 text-white border-lavender-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
                  }`}
                >
                  <span aria-hidden="true">{m.emoji}</span> {m.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
            className="w-full rounded-lg bg-lavender-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-lavender-700 transition-colors"
          >
            {editingEntry ? 'Save changes' : 'Save note'}
          </button>
        </div>
      )}

      {/* Filter by leap */}
      {leapsWithEntries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter diary by leap">
          <button
            onClick={() => setFilterLeap('all')}
            aria-pressed={filterLeap === 'all'}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
              filterLeap === 'all' ? 'bg-lavender-600 text-white border-lavender-600' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            All leaps
          </button>
          {leapsWithEntries.map((l) => (
            <button
              key={l.number}
              onClick={() => setFilterLeap(l.number)}
              aria-pressed={filterLeap === l.number}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                filterLeap === l.number ? 'bg-lavender-600 text-white border-lavender-600' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Leap {l.number}
            </button>
          ))}
        </div>
      )}

      {/* Entry list */}
      <div className="space-y-3" role="list" aria-label="Diary notes">
        {childEntries.map((entry) => {
          const moodOpt = MOOD_OPTIONS.find((m) => m.id === entry.mood);
          const leapDef = LEAP_CHART.find((l) => l.number === entry.leapNumber);
          return (
            <div key={entry.id} role="listitem" className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {moodOpt && <span aria-hidden="true" title={moodOpt.label}>{moodOpt.emoji}</span>}
                    <span className="font-semibold text-sm text-gray-800">{entry.title}</span>
                    {leapDef && entry.leapNumber > 0 && (
                      <span className="rounded-full bg-lavender-100 px-2 py-0.5 text-[11px] font-medium text-lavender-700">
                        Leap {leapDef.number}: {leapDef.title}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{entry.body}</p>
                  <p className="text-[11px] text-gray-400">{entry.date}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-lavender-600 hover:bg-lavender-50 transition-colors"
                    aria-label={`Edit note: ${entry.title}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteLeapDiaryEntry(entry.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`Delete note: ${entry.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {childEntries.length === 0 && (
          <p className="text-sm text-gray-400 italic py-4 text-center">
            No diary notes yet. Tap &quot;Add note&quot; to record your observations.
          </p>
        )}
      </div>
    </section>
  );
}

// ── Section 5: Custom Leap Notifications ─────────────────────────────

function LeapNotifications({ child }: { child: Child }) {
  const { user, reminderPreferences, setReminderPreferences } = useApp();

  const leapPref = reminderPreferences.find(
    (p) => p.childId === child.id && p.moduleId === 'leaps',
  );

  const [enabled, setEnabled] = useState(leapPref?.enabled ?? false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(leapPref?.frequency ?? 'daily');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    await setReminderPreferences(child.id, [{ moduleId: 'leaps', frequency, enabled }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const currentLeap = getCurrentLeap(refDate, new Date());
  const nextLeap = getNextLeap(refDate, new Date());

  // Compute when next reminder would fire
  const nextAt = leapPref?.nextReminderAt
    ? new Date(leapPref.nextReminderAt)
    : null;

  return (
    <section aria-labelledby="notifications-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="notifications-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Bell size={22} aria-hidden="true" />
        Leap Reminders
      </h2>

      {/* Status banner */}
      {currentLeap && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="status">
          ⛈️ <strong>Leap {currentLeap.leap.number}</strong> ({currentLeap.leap.title}) is currently active.
          {currentLeap.status === 'stormy' ? ' Stormy phase in progress.' : ' Sunny phase — skills emerging!'}
        </div>
      )}
      {!currentLeap && nextLeap && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800" role="status">
          🔜 Next leap: <strong>Leap {nextLeap.leap.number}</strong> ({nextLeap.leap.title}) starts around{' '}
          {format(nextLeap.stormyStart, 'd MMM yyyy')}.
        </div>
      )}

      {/* Toggle & frequency */}
      <div className="space-y-4">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {enabled ? <Bell size={16} className="text-lavender-600" aria-hidden="true" /> : <BellOff size={16} className="text-gray-400" aria-hidden="true" />}
            Enable leap reminders
          </span>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lavender-400 ${
              enabled ? 'bg-lavender-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>

        {enabled && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Reminder frequency</p>
            <div className="flex gap-2" role="group" aria-label="Notification frequency">
              {(['daily', 'weekly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  aria-pressed={frequency === f}
                  className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all ${
                    frequency === f
                      ? 'bg-lavender-600 text-white border-lavender-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-lavender-300'
                  }`}
                >
                  {f === 'daily' ? '📅 Daily' : '📆 Weekly'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-lavender-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lavender-700 transition-colors"
        >
          {saved ? '✅ Saved!' : 'Save notification settings'}
        </button>

        {nextAt && (
          <p className="text-xs text-gray-400 text-center">
            Next reminder: {format(nextAt, 'd MMM yyyy')}
          </p>
        )}
      </div>

      {/* How reminders work */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p className="text-xs font-semibold text-gray-600 mb-1">How reminders work</p>
        <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
          <li>Reminders appear as in-app notifications in your notification centre.</li>
          <li>Daily reminders fire every day; weekly reminders fire once per week.</li>
          <li>Use them to keep a habit of checking the leap tracker regularly.</li>
          <li>The next reminder date is shown below the save button when set.</li>
        </ul>
      </div>
    </section>
  );
}

// ── Section 6: Widgets & Calendar Integration ─────────────────────────

function generateICS(predictions: LeapPrediction[], childName: string): string {
  const now = new Date();
  const stamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  const events = predictions
    .filter((p) => p.status !== 'past')
    .flatMap((p) => {
      const uid1 = `leap-${p.leap.number}-stormy@bladdertracker`;
      const uid2 = `leap-${p.leap.number}-sunny@bladdertracker`;
      const stormyEnd = format(addDays(p.peakDate, 1), 'yyyyMMdd');
      const sunnyEnd = format(addDays(p.sunnyDate, 1), 'yyyyMMdd');
      return [
        `BEGIN:VEVENT\r\nUID:${uid1}\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${format(p.stormyStart, 'yyyyMMdd')}\r\nDTEND;VALUE=DATE:${stormyEnd}\r\nSUMMARY:⛈️ ${childName} Leap ${p.leap.number} – Stormy Phase\r\nDESCRIPTION:${p.leap.title}: ${p.leap.description}\r\nEND:VEVENT`,
        `BEGIN:VEVENT\r\nUID:${uid2}\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${format(p.peakDate, 'yyyyMMdd')}\r\nDTEND;VALUE=DATE:${sunnyEnd}\r\nSUMMARY:🌟 ${childName} Leap ${p.leap.number} – Sunny Phase\r\nDESCRIPTION:${p.leap.title}: Skills emerging — ${p.leap.skills.join(', ')}\r\nEND:VEVENT`,
      ];
    });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BladderTracker//Leap Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

function LeapCalendarWidget({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);
  const currentLeap = getCurrentLeap(refDate, new Date());
  const nextLeap = getNextLeap(refDate, new Date());

  const upcomingLeaps = predictions.filter(
    (p) => p.status === 'upcoming' || p.status === 'stormy' || p.status === 'current',
  ).slice(0, 3);

  const handleExportICS = () => {
    const ics = generateICS(predictions, child.name);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${child.name.toLowerCase().replace(/\s+/g, '-')}-leaps-calendar.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="calendar-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="calendar-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        <Calendar size={22} aria-hidden="true" />
        Calendar &amp; Widget
      </h2>

      {/* Mini widget card */}
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-lavender-500 to-purple-600 p-5 text-white shadow-md" role="region" aria-label="Leap summary widget">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">{child.name}</p>
        {currentLeap ? (
          <>
            <p className="text-lg font-extrabold">
              {currentLeap.status === 'stormy' ? '⛈️' : '🌟'} Leap {currentLeap.leap.number}: {currentLeap.leap.title}
            </p>
            <p className="text-sm opacity-90 mt-1">{currentLeap.leap.description}</p>
            <p className="text-xs opacity-70 mt-2">
              {currentLeap.status === 'stormy' ? 'Stormy phase' : 'Sunny / skill phase'} — ends ~{format(currentLeap.sunnyDate, 'd MMM yyyy')}
            </p>
          </>
        ) : nextLeap ? (
          <>
            <p className="text-lg font-extrabold">🔜 Next: Leap {nextLeap.leap.number}</p>
            <p className="text-sm opacity-90 mt-1">{nextLeap.leap.title}</p>
            <p className="text-xs opacity-70 mt-2">Starts around {format(nextLeap.stormyStart, 'd MMM yyyy')}</p>
          </>
        ) : (
          <p className="text-base font-semibold opacity-90">🎉 All developmental leaps complete!</p>
        )}
      </div>

      {/* Upcoming leaps */}
      {upcomingLeaps.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Upcoming &amp; active leaps</h3>
          <div className="space-y-2">
            {upcomingLeaps.map((p) => (
              <div key={p.leap.number} className={`rounded-xl border-2 p-3 ${STATUS_COLOURS[p.status]}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Leap {p.leap.number}: {p.leap.title}</span>
                  <span className="text-xs font-medium">{STATUS_LABELS[p.status]}</span>
                </div>
                <p className="text-xs mt-1 opacity-80">
                  {format(p.stormyStart, 'd MMM')} – {format(p.sunnyDate, 'd MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar export */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">📅 Export to Calendar</p>
        <p className="text-xs text-gray-500 mb-3">
          Download an ICS file with all upcoming leap periods to add to Google Calendar, Apple Calendar, or Outlook.
        </p>
        <button
          onClick={handleExportICS}
          className="w-full rounded-lg border-2 border-lavender-300 bg-white px-4 py-2.5 text-sm font-semibold text-lavender-700 hover:bg-lavender-50 transition-colors"
          aria-label="Export leap calendar as ICS file"
        >
          📥 Download Leap Calendar (.ics)
        </button>
      </div>
    </section>
  );
}

// ── Section 7: Visual Progress Chart (#46) ────────────────────────────

function LeapProgressChart({ child }: { child: Child }) {
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = useMemo(() => predictLeaps(refDate, new Date()), [refDate]);

  const total = predictions.length;
  const completedCount = predictions.filter((p) => p.status === 'past').length;
  const activeCount = predictions.filter((p) => p.status === 'stormy' || p.status === 'current').length;
  const progressPct = Math.round((completedCount / total) * 100);

  const statusColors: Record<LeapStatus, string> = {
    past: 'bg-gray-300',
    stormy: 'bg-amber-400',
    current: 'bg-emerald-400',
    upcoming: 'bg-sky-300',
    // 'future' uses a border in addition to the fill to remain visible on white backgrounds
    future: 'bg-lavender-100 border border-lavender-200',
  };

  return (
    <section aria-labelledby="leap-progress-heading" className="rounded-2xl bg-white border border-lavender-100 shadow-sm p-5">
      <h2 id="leap-progress-heading" className="flex items-center gap-2 text-lg font-bold text-lavender-700 mb-4">
        📈 Leap Progress Overview
      </h2>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-gray-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-gray-700">{completedCount}</div>
          <div className="text-xs text-gray-500 mt-0.5">Completed</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-amber-600">{activeCount}</div>
          <div className="text-xs text-amber-500 mt-0.5">Active</div>
        </div>
        <div className="rounded-xl bg-sky-50 p-3 text-center">
          <div className="text-2xl font-extrabold text-sky-600">{total - completedCount - activeCount}</div>
          <div className="text-xs text-sky-500 mt-0.5">Remaining</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span>Overall progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-label="Leap progress" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Per-leap status strip */}
      <div className="flex gap-1" role="list" aria-label="Leap status indicators">
        {predictions.map((p) => (
          <div
            key={p.leap.number}
            role="listitem"
            title={`Leap ${p.leap.number}: ${p.leap.title} (${p.status})`}
            aria-label={`Leap ${p.leap.number} — ${p.status}`}
            className={`flex-1 h-6 rounded-sm ${statusColors[p.status]} transition-colors`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Leap 1</span>
        <span>Leap {total}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
        {([
          { status: 'past', label: 'Completed', color: 'bg-gray-300' },
          { status: 'stormy', label: 'Stormy', color: 'bg-amber-400' },
          { status: 'current', label: 'In progress', color: 'bg-emerald-400' },
          { status: 'upcoming', label: 'Upcoming', color: 'bg-sky-300' },
          { status: 'future', label: 'Future', color: 'bg-lavender-100 border border-lavender-200' },
        ] as const).map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${color}`} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page Component ───────────────────────────────────────────────────

export default function LeapsPage() {
  const { selectedChild, children } = useApp();
  const [dueDateChild, setDueDateChild] = useState<Child | null>(null);

  // Use the selected child, or the first child available
  const child = selectedChild ?? children[0] ?? null;

  // Sync dueDateChild whenever child changes
  useEffect(() => {
    setDueDateChild(child);
  }, [child]);

  const handleSaveDueDate = (dueDate: string) => {
    if (!child) return;
    const updatedChild = { ...child, dueDate, lastUpdatedAt: new Date().toISOString() };
    updateChild(updatedChild);
    setDueDateChild(updatedChild);
  };

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">🌈</span>
        <h1 className="text-xl font-bold text-gray-700 mb-2">Developmental Leaps</h1>
        <p className="text-sm text-gray-500">Add a child profile first to use the leap tracker.</p>
      </div>
    );
  }

  // Use patched child with dueDate if available
  const effectiveChild = dueDateChild ?? child;

  return (
    <div className="space-y-5 pb-4">
      <header className="px-1">
        <h1 className="text-xl font-bold text-lavender-700">🌈 Developmental Leaps</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track <strong>{effectiveChild.name}&apos;s</strong> developmental leaps, age, and symptoms
        </p>
      </header>

      {/* Due-date editor (if not set) */}
      {!effectiveChild.dueDate && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-700 mb-3">
            💡 For more accurate leap predictions, set {effectiveChild.name}&apos;s due date.
          </p>
          <DueDateEditor child={effectiveChild} onSave={handleSaveDueDate} />
        </div>
      )}

      <AgeCalculator child={effectiveChild} />
      <LeapProgressChart child={effectiveChild} />
      <LeapTimeline child={effectiveChild} />
      <SymptomLogger child={effectiveChild} />
      <LeapDiary child={effectiveChild} />
      <LeapNotifications key={effectiveChild.id} child={effectiveChild} />
      <LeapCalendarWidget child={effectiveChild} />
    </div>
  );
}
