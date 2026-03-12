import { APP_ASSETS } from '../assets';
import { BRAND } from '../content/presentation';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived from the SVG viewBox. Defaults to 140.
   *
   * Replace /src/assets/brand-mark.svg to swap the brand mark app-wide.
   */
  width?: number;
  className?: string;
}

export default function BrandIcon({ width = 140, className = '' }: BrandIconProps) {
  return (
    <img
      src={APP_ASSETS.brandIcon}
      alt={BRAND.logoAlt}
      width={width}
      className={className ? `h-auto ${className}` : 'h-auto'}
      draggable={false}
    />
  );
}
