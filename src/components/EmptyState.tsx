import AssetImage from './AssetImage';
import type { AssetKey } from '../assets/assetTypes';

interface EmptyStateProps {
  /** Emoji string rendered as a large icon (existing behaviour). */
  icon?: string;
  /** Semantic asset key for a themed empty-state illustration. */
  illustrationAsset?: AssetKey;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  illustrationAsset,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      {/* Illustration asset takes precedence over emoji icon */}
      {illustrationAsset ? (
        <AssetImage
          assetKey={illustrationAsset}
          alt={title}
          className="mx-auto mb-2 h-24 w-24 object-contain"
          fallback={icon ? <p className="text-3xl">{icon}</p> : null}
        />
      ) : (
        icon && <p className="text-3xl">{icon}</p>
      )}
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--text-secondary)]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-full bg-lavender-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-lavender-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
