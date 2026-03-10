import { screen } from '@testing-library/react';
import { renderAppAtRoute } from './renderApp';

const routeCases = [
  {
    path: '/log',
    waitFor: () => screen.findByText(/review daily updates and tidy up anything you need to change/i, {}, { timeout: 5000 }),
  },
  {
    path: '/add',
    waitFor: () => screen.findByRole('heading', { name: /add an update/i }),
  },
  {
    path: '/reports',
    waitFor: () => screen.findByRole('heading', { name: /trends — reports/i }),
  },
  {
    path: '/milestones',
    waitFor: () => screen.findByRole('heading', { name: /^milestones$/i }),
  },
  {
    path: '/leaps',
    waitFor: () => screen.findAllByRole('heading', { name: /developmental leaps/i }),
  },
  {
    path: '/calendar',
    waitFor: () => screen.findByRole('heading', { name: /calendar/i }),
  },
  {
    path: '/profiles',
    waitFor: () => screen.findByRole('heading', { name: /^profiles$/i }),
  },
  {
    path: '/settings',
    waitFor: () => screen.findByRole('heading', { name: /account & settings/i }),
  },
  {
    path: '/help',
    waitFor: () => screen.findByRole('heading', { name: /help & support/i }),
  },
] as const;

describe('application routes', () => {
  it.each(routeCases)('renders $path without crashing', async ({ path, waitFor }) => {
    renderAppAtRoute(path);
    const result = await waitFor();
    expect(result).toBeTruthy();
  }, 15000);

  it('renders the admin page for an admin user', async () => {
    renderAppAtRoute('/admin', { admin: true });
    expect(await screen.findByText(/admin panel/i)).toBeInTheDocument();
  });
});
