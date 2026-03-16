/**
 * Asset-ready page shell component.
 *
 * Wraps page content with an optional hero/header background asset
 * and consistent padding.  When a `heroAssetKey` is provided and a
 * matching asset exists in the registry, it renders the image behind
 * the hero content.  Otherwise, the default CSS background shows through.
 *
 * Usage:
 *   <PageShell heroAssetKey="pageDashboardHero" heroAlt="Dashboard">
 *     <h1>Dashboard</h1>
 *     ...
 *   </PageShell>
 */
import type { ReactNode } from 'react';
import AssetImage from './AssetImage';
import type { AssetKey } from '../assets/assetTypes';

interface PageShellProps {
  /** Semantic key for a hero/header background asset. */
  heroAssetKey?: AssetKey;
  /** Alt text for the hero image (empty for decorative). */
  heroAlt?: string;
  /** Content rendered on top of the hero area. */
  heroContent?: ReactNode;
  /** Additional class names on the outer wrapper. */
  className?: string;
  /** Page children rendered below the hero. */
  children: ReactNode;
}

export default function PageShell({
  heroAssetKey,
  heroAlt = '',
  heroContent,
  className = '',
  children,
}: PageShellProps) {
  const hasHeroSlot = heroAssetKey !== undefined;

  return (
    <div className={className}>
      {hasHeroSlot && (
        <div className="relative overflow-hidden">
          {/* Background asset layer */}
          <AssetImage
            assetKey={heroAssetKey}
            alt={heroAlt}
            decorative
            className="absolute inset-0 h-full w-full object-cover"
            fallback={null}
          />
          {/* Overlay for readability on top of background asset */}
          <div className="relative z-10">
            {heroContent}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
