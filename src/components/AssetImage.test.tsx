import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import AssetImage from '../components/AssetImage';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('AssetImage', () => {
  it('renders the brand mark image when a registered asset is requested', () => {
    renderWithTheme(
      <AssetImage assetKey="brandMark" alt="Brand" />,
    );
    const img = screen.getByRole('img', { name: 'Brand' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src');
  });

  it('renders the fallback when the asset key is not registered', () => {
    renderWithTheme(
      <AssetImage
        assetKey="stateEmpty"
        alt="Empty"
        fallback={<span data-testid="fallback">📭</span>}
      />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders nothing when neither asset nor fallback are provided', () => {
    const { container } = renderWithTheme(
      <AssetImage assetKey="stateEmpty" alt="Empty" />,
    );
    expect(container.querySelector('img')).toBeNull();
  });

  it('applies decorative attributes when decorative prop is true', () => {
    const { container } = renderWithTheme(
      <AssetImage assetKey="brandMark" alt="Brand" decorative />,
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('aria-hidden', 'true');
    expect(img).toHaveAttribute('role', 'presentation');
  });

  it('applies className to the rendered image', () => {
    renderWithTheme(
      <AssetImage assetKey="brandMark" alt="Brand" className="h-10 w-10" />,
    );
    const img = screen.getByRole('img', { name: 'Brand' });
    expect(img.className).toContain('h-10');
    expect(img.className).toContain('w-10');
  });
});
