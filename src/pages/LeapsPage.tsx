import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { useApp } from '../context/useApp';
import type { Child } from '../types';
import {
  predictLeaps,
  getLeapReferenceDate,
  LEAP_CHART,
} from '../data/leapData';
import { MILESTONE_GUIDANCE } from '../data/milestoneGuidance';
import { ensureLeapsMilestones, stripSlugSentinel } from '../utils/ensureLeapsMilestones';
import { UK_SUPPORT_RESOURCES } from '../data/ukSupportResources';
import {
  AgeCalculator,
  LeapProgressChart,
} from '../components/leaps';
import { Link } from 'react-router-dom';

type LeapsSection = 'overview' | 'milestones' | 'timeline';

// Number of weeks past the target date before a milestone enters "seek advice" state
const SEEK_ADVICE_WEEKS = 8;

// ── Page Component ───────────────────────────────────────────────────

export default function LeapsPage() {
  const { selectedChild, children, milestones, user, addMilestone, updateMilestone, deleteMilestone, enabledModules, leapSymptomLogs, leapDiaryEntries } = useApp();
  const [activeSection, setActiveSection] = useState<LeapsSection>('milestones');
  const [milestonesInitialised, setMilestonesInitialised] = useState(false);

  // Use the selected child, or the first child available
  const child = selectedChild ?? children[0] ?? null;

  const effectiveChild = child;

  const milestonesEnabled = enabledModules.includes('milestones');

  // Auto-generate LEAPS milestones idempotently when the page loads
  // (only when milestones module is enabled and a child is available)
  const initLeapsMilestones = useCallback(async () => {
    if (!effectiveChild || !user || !milestonesEnabled || milestonesInitialised) return;
    setMilestonesInitialised(true);

    const newMilestones = ensureLeapsMilestones({
      child: effectiveChild,
      existingMilestones: milestones,
      userId: user.id,
    });

    // Add all new milestones concurrently — in local mode storage writes are
    // synchronous so all milestones are in localStorage before refreshLocalData runs.
    await Promise.all(newMilestones.map((m) => addMilestone(m)));
  }, [effectiveChild, user, milestonesEnabled, milestonesInitialised, milestones, addMilestone]);

  useEffect(() => {
    void initLeapsMilestones();
  // Reset the flag when child changes so we re-check for the new child
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveChild?.id, milestonesEnabled]);

  // Reset initialised flag when child changes
  useEffect(() => {
    setMilestonesInitialised(false);
  }, [effectiveChild?.id]);

  // Compute leap data for milestone integration
  const leapPredictions = useMemo(() => {
    if (!effectiveChild) return [];
    const refDate = getLeapReferenceDate(effectiveChild.dateOfBirth, effectiveChild.dueDate);
    return predictLeaps(refDate, new Date());
  }, [effectiveChild]);

  const currentLeap = leapPredictions.find((p) => p.status === 'stormy' || p.status === 'current');
  const pastLeaps = leapPredictions.filter((p) => p.status === 'past');

  // Milestone integration
  const childMilestones = useMemo(
    () => milestones.filter((m) => effectiveChild && m.childId === effectiveChild.id),
    [milestones, effectiveChild],
  );
  const achievedCount = childMilestones.filter((m) => m.status === 'achieved').length;
  const inProgressCount = childMilestones.filter((m) => m.status === 'in_progress').length;

  // Missed milestone detection: milestones with a target date in the past that are not achieved
  const missedMilestones = useMemo(
    () => childMilestones.filter((m) => {
      if (m.status === 'achieved') return false;
      if (!m.targetDate) return false;
      return new Date(m.targetDate) < new Date();
    }),
    [childMilestones],
  );

  // "Seek advice" milestones: overdue by more than SEEK_ADVICE_WEEKS
  const seekAdviceMilestones = useMemo(
    () => missedMilestones.filter((m) => {
      if (!m.targetDate) return false;
      const msOverdue = Date.now() - new Date(m.targetDate).getTime();
      return msOverdue > SEEK_ADVICE_WEEKS * 7 * 24 * 60 * 60 * 1000;
    }),
    [missedMilestones],
  );

  // Expected milestone prompts based on past leaps
  const expectedMilestoneCategories = useMemo(() => {
    const categories: string[] = [];
    for (const lp of pastLeaps) {
      const leapDef = LEAP_CHART.find((l) => l.number === lp.leap.number);
      if (!leapDef) continue;
      // Map leap skills to milestone categories
      if (leapDef.skills.some((s) => /word|talk|sound|babbl/i.test(s))) categories.push('speech');
      if (leapDef.skills.some((s) => /reach|grasp|move|smooth|stack|build/i.test(s))) categories.push('motor');
      if (leapDef.skills.some((s) => /social|empathy|conscience|negot/i.test(s))) categories.push('social');
      if (leapDef.skills.some((s) => /problem|strateg|plan|anticipat|cause/i.test(s))) categories.push('cognitive');
    }
    return [...new Set(categories)];
  }, [pastLeaps]);

  const sections: { id: LeapsSection; label: string; emoji: string }[] = [
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'milestones', label: 'Milestones', emoji: '⭐' },
    { id: 'timeline', label: 'Timeline', emoji: '📅' },
  ];

  const [expandedLeap, setExpandedLeap] = useState<number | null>(null);

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">🌈</span>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Developmental Leaps</h1>
        <p className="text-sm text-[var(--text-secondary)]">Add a child profile first to use the leap tracker.</p>
      </div>
    );
  }

  // After the guard clause, effectiveChild is guaranteed non-null
  const activeChild = effectiveChild as Child;

  return (
    <div className="space-y-4 pb-4">
      <header className="px-1">
        <h1 className="text-xl font-bold text-lavender-700">🌈 Developmental Leaps</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Track <strong>{activeChild.name}&apos;s</strong> developmental leaps, milestones, and growth
        </p>
      </header>

      {/* Due-date editor removed from top — set DOB in Settings → Child Profiles */}

      {/* Section tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Leaps page sections">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-medium transition-all whitespace-nowrap ${
              activeSection === sec.id
                ? 'bg-lavender-500 text-white shadow-md'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] shadow-sm ring-1 ring-[var(--border-color)] hover:bg-lavender-50'
            }`}
          >
            <span>{sec.emoji}</span>
            {sec.label}
          </button>
        ))}
      </nav>

      {/* ── Overview Section ──────────────────────────────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <AgeCalculator child={activeChild} />
          <LeapProgressChart child={activeChild} />

          {/* Current leap guidance */}
          {currentLeap && (
            <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] mb-3">
                🌊 Currently in Leap {currentLeap.leap.number}: {currentLeap.leap.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{currentLeap.leap.description}</p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-1">🌟 Skills emerging</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentLeap.leap.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-lavender-50 px-2.5 py-1 text-xs text-lavender-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-1">💡 Tips for parents</h3>
                  <ul className="space-y-1">
                    {currentLeap.leap.parentalTips.slice(0, 3).map((tip) => (
                      <li key={tip} className="text-xs text-[var(--text-secondary)] flex gap-1.5">
                        <span className="text-lavender-400 shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Missed milestones alert */}
          {missedMilestones.length > 0 && (
            <section className="rounded-2xl bg-rose-50 border border-rose-200 p-4" aria-label="Milestones needing attention">
              <h2 className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-2">
                ⚠️ {missedMilestones.length} milestone{missedMilestones.length !== 1 ? 's' : ''} past their target date
              </h2>
              <p className="text-xs text-rose-700 mb-3">
                These milestones have not yet been marked as achieved. Every child develops at their own pace —
                these dates are advisory guides, not diagnostic deadlines. Only you can mark a milestone as achieved
                when you have observed the skill.
              </p>
              <ul className="space-y-2 mb-3">
                {missedMilestones.slice(0, 3).map((m) => (
                  <li key={m.id} className="rounded-xl bg-[var(--bg-card)] px-3 py-2 text-xs ring-1 ring-rose-100">
                    <span className="font-semibold text-[var(--text-primary)]">{m.name}</span>
                    <span className="text-rose-700 ml-2">Target: {m.targetDate}</span>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                      Continue observing and practising — mark this achieved when you see the skill.
                    </p>
                  </li>
                ))}
                {missedMilestones.length > 3 && (
                  <li className="text-xs text-rose-700">
                    +{missedMilestones.length - 3} more — view in the Milestones tab
                  </li>
                )}
              </ul>

              {/* Seek advice banner for significantly overdue milestones */}
              {seekAdviceMilestones.length > 0 && (
                <div className="rounded-xl bg-[var(--bg-card)] border border-rose-200 px-3 py-3 mb-3">
                  <p className="text-xs font-semibold text-rose-800 mb-1">
                    🩺 Some milestones are significantly overdue — consider seeking advice
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] mb-2">
                    When milestones are significantly past their expected window it can be worth a chat with
                    your health visitor or GP. They can reassure you or point you to appropriate support.
                  </p>
                  <ul className="space-y-1 text-[10px] text-rose-700">
                    {UK_SUPPORT_RESOURCES.map((r) => (
                      <li key={r.url} className="flex gap-1.5">
                        <span>{r.emoji}</span>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                          {r.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-rose-800">Reassuring next steps:</h3>
                <ul className="space-y-1 text-xs text-rose-700">
                  <li className="flex gap-1.5"><span>✅</span> Keep supporting play and daily activities — skills often emerge gradually</li>
                  <li className="flex gap-1.5"><span>📝</span> Note any new skills you observe, however small, and update the milestone</li>
                  <li className="flex gap-1.5"><span>🩺</span> Speak to your GP or health visitor if you have concerns — they are there to help</li>
                  <li className="flex gap-1.5"><span>📋</span> Share your observations with therapy or SEND teams if involved</li>
                </ul>
              </div>
              {milestonesEnabled && (
                <Link
                  to="/milestones"
                  className="mt-3 inline-flex rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                >
                  Review &amp; update milestones →
                </Link>
              )}
            </section>
          )}

          {/* Quick stats */}
          {milestonesEnabled && (
            <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">📈 Progress at a glance</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[var(--bg-primary)] p-3 text-center">
                  <div className="text-lg font-bold text-lavender-700">{pastLeaps.length}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Leaps completed</div>
                </div>
                <div className="rounded-xl bg-[var(--bg-primary)] p-3 text-center">
                  <div className="text-lg font-bold text-emerald-600">{achievedCount}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Milestones achieved</div>
                </div>
                <div className="rounded-xl bg-[var(--bg-primary)] p-3 text-center">
                  <div className="text-lg font-bold text-amber-600">{inProgressCount}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">In progress</div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Milestones Section ────────────────────────────────────────── */}
      {activeSection === 'milestones' && (
        <div className="space-y-4">
          {!milestonesEnabled ? (
            <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5 text-center">
              <span className="text-3xl mb-2 block">⭐</span>
              <h2 className="text-sm font-bold text-[var(--text-primary)] mb-1">Milestones module is turned off</h2>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Enable the Milestones module in Settings to track and link milestones with developmental leaps.
              </p>
              <Link to="/settings" className="inline-flex rounded-full bg-lavender-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lavender-600">
                Open Settings
              </Link>
            </section>
          ) : (
            <>
              {/* Compact quick-log actions: compact buttons + preview, full page at /leap-entry */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">📝 Quick logging</h2>
                  <Link to="/leap-entry" className="text-xs font-semibold text-lavender-600 hover:underline">Open full entry page →</Link>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/leap-entry"
                    className="flex-1 rounded-lg bg-lavender-600 px-3 py-2 text-sm font-semibold text-white text-center hover:bg-lavender-700"
                  >
                    📝 Log symptom or note
                  </Link>
                  <Link
                    to="/leap-entry"
                    className="flex-1 rounded-lg bg-[var(--bg-primary)] border border-lavender-100 px-3 py-2 text-sm font-semibold text-lavender-700 text-center hover:bg-lavender-50"
                  >
                    📚 Add diary note
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3 border border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Most recent symptom</div>
                    {leapSymptomLogs.filter((l) => l.childId === activeChild.id).slice(-1).map((log) => (
                      <div key={log.id} className="text-sm text-gray-700">
                        <div className="truncate">{log.symptoms.map((s) => s).join(', ')}</div>
                        <div className="text-[11px] text-gray-400">{log.date} {log.time}</div>
                      </div>
                    ))}
                    {leapSymptomLogs.filter((l) => l.childId === activeChild.id).length === 0 && (
                      <div className="text-sm text-gray-400 italic">No recent symptoms</div>
                    )}
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Most recent diary note</div>
                    {leapDiaryEntries.filter((e) => e.childId === activeChild.id).slice(-1).map((entry) => (
                      <div key={entry.id} className="text-sm text-gray-700">
                        <div className="font-medium truncate">{entry.title}</div>
                        <div className="text-[11px] text-gray-400">{entry.date}</div>
                      </div>
                    ))}
                    {leapDiaryEntries.filter((e) => e.childId === activeChild.id).length === 0 && (
                      <div className="text-sm text-gray-400 italic">No diary notes yet</div>
                    )}
                  </div>
                </div>
              </section>

              {/* Milestone summary by category */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-[var(--text-primary)] mb-1">Milestone progress by category</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Milestones are marked achieved only when <strong>you</strong> confirm the skill — they are never
                  auto-completed. Target dates are advisory guides, not diagnostic deadlines.
                </p>
                <div className="space-y-2">
                  {(Object.keys(MILESTONE_GUIDANCE) as Array<keyof typeof MILESTONE_GUIDANCE>).map((cat) => {
                    const catMilestones = childMilestones.filter((m) => m.category === cat);
                    const catAchieved = catMilestones.filter((m) => m.status === 'achieved').length;
                    const isExpected = expectedMilestoneCategories.includes(cat);
                    return (
                      <div key={cat} className="flex items-center gap-3 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                              {MILESTONE_GUIDANCE[cat].title}
                            </span>
                            {isExpected && catMilestones.length === 0 && (
                              <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                                Expected
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            {catMilestones.length === 0
                              ? 'No milestones tracked yet'
                              : `${catAchieved} of ${catMilestones.length} achieved`}
                          </div>
                        </div>
                        {catMilestones.length > 0 && (
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-[var(--bg-hover)]">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${(catAchieved / catMilestones.length) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/milestones"
                  className="mt-3 inline-flex rounded-full bg-lavender-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lavender-600"
                >
                  Manage milestones →
                </Link>
              </section>

              {/* Missed milestones in milestones tab */}
              {missedMilestones.length > 0 && (
                <section className="rounded-2xl bg-rose-50 border border-rose-200 p-4" aria-label="Milestones past target date">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-2">
                    ⚠️ Milestones past target date
                  </h2>
                  <p className="text-xs text-rose-700 mb-2">
                    Every child develops at their own pace — these dates are guides, not deadlines.
                    Only you can mark a milestone as achieved when you observe the skill.
                  </p>
                  <div className="space-y-2">
                    {missedMilestones.map((m) => {
                      const guidance = MILESTONE_GUIDANCE[m.category];
                      const isSeekAdvice = seekAdviceMilestones.some((s) => s.id === m.id);
                      return (
                        <div key={m.id} className="rounded-xl bg-[var(--bg-card)] p-3 ring-1 ring-rose-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[var(--text-primary)]">
                              {stripSlugSentinel(m.name)}
                            </span>
                            {isSeekAdvice && (
                              <span className="shrink-0 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                                Seek advice
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {guidance?.title ?? m.category} · Target: {m.targetDate}
                          </div>
                          {guidance && (
                            <div className="mt-1.5 text-[10px] text-rose-700">
                              <strong>Next steps:</strong> {guidance.nextSteps[0]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Seek advice resources shown when any milestone is significantly overdue */}
                  {seekAdviceMilestones.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-semibold text-rose-800">UK support resources:</p>
                      {UK_SUPPORT_RESOURCES.map((r) => (
                        <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-rose-700 underline underline-offset-2">
                          <span>{r.emoji}</span>{r.label}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Guidance by leap stage */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">🧭 Guidance &amp; support</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Helpful UK resources for each stage of your child&apos;s development.
                </p>
                <div className="space-y-2">
                  {UK_SUPPORT_RESOURCES.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] hover:ring-lavender-200 transition"
                    >
                      {r.emoji} <span className="underline underline-offset-2">{r.label}</span>
                    </a>
                  ))}
                </div>
              </section>
            </>
          )}

          

          {/* ── Leap reminders ───────────────────────────────────── */}
          <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">🔔 Leap reminders</h2>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Reminders can be configured in{' '}
                <Link to="/settings" className="text-lavender-600 underline underline-offset-2">Settings</Link>.
              </p>
          </section>
        </div>
      )}

      {/* ── Timeline Section ──────────────────────────────────────────── */}
      {activeSection === 'timeline' && (
        <div className="space-y-4">
          {/* Render the 10 leap periods as a timeline, expanded to show their generated milestones (new milestones) */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-3 text-sm font-bold text-slate-800">Leap timeline & milestones</h2>
            <div className="space-y-3">
              {leapPredictions.map((pred) => {
                const leapMilestones = milestones
                  .filter((m) => m.childId === activeChild.id && (m.moduleId ?? 'milestones') === 'leaps')
                  .filter((m) => {
                    const match = /\[slug:leap(\d+)-/.exec(m.description ?? '');
                    return match ? parseInt(match[1], 10) === pred.leap.number : false;
                  })
                  .sort((a, b) => {
                    const da = new Date(a.targetDate ?? a.createdAt).getTime();
                    const db = new Date(b.targetDate ?? b.createdAt).getTime();
                    return da - db;
                  });

                const isCompleted = leapMilestones.length > 0 && leapMilestones.every((m) => m.status === 'achieved');

                const isOpen = expandedLeap === pred.leap.number;

                return (
                  <div key={pred.leap.number} className="rounded-xl border p-3">
                    <button
                      type="button"
                      onClick={() => setExpandedLeap(isOpen ? null : pred.leap.number)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div>
                        <div className="text-sm font-bold">{pred.leap.number}</div>
                        <div className="text-sm">{pred.leap.title}</div>
                        <div className="text-xs text-slate-500">{format(pred.stormyStart, 'd MMM')} – {format(pred.sunnyDate, 'd MMM yyyy')}</div>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700">{isCompleted ? 'Completed' : 'Ongoing'}</div>
                    </button>
                    {isOpen && (
                      <div className="mt-3 space-y-2">
                        {pred.leap.resourceLinks && pred.leap.resourceLinks.length > 0 && (
                          <div className="mt-2 rounded-lg bg-white/40 p-3">
                            <p className="text-xs font-bold mb-1.5">🔗 Trusted resources</p>
                            <ul className="space-y-1">
                              {pred.leap.resourceLinks.map((link) => (
                                <li key={link.url}>
                                  {link.url.startsWith('/') ? (
                                    <Link to={link.url} className="text-xs font-medium underline underline-offset-2">
                                      {link.label}
                                    </Link>
                                  ) : (
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium underline underline-offset-2">
                                      {link.label}
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {leapMilestones.length === 0 ? (
                          <p className="text-sm text-gray-400">No milestones for this leap yet.</p>
                        ) : (
                          leapMilestones.map((entry) => (
                            <article key={entry.id} className="rounded-xl bg-slate-50 p-3 ring-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg">🌈</span>
                                <h3 className="text-sm font-semibold text-slate-900">{entry.name}</h3>
                                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">{entry.category}</span>
                                <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">{entry.status}</span>
                                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">{(entry.milestoneType ?? 'developmental').replace('_', ' ')}</span>
                              </div>
                              {entry.description && <p className="mt-1 text-sm text-slate-600">{stripSlugSentinel(entry.description)}</p>}
                              {entry.notes && <p className="mt-1 text-xs text-slate-500">Diary note: {entry.notes}</p>}
                              <p className="mt-1 text-xs text-slate-500">Date marker: {entry.targetDate ? format(parseISO(entry.targetDate), 'EEE d MMM yyyy') : entry.createdAt}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(['not_started', 'in_progress', 'achieved'] as const).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => updateMilestone({ ...entry, status, dateAchieved: status === 'achieved' ? format(new Date(), 'yyyy-MM-dd') : null })}
                                    className={`min-h-10 rounded-full px-3 text-xs font-semibold ${entry.status === status ? 'bg-violet-600 text-white' : 'bg-white text-slate-700'}`}
                                  >
                                    {status === 'not_started' ? 'Not started' : status === 'in_progress' ? 'In progress' : 'Achieved'}
                                  </button>
                                ))}
                                <button type="button" onClick={() => window.location.assign(`/milestones?module=leaps&leap=${pred.leap.number}`)} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-700">
                                  NHS guidance
                                </button>
                                <button type="button" onClick={() => deleteMilestone(entry.id)} className="ml-auto min-h-10 rounded-full bg-rose-600 px-3 text-xs font-semibold text-white">Delete</button>
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
