import { useState, type ReactNode } from 'react';
import { Sparkles, X } from 'lucide-react';

type CelebrationTone = 'lavender' | 'emerald' | 'sky';

const TONE_STYLES: Record<CelebrationTone, string> = {
  lavender: 'border-lavender-200 bg-lavender-50 text-lavender-900',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  sky: 'border-sky-200 bg-sky-50 text-sky-900',
};

export default function CelebrationBanner({
  emoji,
  title,
  message,
  tone = 'lavender',
  action,
  dismissible = false,
}: {
  emoji: string;
  title: string;
  message: string;
  tone?: CelebrationTone;
  action?: ReactNode;
  dismissible?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <section className={`rounded-3xl border p-4 shadow-sm ${TONE_STYLES[tone]}`} aria-label={title}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-2xl" aria-hidden="true">{emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="shrink-0" />
            <h2 className="text-sm font-semibold">{title}</h2>
          </div>
          <p className="mt-1 text-sm leading-relaxed opacity-90">{message}</p>
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-full p-1 opacity-60 transition hover:opacity-100"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </section>
  );
}
