/**
 * Theme-aware asset resolver.
 *
 * Provides a pure function (`resolveAsset`) and a React hook
 * (`useThemeAsset`) that look up an asset from the central registry,
 * apply the theme fallback chain, and return a URL string (or undefined
 * when no asset is registered).
 *
 * Fallback order:  requested theme → 'light' → undefined
 *
 * Components should treat `undefined` as "no custom asset — use the
 * existing CSS / emoji / icon fallback".
 */
import type { AssetKey, Theme } from './assetTypes';
import { ASSET_REGISTRY } from './assetRegistry';

/**
 * Look up a semantic asset key for a given theme.
 *
 * @returns The resolved URL string, or `undefined` if no asset is
 *          registered for this key.
 */
export function resolveAsset(
  key: AssetKey,
  theme: Theme,
): string | undefined {
  const entry = ASSET_REGISTRY[key];
  if (!entry) return undefined;

  // Try the requested theme first, fall back to 'light'.
  return entry[theme] ?? entry.light ?? undefined;
}
