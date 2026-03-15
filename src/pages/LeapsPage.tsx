import { useState, useMemo } from 'react';
import { useApp } from '../context/useApp';
import type { Child } from '../types';
import {
  predictLeaps,
  getLeapReferenceDate,
  LEAP_CHART,
} from '../data/leapData';
import { MILESTONE_GUIDANCE } from '../data/milestoneGuidance';
import {
  AgeCalculator,
  LeapTimeline,
  SymptomLogger,
  LeapDiary,
  LeapProgressChart,
} from '../components/leaps';
import { Link } from 'react-router-dom';

type LeapsSection = 'milestones' | 'overview' | 'timeline';

// ── Page Component ───────────────────────────────────────────────────

export default function LeapsPage() {
  const { selectedChild, children, milestones, enabledModules } = useApp();
  const [activeSection, setActiveSection] = useState<LeapsSection>('milestones');

  // Use the selected child, or the first child available
  const child = selectedChild ?? children[0] ?? null;

  // Use child directly (dueDate editing is now in Settings)
  const effectiveChild = child;

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

  const milestonesEnabled = enabledModules.includes('milestones');

  const sections: { id: LeapsSection; label: string; emoji: string }[] = [
    { id: 'milestones', label: 'Milestones', emoji: '⭐' },
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'timeline', label: 'Timeline', emoji: '📅' },
  ];

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
        {!activeChild.dueDate && (
          <Link to="/settings" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700">
            💡 Set due date in Settings for better leap accuracy
          </Link>
        )}
      </header>

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

      {/* ── Milestones Section (default) ──────────────────────────────── */}
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
              {/* Quick-log actions for leap symptoms & diary */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Quick log</h2>
                <div className="space-y-3">
                  <SymptomLogger child={activeChild} />
                  <LeapDiary child={activeChild} />
                </div>
              </section>

              {/* Milestone summary by category */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Milestone progress by category</h2>
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
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
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

              {/* Missed milestones */}
              {missedMilestones.length > 0 && (
                <section className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-2">
                    ⚠️ Milestones past target date
                  </h2>
                  <p className="text-xs text-rose-600 mb-2">
                    These milestones have not yet been achieved. Every child is different — use these as conversation starters with professionals, not as cause for alarm.
                  </p>
                  <div className="space-y-2">
                    {missedMilestones.map((m) => {
                      const guidance = MILESTONE_GUIDANCE[m.category];
                      return (
                        <div key={m.id} className="rounded-xl bg-white p-3 ring-1 ring-rose-100">
                          <div className="text-xs font-semibold text-rose-900">{m.name}</div>
                          <div className="text-[10px] text-rose-600 mt-0.5">
                            Category: {guidance?.title ?? m.category} · Target: {m.targetDate}
                          </div>
                          {guidance && (
                            <div className="mt-2 text-[10px] text-rose-700">
                              <strong>Next steps:</strong> {guidance.nextSteps[0]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Guidance by leap stage */}
              <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">🧭 Guidance &amp; support</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Helpful resources for each stage of your child&apos;s development.
                </p>
                <div className="space-y-2">
                  <a
                    href="https://www.nhs.uk/start-for-life/baby/development/"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] hover:ring-lavender-200 transition"
                  >
                    🏥 <span className="underline underline-offset-2">NHS Start for Life: Baby development</span>
                  </a>
                  <a
                    href="https://www.nhs.uk/conditions/baby/babys-development/is-my-child-developing-normally/"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] hover:ring-lavender-200 transition"
                  >
                    👶 <span className="underline underline-offset-2">NHS: Is my child developing normally?</span>
                  </a>
                  <a
                    href="https://www.nhs.uk/conditions/autism/"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] hover:ring-lavender-200 transition"
                  >
                    🧩 <span className="underline underline-offset-2">NHS: Autism overview and support</span>
                  </a>
                  <a
                    href="https://www.nhs.uk/nhs-services/find-your-local-nhs-website/"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-3 py-2.5 text-xs text-[var(--text-primary)] ring-1 ring-[var(--border-color)] hover:ring-lavender-200 transition"
                  >
                    📍 <span className="underline underline-offset-2">Find your local NHS services</span>
                  </a>
                </div>
              </section>
            </>
          )}
        </div>
      )}

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
            <section className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-2">
                ⚠️ {missedMilestones.length} milestone{missedMilestones.length !== 1 ? 's' : ''} may need attention
              </h2>
              <p className="text-xs text-rose-700 mb-3">
                The following milestones have passed their target date without being marked as achieved.
                This is not necessarily a concern — every child develops at their own pace.
              </p>
              <ul className="space-y-2 mb-3">
                {missedMilestones.slice(0, 3).map((m) => (
                  <li key={m.id} className="rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-rose-100">
                    <span className="font-semibold text-rose-900">{m.name}</span>
                    <span className="text-rose-600 ml-2">Target: {m.targetDate}</span>
                  </li>
                ))}
                {missedMilestones.length > 3 && (
                  <li className="text-xs text-rose-600">
                    +{missedMilestones.length - 3} more
                  </li>
                )}
              </ul>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-rose-800">Suggested next steps:</h3>
                <ul className="space-y-1 text-xs text-rose-700">
                  <li className="flex gap-1.5"><span>🩺</span> Speak to your GP or health visitor about any concerns</li>
                  <li className="flex gap-1.5"><span>📋</span> Review milestones with your child&apos;s therapy or SEND team</li>
                  <li className="flex gap-1.5"><span>🔗</span>
                    <a href="https://www.nhs.uk/conditions/baby/babys-development/is-my-child-developing-normally/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      NHS: Is my child developing normally?
                    </a>
                  </li>
                  <li className="flex gap-1.5"><span>📞</span>
                    <a href="https://www.nhs.uk/nhs-services/find-your-local-nhs-website/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      Find your local NHS services
                    </a>
                  </li>
                </ul>
              </div>
              {milestonesEnabled && (
                <Link
                  to="/milestones"
                  className="mt-3 inline-flex rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                >
                  Review milestones →
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

      {/* ── Timeline Section ──────────────────────────────────────────── */}
      {activeSection === 'timeline' && (
        <div className="space-y-4">
          <LeapTimeline child={activeChild} />
          {milestonesEnabled && (
            <section className="rounded-2xl bg-[var(--bg-card)] border border-lavender-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">View full milestones timeline</h2>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                See detailed milestone progress, filters, and categories on the dedicated Milestones page.
              </p>
              <Link
                to="/milestones"
                className="inline-flex rounded-full bg-lavender-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-lavender-600"
              >
                Open milestones →
              </Link>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
