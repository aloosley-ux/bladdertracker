import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { renderAppAtRoute } from './renderApp';

const routeCases = [
  { path: '/log', admin: false, waitFor: () => screen.findByText(/review daily updates and tidy up anything you need to change/i, {}, { timeout: 5000 }) },
  { path: '/add', admin: false, waitFor: () => screen.findByRole('heading', { name: /add an update/i }) },
  { path: '/reports', admin: false, waitFor: () => screen.findByRole('heading', { name: /trends — reports/i }) },
  { path: '/milestones', admin: false, waitFor: () => screen.findByRole('heading', { name: /^milestones$/i }) },
  { path: '/leaps', admin: false, waitFor: () => screen.findAllByRole('heading', { name: /developmental leaps/i }) },
  { path: '/calendar', admin: false, waitFor: () => screen.findByRole('heading', { name: /calendar/i }) },
  { path: '/profiles', admin: false, waitFor: () => screen.findByRole('heading', { name: /^profiles$/i }) },
  { path: '/settings', admin: false, waitFor: () => screen.findByRole('heading', { name: /account & settings/i }) },
  { path: '/help', admin: false, waitFor: () => screen.findByRole('heading', { name: /help & support/i }) },
  { path: '/admin', admin: true, waitFor: () => screen.findByRole('heading', { name: /admin panel/i }) },
] as const;

describe('route accessibility', () => {
  it.each(routeCases)('has no obvious axe violations on $path', async ({ path, admin, waitFor }) => {
    const { container } = renderAppAtRoute(path, { admin });
    expect(await waitFor()).toBeTruthy();
    const results = await axe(container);
    const seriousViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );
    expect(seriousViolations).toEqual([]);
  }, 15000);
});
