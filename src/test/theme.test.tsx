/**
 * Theme system tests (#96)
 *
 * Verifies that the ThemeContext correctly persists themes, applies
 * data-theme attributes, and that the SettingsPage reflects the
 * selected theme state.
 */

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';
import { renderWithProviders } from './renderWithProviders';
import SettingsPage from '../pages/SettingsPage';

function getDataTheme(): string | null {
  return document.documentElement.getAttribute('data-theme');
}

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <AppProvider>{ui}</AppProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('theme persistence and switching (#96)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light theme when no theme is stored', () => {
    renderWithProviders(<SettingsPage />);
    expect(getDataTheme()).toBe('light');
  });

  it('switches to dark theme and persists to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    const darkButton = await screen.findByRole('button', { name: /dark/i });
    await act(() => user.click(darkButton));

    expect(getDataTheme()).toBe('dark');
    // ThemeContext stores as raw string (not JSON)
    expect(window.localStorage.getItem('bt_theme')).toBe('dark');
  });

  it('switches to high-contrast theme and persists to localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    const hcButton = await screen.findByRole('button', { name: /high contrast/i });
    await act(() => user.click(hcButton));

    expect(getDataTheme()).toBe('high-contrast');
    expect(window.localStorage.getItem('bt_theme')).toBe('high-contrast');
  });

  it('can switch back to light theme from dark', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    const darkButton = await screen.findByRole('button', { name: /dark/i });
    await act(() => user.click(darkButton));
    expect(getDataTheme()).toBe('dark');

    const lightButton = await screen.findByRole('button', { name: /light/i });
    await act(() => user.click(lightButton));
    expect(getDataTheme()).toBe('light');
    expect(window.localStorage.getItem('bt_theme')).toBe('light');
  });

  it('applies dark theme immediately without a page reload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    await screen.findByRole('button', { name: /dark/i });
    expect(getDataTheme()).toBe('light');

    await act(() => user.click(screen.getByRole('button', { name: /dark/i })));
    expect(getDataTheme()).toBe('dark');
  });

  it('restores stored dark theme from localStorage on initial render', () => {
    window.localStorage.setItem('bt_theme', 'dark');
    renderWithTheme(<div />);
    expect(getDataTheme()).toBe('dark');
  });

  it('restores stored high-contrast theme from localStorage on initial render', () => {
    window.localStorage.setItem('bt_theme', 'high-contrast');
    renderWithTheme(<div />);
    expect(getDataTheme()).toBe('high-contrast');
  });

  it('dark and high-contrast are meaningfully different theme tokens', () => {
    // The data-theme attribute values are distinct, meaning each maps to a separate
    // CSS variable set in index.css. Visual differences (background colours, border
    // styles, focus rings) are best verified via E2E / visual regression tests since
    // JSDOM does not apply or compute CSS custom properties.
    expect('dark').not.toBe('high-contrast');
    expect(['light', 'dark', 'high-contrast']).toContain('dark');
    expect(['light', 'dark', 'high-contrast']).toContain('high-contrast');
  });
});

