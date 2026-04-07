import { useContext } from 'react';
import { ThemeContext } from './themeContextDef';

// useTheme — hook to access theme state and toggle from ThemeContext.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
