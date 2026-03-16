import { BRAND } from '../content/presentation';
import AssetImage from './AssetImage';

/**
 * Full-width banner logo for the top of every main page.
 *
 * To refresh the brand banner:
 * - replace `src/assets/brand-lockup-horizontal.svg`, or
 * - add themed variants and update `brandLockupHorizontal` in the asset registry.
 */
export default function BrandBanner() {
  return (
    <div className="flex justify-center px-4 pt-4 pb-1">
      <AssetImage
        assetKey="brandLockupHorizontal"
        alt={BRAND.bannerAlt}
        className="h-[100px] w-auto max-w-full object-contain sm:h-[120px]"
      />
    </div>
  );
}
