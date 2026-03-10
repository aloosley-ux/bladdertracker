import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';
import { authenticatedStorageState } from './fixtures';

function seedLocalStorage(state: Record<string, unknown>) {
  window.localStorage.clear();
  for (const [key, value] of Object.entries(state)) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: {
    route?: string;
    overrides?: Record<string, unknown>;
  },
) {
  seedLocalStorage({ ...authenticatedStorageState, ...options?.overrides });
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[options?.route ?? '/']}>
        <AppProvider>{ui}</AppProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}
