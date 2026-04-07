import { useState } from 'react';
import type { ReactNode } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpPanelProps {
  title: string;
  children: ReactNode;
}

// HelpPanel — collapsible help guide panel with aria-expanded toggle.
export default function HelpPanel({ title, children }: HelpPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-lavender-600 hover:text-lavender-700 transition"
        aria-expanded={open}
        aria-label={`${open ? 'Hide' : 'Show'} help for ${title}`}
      >
        <HelpCircle size={14} />
        {open ? 'Hide guide' : 'How to use this tracker'}
      </button>

      {open && (
        <div
          role="region"
          aria-label={`Help: ${title}`}
          className="mt-2 rounded-2xl bg-lavender-50 p-4 text-xs text-lavender-900 ring-1 ring-lavender-100 relative"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 text-lavender-400 hover:text-lavender-600"
            aria-label="Close help panel"
          >
            <X size={14} />
          </button>
          <p className="font-semibold text-lavender-800 mb-2">📖 {title}</p>
          <div className="space-y-1.5">{children}</div>
        </div>
      )}
    </div>
  );
}
