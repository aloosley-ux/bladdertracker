# UI Asset Inventory & Specification

> Complete catalogue of every visual asset that the BladderTracker UI can accept.
> Use this as a production brief for creating custom assets.

---

## How to Read This Document

Each entry describes one **semantic asset slot** in the application.

| Column | Meaning |
|--------|---------|
| **Asset Key** | The programmatic key used in `assetRegistry.ts` |
| **Purpose** | What the asset is for |
| **Where Used** | Which component(s) or page(s) consume it |
| **Required** | Whether the app needs this asset to function (all are optional — CSS fallback exists) |
| **Theme Variants** | Which themes need a dedicated variant |
| **Format** | Recommended file format |
| **Dimensions** | Recommended export size (at 1× unless noted @2x) |
| **Transparency** | Whether the asset should have a transparent background |
| **Notes** | Additional export or design guidance |

---

## 1. Branding Assets

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `brandMark` | Primary app icon / logo mark | `BrandIcon`, login, PWA icon | ✅ Provided | Light, Dark, High Contrast | PNG | 256×256 | ✅ Yes | Uses `brand-icon.png` with `-dark` and `-hc` variants. |
| `brandWordmark` | Text-only logo | Settings, about section | ✅ Provided | All 3 | SVG | 400×80 | ✅ Yes | Should be legible at 60px height. |
| `brandLockupHorizontal` | Logo + wordmark side-by-side | `BrandBanner` (top of every page) | ✅ Provided | All 3 | PNG | 800×200 | ✅ Yes | Uses `brand-lockup-horizontal.png` with `-dark` and `-hc` variants. Rendered at 100–120px height. |
| `brandLockupStacked` | Logo + wordmark stacked | Splash/onboarding | ✅ Provided | All 3 | SVG | 400×400 | ✅ Yes | Used for square layout contexts. |
| `brandMonochromeMark` | Single-colour logo variant | High-contrast fallback | ✅ Provided | HC only | SVG | 256×256 | ✅ Yes | White or `currentColor`. Used in HC theme. |

---

## 2. Navigation Icons

Currently served by **lucide-react** inline SVG icons. Custom asset replacement is fully supported.

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `navDashboard` | Dashboard / Today tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `LayoutDashboard` lucide icon |
| `navDiary` | Diary / Log tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `ClipboardList` lucide icon |
| `navReports` | Reports / Trends tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `BarChart3` lucide icon |
| `navMilestones` | Milestones / Goals tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Star` lucide icon |
| `navLeaps` | Leaps tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Rainbow` lucide icon |
| `navProfiles` | Profiles / Family tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Users` lucide icon |
| `navSettings` | Settings tab | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Settings` lucide icon |
| `navAdmin` | Admin tab (admin users only) | `AppNav` | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Crown` lucide icon |
| `navCalendar` | Calendar page | `CalendarPage` header | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Calendar` lucide icon |
| `navHelp` | Help page | `HelpPage` header | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `HelpCircle` lucide icon |
| `navAdd` | Add entry action | `AddEntryPage`, FAB button | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Plus` lucide icon |

---

## 3. Module / Entry-Type Icons

Displayed on diary entry cards, form tabs, and reports. Currently use lucide-react icons.

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `iconDrinks` | Drinks / fluids module icon | `EntryCard`, `AddEntryPage` tabs, Reports | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Droplets` / 🥤 emoji |
| `iconUrine` | Wee / urine module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `CloudRain` / 💦 emoji |
| `iconBowel` | Poo / bowel module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Stethoscope` / 🚽 emoji |
| `iconSleep` | Sleep module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Moon` / 🌙 emoji |
| `iconToilet` | Toilet visits module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Target` / 🎯 emoji |
| `iconFood` | Meals / food module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Apple` / 🍽️ emoji |
| `iconMood` | Mood module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Smile` / 😊 emoji |
| `iconSensory` | Sensory module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Palette` / 🎨 emoji |
| `iconMedication` | Medication module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Pill` / 💊 emoji |
| `iconTherapy` | Therapy module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Puzzle` / 🧩 emoji |
| `iconRoutine` | Routine module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `ClipboardList` / 📋 emoji |
| `iconMilestones` | Milestones module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Star` / ⭐ emoji |
| `iconLeaps` | Leaps module icon | Same | ❌ Optional | All 3 | SVG | 48×48 | ✅ Yes | Fallback: `Rainbow` / 🌈 emoji |

---

## 4. Page Hero / Header Backgrounds

Optional backgrounds displayed at the top of each main page.

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `pageDashboardHero` | Dashboard page header bg | `DashboardPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | Keep centre area simple for overlay text. |
| `pageAddEntryHero` | Add entry page header bg | `AddEntryPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageReportsHero` | Reports page header bg | `ReportsPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageSettingsHero` | Settings page header bg | `SettingsPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageMilestonesHero` | Milestones page header bg | `MilestonesPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageLeapsHero` | Leaps page header bg | `LeapsPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageProfilesHero` | Profiles page header bg | `ProfilesPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageHelpHero` | Help page header bg | `HelpPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |
| `pageLoginHero` | Login page header bg | `LoginPage` via `PageShell` | ❌ Optional | All 3 | PNG | 1200×400 @2x | Optional | — |

---

## 5. Card & Section Backgrounds

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `cardEntryBackground` | Background for diary entry cards | `EntryCard` | ❌ Optional | All 3 | PNG | 800×200 @2x | Optional | Keep text areas clear. Cards have ~100px rendered height. |
| `cardMilestoneBackground` | Background for milestone cards | `MilestonesPage` | ❌ Optional | All 3 | PNG | 800×200 @2x | Optional | — |
| `sectionHeaderBackground` | Background for section headers | Various page sections | ❌ Optional | All 3 | PNG | 1200×120 @2x | Optional | Used behind section titles. |

---

## 6. State Illustrations

Shown when a page or section has no data, or to indicate success/error/loading states.

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `stateEmpty` | Generic empty state | `EmptyState` component | ❌ Optional | All 3 | SVG or PNG | 384×384 @2x | ✅ Yes | Fallback: emoji icon. Friendly, encouraging tone. |
| `stateSuccess` | Action success feedback | Toast/confirmation areas | ❌ Optional | All 3 | SVG or PNG | 192×192 @2x | ✅ Yes | Celebratory, positive. |
| `stateWarning` | Warning / caution state | Error boundaries, alerts | ❌ Optional | All 3 | SVG or PNG | 192×192 @2x | ✅ Yes | Attention-getting, not alarming. |
| `stateError` | Error state | `ErrorBoundary`, failed loads | ❌ Optional | All 3 | SVG or PNG | 192×192 @2x | ✅ Yes | Empathetic, not scary. |
| `stateLoading` | Loading indicator | `RouteLoadingFallback` | ❌ Optional | All 3 | SVG | 192×192 | ✅ Yes | Can be animated SVG. |
| `stateNoDiary` | No diary entries for selected date | `LogPage`, `DashboardPage` | ❌ Optional | All 3 | SVG or PNG | 384×384 @2x | ✅ Yes | "Nothing logged yet" feeling. |
| `stateNoChildren` | No child profiles created | `ProfilesPage`, `DashboardPage` | ❌ Optional | All 3 | SVG or PNG | 384×384 @2x | ✅ Yes | Onboarding-friendly, warm. |
| `stateNoMilestones` | No milestones tracked | `MilestonesPage` | ❌ Optional | All 3 | SVG or PNG | 384×384 @2x | ✅ Yes | Encouraging, motivational. |

---

## 7. UI Element Assets

| Asset Key | Purpose | Where Used | Required | Theme Variants | Format | Dimensions | Transparency | Notes |
|-----------|---------|-----------|----------|---------------|--------|------------|-------------|-------|
| `buttonPrimaryBackground` | Background for primary CTA buttons | Global primary buttons | ❌ Optional | All 3 | PNG or SVG | 600×120 @2x | Optional | Must not obscure white text. Stretches via `background-size: cover`. |
| `buttonSecondaryBackground` | Background for secondary buttons | Global secondary buttons | ❌ Optional | All 3 | PNG or SVG | 600×120 @2x | Optional | — |
| `badgeAchievement` | Achievement unlocked badge | `CelebrationBanner`, milestones | ❌ Optional | All 3 | SVG or PNG | 128×128 @2x | ✅ Yes | Celebratory, shiny. |
| `badgeMilestone` | Milestone reached badge | `MilestonesPage` | ❌ Optional | All 3 | SVG or PNG | 128×128 @2x | ✅ Yes | Positive, rewarding. |
| `decorativeDivider` | Decorative horizontal rule | Between page sections | ❌ Optional | All 3 | SVG | 1200×32 | ✅ Yes | Thin, decorative, non-intrusive. |
| `splashBackground` | Full-screen splash / onboarding bg | Login, first-run | ❌ Optional | All 3 | PNG | 1200×800 @2x | ❌ No | Full viewport coverage. |
| `celebrationBanner` | Background for celebration banners | `CelebrationBanner` | ❌ Optional | All 3 | PNG or SVG | 1200×200 @2x | Optional | Festive but text must remain readable. |

---

## Summary Statistics

| Category | Total Slots | Currently Provided | Optional |
|----------|-------------|-------------------|----------|
| Branding | 5 | 5 ✅ | 0 |
| Navigation Icons | 11 | 0 | 11 |
| Module Icons | 13 | 0 | 13 |
| Page Heroes | 9 | 9 ✅ | 0 |
| Card Backgrounds | 3 | 2 ✅ | 1 |
| State Illustrations | 8 | 0 | 8 |
| UI Elements | 7 | 0 | 7 |
| **Total** | **56** | **21** | **35** |

### Priority Order for Asset Creation

If producing assets incrementally, we recommend this order:

1. **Branding** — already provided, update with new brand if needed.
2. **Module Icons** (13) — highest visual impact, shown on every diary entry.
3. **State Illustrations** (8) — emotional tone-setters, shown frequently.
4. **Navigation Icons** (11) — visible on every screen.
5. **Page Heroes** (9) — dramatic visual improvement, per-page.
6. **UI Elements** (7) — polish and delight.
7. **Card Backgrounds** (3) — subtle enhancement.

---

## Quick Reference: Adding a New Asset

```bash
# 1. Create the file
# Place in src/assets/themes/light/icon-drinks.svg (or shared location)

# 2. Register it
# In src/assets/assetRegistry.ts:
import iconDrinksUrl from './themes/light/icon-drinks.svg';

// In ASSET_REGISTRY:
iconDrinks: { light: iconDrinksUrl },

# 3. Test
npm run dev   # Visual check
npm run build # Build check
npm test      # Regression check
```

---

_Last updated: March 2026_
