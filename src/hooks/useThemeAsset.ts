/**
 * React hook for theme-aware asset resolution.
 *
 * Usage:
 *   const url = useThemeAsset('brandMark');
 *   // Returns the URL for the current theme, or undefined.
 *
 * The hook automatically re-resolves when the active theme changes.
 */
import { useMemo } from 'react';
import { useTheme } from '../context/useTheme';
import { resolveAsset } from '../assets/assetResolver';
import type { AssetKey, Theme } from '../assets/assetTypes';

/**
 * Resolve a semantic asset key against the current theme.
 *
 * @param key – A semantic asset key (e.g. `'brandMark'`, `'stateEmpty'`),
 *              or `undefined` to skip resolution.
 * @param themeOverride – Optional. Force a specific theme instead of the
 *                        current one.
 * @returns The asset URL, or `undefined` when no asset is registered or
 *          the key is `undefined`.
 */
export function useThemeAsset(
  key: AssetKey | undefined,
  themeOverride?: Theme,
): string | undefined {
  const { theme: currentTheme } = useTheme();
  const theme = themeOverride ?? currentTheme;

  return useMemo(
    () => (key ? resolveAsset(key, theme as Theme) : undefined),
    [key, theme],
  );
}
