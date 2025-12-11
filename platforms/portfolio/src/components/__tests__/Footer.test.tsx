/**
 * @file Footer.test.tsx
 * @description Tests for Footer component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../layout/Footer';

describe('Footer', () => {
  it('should render copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument();
  });

  it('should render author name', () => {
    render(<Footer />);
    expect(screen.getByText(/Meshaal Alawein/)).toBeInTheDocument();
  });

  it('should render social links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
  });

  it('should have correct href for GitHub link', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/alawein');
  });

  it('should open social links in new tab', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
