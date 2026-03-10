import { useMemo, useState } from 'react';
import { addDays, format, isAfter, isBefore, isSameDay, parseISO, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { Calendar, ChevronRight, CircleHelp, Plus, X } from 'lucide-react';
import { useApp } from '../context/useApp';
import CelebrationBanner from '../components/CelebrationBanner';
import { MILESTONE_ACHIEVED_CELEBRATION, MILESTONE_SAVE_CELEBRATION } from '../content/presentation';
import type { Milestone, MilestoneCategory, MilestoneStatus, ModuleId } from '../types';
import { DEFAULT_MODULES } from '../types';
import { generateId } from '../utils/storage';
import { MILESTONE_GUIDANCE } from '../data/milestoneGuidance';

const CATEGORIES: MilestoneCategory[] = ['speech', 'motor', 'social', 'cognitive', 'self_care', 'routine', 'sensory', 'other'];
type MilestoneType = NonNullable<Milestone['milestoneType']>;

const MILESTONE_TYPES: MilestoneType[] = ['developmental', 'educational', 'medical', 'therapy', 'custom'];
const ZOOMS = ['weekly', 'monthly', 'annual'] as const;

type TimeWindow = 'all' | 'next_30' | 'next_90' | 'past_90';
type ZoomMode = (typeof ZOOMS)[number];

const CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  speech: 'Speech',
  motor: 'Motor',
  social: 'Social',
  cognitive: 'Cognitive',
  self_care: 'Self-care',
  routine: 'Routine',
  sensory: 'Sensory',
  other: 'Other',
};

const STATUS_LABELS: Record<MilestoneStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  achieved: 'Achieved',
};

const STATUS_STYLES: Record<MilestoneStatus, string> = {
  not_started: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-800',
  achieved: 'bg-emerald-100 text-emerald-800',
};

const ZOOM_BUCKET_FORMAT: Record<ZoomMode, string> = {
  weekly: 'EEE d MMM',
  monthly: 'd MMM',
  annual: 'MMM yyyy',
};

function milestoneDate(milestone: Milestone): Date {
  if (milestone.dateAchieved) return parseISO(milestone.dateAchieved);
  if (milestone.targetDate) return parseISO(milestone.targetDate);
  return parseISO(milestone.createdAt);
}

function bucketStart(date: Date, zoom: ZoomMode): Date {
  if (zoom === 'weekly') return startOfDay(date);
  if (zoom === 'monthly') return startOfWeek(date, { weekStartsOn: 1 });
  return startOfMonth(date);
}

export default function MilestonesPage() {
  const {
    selectedChild,
    selectedChildId,
    milestones,
    user,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    enabledModules,
  } = useApp();

  const [zoom, setZoom] = useState<ZoomMode>('monthly');
  const [categoryFilter, setCategoryFilter] = useState<MilestoneCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MilestoneStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MilestoneType | 'all'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');
  const [highlightMilestoneId, setHighlightMilestoneId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [guidanceMilestone, setGuidanceMilestone] = useState<Milestone | null>(null);
  const [celebration, setCelebration] = useState<typeof MILESTONE_SAVE_CELEBRATION | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MilestoneCategory>('speech');
  const [formType, setFormType] = useState<MilestoneType>('custom');
  const [formModuleId, setFormModuleId] = useState<ModuleId>('milestones');
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTargetDate, setFormTargetDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const enabledModuleList = useMemo(
    () => DEFAULT_MODULES.filter((mod) => enabledModules.includes(mod.id) || mod.id === 'milestones'),
    [enabledModules],
  );

  const childMilestones = useMemo(
    () => milestones.filter((entry) => entry.childId === selectedChildId),
    [milestones, selectedChildId],
  );

  const filteredMilestones = useMemo(() => {
    const now = startOfDay(new Date());
    return childMilestones
      .filter((entry) => categoryFilter === 'all' || entry.category === categoryFilter)
      .filter((entry) => statusFilter === 'all' || entry.status === statusFilter)
      .filter((entry) => typeFilter === 'all' || (entry.milestoneType ?? 'developmental') === typeFilter)
      .filter((entry) => moduleFilter === 'all' || (entry.moduleId ?? 'milestones') === moduleFilter)
      .filter((entry) => {
        if (timeWindow === 'all') return true;
        const date = startOfDay(milestoneDate(entry));
        if (timeWindow === 'next_30') return !isBefore(date, now) && !isAfter(date, addDays(now, 30));
        if (timeWindow === 'next_90') return !isBefore(date, now) && !isAfter(date, addDays(now, 90));
        return !isAfter(date, now) && !isBefore(date, addDays(now, -90));
      })
      .sort((a, b) => milestoneDate(a).getTime() - milestoneDate(b).getTime());
  }, [categoryFilter, childMilestones, moduleFilter, statusFilter, timeWindow, typeFilter]);

  const timelineBuckets = useMemo(() => {
    const map = new Map<string, Milestone[]>();
    filteredMilestones.forEach((entry) => {
      const keyDate = bucketStart(milestoneDate(entry), zoom);
      const key = keyDate.toISOString();
      const prev = map.get(key) ?? [];
      prev.push(entry);
      map.set(key, prev);
    });
    return [...map.entries()]
      .map(([dateISO, entries]) => ({ date: parseISO(dateISO), entries }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredMilestones, zoom]);

  const nextLeap = useMemo(
    () => filteredMilestones.find((entry) => entry.status !== 'achieved' && !isBefore(milestoneDate(entry), startOfDay(new Date()))),
    [filteredMilestones],
  );

  const saveMilestone = () => {
    if (!selectedChildId || !formName.trim()) return;

    addMilestone({
      id: generateId(),
      childId: selectedChildId,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      moduleId: formModuleId,
      milestoneType: formType,
      status: isSameDay(startOfDay(parseISO(formTargetDate)), startOfDay(new Date())) ? 'in_progress' : 'not_started',
      targetDate: formTargetDate,
      dateAchieved: null,
      notes: formNotes.trim(),
      sourceRole: user?.role,
      createdBy: user?.id ?? '',
      createdAt: new Date().toISOString(),
    });

    setFormName('');
    setFormDescription('');
    setFormNotes('');
    setFormTargetDate(format(new Date(), 'yyyy-MM-dd'));
    setShowForm(false);
    setCelebration(MILESTONE_SAVE_CELEBRATION);
  };

  const jumpToToday = () => {
    const todayItem = filteredMilestones.find((entry) => isSameDay(milestoneDate(entry), new Date()));
    setHighlightMilestoneId(todayItem?.id ?? null);
  };

  const jumpToNextLeap = () => {
    setHighlightMilestoneId(nextLeap?.id ?? null);
  };

  if (!selectedChild || !selectedChildId) {
    return (
      <div className="px-4 pt-10 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Milestones</h1>
        <p className="mt-2 text-sm text-slate-500">Select or add a child profile to start the milestone timeline.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <header className="bg-white px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Milestones</h1>
        <p className="text-sm text-slate-500">A clear progress timeline for {selectedChild.name}</p>
      </header>

      <section className="px-4">
        {celebration ? (
          <div className="mb-3">
            <CelebrationBanner {...celebration} />
          </div>
        ) : null}
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            <FilterSelect label="Category" value={categoryFilter} onChange={(value) => setCategoryFilter(value as MilestoneCategory | 'all')}>
              <option value="all">All</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
            </FilterSelect>
            <FilterSelect label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as MilestoneStatus | 'all')}>
              <option value="all">All</option>
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="achieved">Achieved</option>
            </FilterSelect>
            <FilterSelect label="Type" value={typeFilter} onChange={(value) => setTypeFilter(value as MilestoneType | 'all')}>
              <option value="all">All</option>
              {MILESTONE_TYPES.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
            </FilterSelect>
            <FilterSelect label="Module" value={moduleFilter} onChange={setModuleFilter}>
              <option value="all">All</option>
              {enabledModuleList.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
            </FilterSelect>
            <FilterSelect label="Window" value={timeWindow} onChange={(value) => setTimeWindow(value as TimeWindow)}>
              <option value="all">All</option>
              <option value="next_30">Next 30 days</option>
              <option value="next_90">Next 90 days</option>
              <option value="past_90">Past 90 days</option>
            </FilterSelect>
            <FilterSelect label="Zoom" value={zoom} onChange={(value) => setZoom(value as ZoomMode)}>
              {ZOOMS.map((item) => <option key={item} value={item}>{item}</option>)}
            </FilterSelect>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={jumpToToday}
              className="inline-flex min-h-11 items-center gap-1 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-700"
            >
              <Calendar size={14} /> Jump to today
            </button>
            <button
              type="button"
              onClick={jumpToNextLeap}
              className="inline-flex min-h-11 items-center gap-1 rounded-full bg-violet-600 px-4 text-xs font-semibold text-white"
            >
              <ChevronRight size={14} /> Next upcoming milestone
            </button>
            <button
              type="button"
              onClick={() => setShowForm((value) => !value)}
              className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-full bg-sky-700 px-4 text-xs font-semibold text-white"
            >
              <Plus size={14} /> Add milestone
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="mt-3 px-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-sm font-bold text-slate-800">Custom milestone</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormField label="Milestone name">
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" />
              </FormField>
              <FormField label="Target date">
                <input type="date" value={formTargetDate} onChange={(e) => setFormTargetDate(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" />
              </FormField>
              <FormField label="Category">
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as MilestoneCategory)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
                </select>
              </FormField>
              <FormField label="Milestone type">
                <select value={formType} onChange={(e) => setFormType(e.target.value as MilestoneType)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                  {MILESTONE_TYPES.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Module">
                <select value={formModuleId} onChange={(e) => setFormModuleId(e.target.value as ModuleId)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                  {enabledModuleList.map((module) => <option key={module.id} value={module.id}>{module.label}</option>)}
                </select>
              </FormField>
              <FormField label="Description">
                <input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" />
              </FormField>
            </div>
            <FormField label="Diary notes" className="mt-3">
              <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </FormField>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveMilestone} disabled={!formName.trim()} className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">Save milestone</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700">Cancel</button>
            </div>
          </div>
        </section>
      )}

      <section className="mt-3 px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-sm font-bold text-slate-800">Timeline</h2>
          {timelineBuckets.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No milestones match your current filters.</p>
          )}
          <div className="space-y-4">
            {timelineBuckets.map((bucket) => (
              <div key={bucket.date.toISOString()} className="rounded-xl border border-slate-100 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-700">{format(bucket.date, ZOOM_BUCKET_FORMAT[zoom])}</div>
                <div className="space-y-2">
                  {bucket.entries.map((entry) => {
                    const module = DEFAULT_MODULES.find((item) => item.id === (entry.moduleId ?? 'milestones'));
                    return (
                      <article
                        key={entry.id}
                        className={`rounded-xl bg-slate-50 p-3 ring-1 ${highlightMilestoneId === entry.id ? 'ring-violet-400' : 'ring-transparent'}`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg" aria-label={`${module?.label ?? 'Milestone'} icon`}>{module?.icon ?? '⭐'}</span>
                          <h3 className="text-sm font-semibold text-slate-900">{entry.name}</h3>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{CATEGORY_LABELS[entry.category]}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">{(entry.milestoneType ?? 'developmental').replace('_', ' ')}</span>
                        </div>
                        {entry.description && <p className="mt-1 text-sm text-slate-600">{entry.description}</p>}
                        {entry.notes && <p className="mt-1 text-xs text-slate-500">Diary note: {entry.notes}</p>}
                        <p className="mt-1 text-xs text-slate-500">Date marker: {format(milestoneDate(entry), 'EEE d MMM yyyy')}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(['not_started', 'in_progress', 'achieved'] as MilestoneStatus[]).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                updateMilestone({
                                  ...entry,
                                  status,
                                  dateAchieved: status === 'achieved' ? format(new Date(), 'yyyy-MM-dd') : null,
                                });
                                setCelebration(status === 'achieved' ? MILESTONE_ACHIEVED_CELEBRATION : null);
                              }}
                              className={`min-h-10 rounded-full px-3 text-xs font-semibold ${entry.status === status ? 'bg-violet-600 text-white' : 'bg-white text-slate-700'}`}
                            >
                              {STATUS_LABELS[status]}
                            </button>
                          ))}
                          <button type="button" onClick={() => setGuidanceMilestone(entry)} className="inline-flex min-h-10 items-center gap-1 rounded-full bg-amber-100 px-3 text-xs font-semibold text-amber-900">
                            <CircleHelp size={14} /> NHS guidance
                          </button>
                          <button type="button" onClick={() => deleteMilestone(entry.id)} className="ml-auto min-h-10 rounded-full bg-rose-100 px-3 text-xs font-semibold text-rose-700">Delete</button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {guidanceMilestone && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 md:items-center md:justify-center">
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-5 md:max-w-lg">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{MILESTONE_GUIDANCE[guidanceMilestone.category].title}</h2>
              <button type="button" onClick={() => setGuidanceMilestone(null)} className="rounded-full bg-slate-100 p-2" aria-label="Close guidance panel">
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-slate-600">{MILESTONE_GUIDANCE[guidanceMilestone.category].whatItMeans}</p>
            <GuidanceSection title="Expected behaviours" items={MILESTONE_GUIDANCE[guidanceMilestone.category].expectedBehaviours} />
            <GuidanceSection title="Practical tips" items={MILESTONE_GUIDANCE[guidanceMilestone.category].tips} />
            <GuidanceSection title="Next steps" items={MILESTONE_GUIDANCE[guidanceMilestone.category].nextSteps} />
            <GuidanceSection title="Autism / SEND support" items={MILESTONE_GUIDANCE[guidanceMilestone.category].autismSupport} />
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="mb-1 text-xs font-semibold text-slate-700">Trusted links</p>
              <ul className="space-y-1 text-sm">
                {MILESTONE_GUIDANCE[guidanceMilestone.category].links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-violet-700 underline">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-semibold text-slate-700 ${className}`}>
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[11px] font-semibold text-slate-600">
      <span className="mb-1 block">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-2 text-sm">
        {children}
      </select>
    </label>
  );
}

function GuidanceSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{title}</p>
      <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-600">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
