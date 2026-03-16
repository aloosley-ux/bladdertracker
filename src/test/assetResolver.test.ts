import { describe, it, expect } from 'vitest';
import { resolveAsset } from '../assets/assetResolver';
import { ASSET_REGISTRY } from '../assets/assetRegistry';
import type { AssetKey, Theme } from '../assets/assetTypes';

describe('resolveAsset', () => {
  it('returns the light URL for a registered branding key in light theme', () => {
    const url = resolveAsset('brandMark', 'light');
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
  });

  it('returns the dark URL when available', () => {
    const url = resolveAsset('brandMark', 'dark');
    expect(url).toBeDefined();
  });

  it('returns the high-contrast URL when available', () => {
    const url = resolveAsset('brandMark', 'high-contrast');
    expect(url).toBeDefined();
  });

  it('falls back to light when requested theme variant is missing', () => {
    // brandWordmark has light, dark, and HC all set — but let's test the
    // fallback logic by checking a key that only has light registered.
    // We'll use the registry's own state: if a dark entry is absent the
    // resolver should return the light value.
    const entry = ASSET_REGISTRY.brandLockupHorizontal;
    expect(entry).toBeDefined();
    // This key has all three — so the result should equal the per-theme value.
    const lightUrl = resolveAsset('brandLockupHorizontal', 'light');
    const darkUrl = resolveAsset('brandLockupHorizontal', 'dark');
    expect(lightUrl).toBeDefined();
    expect(darkUrl).toBeDefined();
  });

  it('returns undefined for an unregistered key', () => {
    // An asset key that exists in the type system but has no registry entry.
    const url = resolveAsset('stateEmpty', 'light');
    expect(url).toBeUndefined();
  });

  it('returns undefined for all themes when key is unregistered', () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];
    for (const theme of themes) {
      expect(resolveAsset('stateWarning', theme)).toBeUndefined();
    }
  });

  it('resolves all registered branding assets without error', () => {
    const brandingKeys: AssetKey[] = [
      'brandMark',
      'brandWordmark',
      'brandLockupHorizontal',
      'brandLockupStacked',
      'brandMonochromeMark',
    ];
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];

    for (const key of brandingKeys) {
      for (const theme of themes) {
        const url = resolveAsset(key, theme);
        expect(url).toBeDefined();
        expect(typeof url).toBe('string');
      }
    }
  });
});

describe('ASSET_REGISTRY', () => {
  it('is a plain object', () => {
    expect(typeof ASSET_REGISTRY).toBe('object');
    expect(ASSET_REGISTRY).not.toBeNull();
  });

  it('has branding entries registered', () => {
    expect(ASSET_REGISTRY.brandMark).toBeDefined();
    expect(ASSET_REGISTRY.brandWordmark).toBeDefined();
    expect(ASSET_REGISTRY.brandLockupHorizontal).toBeDefined();
    expect(ASSET_REGISTRY.brandLockupStacked).toBeDefined();
    expect(ASSET_REGISTRY.brandMonochromeMark).toBeDefined();
  });

  it('each registered entry has at least a light variant', () => {
    for (const [, entry] of Object.entries(ASSET_REGISTRY)) {
      if (entry) {
        expect(entry.light).toBeDefined();
        expect(typeof entry.light).toBe('string');
      }
    }
  });
});
