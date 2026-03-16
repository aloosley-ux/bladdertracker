import { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { useThemeAsset } from '../hooks/useThemeAsset';
import type { AssetKey } from '../assets/assetTypes';

interface EntryCardProps {
  icon?: ReactNode;
  /** Semantic asset key for a custom icon (takes priority over `icon`). */
  iconAsset?: AssetKey;
  title: string;
  subtitle?: string;
  time?: string;
  color?: string;
  /** Semantic asset key for a card background image. */
  backgroundAsset?: AssetKey;
  onDelete?: () => void;
  entryType?: string;
  entryData?: unknown;
  children?: ReactNode;
  className?: string;
}

export default function EntryCard({
  icon,
  iconAsset,
  title,
  subtitle,
  time,
  color = '',
  backgroundAsset,
  onDelete,
  entryType,
  entryData,
  children,
  className,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((s) => !s);
  const bgUrl = useThemeAsset(backgroundAsset);
  const iconUrl = useThemeAsset(iconAsset);

  return (
    <article
      data-entry-type={entryType ?? ''}
      className={clsx(
        color,
        'rounded-2xl p-3 flex items-start gap-3 relative group overflow-hidden',
        className,
      )}
      style={
        bgUrl
          ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shadow-sm shrink-0">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="w-5 h-5 object-contain" draggable={false} />
        ) : (
          icon
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <button onClick={toggle} className="text-left flex-1" aria-expanded={expanded}>
            <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">{title}</h4>
            {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{subtitle}</p>}
          </button>

          <div className="ml-3 flex-shrink-0">
            <span className="text-xs text-[var(--text-secondary)]">{time}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-3">
            {children}
            {/* If entryData is provided but no children, show a small JSON summary */}
            {!children && entryData !== undefined && entryData !== null && (
              <pre className="text-xs text-[var(--text-secondary)] mt-2 whitespace-pre-wrap">
                {JSON.stringify(entryData, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-400 transition-all text-xs"
          aria-label="Delete entry"
        >
          ✕
        </button>
      )}
    </article>
  );
}
