/**
 * Asset system type definitions.
 *
 * This file defines the semantic asset key catalogue used by the
 * theme-aware asset resolver.  Each key describes *what* the asset
 * represents, not which file fulfils it.
 */

// ── Themes ──────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark' | 'high-contrast';

export const THEMES: readonly Theme[] = ['light', 'dark', 'high-contrast'] as const;

// ── Semantic asset keys ─────────────────────────────────────────────
// Grouped by category to keep the catalogue navigable.

/** Branding assets – logos, wordmarks, lockups. */
export type BrandingAssetKey =
  | 'brandMark'
  | 'brandWordmark'
  | 'brandLockupHorizontal'
  | 'brandLockupStacked'
  | 'brandMonochromeMark';

/** Navigation icons used in the main nav bars. */
export type NavigationAssetKey =
  | 'navDashboard'
  | 'navDiary'
  | 'navReports'
  | 'navMilestones'
  | 'navLeaps'
  | 'navProfiles'
  | 'navSettings'
  | 'navAdmin'
  | 'navCalendar'
  | 'navHelp'
  | 'navAdd';

/** Module/entry-type icons shown on cards, tabs, and headers. */
export type ModuleIconAssetKey =
  | 'iconDrinks'
  | 'iconUrine'
  | 'iconBowel'
  | 'iconSleep'
  | 'iconToilet'
  | 'iconFood'
  | 'iconMood'
  | 'iconSensory'
  | 'iconMedication'
  | 'iconTherapy'
  | 'iconRoutine'
  | 'iconMilestones'
  | 'iconLeaps';

/** Background assets for pages, sections, and cards. */
export type BackgroundAssetKey =
  | 'pageDashboardHero'
  | 'pageAddEntryHero'
  | 'pageReportsHero'
  | 'pageSettingsHero'
  | 'pageMilestonesHero'
  | 'pageLeapsHero'
  | 'pageProfilesHero'
  | 'pageHelpHero'
  | 'pageLoginHero'
  | 'cardEntryBackground'
  | 'cardMilestoneBackground'
  | 'sectionHeaderBackground';

/** State illustrations – empty, success, error, loading, etc. */
export type StateAssetKey =
  | 'stateEmpty'
  | 'stateSuccess'
  | 'stateWarning'
  | 'stateError'
  | 'stateLoading'
  | 'stateNoDiary'
  | 'stateNoChildren'
  | 'stateNoMilestones';

/** UI element assets – buttons, badges, decorative. */
export type UIAssetKey =
  | 'buttonPrimaryBackground'
  | 'buttonSecondaryBackground'
  | 'badgeAchievement'
  | 'badgeMilestone'
  | 'decorativeDivider'
  | 'splashBackground'
  | 'celebrationBanner';

/** Combined union of every semantic asset key. */
export type AssetKey =
  | BrandingAssetKey
  | NavigationAssetKey
  | ModuleIconAssetKey
  | BackgroundAssetKey
  | StateAssetKey
  | UIAssetKey;

// ── Asset entry metadata ────────────────────────────────────────────

export interface AssetEntry {
  /** URL or import reference for the light theme (also used as default fallback). */
  light?: string;
  /** URL or import reference for the dark theme. */
  dark?: string;
  /** URL or import reference for the high-contrast theme. */
  'high-contrast'?: string;
}

/** The full asset registry maps semantic keys to per-theme file references. */
export type AssetRegistry = Partial<Record<AssetKey, AssetEntry>>;
