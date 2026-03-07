import { useState, type ReactNode } from 'react';
import { ThemeContext } from './themeContextDef';

type Theme = 'light' | 'dark' | 'high-contrast';

const STORAGE_KEY = 'bt_theme';
const DYSLEXIA_KEY = 'bt_dyslexia_font';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'high-contrast') {
      return stored;
    }
  } catch { /* localStorage unavailable */ }
  return 'light';
}

function getInitialDyslexia(): boolean {
  try {
    return localStorage.getItem(DYSLEXIA_KEY) === 'true';
  } catch { return false; }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function applyDyslexia(val: boolean) {
  document.documentElement.setAttribute('data-dyslexia', String(val));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  const [dyslexiaFont, setDyslexiaState] = useState<boolean>(() => {
    const initial = getInitialDyslexia();
    applyDyslexia(initial);
    return initial;
  });

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* localStorage unavailable */ }
    applyTheme(next);
  };

  const setDyslexiaFont = (val: boolean) => {
    setDyslexiaState(val);
    try {
      localStorage.setItem(DYSLEXIA_KEY, String(val));
    } catch { /* localStorage unavailable */ }
    applyDyslexia(val);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, dyslexiaFont, setDyslexiaFont }}>
      {children}
    </ThemeContext.Provider>
  );
}
