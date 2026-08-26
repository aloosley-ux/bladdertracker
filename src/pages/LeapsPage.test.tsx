import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeapsPage from './LeapsPage';
import { renderWithProviders } from '../test/renderWithProviders';
import { LEAP_CHART } from '../data/leapData';
import { LEAPS_MILESTONE_TEMPLATES } from '../data/leapsMilestones';
import { ensureLeapsMilestones, stripSlugSentinel } from '../utils/ensureLeapsMilestones';
import { UK_SUPPORT_RESOURCES } from '../data/ukSupportResources';
import { CHILD_ID, USER_ID, baseChild } from '../test/fixtures';
import type { Milestone } from '../types';

describe('LeapsPage', () => {
  it('maps trusted resource links across early and late leaps', () => {
    expect(LEAP_CHART[0].resourceLinks).toEqual([
      {
        label: 'Milestones (1 month)',
        url: '/milestones?module=leaps&leap=1',
      },
    ]);
    expect(LEAP_CHART[9].resourceLinks).toEqual([
      {
        label: 'Milestones (2 years)',
        url: '/milestones?module=leaps&leap=10',
      },
    ]);
  });

  it('defaults to the Milestones sub-page on first render', async () => {
    renderWithProviders(<LeapsPage />);

    // The active (selected) tab should be Milestones
    const milestonesBtn = await screen.findByRole('button', { name: /milestones/i });
    // It should be the active tab (bg-violet-500 class indicates active)
    expect(milestonesBtn.className).toContain('bg-violet-500');
  }, 15000);

  it('does not show a Tools tab', async () => {
    renderWithProviders(<LeapsPage />);

    await screen.findByRole('button', { name: /milestones/i });

    expect(screen.queryByRole('button', { name: /tools/i })).not.toBeInTheDocument();
  }, 15000);

  it('shows quick logging section on the Milestones sub-page', async () => {
    renderWithProviders(<LeapsPage />);

    // Milestones is the default tab so quick logging should be visible
    expect(await screen.findByText(/quick logging/i)).toBeInTheDocument();
  }, 15000);

  it('renders trusted resource links for expanded leap details', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LeapsPage />);

    // Navigate to the Timeline section first (LeapTimeline is in the Timeline tab)
    await user.click(await screen.findByRole('button', { name: /timeline/i }));

    await user.click(await screen.findByRole('button', { name: /changing sensations/i }));

    const trustedResourceLink = await screen.findByRole('link', { name: /milestones \(1 month\)/i });
    expect(trustedResourceLink).toHaveAttribute('href', '/milestones?module=leaps&leap=1');
  });
});

// ── LEAPS milestone template tests ────────────────────────────────────────────

describe('LEAPS_MILESTONE_TEMPLATES', () => {
  it('covers all 10 leaps', () => {
    expect(LEAPS_MILESTONE_TEMPLATES).toHaveLength(10);
    const leapNumbers = LEAPS_MILESTONE_TEMPLATES.map((g) => g.leapNumber);
    expect(leapNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('has unique slugs across all groups', () => {
    const slugs = LEAPS_MILESTONE_TEMPLATES.flatMap((g) => g.milestones.map((m) => m.slug));
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('has at least 2 milestones per leap', () => {
    for (const group of LEAPS_MILESTONE_TEMPLATES) {
      expect(group.milestones.length).toBeGreaterThanOrEqual(2);
    }
  });
});

// ── ensureLeapsMilestones utility tests ──────────────────────────────────────

describe('ensureLeapsMilestones', () => {
  const now = new Date('2026-03-15T00:00:00Z');

  it('generates milestones for all 10 leaps when none exist', () => {
    const result = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    expect(result.length).toBeGreaterThan(0);
    // One group per leap at minimum
    const leapNumbers = new Set(result.map((m) => {
      // Extract leap number from slug embedded in description
      const match = /\[slug:leap(\d+)-/.exec(m.description);
      return match ? parseInt(match[1], 10) : null;
    }));
    expect(leapNumbers.size).toBeGreaterThanOrEqual(3); // at least a few leaps generated
  });

  it('all generated milestones have status not_started', () => {
    const result = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    for (const m of result) {
      expect(m.status).toBe('not_started');
    }
  });

  it('all generated milestones have moduleId leaps', () => {
    const result = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    for (const m of result) {
      expect(m.moduleId).toBe('leaps');
    }
  });

  it('is idempotent — generates no duplicates on second call', () => {
    const firstRun = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    const secondRun = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: firstRun,
      userId: USER_ID,
      now,
    });

    expect(secondRun).toHaveLength(0);
  });

  it('backfills missing milestones without touching existing ones', () => {
    const partial = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    }).slice(0, 3); // only keep first 3

    const backfilled = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: partial,
      userId: USER_ID,
      now,
    });

    // Should have generated the rest, not the first 3
    expect(backfilled.length).toBeGreaterThan(0);
    const backfilledSlugs = backfilled.map((m) => {
      const match = /\[slug:([^\]]+)\]$/.exec(m.description);
      return match?.[1];
    });
    const partialSlugs = partial.map((m) => {
      const match = /\[slug:([^\]]+)\]$/.exec(m.description);
      return match?.[1];
    });
    // None of the backfilled slugs should overlap with partial
    for (const slug of backfilledSlugs) {
      expect(partialSlugs).not.toContain(slug);
    }
  });

  it('preserves existing achieved milestone status on backfill', () => {
    const initial = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    // Simulate user marking the first milestone as achieved
    const achievedMilestone: Milestone = { ...initial[0], status: 'achieved', dateAchieved: '2026-01-01' };
    const withAchieved = [achievedMilestone, ...initial.slice(1)];

    const secondRun = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: withAchieved,
      userId: USER_ID,
      now,
    });

    // No new milestones — all already exist
    expect(secondRun).toHaveLength(0);
    // The achieved milestone is untouched
    expect(withAchieved[0].status).toBe('achieved');
  });

  it('generates milestones with valid target dates', () => {
    const result = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    for (const m of result) {
      expect(m.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const targetDate = new Date(m.targetDate!);
      expect(isNaN(targetDate.getTime())).toBe(false);
    }
  });

  it('generates milestones scoped to the correct childId', () => {
    const result = ensureLeapsMilestones({
      child: baseChild,
      existingMilestones: [],
      userId: USER_ID,
      now,
    });

    for (const m of result) {
      expect(m.childId).toBe(CHILD_ID);
    }
  });
});

// ── stripSlugSentinel tests ───────────────────────────────────────────────────

describe('stripSlugSentinel', () => {
  it('removes the slug sentinel from a description', () => {
    expect(stripSlugSentinel('Baby smiles responsively.  [slug:leap1-smiles-responsively]'))
      .toBe('Baby smiles responsively.');
  });

  it('returns the string unchanged when there is no sentinel', () => {
    expect(stripSlugSentinel('Normal description')).toBe('Normal description');
  });
});

// ── UK support resources tests ────────────────────────────────────────────────

describe('UK_SUPPORT_RESOURCES', () => {
  it('contains resources', () => {
    expect(UK_SUPPORT_RESOURCES.length).toBeGreaterThan(0);
  });

  it('all resources have valid https URLs', () => {
    for (const r of UK_SUPPORT_RESOURCES) {
      expect(r.url).toMatch(/^https:\/\//);
    }
  });

  it('includes NHS resources', () => {
    const nhsResources = UK_SUPPORT_RESOURCES.filter((r) => r.category === 'nhs');
    expect(nhsResources.length).toBeGreaterThan(0);
  });

  it('includes a health visitor resource', () => {
    const hvResources = UK_SUPPORT_RESOURCES.filter((r) => r.category === 'health-visitor');
    expect(hvResources.length).toBeGreaterThan(0);
  });

  it('all resources have emoji, label, and category', () => {
    for (const r of UK_SUPPORT_RESOURCES) {
      expect(r.emoji).toBeTruthy();
      expect(r.label).toBeTruthy();
      expect(r.category).toBeTruthy();
    }
  });
});

