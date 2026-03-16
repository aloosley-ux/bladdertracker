import { BRAND } from '../content/presentation';
import AssetImage from './AssetImage';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived from the SVG viewBox. Defaults to 140.
   *
   * To swap the brand mark app-wide, either:
   * - replace `src/assets/brand-mark.svg`, or
   * - add themed variants in `src/assets/themes/<theme>/` and update
   *   the `brandMark` entry in `src/assets/assetRegistry.ts`.
   */
  width?: number;
  className?: string;
}

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
