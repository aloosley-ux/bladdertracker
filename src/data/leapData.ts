/**
 * Developmental Leap Prediction Module
 *
 * Provides baby age calculation and developmental leap period predictions.
 * Leap periods are based on well-established child development research
 * showing that infants go through predictable phases of rapid neurological
 * development during the first ~20 months of life.
 *
 * Key concepts:
 * - Leaps are calculated from the *due date* (not birth date) for accuracy.
 * - Each leap has a stormy onset (fussy period) and a sunny resolution.
 * - The data is modular and easily updatable as research evolves.
 *
 * Public API:
 * - LEAP_CHART: Array of LeapDefinition objects
 * - SYMPTOM_OPTIONS: Common symptoms with emoji/icon IDs
 * - computeChildAge(birthDate, now?): Age in days/weeks/months
 * - predictLeaps(dueDate, now?): Array of LeapPrediction objects
 * - getCurrentLeap(dueDate, now?): Current active leap or null
 * - getNextLeap(dueDate, now?): Next upcoming leap or null
 */

import { differenceInDays, differenceInWeeks, differenceInMonths, addWeeks, isBefore, isAfter, isWithinInterval } from 'date-fns';

// ── Leap Definition ──────────────────────────────────────────────────
export interface LeapDefinition {
  number: number;
  /** Week from due date when the stormy (fussy) phase typically begins */
  stormyStartWeek: number;
  /** Week from due date when the leap peaks / skill emerges */
  peakWeek: number;
  /** Week from due date when the sunny phase begins (leap resolves) */
  sunnyWeek: number;
  title: string;
  description: string;
  skills: string[];
  /** Practical tips for parents during this leap */
  parentalTips: string[];
  /** External resource links for further reading */
  resourceLinks?: Array<{ label: string; url: string }>;
}

/**
 * 10 developmental leap periods.
 * Weeks are counted from the due date (gestational-age corrected).
 * Stormy phase = increased fussiness, clinginess before the leap.
 */
export const LEAP_CHART: LeapDefinition[] = [
  {
    number: 1,
    stormyStartWeek: 4,
    peakWeek: 5,
    sunnyWeek: 6,
    title: 'Changing Sensations',
    description: 'Baby becomes more aware of sensory changes in the world around them.',
    skills: ['More alert', 'Better focus', 'Smiles more'],
    parentalTips: [
      'Offer extra skin-to-skin contact for comfort.',
      'Keep the environment calm and predictable during fussy periods.',
      'Talk softly and make eye contact to stimulate new awareness.',
      'Respond quickly to cries — baby is adjusting to a whole new sensory world.',
    ],
  },
  {
    number: 2,
    stormyStartWeek: 7,
    peakWeek: 8,
    sunnyWeek: 10,
    title: 'Patterns',
    description: 'Baby starts to recognise simple patterns in sights, sounds, and movement.',
    skills: ['Discovers hands', 'Tracks objects', 'Simple patterns'],
    parentalTips: [
      'Introduce high-contrast black-and-white images for visual stimulation.',
      'Repeat simple sounds and gestures — repetition builds pattern recognition.',
      'Hang a mobile above the cot and let baby track the movement.',
      'Try gentle rhythmic movements like rocking or swaying.',
    ],
  },
  {
    number: 3,
    stormyStartWeek: 11,
    peakWeek: 12,
    sunnyWeek: 13,
    title: 'Smooth Transitions',
    description: 'Movements become smoother and more purposeful.',
    skills: ['Reaches for objects', 'Smoother head turns', 'Babbles more'],
    parentalTips: [
      'Place colourful objects just within reach to encourage deliberate grasping.',
      'Give tummy time daily to support muscle control.',
      'Respond to babbles with conversation — it encourages communication.',
      'Use a baby gym with different textures and sounds to explore.',
    ],
  },
  {
    number: 4,
    stormyStartWeek: 14,
    peakWeek: 19,
    sunnyWeek: 20,
    title: 'Events',
    description: 'Baby begins to understand short sequences of events.',
    skills: ['Grasps deliberately', 'Anticipates events', 'Cause & effect'],
    parentalTips: [
      'Introduce simple cause-and-effect toys (press a button → sound plays).',
      'Keep daily routines consistent — baby is learning to anticipate sequences.',
      'Play "peek-a-boo" to build object permanence and event expectation.',
      'Narrate daily activities: "Now we are going to bath time!"',
    ],
  },
  {
    number: 5,
    stormyStartWeek: 22,
    peakWeek: 26,
    sunnyWeek: 27,
    title: 'Relationships',
    description: 'Baby starts to understand spatial and temporal relationships.',
    skills: ['Distance awareness', 'Separation anxiety', 'Investigates objects'],
    parentalTips: [
      'Practise short separations to build trust that you always return.',
      'Let baby explore safe environments from different distances.',
      'Offer comfort objects (a soft toy or blanket) to ease anxiety.',
      'Hide toys under blankets and encourage baby to find them.',
    ],
  },
  {
    number: 6,
    stormyStartWeek: 33,
    peakWeek: 37,
    sunnyWeek: 39,
    title: 'Categories',
    description: 'Baby learns to group objects, people, and sensations into categories.',
    skills: ['Sorts objects', 'Recognises groups', 'Imitates more'],
    parentalTips: [
      'Introduce sorting toys (shapes, colours) to support categorisation.',
      'Name object groups during play: "These are all soft things."',
      'Encourage imitation games — copy their actions and let them copy yours.',
      'Read picture books together and name animals, objects, and colours.',
    ],
  },
  {
    number: 7,
    stormyStartWeek: 41,
    peakWeek: 46,
    sunnyWeek: 48,
    title: 'Sequences',
    description: 'Baby understands that things happen in a particular order.',
    skills: ['Follows routines', 'Builds/stacks', 'Multi-step actions'],
    parentalTips: [
      'Use consistent bedtime or mealtime sequences to reinforce order.',
      'Offer stacking cups or nesting toys for hands-on sequence practice.',
      'Give simple two-step instructions and celebrate when followed.',
      'Demonstrate activities step-by-step and let baby copy each stage.',
    ],
  },
  {
    number: 8,
    stormyStartWeek: 50,
    peakWeek: 55,
    sunnyWeek: 57,
    title: 'Programmes',
    description: 'Baby can carry out a "programme" — a flexible sequence of steps.',
    skills: ['Pretend play', 'Problem solving', 'More independent'],
    parentalTips: [
      'Encourage pretend play: toy kitchen, doll-feeding, or building dens.',
      'Offer simple puzzles to nurture problem-solving confidence.',
      'Allow safe independent exploration — watch from a little distance.',
      'Celebrate attempts and effort, not just outcomes.',
    ],
  },
  {
    number: 9,
    stormyStartWeek: 59,
    peakWeek: 64,
    sunnyWeek: 66,
    title: 'Principles',
    description: 'Toddler begins to understand general rules and principles.',
    skills: ['Negotiates', 'Tests boundaries', 'Plans ahead'],
    parentalTips: [
      'Set clear, consistent boundaries with calm explanations.',
      'Acknowledge feelings before redirecting behaviour.',
      'Offer limited choices to support autonomy: "red cup or blue cup?"',
      'Use visual schedules to help toddlers understand what comes next.',
    ],
  },
  {
    number: 10,
    stormyStartWeek: 70,
    peakWeek: 75,
    sunnyWeek: 77,
    title: 'Systems',
    description: 'Toddler begins to understand complex systems and adapt behaviour.',
    skills: ['Conscience emerging', 'Strategy', 'Empathy'],
    parentalTips: [
      'Model empathy — name your own feelings and acknowledge theirs.',
      'Encourage cooperative play and taking turns with others.',
      'Introduce simple role responsibilities ("your job is to put toys away").',
      'Read stories with moral themes to nurture emerging conscience.',
    ],
  },
];

// ── Symptom Options ──────────────────────────────────────────────────

export interface SymptomOption {
  id: string;
  emoji: string;
  label: string;
}

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  { id: 'clingy', emoji: '🤗', label: 'Clingy' },
  { id: 'crying', emoji: '😢', label: 'Crying more' },
  { id: 'fussy', emoji: '😤', label: 'Fussy / Cranky' },
  { id: 'sleep_trouble', emoji: '😴', label: 'Sleep trouble' },
  { id: 'appetite_change', emoji: '🍼', label: 'Appetite change' },
  { id: 'shy', emoji: '🙈', label: 'Shy with strangers' },
  { id: 'wants_cuddles', emoji: '🧸', label: 'Wants cuddles' },
  { id: 'mood_swings', emoji: '🎭', label: 'Mood swings' },
  { id: 'thumb_sucking', emoji: '👶', label: 'Self-soothing' },
  { id: 'new_skill', emoji: '⭐', label: 'New skill emerging' },
  { id: 'happy', emoji: '😊', label: 'Happy / Content' },
  { id: 'active', emoji: '🏃', label: 'Very active' },
];

// ── Age Calculation ──────────────────────────────────────────────────

export interface ChildAge {
  days: number;
  weeks: number;
  months: number;
  totalDays: number;
}

/**
 * Compute a child's current age from their birth date.
 */
export function computeChildAge(birthDate: Date, now: Date = new Date()): ChildAge {
  const totalDays = Math.max(0, differenceInDays(now, birthDate));
  return {
    days: totalDays % 7,
    weeks: differenceInWeeks(now, birthDate),
    months: differenceInMonths(now, birthDate),
    totalDays,
  };
}

// ── Leap Prediction ──────────────────────────────────────────────────

export type LeapStatus = 'past' | 'stormy' | 'current' | 'upcoming' | 'future';

export interface LeapPrediction {
  leap: LeapDefinition;
  stormyStart: Date;
  peakDate: Date;
  sunnyDate: Date;
  status: LeapStatus;
}

/**
 * Calculate the reference date for leaps. Uses due date if available,
 * otherwise falls back to birth date.
 */
export function getLeapReferenceDate(birthDate: string, dueDate?: string): Date {
  return dueDate ? new Date(dueDate) : new Date(birthDate);
}

/**
 * Predict all leap periods for a child based on their due date.
 * Returns an array of LeapPrediction objects with dates and status.
 */
export function predictLeaps(referenceDate: Date, now: Date = new Date()): LeapPrediction[] {
  return LEAP_CHART.map((leap) => {
    const stormyStart = addWeeks(referenceDate, leap.stormyStartWeek);
    const peakDate = addWeeks(referenceDate, leap.peakWeek);
    const sunnyDate = addWeeks(referenceDate, leap.sunnyWeek);

    let status: LeapStatus;
    if (isAfter(now, sunnyDate)) {
      status = 'past';
    } else if (isWithinInterval(now, { start: peakDate, end: sunnyDate })) {
      status = 'current';
    } else if (isWithinInterval(now, { start: stormyStart, end: peakDate })) {
      status = 'stormy';
    } else if (isBefore(now, stormyStart) && differenceInWeeks(stormyStart, now) <= 4) {
      status = 'upcoming';
    } else {
      status = 'future';
    }

    return { leap, stormyStart, peakDate, sunnyDate, status };
  });
}

/**
 * Get the current active leap (stormy or current phase), if any.
 */
export function getCurrentLeap(referenceDate: Date, now: Date = new Date()): LeapPrediction | null {
  const predictions = predictLeaps(referenceDate, now);
  return predictions.find((p) => p.status === 'stormy' || p.status === 'current') ?? null;
}

/**
 * Get the next upcoming leap.
 */
export function getNextLeap(referenceDate: Date, now: Date = new Date()): LeapPrediction | null {
  const predictions = predictLeaps(referenceDate, now);
  return predictions.find((p) => p.status === 'upcoming' || p.status === 'future') ?? null;
}
