import { screen } from '@testing-library/react';
import { renderAppAtRoute } from './test/renderApp';

describe('App', () => {
  it('renders the dashboard for an authenticated local user', async () => {
    renderAppAtRoute('/help');

    expect(await screen.findByRole('heading', { name: /help & support/i })).toBeInTheDocument();
  });
});
