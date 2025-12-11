/**
 * @file Contact.test.tsx
 * @description Tests for Contact page component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

describe('Contact', () => {
  it('should render page title', () => {
    render(<Contact />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
  });

  it('should render contact form', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('should render contact methods', () => {
    render(<Contact />);
    // Use getAllByText since Email appears in both form label and contact method
    const emailElements = screen.getAllByText('Email');
    expect(emailElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
  });

  it('should render location section', () => {
    render(<Contact />);
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText(/remote work/i)).toBeInTheDocument();
  });

  it('should have correct email link', () => {
    render(<Contact />);
    const emailLink = screen.getByRole('link', { name: /contact@alawein.dev/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@alawein.dev');
  });
});
