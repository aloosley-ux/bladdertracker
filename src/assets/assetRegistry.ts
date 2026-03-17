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


// ── Brand imports ────────────────────────────────────────────────────
import brandIconUrl from './brand-icon.png';
import brandIconDarkUrl from './brand-icon-dark.png';
import brandIconHcUrl from './brand-icon-hc.png';
import brandWordmarkUrl from './brand-wordmark.svg';
import brandLockupHorizontalPngUrl from './brand-lockup-horizontal.png';
import brandLockupHorizontalDarkUrl from './brand-lockup-horizontal-dark.png';
import brandLockupHorizontalHcUrl from './brand-lockup-horizontal-hc.png';
import brandLockupStackedUrl from './brand-lockup-stacked.svg';
import brandMonochromeMarkUrl from './brand-mark-monochrome.svg';

// ── Light theme hero backgrounds ────────────────────────────────────
import pageAddEntryHeroLightUrl from './themes/light/hero-addentryheader.png';
import pageDashboardHeroLightUrl from './themes/light/hero-dashboardheader.png';
import pageHelpHeroLightUrl from './themes/light/hero-helpheader.png';
import pageLeapsHeroLightUrl from './themes/light/hero-leapsheader.png';
import pageLoginHeroLightUrl from './themes/light/hero-loginheader.png';
import pageMilestonesHeroLightUrl from './themes/light/hero-milestoneheader.png';
import pageProfilesHeroLightUrl from './themes/light/hero-profilesheader.png';
import pageReportsHeroLightUrl from './themes/light/hero-reportsheader.png';
import pageSettingsHeroLightUrl from './themes/light/hero-settingsheader.png';

// ── Dark theme hero backgrounds ─────────────────────────────────────
import pageAddEntryHeroDarkUrl from './themes/dark/hero-addentryheader-dark.png';
import pageDashboardHeroDarkUrl from './themes/dark/hero-dashboardheader-dark.png';
import pageHelpHeroDarkUrl from './themes/dark/hero-helperheader-dark.png';
import pageLeapsHeroDarkUrl from './themes/dark/hero-leapsheader-dark.png';
import pageLoginHeroDarkUrl from './themes/dark/hero-loginheader-dark.png';
import pageMilestonesHeroDarkUrl from './themes/dark/hero-milestoneheader-dark.png';
import pageProfilesHeroDarkUrl from './themes/dark/hero-profilesheader-dark.png';
import pageReportsHeroDarkUrl from './themes/dark/hero-reportsheader-dark.png';
import pageSettingsHeroDarkUrl from './themes/dark/hero-settingsheader-dark.png';

// ── High-contrast theme hero backgrounds ────────────────────────────
import pageAddEntryHeroHcUrl from './themes/high-contrast/hero-addentryheader-hc.png';
import pageDashboardHeroHcUrl from './themes/high-contrast/hero-dashboardheader-hc.png';
import pageHelpHeroHcUrl from './themes/high-contrast/hero-helperheader-hc.png';
import pageLeapsHeroHcUrl from './themes/high-contrast/hero-leapsheader-hc.png';
import pageLoginHeroHcUrl from './themes/high-contrast/hero-loginheader-hc.png';
import pageMilestonesHeroHcUrl from './themes/high-contrast/hero-milestonesheader-hc.png';
import pageProfilesHeroHcUrl from './themes/high-contrast/hero-profilesheader-hc.png';
import pageReportsHeroHcUrl from './themes/high-contrast/hero-reportsheader-hc.png';
import pageSettingsHeroHcUrl from './themes/high-contrast/hero-settingsheader-hc.png';

// ── Card / section backgrounds ──────────────────────────────────────
import cardEntryBgLightUrl from './themes/light/card-bg-diaryentry.png';
import cardEntryBgDarkUrl from './themes/dark/card-bg-diaryentry-dark.png';
import cardEntryBgHcUrl from './themes/high-contrast/card-bg-diaryentry-hc.png';
import sectionHeaderBgLightUrl from './themes/light/card-bg-sectionheaders.png';
import sectionHeaderBgDarkUrl from './themes/dark/card-bg-sectionheaders-dark.png';
import sectionHeaderBgHcUrl from './themes/high-contrast/card-bg-sectionheaders-hc.png';

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
    light: brandIconUrl,
    dark: brandIconDarkUrl,
    'high-contrast': brandIconHcUrl,
  },
  brandWordmark: {
    light: brandWordmarkUrl,
    dark: brandWordmarkUrl,
    'high-contrast': brandWordmarkUrl,
  },
  brandLockupHorizontal: {
    light: brandLockupHorizontalPngUrl,
    dark: brandLockupHorizontalDarkUrl,
    'high-contrast': brandLockupHorizontalHcUrl,
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
  pageDashboardHero: {
    light: pageDashboardHeroLightUrl,
    dark: pageDashboardHeroDarkUrl,
    'high-contrast': pageDashboardHeroHcUrl,
  },
  pageAddEntryHero: {
    light: pageAddEntryHeroLightUrl,
    dark: pageAddEntryHeroDarkUrl,
    'high-contrast': pageAddEntryHeroHcUrl,
  },
  pageReportsHero: {
    light: pageReportsHeroLightUrl,
    dark: pageReportsHeroDarkUrl,
    'high-contrast': pageReportsHeroHcUrl,
  },
  pageSettingsHero: {
    light: pageSettingsHeroLightUrl,
    dark: pageSettingsHeroDarkUrl,
    'high-contrast': pageSettingsHeroHcUrl,
  },
  pageMilestonesHero: {
    light: pageMilestonesHeroLightUrl,
    dark: pageMilestonesHeroDarkUrl,
    'high-contrast': pageMilestonesHeroHcUrl,
  },
  pageLeapsHero: {
    light: pageLeapsHeroLightUrl,
    dark: pageLeapsHeroDarkUrl,
    'high-contrast': pageLeapsHeroHcUrl,
  },
  pageProfilesHero: {
    light: pageProfilesHeroLightUrl,
    dark: pageProfilesHeroDarkUrl,
    'high-contrast': pageProfilesHeroHcUrl,
  },
  pageHelpHero: {
    light: pageHelpHeroLightUrl,
    dark: pageHelpHeroDarkUrl,
    'high-contrast': pageHelpHeroHcUrl,
  },
  pageLoginHero: {
    light: pageLoginHeroLightUrl,
    dark: pageLoginHeroDarkUrl,
    'high-contrast': pageLoginHeroHcUrl,
  },

  // ── Card / section backgrounds ────────────────────────────────────
  cardEntryBackground: {
    light: cardEntryBgLightUrl,
    dark: cardEntryBgDarkUrl,
    'high-contrast': cardEntryBgHcUrl,
  },
  sectionHeaderBackground: {
    light: sectionHeaderBgLightUrl,
    dark: sectionHeaderBgDarkUrl,
    'high-contrast': sectionHeaderBgHcUrl,
  },

  // ── State illustrations ───────────────────────────────────────────
  // stateEmpty: { light: emptyLightUrl },
  // stateNoChildren: { light: noChildrenUrl },

  // ── UI elements ───────────────────────────────────────────────────
  // buttonPrimaryBackground: { light: btnPrimaryUrl },
  // celebrationBanner:       { light: celebrationUrl },
};
