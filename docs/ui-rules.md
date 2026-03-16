# UI Rules

## Design principles

BladderTracker follows NHS-inspired design principles: clear, accessible, calming. The product is designed for one-handed use on a phone during routines, school handovers, and care conversations.

## Styling

- **Tailwind CSS 4** utility classes only — no inline styles, CSS modules, or custom stylesheets.
- Use existing colour tokens defined as CSS custom properties in `src/index.css`.
- Avoid hardcoded colour values. Use theme variables instead.

## Themes

Three themes are supported — all new UI must work in each:

| Theme | Attribute | Notes |
|-------|-----------|-------|
| Light | `data-theme="light"` | Default. Soft lavender palette. |
| Dark | `data-theme="dark"` | Dark backgrounds with appropriate contrast. |
| High-contrast | `data-theme="high-contrast"` | Maximum contrast for accessibility. |

CSS custom properties used across themes:

- `--bg-primary`, `--bg-card`, `--bg-input`, `--bg-hover`, `--bg-accent`
- `--text-primary`, `--text-secondary`, `--text-accent`
- `--icon-color`, `--divider-color`, `--ring-color`, `--border-color`

Dark and high-contrast overrides use `[data-theme='dark']` and `[data-theme='high-contrast']` selectors with `!important` to override Tailwind utility classes.

### EntryCard theming

`EntryCard` uses `data-entry-type` attributes. Light colour props (e.g. `bg-sky-light`, `bg-peach`) are overridden in dark/high-contrast via CSS custom property redefinition.

## Accessibility

- All interactive elements require ARIA labels.
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`, `<h1>`–`<h6>`).
- Keyboard navigation must work for all interactive flows.
- Text contrast must meet WCAG AA minimums in all three themes.
- Use `vitest-axe` in tests for automated checks.
- High-contrast theme support is required, not optional.

## Components

### Shared components

Reuse these before creating new ones:

| Component | Purpose |
|-----------|---------|
| `EntryCard` | Diary entry display card |
| `EmptyState` | Empty state placeholder |
| `HelpPanel` | Collapsible in-app help |
| `FormStep` | Step-by-step form wrapper (3 steps: When, What/Details, Notes) |
| `CalendarStrip` | Horizontal date scroller |
| `BristolStoolPicker` | Bristol stool scale selector |
| `BrandBanner` | App header |
| `AppNav` | Top/bottom navigation shell |

### Form pattern

All 11 entry forms in `src/components/forms/` use the `FormStep` component with a consistent 3-step pattern:

1. **When** — date and time
2. **What / Details** — module-specific fields
3. **Notes** — free-text notes

### Responsive layout

- Mobile-first design. Test on narrow viewports (375px+).
- Bottom navigation on mobile, top navigation on wider screens.
- Forms and cards should be usable one-handed.

## Copy and labels

- User-facing labels are centralised in `src/content/presentation.ts`.
- Use plain-English, calmer labels in the UI (e.g. "Wee" not "Urine", "Poo" not "Bowel").
- Do not hardcode UI copy in page components — reference `presentation.ts`.

## Icons

- Use `lucide-react` for all icons.
- Do not introduce additional icon libraries.
