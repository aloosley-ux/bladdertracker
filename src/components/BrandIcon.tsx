import brandIconUrl from '../assets/brand-icon.svg';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived automatically from the logo's
   * native 520 × 410 aspect ratio. Defaults to 140.
   *
   * Swap the brand image by replacing /src/assets/brand-icon.svg.
   */
  width?: number;
  className?: string;
}

export default function BrandIcon({ width = 140, className = '' }: BrandIconProps) {
  // Native viewBox is 520 × 410
  const height = Math.round((width * 410) / 520);
  return (
    <img
      src={brandIconUrl}
      alt="BladderTracker app logo"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  );
}
