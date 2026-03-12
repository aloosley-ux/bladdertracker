import { APP_ASSETS } from '../assets';
import { BRAND } from '../content/presentation';

/**
 * Full-width banner logo for the top of every main page.
 *
 * Swap `/src/assets/brand-lockup-horizontal.svg` to refresh the brand banner app-wide.
 */
export default function BrandBanner() {
  return (
    <div className="flex justify-center px-4 pt-4 pb-1">
      <img
        src={APP_ASSETS.brandLockupHorizontal}
        alt={BRAND.bannerAlt}
        className="h-[100px] w-auto max-w-full object-contain sm:h-[120px]"
        draggable={false}
      />
    </div>
  );
}
