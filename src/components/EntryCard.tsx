import type { ReactNode } from 'react';

interface EntryCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  time: string;
  color?: string;
  onDelete?: () => void;
  children?: ReactNode;
}

export default function EntryCard({ icon, title, subtitle, time, color = 'bg-lavender-50', onDelete, children }: EntryCardProps) {
  return (
    <div className={`${color} rounded-2xl p-4 flex items-start gap-3 relative group`}>
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-gray-800 truncate">{title}</h4>
          <span className="text-xs text-gray-400 shrink-0 ml-2">{time}</span>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        {children}
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
    </div>
  );
}
