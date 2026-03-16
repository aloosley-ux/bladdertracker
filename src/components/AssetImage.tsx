/**
 * Theme-aware image component with graceful fallback.
 *
 * Renders an `<img>` from the asset registry when a matching asset
 * exists for the current theme.  When no asset is registered (or the
 * image fails to load), it renders the `fallback` React node instead
 * — typically an emoji, a lucide icon, or a CSS-styled placeholder.
 *
 * Usage:
 *   <AssetImage
 *     assetKey="stateEmpty"
 *     alt="No entries yet"
 *     fallback={<span className="text-3xl">📭</span>}
 *     className="h-24 w-24"
 *   />
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useThemeAsset } from '../hooks/useThemeAsset';
import type { AssetKey } from '../assets/assetTypes';

interface AssetImageProps {
  /** Semantic asset key from the registry. */
  assetKey: AssetKey;
  /** Accessible alt text (empty string for purely decorative images). */
  alt: string;
  /** Rendered when the asset is missing or fails to load. */
  fallback?: ReactNode;
  /** Additional CSS classes on the `<img>` element. */
  className?: string;
  /** Image width attribute. */
  width?: number | string;
  /** Image height attribute. */
  height?: number | string;
  /** Whether the image is purely decorative (`role="presentation"`). */
  decorative?: boolean;
}

export default function AssetImage({
  assetKey,
  alt,
  fallback = null,
  className = '',
  width,
  height,
  decorative = false,
}: AssetImageProps) {
  const url = useThemeAsset(assetKey);
  const [loadError, setLoadError] = useState(false);

  // No asset registered or previous load failed → show fallback
  if (!url || loadError) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={url}
      alt={decorative ? '' : alt}
      role={decorative ? 'presentation' : undefined}
      aria-hidden={decorative ? true : undefined}
      className={className}
      width={width}
      height={height}
      draggable={false}
      onError={() => setLoadError(true)}
    />
  );
}
