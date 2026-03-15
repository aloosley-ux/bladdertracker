import { screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import DashboardPage from './DashboardPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('DashboardPage', () => {
  it('renders with seeded diary data', async () => {
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 })).toBeInTheDocument();
  }, 15000);

  it('does not render the redundant quick nav links (Open Diary, Reports, Milestones, Quick add)', async () => {
    renderWithProviders(<DashboardPage />);

    await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 });

    // These redundant links were removed — they duplicate bottom-nav functionality
    expect(screen.queryByRole('link', { name: /open diary/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /quick add/i })).not.toBeInTheDocument();
  }, 15000);

  it('renders a "Today\'s entries" heading above the entries list', async () => {
    renderWithProviders(<DashboardPage />);

    await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 });

    expect(screen.getByText(/today's entries/i)).toBeInTheDocument();
  }, 15000);

  it('CelebrationBanner renders with a dismiss button', async () => {
    renderWithProviders(<DashboardPage />);

    await screen.findByRole('heading', { name: /dashboard heading/i }, { timeout: 5000 });

    // The banner should have a dismiss button
    expect(screen.getByRole('button', { name: /dismiss banner/i })).toBeInTheDocument();
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
