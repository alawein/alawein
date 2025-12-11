/**
 * @file Header.test.tsx
 * @description Tests for Header component
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../layout/Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  it('should render the logo/brand name', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Meshaal Alawein')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should have correct link destinations', () => {
    renderWithRouter(<Header />);
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks[0].closest('a')).toHaveAttribute('href', '/');
  });

  it('should render mobile menu button', () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });

  it('should toggle mobile menu when button is clicked', () => {
    renderWithRouter(<Header />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Initially mobile nav should not be visible (only desktop nav)
    const navElements = screen.getAllByRole('navigation');
    expect(navElements.length).toBe(1);
    
    // Click to open mobile menu
    fireEvent.click(menuButton);
    
    // Now there should be 2 nav elements (desktop + mobile)
    const navElementsAfterClick = screen.getAllByRole('navigation');
    expect(navElementsAfterClick.length).toBe(2);
  });
});
