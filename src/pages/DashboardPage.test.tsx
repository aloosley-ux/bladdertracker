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
});
