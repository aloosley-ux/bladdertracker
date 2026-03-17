import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import PageShell from './PageShell';

function renderWithTheme(ui: ReactElement) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>,
  );
}

describe('PageShell', () => {
  it('renders a decorative hero asset when a registered hero key is provided', () => {
    const { container } = renderWithTheme(
      <PageShell
        heroAssetKey="pageDashboardHero"
        heroContent={<h1>Dashboard hero</h1>}
      >
        <p>Dashboard content</p>
      </PageShell>,
    );

    const heroImage = container.querySelector('img');
    expect(heroImage).not.toBeNull();
    expect(heroImage).toHaveAttribute('src');
    expect(heroImage).toHaveAttribute('alt', '');
    expect(heroImage).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders hero content and page children in order', () => {
    renderWithTheme(
      <PageShell
        heroAssetKey="pageDashboardHero"
        heroContent={<h1>Dashboard hero</h1>}
      >
        <p>Dashboard content</p>
      </PageShell>,
    );

    expect(screen.getByRole('heading', { name: 'Dashboard hero' })).toBeInTheDocument();
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  it('renders children without an image when no hero key is provided', () => {
    const { container } = renderWithTheme(
      <PageShell heroContent={<h1>No hero asset</h1>}>
        <p>Content only</p>
      </PageShell>,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Content only')).toBeInTheDocument();
  });
});
