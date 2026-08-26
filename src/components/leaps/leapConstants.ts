import type { LeapStatus } from '../../data/leapData';

export const STATUS_COLOURS: Record<LeapStatus, string> = {
  past: 'bg-gray-100 text-gray-600 border-gray-200',
  stormy: 'bg-amber-100 text-amber-800 border-amber-300',
  current: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  upcoming: 'bg-sky-100 text-sky-800 border-sky-300',
  future: 'bg-violet-50 text-violet-700 border-violet-200',
};

export const STATUS_LABELS: Record<LeapStatus, string> = {
  past: 'Completed',
  stormy: '⛈️ Stormy phase',
  current: '🌟 In progress',
  upcoming: '🔜 Coming soon',
  future: 'Future',
};

export const MOOD_OPTIONS = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'hard', emoji: '😣', label: 'Hard day' },
  { id: 'rough', emoji: '😢', label: 'Rough' },
];
