/**
 * Central asset registry – the single source of truth that maps semantic
 * asset keys to concrete file URLs per theme.
 *
 * HOW TO ADD OR REPLACE AN ASSET
 * ──────────────────────────────
 * 1. Drop the file into `src/assets/themes/<theme>/` (or a shared location).
 * 2. Import the file in this module.
 * 3. Set the relevant key + theme in the `ASSET_REGISTRY` object below.
 *
 * The resolver (`assetResolver.ts`) will pick up the change automatically.
 * Components that use `useThemeAsset()` or `resolveAsset()` will render the
 * updated file with no further changes required.
 *
 * FALLBACK ORDER
 * ──────────────
 * theme-specific → light → undefined (component renders its CSS fallback)
 */
import type { AssetRegistry } from './assetTypes';

// ── Brand SVG imports (shared across themes) ────────────────────────
import brandMarkUrl from './brand-mark.svg';
import brandWordmarkUrl from './brand-wordmark.svg';
import brandLockupHorizontalUrl from './brand-lockup-horizontal.svg';
import brandLockupStackedUrl from './brand-lockup-stacked.svg';
import brandMonochromeMarkUrl from './brand-mark-monochrome.svg';

/**
 * Master asset registry.
 *
 * Keys are **semantic** – they describe what the asset is *for*, not which
 * file provides it.  Each key maps to an `AssetEntry` with optional
 * per-theme URLs.
 *
 * When a theme-specific value is absent the resolver falls back through:
 *   requested theme → 'light' → undefined
 */
export const ASSET_REGISTRY: AssetRegistry = {
  // ── Branding ──────────────────────────────────────────────────────
  brandMark: {
    light: brandMarkUrl,
    dark: brandMarkUrl,
    'high-contrast': brandMonochromeMarkUrl,
  },
  brandWordmark: {
    light: brandWordmarkUrl,
    dark: brandWordmarkUrl,
    'high-contrast': brandWordmarkUrl,
  },
  brandLockupHorizontal: {
    light: brandLockupHorizontalUrl,
    dark: brandLockupHorizontalUrl,
    'high-contrast': brandLockupHorizontalUrl,
  },
  brandLockupStacked: {
    light: brandLockupStackedUrl,
    dark: brandLockupStackedUrl,
    'high-contrast': brandLockupStackedUrl,
  },
  brandMonochromeMark: {
    light: brandMonochromeMarkUrl,
    dark: brandMonochromeMarkUrl,
    'high-contrast': brandMonochromeMarkUrl,
  },

  // ── Navigation icons ──────────────────────────────────────────────
  // Currently served by lucide-react.  To replace with custom assets,
  // import themed SVG/PNG files and add them here:
  //
  // navDashboard: { light: dashboardLightUrl, dark: dashboardDarkUrl },
  // navDiary: { light: diaryLightUrl, dark: diaryDarkUrl },

  // ── Module / entry-type icons ─────────────────────────────────────
  // Currently served by lucide-react inline.  Add custom icon assets:
  //
  // iconDrinks: { light: drinksLightUrl },
  // iconSleep: { light: sleepLightUrl },

  // ── Backgrounds ───────────────────────────────────────────────────
  // Drop hero/card background images and register them here:
  //
  // pageDashboardHero: { light: heroLightUrl, dark: heroDarkUrl },
  // cardEntryBackground: { light: cardBgLightUrl },

  // ── State illustrations ───────────────────────────────────────────
  // stateEmpty: { light: emptyLightUrl },
  // stateNoChildren: { light: noChildrenUrl },

  // ── UI elements ───────────────────────────────────────────────────
  // buttonPrimaryBackground: { light: btnPrimaryUrl },
  // celebrationBanner:       { light: celebrationUrl },
};
