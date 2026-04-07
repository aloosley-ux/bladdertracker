import { BRAND } from '../content/presentation';
import AssetImage from './AssetImage';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived automatically. Defaults to 140.
   *
   * To swap the brand mark app-wide, either:
   * - replace `src/assets/brand-icon.png` (and the `-dark` / `-hc` variants), or
   * - add themed variants in `src/assets/themes/<theme>/` and update
   *   the `brandMark` entry in `src/assets/assetRegistry.ts`.
   */
  width?: number;
  className?: string;
}

// BrandIcon — themed brand mark image used in login and onboarding screens.
export default function BrandIcon({ width = 140, className = '' }: BrandIconProps) {
  return (
    <AssetImage
      assetKey="brandMark"
      alt={BRAND.logoAlt}
      width={width}
      className={className ? `h-auto ${className}` : 'h-auto'}
    />
  );
}
