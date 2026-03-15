import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeapsPage from './LeapsPage';
import { renderWithProviders } from '../test/renderWithProviders';
import { LEAP_CHART } from '../data/leapData';

describe('LeapsPage', () => {
  it('maps trusted resource links across early and late leaps', () => {
    expect(LEAP_CHART[0].resourceLinks).toEqual([
      {
        label: 'CDC milestones (1 month)',
        url: 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1mo.html',
      },
    ]);
    expect(LEAP_CHART[9].resourceLinks).toEqual([
      {
        label: 'CDC milestones (2 years)',
        url: 'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-2yr.html',
      },
    ]);
  });

  it('renders trusted resource links for expanded leap details', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LeapsPage />);

    // Navigate to the Timeline section first (LeapTimeline is in the Timeline tab)
    await user.click(await screen.findByRole('button', { name: /timeline/i }));

    await user.click(await screen.findByRole('button', { name: /changing sensations/i }));

    const trustedResourceLink = await screen.findByRole('link', { name: /cdc milestones \(1 month\)/i });
    expect(trustedResourceLink).toHaveAttribute(
      'href',
      'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1mo.html',
    );
    expect(trustedResourceLink).toHaveAttribute('target', '_blank');
    expect(trustedResourceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('defaults to the milestones tab', async () => {
    renderWithProviders(<LeapsPage />);

    // The Milestones section should be active by default
    const milestonesButton = await screen.findByRole('button', { name: /milestones/i });
    expect(milestonesButton.className).toMatch(/bg-lavender-500/);
  });

  it('does not render a tools tab', async () => {
    renderWithProviders(<LeapsPage />);

    expect(screen.queryByRole('button', { name: /tools/i })).not.toBeInTheDocument();
  });
});
