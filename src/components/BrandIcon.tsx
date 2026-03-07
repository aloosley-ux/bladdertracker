import brandIconUrl from '../assets/brand-icon.svg';

interface BrandIconProps {
  /**
   * Width in pixels. Height is derived from the logo's native 420×370
   * aspect ratio (~1.14:1). Defaults to 140.
   *
   * Replace /src/assets/brand-icon.svg to swap the brand image app-wide.
   */
  width?: number;
  className?: string;
}

/** Native dimensions of brand-icon.svg viewBox */
const LOGO_WIDTH = 420;
const LOGO_HEIGHT = 370;

export default function BrandIcon({ width = 140, className = '' }: BrandIconProps) {
  const height = Math.round((width * LOGO_HEIGHT) / LOGO_WIDTH);
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
