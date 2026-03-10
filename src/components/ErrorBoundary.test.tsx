import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function CrashingChild() {
  throw new Error('boom');
  return null;
}

describe('ErrorBoundary', () => {
  it('shows the fallback UI when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <CrashingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    expect(screen.getByRole('button', { name: /refresh tracker/i })).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
