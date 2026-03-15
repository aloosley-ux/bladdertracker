/**
 * ensureLeapsMilestones
 *
 * Idempotently generates developmental milestone records for a child from the
 * LEAPS_MILESTONE_TEMPLATES data.  Safe to call on every page load:
 *
 * - If a milestone with the same slug (stored in the `name` field with a
 *   `leaps` moduleId) already exists for the child it is NOT duplicated.
 * - Existing user-entered completion data is never touched.
 * - Works for both new children (no milestones yet) and existing children
 *   (backfills any missing templates without disturbing existing records).
 *
 * Returns the list of newly-created milestones (empty array if none were
 * needed), so callers can decide whether to refresh state.
 */

import { addWeeks, format } from 'date-fns';
import { generateId } from './storage';
import { LEAPS_MILESTONE_TEMPLATES } from '../data/leapsMilestones';
import { predictLeaps, getLeapReferenceDate } from '../data/leapData';
import type { Child, Milestone } from '../types';

/**
 * Derive the target date for a leap milestone template.
 * Uses the leap's sunnyDate + the template's targetOffsetWeeks grace window.
 */
function milestoneTargetDate(sunnyDate: Date, offsetWeeks: number): string {
  return format(addWeeks(sunnyDate, offsetWeeks), 'yyyy-MM-dd');
}

/**
 * Build the unique deduplication key for a given template + child combination.
 * We encode the slug in the description field so it can be matched later.
 */
function slugKey(childId: string, slug: string): string {
  return `leaps:${childId}:${slug}`;
}

/**
 * Check whether a milestone was already generated from a LEAPS template by
 * inspecting its description for the slug sentinel comment.
 */
function isLeapsMilestone(m: Milestone): boolean {
  return m.moduleId === 'leaps';
}

/**
 * Extract the slug from a LEAPS-generated milestone description.
 * Convention: description ends with `  [slug:${slug}]`
 */
function extractSlug(description: string): string | null {
  const match = /\[slug:([^\]]+)\]$/.exec(description);
  return match?.[1] ?? null;
}

export interface EnsureLeapsMilestonesOptions {
  child: Child;
  existingMilestones: Milestone[];
  userId: string;
  /** Current date — injectable for tests. Defaults to new Date(). */
  now?: Date;
}

export function ensureLeapsMilestones({
  child,
  existingMilestones,
  userId,
  now = new Date(),
}: EnsureLeapsMilestonesOptions): Milestone[] {
  // Build a set of slugs that already exist for this child so we never duplicate
  const existingSlugs = new Set<string>();
  for (const m of existingMilestones) {
    if (isLeapsMilestone(m) && m.childId === child.id) {
      const slug = extractSlug(m.description);
      if (slug) existingSlugs.add(slugKey(child.id, slug));
    }
  }

  // Predict leap timings so we can derive target dates
  const refDate = getLeapReferenceDate(child.dateOfBirth, child.dueDate);
  const predictions = predictLeaps(refDate, now);

  const created: Milestone[] = [];
  const nowIso = now.toISOString();

  for (const group of LEAPS_MILESTONE_TEMPLATES) {
    const prediction = predictions.find((p) => p.leap.number === group.leapNumber);
    if (!prediction) continue;

    for (const template of group.milestones) {
      const key = slugKey(child.id, template.slug);
      if (existingSlugs.has(key)) continue;

      const targetDate = milestoneTargetDate(prediction.sunnyDate, template.targetOffsetWeeks);

      const milestone: Milestone = {
        id: generateId(),
        childId: child.id,
        name: template.name,
        // Embed slug sentinel so future calls can detect duplicates
        description: `${template.description}  [slug:${template.slug}]`,
        category: template.category,
        moduleId: 'leaps',
        milestoneType: 'developmental',
        // IMPORTANT: always start as not_started — completion is manual only
        status: 'not_started',
        dateAchieved: null,
        targetDate,
        notes: `Auto-generated from Leap ${group.leapNumber}. Mark as achieved only when you have observed this skill.`,
        sourceRole: 'parent',
        createdBy: userId,
        createdAt: nowIso,
      };

      created.push(milestone);
    }
  }

  return created;
}

/**
 * Derive the human-readable milestone description without the slug sentinel.
 * Useful when displaying a milestone that was auto-generated.
 */
export function stripSlugSentinel(description: string): string {
  return description.replace(/\s+\[slug:[^\]]+\]$/, '');
}
