import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeapsPage from './LeapsPage';
import { renderWithProviders } from '../test/renderWithProviders';

describe('LeapsPage', () => {
  it('renders trusted resource links for expanded leap details', async () => {
    const user = userEvent.setup();

    renderWithProviders(<LeapsPage />);

    await user.click(await screen.findByRole('button', { name: /changing sensations/i }));

    const trustedResourceLink = await screen.findByRole('link', { name: /cdc milestones \(1 month\)/i });
    expect(trustedResourceLink).toHaveAttribute(
      'href',
      'https://www.cdc.gov/ncbddd/actearly/milestones/milestones-1mo.html',
    );
    expect(trustedResourceLink).toHaveAttribute('target', '_blank');
    expect(trustedResourceLink).toHaveAttribute('rel', 'noreferrer');
  });
});
