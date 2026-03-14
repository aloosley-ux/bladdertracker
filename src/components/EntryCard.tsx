import { useState } from 'react';
import type { ReactNode } from 'react';

interface EntryCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  time: string;
  color?: string;
  onDelete?: () => void;
  children?: ReactNode;
  entryType?: string;
  entryData?: Record<string, unknown>;
}

export default function EntryCard({ icon, title, subtitle, time, color = 'bg-lavender-50', onDelete, children, entryType, entryData }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    // Avoid toggling when clicking the delete button
    const target = e.target as HTMLElement;
    if (target.closest('button') && target.getAttribute('aria-label') === 'Delete entry') return;
    setExpanded((s: boolean) => !s);
  };

  return (
    <div data-entry-type={entryType ?? ''} className={`${color} rounded-2xl p-4 flex items-start gap-3 relative group`}>
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <button onClick={toggle} className="text-left flex-1" aria-expanded={expanded}>
            <h4 className="font-semibold text-sm text-gray-800 truncate">{title}</h4>
            <span className="text-xs text-gray-400 shrink-0 ml-2">{time}</span>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
          </button>
        </div>
        {expanded && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs"
          aria-label="Delete entry"
        >
          ✕
        </button>
      )}
      {/* If entryData is provided but no children, show a small JSON summary when expanded */}
      {expanded && !children && entryData && (
        <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">{JSON.stringify(entryData, null, 2)}</pre>
      )}
    </div>
  );
}
