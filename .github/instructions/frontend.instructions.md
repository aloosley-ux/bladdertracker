---
applyTo: "src/**/*.{ts,tsx}"
---

# Frontend Instructions

## Components

- Reuse existing shared components (`EntryCard`, `EmptyState`, `HelpPanel`, `FormStep`, `CalendarStrip`, `BristolStoolPicker`) before creating new ones.
- Shared components live in `src/components/`. Sub-component folders: `forms/`, `leaps/`, `settings/`.
- Route page components live in `src/pages/` and must be lazy-loaded in `src/App.tsx`.

## State and data

- All data access goes through `useApp()` from `src/context/AppContext.tsx`.
- Theme access goes through `useTheme()` from `src/context/useTheme.ts`.
- Types and the module registry are in `src/types/index.ts`.
- UI copy and labels are centralised in `src/content/presentation.ts`.

## Styling

- Tailwind CSS utility classes only. No inline styles or CSS modules.
- Theme variables are defined in `src/index.css` using CSS custom properties.
- Use existing colour tokens (`--bg-primary`, `--bg-card`, `--text-primary`, etc.).
- Dark and high-contrast overrides use `[data-theme='dark']` and `[data-theme='high-contrast']` selectors with `!important`.

## Accessibility

- All interactive elements need ARIA labels.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`).
- Keyboard navigation must work for all interactive flows.
- Test in all three themes: light, dark, high-contrast.
- Use `vitest-axe` for automated accessibility checks.

## Modules

- 13 modules defined in `DEFAULT_MODULES` in `src/types/index.ts`.
- Module toggles control page access via `AppNav` filtering and route guards in `App.tsx`.
- Each entry form lives in `src/components/forms/` and follows the `FormStep` pattern.
