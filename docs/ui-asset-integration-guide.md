# UI Asset Integration Guide

> How to prepare, drop in, and manage custom visual assets for EveryStep.

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Naming Conventions](#naming-conventions)
4. [Supported File Formats](#supported-file-formats)
5. [How the Asset System Works](#how-the-asset-system-works)
6. [Adding or Replacing an Asset](#adding-or-replacing-an-asset)
7. [Theme-Specific Assets](#theme-specific-assets)
8. [Fallback Behaviour](#fallback-behaviour)
9. [Component Integration](#component-integration)
10. [SVG vs PNG Guidance](#svg-vs-png-guidance)
11. [Recommended Dimensions](#recommended-dimensions)
12. [Pixel Density / @2x Considerations](#pixel-density--2x-considerations)
13. [Transparency & Background Guidance](#transparency--background-guidance)
14. [Accessibility Requirements](#accessibility-requirements)
15. [Testing Your Assets](#testing-your-assets)
16. [Frequently Asked Questions](#faq)

---

## Overview

EveryStep uses a **semantic asset system** that separates _what an asset is for_ (e.g. "dashboard hero background") from _which file provides it_ (e.g. `hero-dashboard-light.png`).

All assets are managed through a central **asset registry** (`src/assets/assetRegistry.ts`).  Components request assets by **semantic key** (e.g. `pageDashboardHero`), and the system automatically resolves the correct file for the current theme.

### Key Benefits

- Replace the look of the entire app by swapping files and updating one registry.
- Assets are theme-aware: Light, Dark, and High Contrast each get their own variant.
- Missing assets never crash the app – components fall back to existing CSS styling.

---

## Folder Structure

```
src/assets/
├── brand-icon.png                  # Brand mark (light)
├── brand-icon-dark.png             # Brand mark (dark)
├── brand-icon-hc.png               # Brand mark (high-contrast)
├── brand-wordmark.svg              # Shared brand wordmark
├── brand-lockup-horizontal.png     # Horizontal lockup (light)
├── brand-lockup-horizontal-dark.png # Horizontal lockup (dark)
├── brand-lockup-horizontal-hc.png  # Horizontal lockup (high-contrast)
├── brand-lockup-stacked.svg        # Stacked lockup (shared)
├── brand-mark-monochrome.svg       # Monochrome mark (shared)
├── index.ts                        # Main export barrel
├── assetTypes.ts                   # TypeScript type definitions
├── assetRegistry.ts                # ⭐ Central asset registry
├── assetResolver.ts                # Resolution logic
└── themes/
    ├── light/                      # Light-theme-specific assets
    │   ├── hero-*.png              # Page hero backgrounds
    │   └── card-bg-*.png           # Card backgrounds
    ├── dark/                       # Dark-theme-specific assets
    │   ├── hero-*-dark.png
    │   └── card-bg-*-dark.png
    └── high-contrast/              # High-contrast-theme-specific assets
        ├── hero-*-hc.png
        └── card-bg-*-hc.png
```

### Where to place files

| Asset type | Location |
|-----------|----------|
| Shared across all themes | `src/assets/` (root) |
| Light theme only | `src/assets/themes/light/` |
| Dark theme only | `src/assets/themes/dark/` |
| High-contrast theme only | `src/assets/themes/high-contrast/` |

---

## Naming Conventions

Use **kebab-case** with a descriptive name and optional theme suffix:

```
<semantic-name>[-<theme>].<ext>

Examples:
  hero-dashboard.svg          ← shared / light default
  hero-dashboard-dark.svg     ← dark variant
  hero-dashboard-hc.svg       ← high-contrast variant
  icon-drinks.svg
  state-empty.png
  card-entry-bg-dark.png
  badge-achievement.svg
```

### Rules

- Use lowercase letters, numbers, and hyphens only.
- Start with a category prefix: `hero-`, `icon-`, `state-`, `card-`, `badge-`, `btn-`, `nav-`, `brand-`, `illust-`.
- Add `-dark` or `-hc` suffixes for theme-specific variants.
- Avoid version numbers in filenames (`v2`, `final`, `new`).

---

## Supported File Formats

| Format | Use case | Notes |
|--------|----------|-------|
| **SVG** | Icons, logos, line art, simple shapes | Preferred for scalable UI elements. Vite inlines small SVGs. |
| **PNG** | Textured backgrounds, illustrations, raster art | Use when SVG is impractical. Provide @2x versions for retina. |

Both formats are supported by the asset system. The registry does not enforce format – just reference the correct import path.

---

## How the Asset System Works

### Architecture

```
  Component
      │
      │  useThemeAsset('pageDashboardHero')
      ▼
  useThemeAsset hook
      │
      │  resolveAsset(key, currentTheme)
      ▼
  assetResolver.ts
      │
      │  ASSET_REGISTRY[key][theme] ?? ASSET_REGISTRY[key]['light'] ?? undefined
      ▼
  assetRegistry.ts
      │
      │  Returns URL string or undefined
      ▼
  Component renders <img> or falls back to CSS
```

### Key Files

| File | Purpose |
|------|---------|
| `src/assets/assetTypes.ts` | TypeScript type definitions for all semantic asset keys |
| `src/assets/assetRegistry.ts` | Maps semantic keys → per-theme file URLs |
| `src/assets/assetResolver.ts` | Pure function that resolves key + theme → URL |
| `src/hooks/useThemeAsset.ts` | React hook wrapping the resolver with theme context |
| `src/components/AssetImage.tsx` | `<img>` component with fallback support |
| `src/components/PageShell.tsx` | Page wrapper with hero background asset slot |

---

## Adding or Replacing an Asset

### Step 1 – Prepare the file

Export your asset in the correct format and dimensions (see [Recommended Dimensions](#recommended-dimensions)).

### Step 2 – Place the file

Drop the file into the appropriate `src/assets/` subdirectory.

### Step 3 – Import in the registry

Open `src/assets/assetRegistry.ts` and add an import + registry entry:

```typescript
// Import at the top of the file
import heroDashboardLightUrl from './themes/light/hero-dashboard.png';
import heroDashboardDarkUrl from './themes/dark/hero-dashboard-dark.png';

// Add to the ASSET_REGISTRY object
export const ASSET_REGISTRY: AssetRegistry = {
  // ...existing entries...

  pageDashboardHero: {
    light: heroDashboardLightUrl,
    dark: heroDashboardDarkUrl,
    // high-contrast will fall back to light if not specified
  },
};
```

### Step 4 – Done

Components using `useThemeAsset('pageDashboardHero')` or `<AssetImage assetKey="pageDashboardHero" />` will automatically pick up the new asset.

No component code changes required.

---

## Theme-Specific Assets

EveryStep supports **three themes**:

| Theme | Key | CSS attribute | Typical style |
|-------|-----|--------------|---------------|
| Light | `'light'` | `[data-theme="light"]` | White/lavender backgrounds, dark text |
| Dark | `'dark'` | `[data-theme="dark"]` | Deep purple/navy backgrounds, light text |
| High Contrast | `'high-contrast'` | `[data-theme="high-contrast"]` | Black backgrounds, white/yellow text, strong borders |

### Theme fallback chain

```
requested theme → 'light' → undefined (CSS fallback)
```

If you only provide a `light` variant, dark and high-contrast will use it automatically.

### High Contrast considerations

High Contrast is an **accessibility theme**, not just "darker dark mode":

- Assets should have **strong contrast ratios** (minimum 7:1 for text areas).
- Avoid subtle gradients or low-contrast decorative elements.
- Consider providing simpler, higher-contrast variants or omitting background textures.
- The app will fall back to its strong CSS-based HC styling if no asset is provided.

---

## Fallback Behaviour

The asset system is designed to **never break the app** when an asset is missing:

1. **No asset registered for a key** → `resolveAsset()` returns `undefined` → component uses its CSS fallback.
2. **Asset registered but file fails to load** → `<AssetImage>` catches the `onError` event and renders the fallback prop.
3. **Theme variant missing** → falls back to the `light` variant.
4. **All variants missing** → returns `undefined` → CSS fallback.

### What "CSS fallback" means

Each component has built-in styling (Tailwind classes, CSS custom properties) that renders correctly without any custom assets.  The current app already works fully without any non-branding assets in the registry.

---

## Component Integration

### AssetImage

Drop-in image component with automatic theme resolution and fallback:

```tsx
import AssetImage from '../components/AssetImage';

<AssetImage
  assetKey="stateEmpty"
  alt="No entries yet"
  fallback={<span className="text-3xl">📭</span>}
  className="h-24 w-24"
/>
```

### useThemeAsset hook

For custom rendering logic:

```tsx
import { useThemeAsset } from '../hooks/useThemeAsset';

function MyComponent() {
  const bgUrl = useThemeAsset('pageDashboardHero');

  return (
    <div style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}>
      <h1>Dashboard</h1>
    </div>
  );
}
```

### resolveAsset (non-React)

Pure function for use outside React components:

```typescript
import { resolveAsset } from '../assets/assetResolver';

const url = resolveAsset('brandMark', 'dark');
```

### PageShell

Page wrapper with hero asset slot:

```tsx
import PageShell from '../components/PageShell';

<PageShell heroAssetKey="pageDashboardHero">
  <h1>Dashboard</h1>
  {/* page content */}
</PageShell>
```

### EntryCard (asset-ready)

Supports optional `backgroundAsset` and `iconAsset` props:

```tsx
<EntryCard
  title="Drink logged"
  backgroundAsset="cardEntryBackground"
  iconAsset="iconDrinks"
  icon={<Droplets size={18} />}  // fallback icon
/>
```

### EmptyState (asset-ready)

Supports optional `illustrationAsset` prop with emoji fallback:

```tsx
<EmptyState
  title="No entries yet"
  illustrationAsset="stateEmpty"
  icon="📭"  // fallback if no asset registered
/>
```

---

## SVG vs PNG Guidance

| Criterion | SVG | PNG |
|-----------|-----|-----|
| Icons & logos | ✅ Preferred | Use only if complex raster |
| Line art / simple illustrations | ✅ Preferred | — |
| Textured backgrounds | — | ✅ Preferred |
| Complex illustrations / mascots | — | ✅ Preferred |
| Painted / photographic artwork | — | ✅ Required |
| Scalability | Infinite | Fixed (provide @2x) |
| File size for simple shapes | Usually smaller | Usually larger |
| Animation support | ✅ CSS/SMIL | ❌ No |

### SVG export rules

- Optimise with SVGO or your design tool's optimiser.
- Remove metadata, comments, and editor-specific attributes.
- Use `viewBox` for scalability; avoid fixed `width`/`height` when possible.
- Use `currentColor` for icons that should inherit the theme text colour.

### PNG export rules

- Export at **2×** native resolution (the app uses CSS to downscale).
- Use **8-bit PNG** for images with transparency.
- Compress with tools like TinyPNG or ImageOptim.
- Keep file size under **100 KB** per asset where possible (PWA bundle size matters).

---

## Recommended Dimensions

| Asset type | Recommended size | Format | Notes |
|-----------|-----------------|--------|-------|
| App logo / brand mark | 256×256 px | SVG | Scalable, no fixed size needed |
| Brand lockup horizontal | 800×200 px | SVG | Rendered at 100-120px height |
| Page hero / header background | 1200×400 px @2x | PNG or SVG | Full-width, 200px rendered height |
| Card background | 800×200 px @2x | PNG | Rendered at ~100px height |
| Entry type icons | 48×48 px | SVG | Rendered at 18-24px |
| Navigation icons | 48×48 px | SVG | Rendered at 18-24px |
| State illustrations | 384×384 px @2x | SVG or PNG | Rendered at ~96px |
| Achievement badges | 128×128 px @2x | SVG or PNG | Rendered at ~48px |
| Button background | 600×120 px @2x | PNG or SVG | Stretches to fit |
| Decorative divider | 1200×32 px | SVG | Full-width, 16px height |
| Splash background | 1200×800 px @2x | PNG | Full viewport |

> @2x = provide at double the rendered pixel size for retina/high-DPI screens.

---

## Pixel Density / @2x Considerations

The app is a **mobile-first PWA**. Most users will have 2× or 3× pixel density screens.

- **SVG assets** scale automatically — no @2x variants needed.
- **PNG assets** should be exported at **2× the rendered CSS pixel size**.
- For critical hero images, consider providing 3× variants for high-end mobile.
- Vite handles importing both formats identically — the URL is resolved at build time.

---

## Transparency & Background Guidance

- **Icons**: Use transparent backgrounds. Let the app's CSS handle the container colour.
- **Page hero backgrounds**: Can be opaque or semi-transparent. The component renders content on top with proper z-indexing.
- **Card backgrounds**: Use subtle transparency or opaque with care — text must remain readable.
- **State illustrations**: Transparent background recommended — the empty state container handles padding/centering.
- **Branding assets**: Current SVGs have no background fill — keep this approach.

### Text readability over background assets

When providing background images for cards, buttons, or hero areas:

- Keep the centre/text areas simple and low-contrast.
- Push detail to edges/corners.
- The app uses CSS custom property text colours that are guaranteed readable on the default backgrounds. If your asset is darker/lighter than the default, you may need to adjust the relevant CSS custom properties.

---

## Accessibility Requirements

### Non-negotiable rules

1. **Decorative images** must have `alt=""` or `role="presentation"`.
2. **Meaningful icons** must have `alt` text or an `aria-label` on the parent.
3. **Text contrast** must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
4. **High Contrast theme** must meet WCAG AAA (7:1).
5. **Never bake essential text into images** — the app renders text accessibly in HTML.
6. **Focus states** must remain visible over background assets.
7. **Interactive elements** must remain identifiable in all themes.

### High Contrast theme specifics

- Prefer simple, monochrome, or very high-contrast versions of assets.
- Avoid gradients and subtle textures.
- Icons should be white on dark, or use `currentColor` in SVG.
- Consider omitting purely decorative backgrounds — the CSS fallback is optimised for HC readability.

---

## Testing Your Assets

### Visual testing

1. Run `npm run dev` to start the dev server.
2. Switch between all three themes in **Settings → Theme**.
3. Verify:
   - Assets render correctly in each theme.
   - Text remains readable over any background assets.
   - Focus rings are visible on interactive elements.
   - The layout doesn't break or shift.

### Automated testing

- Run `npm test` to ensure no regressions.
- Tests use `vitest-axe` for accessibility checks.
- The `AssetImage` component has unit tests verifying fallback behaviour.

### Removing an asset

1. Delete the file from `src/assets/`.
2. Remove the import and registry entry in `assetRegistry.ts`.
3. Build and test — the component will gracefully fall back.

---

## FAQ

### Q: Do I need to provide all three theme variants?

No. The system falls back: **dark → light → CSS fallback**. You can start with light-only assets and add dark/HC variants later.

### Q: What happens if I break a file path?

The `<AssetImage>` component catches image load errors and shows the fallback. The app won't crash.

### Q: Can I add new asset keys?

Yes. Add the key to the relevant type union in `src/assets/assetTypes.ts`, then register it in `assetRegistry.ts`. Components can reference the new key immediately.

### Q: How does this interact with Tailwind CSS?

The asset system and Tailwind are complementary. Tailwind handles layout, spacing, and colour tokens. Assets provide visual imagery (backgrounds, icons, illustrations). Components combine both.

### Q: What about bundle size?

Vite tree-shakes unused imports. Only registered assets are included in the build. SVGs are typically tiny. Keep PNGs under 100 KB each. The asset system adds ~2 KB of JavaScript.

---

_Last updated: March 2026_
