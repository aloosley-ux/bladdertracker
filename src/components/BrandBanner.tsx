import brandIconUrl from '../assets/brand-icon.svg';

/**
 * Full-width banner logo for the top of every main page.
 *
 * Swap `/src/assets/brand-icon.svg` to refresh the brand image app-wide.
 */
export default function BrandBanner() {
  return (
    <div className="flex justify-center px-4 pt-4 pb-1">
      <img
        src={brandIconUrl}
        alt="BladderTracker mascot logo"
        className="h-[100px] w-auto max-w-full object-contain sm:h-[120px]"
        draggable={false}
      />
    </div>
  );
}
