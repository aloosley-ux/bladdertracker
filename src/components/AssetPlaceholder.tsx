/**
 * AssetPlaceholder — a descriptive placeholder for missing UI assets.
 *
 * Used to indicate where a designed asset (icon, illustration, mascot, etc.)
 * should be placed once provided by the design/brand team.
 *
 * Asset handoff instructions:
 * 1. Supply the final asset at the path specified by `src`.
 * 2. Ensure the asset is accessible (has meaningful `alt` text).
 * 3. Remove the placeholder shell once the real asset renders.
 *
 * Issues addressed:
 * #18 UI Asset Checklist, #19 Mascot & Logo, #20 Tracker & Entry Icons,
 * #21 Calendar/Cards/Backgrounds, #22 Charts & Data Visualizations,
 * #23 Navigation Bar Icons, #24 Supplementary UI Controls,
 * #25 Brand/Illustration Moments, #26 Accessibility Variants,
 * #27 README/Guides Documentation
 */
export interface AssetPlaceholderProps {
  /** Target asset path (relative to /public/assets/) */
  src: string;
  /** Descriptive alt text for accessibility */
  alt: string;
  /** Visual width (CSS value, e.g. '64px', '100%') */
  width?: string | number;
  /** Visual height (CSS value) */
  height?: string | number;
  /** Optional Tailwind className overrides */
  className?: string;
  /** Issue number(s) this asset belongs to */
  issueRef?: string;
}

/**
 * Renders the real asset if it loads; otherwise shows a styled placeholder
 * with the descriptive alt text, file path, and issue reference.
 */
export default function AssetPlaceholder({
  src,
  alt,
  width = 64,
  height = 64,
  className = '',
  issueRef,
}: AssetPlaceholderProps) {
  const fullSrc = src.startsWith('/') ? src : `/assets/${src}`;

  return (
    <span
      className={`inline-flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-lavender-300 bg-lavender-50 text-center ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
      title={`Asset placeholder — ${alt}${issueRef ? ` (Issue #${issueRef})` : ''}`}
      aria-label={alt}
      role="img"
    >
      {/* Placeholder image — replace src with real asset when available */}
      <img
        src={fullSrc}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        className="object-contain w-full h-full"
        onError={(e) => {
          // Hide broken image and show fallback text
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback shown when asset is not yet available */}
      <span
        className="hidden flex-col items-center justify-center gap-0.5 p-1 w-full h-full"
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-lavender-400 leading-tight">🖼️</span>
        <span className="text-[9px] text-lavender-500 font-medium leading-tight break-all px-1 text-center">{fullSrc}</span>
        {issueRef && (
          <span className="text-[8px] text-lavender-400">#{issueRef}</span>
        )}
      </span>
    </span>
  );
}
