import brandIconUrl from '../assets/brand-icon.svg';

interface BrandIconProps {
  /** Size in pixels (width = height). Defaults to 56. */
  size?: number;
  className?: string;
}

/**
 * Reusable brand/logo icon component.
 * Swap the logo by replacing /src/assets/brand-icon.svg.
 */
export default function BrandIcon({ size = 56, className = '' }: BrandIconProps) {
  return (
    <img
      src={brandIconUrl}
      alt="BladderTracker app logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
