import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { BookOpen, Edit2, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { generateId } from '../../utils/storage';
import type { LeapDiaryEntry, Child } from '../../types';
import {
  getLeapReferenceDate,
  getCurrentLeap,
  LEAP_CHART,
} from '../../data/leapData';
import { MOOD_OPTIONS } from './leapConstants';

// LeapDiary — diary entry manager for leap observations with add, edit, delete, and filtering.
export default function LeapDiary({ child }: { child: Child }) {
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
                    className="p-2.5 rounded-lg text-gray-400 hover:text-lavender-600 hover:bg-lavender-50 transition-colors"
                    aria-label={`Edit note: ${entry.title}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteLeapDiaryEntry(entry.id)}
                    className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
