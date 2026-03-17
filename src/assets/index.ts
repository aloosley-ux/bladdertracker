import brandIconUrl from './brand-icon.png';
import brandWordmarkUrl from './brand-wordmark.svg';
import brandLockupHorizontalPngUrl from './brand-lockup-horizontal.png';
import brandLockupStackedUrl from './brand-lockup-stacked.svg';
import brandMonochromeMarkUrl from './brand-mark-monochrome.svg';

/**
 * Legacy flat asset map.  Prefer using `resolveAsset()` or the
 * `useThemeAsset()` hook from the new asset system instead.
 */
export const APP_ASSETS = {
  brandIcon: brandIconUrl,
  brandMark: brandIconUrl,
  brandWordmark: brandWordmarkUrl,
  brandLockupHorizontal: brandLockupHorizontalPngUrl,
  brandLockupStacked: brandLockupStackedUrl,
  brandMonochromeMark: brandMonochromeMarkUrl,
} as const;

// ── New asset system re-exports ─────────────────────────────────────
export { ASSET_REGISTRY } from './assetRegistry';
export { resolveAsset } from './assetResolver';
export type {
  AssetKey,
  AssetEntry,
  AssetRegistry,
  Theme as AssetTheme,
  BrandingAssetKey,
  NavigationAssetKey,
  ModuleIconAssetKey,
  BackgroundAssetKey,
  StateAssetKey,
  UIAssetKey,
} from './assetTypes';
export { THEMES } from './assetTypes';
