import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/renderWithProviders';
import TodayCombined from './TodayCombined';

describe('TodayCombined', () => {
  it('renders summary and quickAdd slots', () => {
    const summaryText = 'Summary area';
    const quickText = 'Quick add area';

    renderWithProviders(
      <TodayCombined
        summary={<div>{summaryText}</div>}
        quickAdd={<div>{quickText}</div>}
      />,
      { route: '/' },
    );

    expect(screen.getByText(summaryText)).toBeInTheDocument();
    expect(screen.getByText(quickText)).toBeInTheDocument();
  });
});
