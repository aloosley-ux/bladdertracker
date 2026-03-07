import { useState } from 'react';
import { useApp } from '../context/useApp';
import type { Milestone, MilestoneCategory, MilestoneStatus } from '../types';
import { generateId } from '../utils/storage';
import BrandBanner from '../components/BrandBanner';

const CATEGORIES: MilestoneCategory[] = [
  'speech',
  'motor',
  'social',
  'cognitive',
  'self_care',
  'routine',
  'sensory',
  'other',
];

const CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  speech: 'Speech',
  motor: 'Motor',
  social: 'Social',
  cognitive: 'Cognitive',
  self_care: 'Self-Care',
  routine: 'Routine',
  sensory: 'Sensory',
  other: 'Other',
};

const STATUS_COLORS: Record<MilestoneStatus, string> = {
  not_started: 'bg-gray-400',
  in_progress: 'bg-yellow-400',
  achieved: 'bg-green-500',
};

const STATUS_LABELS: Record<MilestoneStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  achieved: 'Achieved',
};

export default function MilestonesPage() {
  const {
    selectedChild,
    selectedChildId,
    milestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    user,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<MilestoneCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MilestoneCategory>('speech');
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');

  if (!selectedChild || !selectedChildId) {
    return (
      <div className="pb-20">
        <BrandBanner />
        <div className="px-4 pt-6 text-center">
          <p className="text-sm text-gray-500">Please add a child first to track milestones.</p>
        </div>
      </div>
    );
  }

  const childMilestones = milestones.filter((m) => m.childId === selectedChildId);

  const notStartedCount = childMilestones.filter((m) => m.status === 'not_started').length;
  const inProgressCount = childMilestones.filter((m) => m.status === 'in_progress').length;
  const achievedCount = childMilestones.filter((m) => m.status === 'achieved').length;

  const filteredMilestones =
    filterCategory === 'all'
      ? childMilestones
      : childMilestones.filter((m) => m.category === filterCategory);

  const resetForm = () => {
    setFormName('');
    setFormCategory('speech');
    setFormDescription('');
    setFormNotes('');
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    const milestone: Milestone = {
      id: generateId(),
      childId: selectedChildId,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim(),
      status: 'not_started',
      dateAchieved: null,
      notes: formNotes.trim(),
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    };

    addMilestone(milestone);
    resetForm();
  };

  const handleStatusChange = (milestone: Milestone, newStatus: MilestoneStatus) => {
    updateMilestone({
      ...milestone,
      status: newStatus,
      dateAchieved:
        newStatus === 'achieved'
          ? new Date().toISOString().split('T')[0]
          : milestone.dateAchieved,
    });
  };

  return (
    <div className="pb-20">
      <BrandBanner />

      <div className="rounded-b-[2rem] bg-[linear-gradient(180deg,#fbf7f2_0%,#ffffff_100%)] pb-4 shadow-sm">
        <h1 className="px-4 pt-2 text-center text-lg font-semibold text-gray-900">
          ⭐ Milestones for {selectedChild.name}
        </h1>

        <div className="mt-3 grid grid-cols-3 gap-3 px-4">
          <div className="rounded-[1.5rem] bg-gray-100 p-3 text-center ring-1 ring-black/5">
            <p className="text-xl font-semibold text-gray-700">{notStartedCount}</p>
            <p className="text-xs text-gray-500">Not Started</p>
          </div>
          <div className="rounded-[1.5rem] bg-yellow-50 p-3 text-center ring-1 ring-black/5">
            <p className="text-xl font-semibold text-yellow-700">{inProgressCount}</p>
            <p className="text-xs text-yellow-600">In Progress</p>
          </div>
          <div className="rounded-[1.5rem] bg-green-50 p-3 text-center ring-1 ring-black/5">
            <p className="text-xl font-semibold text-green-700">{achievedCount}</p>
            <p className="text-xs text-green-600">Achieved</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition active:scale-95 ${
              filterCategory === 'all'
                ? 'bg-lavender-500 text-white'
                : 'bg-lavender-50 text-lavender-600 hover:bg-lavender-100'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition active:scale-95 ${
                filterCategory === cat
                  ? 'bg-lavender-500 text-white'
                  : 'bg-lavender-50 text-lavender-600 hover:bg-lavender-100'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-lavender-600 active:scale-95"
        >
          {showForm ? 'Cancel' : '🎯 Add Milestone'}
        </button>

        {showForm && (
          <div className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. First words"
                  className="w-full rounded-[1rem] border border-gray-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as MilestoneCategory)}
                  className="w-full rounded-[1rem] border border-gray-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What does this milestone involve?"
                  rows={2}
                  className="w-full rounded-[1rem] border border-gray-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Any additional notes…"
                  rows={2}
                  className="w-full rounded-[1rem] border border-gray-200 px-3 py-2 text-sm outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={!formName.trim()}
                className="w-full rounded-full bg-lavender-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-lavender-600 active:scale-95 disabled:opacity-40"
              >
                Save Milestone
              </button>
            </div>
          </div>
        )}

        {filteredMilestones.length === 0 ? (
          <div className="rounded-[1.75rem] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-gray-500">No milestones yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMilestones.map((m) => (
              <div
                key={m.id}
                className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 inline-block h-3 w-3 shrink-0 rounded-full ${STATUS_COLORS[m.status]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{m.name}</h3>
                      <span className="rounded-full bg-lavender-50 px-2 py-0.5 text-xs font-semibold text-lavender-600">
                        {CATEGORY_LABELS[m.category]}
                      </span>
                    </div>

                    {m.description && (
                      <p className="mt-1 text-sm text-gray-500">{m.description}</p>
                    )}

                    {m.notes && (
                      <p className="mt-1 text-xs italic text-gray-400">{m.notes}</p>
                    )}

                    {m.status === 'achieved' && m.dateAchieved && (
                      <p className="mt-1 text-xs text-green-600">
                        Achieved on {m.dateAchieved}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {(['not_started', 'in_progress', 'achieved'] as MilestoneStatus[]).map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(m, s)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95 ${
                              m.status === s
                                ? 'bg-lavender-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-lavender-50'
                            }`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        onClick={() => deleteMilestone(m.id)}
                        className="ml-auto rounded-full px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
