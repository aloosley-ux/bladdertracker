import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import DashboardPage from './DashboardPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('DashboardPage', () => {
  it('renders with seeded diary data', async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 })).toBeInTheDocument();
  }, 15000);

  it('has no critical or serious axe violations', async () => {
    const { container } = renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 })).toBeInTheDocument();

    const results = await axe(container);
    const seriousViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(seriousViolations).toEqual([]);
  }, 15000);

  it('does not render quick navigation links', async () => {
    renderWithProviders(<DashboardPage />);

    await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 });

    expect(screen.queryByRole('navigation', { name: /quick navigation/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Open diary')).not.toBeInTheDocument();
    expect(screen.queryByText('Reports')).not.toBeInTheDocument();
  }, 15000);

  it('renders "Today\'s entries" heading above the feed', async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /today.s entries/i }, { timeout: 5000 })).toBeInTheDocument();
  }, 15000);
});
