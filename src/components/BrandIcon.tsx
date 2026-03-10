import brandIconUrl from '../assets/brand-icon.svg';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived from the SVG viewBox. Defaults to 140.
   *
   * Replace /src/assets/brand-icon.svg to swap the brand image app-wide.
   */
  width?: number;
  className?: string;
}

export default function BrandIcon({ width = 140, className = '' }: BrandIconProps) {
  return (
    <img
      src={brandIconUrl}
      alt="BladderTracker app logo"
      width={width}
      className={`h-auto ${className}`.trim()}
      draggable={false}
    />
  );
}
