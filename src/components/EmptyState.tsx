interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      {icon && <p className="text-3xl">{icon}</p>}
      <p className="mt-2 text-sm font-semibold text-gray-700">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
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
