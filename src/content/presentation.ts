import { DEFAULT_MODULES } from '../types';
import type { ModuleId, ToiletAttemptOutcome, UserRole } from '../types';

export const BRAND = {
  name: 'BladderTracker',
  tagline: 'Calm tracking for families and care teams',
  heroTitle: 'Calm, one-handed tracking for families and care teams',
  logoAlt: 'BladderTracker logo',
  bannerAlt: 'BladderTracker brand mark',
} as const;

type ModulePresentation = {
  label: string;
  shortLabel: string;
  quickActionLabel: string;
  reportLabel: string;
  summaryLabel: string;
  description: string;
};

const MODULE_OVERRIDES: Record<ModuleId, Partial<ModulePresentation>> = {
  drinks: {
    shortLabel: 'Drink',
    quickActionLabel: 'Drink',
    reportLabel: 'Drinks',
    summaryLabel: 'Drinks',
  },
  urine: {
    label: 'Wee',
    shortLabel: 'Wee',
    quickActionLabel: 'Wee',
    reportLabel: 'Wee',
    summaryLabel: 'Wees',
    description: 'Log wees, wet clothes, and urgency',
  },
  bowel: {
    label: 'Poo',
    shortLabel: 'Poo',
    quickActionLabel: 'Poo',
    reportLabel: 'Poo',
    summaryLabel: 'Poo',
    description: 'Track poos and stool consistency',
  },
  sleep: {
    shortLabel: 'Sleep',
    quickActionLabel: 'Sleep',
    reportLabel: 'Sleep',
    summaryLabel: 'Sleep',
  },
  toilet: {
    label: 'Toilet visits',
    shortLabel: 'Toilet',
    quickActionLabel: 'Visit',
    reportLabel: 'Toilet visits',
    summaryLabel: 'Visits',
    description: 'Track toilet sits, prompts, and outcomes',
  },
  food: {
    label: 'Meals',
    shortLabel: 'Meals',
    quickActionLabel: 'Meal',
    reportLabel: 'Meals',
    summaryLabel: 'Meals',
    description: 'Track meals, snacks, and new foods',
  },
  mood: {
    shortLabel: 'Mood',
    quickActionLabel: 'Mood',
    reportLabel: 'Mood',
    summaryLabel: 'Mood',
  },
  sensory: {
    shortLabel: 'Sensory',
    quickActionLabel: 'Sensory',
    reportLabel: 'Sensory',
    summaryLabel: 'Sensory',
  },
  medication: {
    shortLabel: 'Meds',
    quickActionLabel: 'Meds',
    reportLabel: 'Medication',
    summaryLabel: 'Meds',
  },
  therapy: {
    shortLabel: 'Therapy',
    quickActionLabel: 'Therapy',
    reportLabel: 'Therapy',
    summaryLabel: 'Therapy',
  },
  routine: {
    label: 'Routines',
    shortLabel: 'Routine',
    quickActionLabel: 'Routine',
    reportLabel: 'Routines',
    summaryLabel: 'Routine',
    description: 'Track routines and what helped',
  },
  milestones: {
    shortLabel: 'Milestones',
    quickActionLabel: 'Milestone',
    reportLabel: 'Milestones',
    summaryLabel: 'Milestones',
  },
  leaps: {
    shortLabel: 'Leaps',
    quickActionLabel: 'Leap',
    reportLabel: 'Leaps',
    summaryLabel: 'Leaps',
  },
};

export const MODULE_PRESENTATION = DEFAULT_MODULES.reduce((acc, module) => {
  acc[module.id] = {
    label: module.label,
    shortLabel: module.label,
    quickActionLabel: module.label,
    reportLabel: module.label,
    summaryLabel: module.label,
    description: module.description,
    ...MODULE_OVERRIDES[module.id],
  };
  return acc;
}, {} as Record<ModuleId, ModulePresentation>);

export function getModulePresentation(id: ModuleId) {
  return MODULE_PRESENTATION[id];
}

export function getModuleLabel(
  id: ModuleId,
  variant: 'default' | 'short' | 'quickAction' | 'report' | 'summary' = 'default',
) {
  const module = getModulePresentation(id);

  if (variant === 'short') return module.shortLabel;
  if (variant === 'quickAction') return module.quickActionLabel;
  if (variant === 'report') return module.reportLabel;
  if (variant === 'summary') return module.summaryLabel;
  return module.label;
}

export const URINE_COPY = {
  heading: 'Log a wee',
  helpTitle: 'Logging a wee',
  eventLabel: 'What happened',
  wetLabel: 'Wet clothes',
  passLabel: 'Used toilet',
  volumeLabel: 'Measured amount (ml)',
  volumePlaceholder: 'Measured amount in ml',
  urgencyLabel: 'Need to go',
  leakageLabel: 'Leaks',
  submitLabel: 'Save wee log',
} as const;

export const BRISTOL_GUIDANCE_TEXT =
  'Types 3–4 are usually the most comfortable. Types 1–2 can suggest stools are firm or hard to pass. Types 5–7 can suggest stools are loose.';

export const TOILET_OUTCOME_LABELS: Record<ToiletAttemptOutcome, string> = {
  success: 'Successful',
  failure: 'No result',
  no_event: 'Not ready',
};

export function getRoleLabel(role: UserRole) {
  if (role === 'schoolAdmin') return 'School staff';
  if (role === 'therapist') return 'Therapist';
  if (role === 'specialist') return 'Specialist';
  if (role === 'admin') return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export type CelebrationContent = {
  emoji: string;
  title: string;
  message: string;
  tone?: 'lavender' | 'emerald' | 'sky';
};

export function getDashboardCelebration(entryCount: number, milestoneCount: number, childName: string): CelebrationContent {
  if (milestoneCount > 0) {
    return {
      emoji: '⭐',
      title: 'A lovely step forward today',
      message: `${childName} has ${milestoneCount} milestone update${milestoneCount === 1 ? '' : 's'} today. Capturing progress like this can make care conversations easier.`,
      tone: 'emerald',
    };
  }

  if (entryCount >= 6) {
    return {
      emoji: '🌿',
      title: 'You already have a strong picture of today',
      message: `${entryCount} moments have been logged so far. That kind of steady tracking can make patterns easier to spot later.`,
      tone: 'lavender',
    };
  }

  if (entryCount >= 1) {
    return {
      emoji: '🤍',
      title: 'Small updates still count',
      message: `You have logged ${entryCount} update${entryCount === 1 ? '' : 's'} today. Even one quick note can be useful when you look back.`,
      tone: 'sky',
    };
  }

  return {
    emoji: '☕',
    title: 'Start with one quick note',
    message: 'A single update is enough to begin. The quickest logs are shown below so you can capture what matters without extra taps.',
    tone: 'lavender',
  };
}

export const MILESTONE_SAVE_CELEBRATION: CelebrationContent = {
  emoji: '✨',
  title: 'Milestone saved',
  message: 'Nice work capturing progress. Keeping milestones in one place can make reviews feel calmer and clearer.',
  tone: 'lavender',
};

export const MILESTONE_ACHIEVED_CELEBRATION: CelebrationContent = {
  emoji: '🎉',
  title: 'Milestone reached',
  message: 'A thoughtful moment to celebrate. Progress can look different for every child, and logging it helps you keep the bigger picture.',
  tone: 'emerald',
};

export const HELP_COPY = {
  bristolAnswer:
    'The Bristol stool chart is a simple way to describe poo by shape and consistency. It can help families and clinicians talk about bowel changes using the same language.',
} as const;
