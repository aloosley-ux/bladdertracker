import { render } from '@testing-library/react';
import App from '../App';
import { adminStorageState, authenticatedStorageState } from './fixtures';

function seedLocalStorage(state: Record<string, unknown>) {
  window.localStorage.clear();
  for (const [key, value] of Object.entries(state)) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function renderAppAtRoute(
  path: string,
  options?: {
    admin?: boolean;
    overrides?: Record<string, unknown>;
  },
) {
  const state = options?.admin ? adminStorageState : authenticatedStorageState;
  seedLocalStorage({ ...state, ...options?.overrides });
  window.history.pushState({}, 'Test route', path);
  return render(<App />);
}
