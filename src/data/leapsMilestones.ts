/**
 * Leap-aligned developmental milestone definitions.
 *
 * Each entry maps to one of the 10 developmental leaps and contains a set of
 * milestone templates that are auto-generated for a child when the Leaps
 * module is initialised. Generated milestones have:
 *   - moduleId: 'leaps'   — so they can be filtered/identified as auto-generated
 *   - milestoneType: 'developmental'
 *   - status: 'not_started'   — NEVER auto-completed; only the user can mark them achieved
 *   - targetDate: calculated from the child's reference date + the leap's sunny week
 *     (the point by which the skill should have emerged)
 *
 * All targetDates are advisory, not diagnostic thresholds.  The UI always
 * presents overdue milestones calmly and with supportive guidance.
 */

import type { MilestoneCategory } from '../types';

export interface LeapMilestoneTemplate {
  /** Unique slug used to detect duplicates across re-initialisation. */
  slug: string;
  name: string;
  description: string;
  category: MilestoneCategory;
  /**
   * Week offset from the leap's sunnyDate at which the target date is set.
   * 0 = sunnyDate, positive = weeks after sunnyDate.
   * This allows a small grace window beyond the sunny week.
   */
  targetOffsetWeeks: number;
}

export interface LeapMilestoneGroup {
  leapNumber: number;
  milestones: LeapMilestoneTemplate[];
}

/**
 * Standard developmental milestone templates for each leap.
 * These are inspired by widely-used developmental frameworks (CDC, NHS Start
 * for Life, EYFS) and are suitable as a starting checklist — not a clinical
 * assessment tool.
 */
export const LEAPS_MILESTONE_TEMPLATES: LeapMilestoneGroup[] = [
  {
    leapNumber: 1,
    milestones: [
      {
        slug: 'leap1-alert-focus',
        name: 'More alert and focuses on faces',
        description: 'Baby is more wakeful and can hold their gaze on a caregiver\'s face for several seconds.',
        category: 'cognitive',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap1-smiles-responsively',
        name: 'First social smile',
        description: 'Baby smiles in response to a caregiver\'s face or voice (not just wind).',
        category: 'social',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap1-reacts-sounds',
        name: 'Reacts to sounds',
        description: 'Baby startles or turns towards a familiar voice or sudden noise.',
        category: 'sensory',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 2,
    milestones: [
      {
        slug: 'leap2-tracks-object',
        name: 'Tracks a moving object with eyes',
        description: 'Baby smoothly follows a slowly moving toy or face across their field of vision.',
        category: 'motor',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap2-discovers-hands',
        name: 'Discovers own hands',
        description: 'Baby stares at their hands or brings them together in front of their face.',
        category: 'cognitive',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap2-patterns-response',
        name: 'Responds to rhythmic patterns',
        description: 'Baby calms or becomes alert in response to repeated sounds or rhythmic movement.',
        category: 'sensory',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 3,
    milestones: [
      {
        slug: 'leap3-reaches-grasps',
        name: 'Reaches for and grasps objects',
        description: 'Baby deliberately reaches towards a toy and attempts to grab it.',
        category: 'motor',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap3-babbles',
        name: 'Babbles with vowel sounds',
        description: 'Baby makes repeated vowel sounds like "ah", "oh", "uh" in a conversational turn-taking way.',
        category: 'speech',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap3-head-control',
        name: 'Holds head steady and upright',
        description: 'Baby can hold their head steady when held in a sitting position.',
        category: 'motor',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 4,
    milestones: [
      {
        slug: 'leap4-cause-effect',
        name: 'Understands cause and effect',
        description: 'Baby repeats an action that produced an interesting result (e.g. shaking a rattle, pressing a button).',
        category: 'cognitive',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap4-rolls-over',
        name: 'Rolls from tummy to back',
        description: 'Baby can roll over in at least one direction independently.',
        category: 'motor',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap4-anticipates-events',
        name: 'Anticipates familiar routines',
        description: 'Baby shows excitement or recognition when a familiar routine (feed, bath) begins — e.g. opens mouth, kicks legs.',
        category: 'cognitive',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 5,
    milestones: [
      {
        slug: 'leap5-separation-awareness',
        name: 'Shows awareness of strangers or separation',
        description: 'Baby shows increased caution with unfamiliar people and prefers familiar caregivers.',
        category: 'social',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap5-sits-briefly',
        name: 'Sits briefly with support',
        description: 'Baby can sit upright for several seconds when propped or with light support.',
        category: 'motor',
        targetOffsetWeeks: 1,
      },
      {
        slug: 'leap5-investigates-objects',
        name: 'Investigates objects by mouthing and inspecting',
        description: 'Baby systematically examines objects — turning them, banging them, mouthing them — to explore properties.',
        category: 'cognitive',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 6,
    milestones: [
      {
        slug: 'leap6-sorts-objects',
        name: 'Sorts or groups objects by shape or size',
        description: 'Baby begins to sort objects into rough categories (e.g. prefers similar shapes together in play).',
        category: 'cognitive',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap6-imitates-actions',
        name: 'Imitates simple actions',
        description: 'Baby copies simple actions like clapping, waving, or banging objects after seeing a caregiver do them.',
        category: 'social',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap6-sits-unaided',
        name: 'Sits unaided',
        description: 'Baby can sit stably without support for more than a moment.',
        category: 'motor',
        targetOffsetWeeks: 1,
      },
    ],
  },
  {
    leapNumber: 7,
    milestones: [
      {
        slug: 'leap7-stands-holding',
        name: 'Pulls to stand holding furniture',
        description: 'Baby pulls themselves to a standing position using furniture or a caregiver\'s hands.',
        category: 'motor',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap7-follows-routine-steps',
        name: 'Follows simple two-step routine',
        description: 'Baby participates in a two-step sequence (e.g. arms up to be lifted, then reaches for item).',
        category: 'routine',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap7-first-words',
        name: 'Uses a first recognisable word or sound',
        description: 'Baby uses a consistent sound or approximation to refer to a specific person, object, or action (e.g. "mama", "da", "more").',
        category: 'speech',
        targetOffsetWeeks: 2,
      },
    ],
  },
  {
    leapNumber: 8,
    milestones: [
      {
        slug: 'leap8-pretend-play',
        name: 'Engages in simple pretend play',
        description: 'Toddler pretends to perform familiar actions (e.g. feeding a doll, talking on a toy phone).',
        category: 'cognitive',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap8-walks-independently',
        name: 'Takes independent steps',
        description: 'Toddler walks a few steps without holding on.',
        category: 'motor',
        targetOffsetWeeks: 3,
      },
      {
        slug: 'leap8-solves-simple-problem',
        name: 'Solves a simple problem independently',
        description: 'Toddler tries different approaches to get a desired outcome (e.g. moves an obstacle, tries a different way).',
        category: 'cognitive',
        targetOffsetWeeks: 2,
      },
    ],
  },
  {
    leapNumber: 9,
    milestones: [
      {
        slug: 'leap9-tests-boundaries',
        name: 'Tests boundaries and negotiates',
        description: 'Toddler says "no", tests rules, and tries to negotiate outcomes — a sign of growing self-awareness.',
        category: 'social',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap9-two-word-phrases',
        name: 'Uses two-word phrases',
        description: 'Toddler combines two words meaningfully (e.g. "more milk", "daddy go", "big dog").',
        category: 'speech',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap9-uses-visual-schedule',
        name: 'Responds to a simple visual or verbal schedule',
        description: 'Toddler demonstrates understanding of what comes next in a routine when shown a picture or told clearly.',
        category: 'routine',
        targetOffsetWeeks: 2,
      },
    ],
  },
  {
    leapNumber: 10,
    milestones: [
      {
        slug: 'leap10-empathy-emerging',
        name: 'Shows empathy or concern for others',
        description: 'Toddler responds to another person\'s distress (e.g. offers a toy, hugs, says "okay?").',
        category: 'social',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap10-cooperative-turn-taking',
        name: 'Engages in cooperative turn-taking',
        description: 'Toddler waits for and takes turns in a simple game or conversation.',
        category: 'social',
        targetOffsetWeeks: 2,
      },
      {
        slug: 'leap10-simple-responsibility',
        name: 'Carries out a simple responsibility',
        description: 'Toddler accepts and can complete a simple, consistent task (e.g. puts shoes by the door, tidies one toy).',
        category: 'self_care',
        targetOffsetWeeks: 2,
      },
    ],
  },
];
