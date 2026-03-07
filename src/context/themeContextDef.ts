import { createContext } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (val: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
