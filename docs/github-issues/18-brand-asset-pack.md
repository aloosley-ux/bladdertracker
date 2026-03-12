# Issue: Create production-ready brand assets and delivery formats

**Status:** ✅ Resolved

**Labels:** `design-system`, `priority:high`

---

## Scope delivered

This issue delivered a complete brand asset pack suitable for in-app UI, PWA icon usage, and social sharing cards.

### Parent issue output

- Added canonical **brand mark** and set it as the app icon source for both `src` and `public` usage.
- Added **wordmark** and **logo lockups** (horizontal + stacked) for responsive placements.
- Added a **monochrome mark** variant for constrained contexts.
- Added **social preview artwork** and wired Open Graph / Twitter metadata in `index.html`.
- Expanded central asset registry in `src/assets/index.ts` so all app references remain easy to swap in one place.

### Sub-issue asset checklist

- [x] Sub-issue A — App icon and mark (`src/assets/brand-mark.svg`, `public/icon.svg`)
- [x] Sub-issue B — Wordmark (`src/assets/brand-wordmark.svg`)
- [x] Sub-issue C — Responsive lockups (`src/assets/brand-lockup-horizontal.svg`, `src/assets/brand-lockup-stacked.svg`)
- [x] Sub-issue D — Monochrome variant (`src/assets/brand-mark-monochrome.svg`)
- [x] Sub-issue E — Social media preview (`public/social-preview.svg`, `index.html` metadata)

## Notes

All assets are vector SVGs to ensure crisp rendering across DPR scales and simple maintenance in source control.
