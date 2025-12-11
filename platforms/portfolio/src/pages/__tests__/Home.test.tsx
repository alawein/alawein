/**
 * @file Home.test.tsx
 * @description Tests for Home page component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home', () => {
  it('should render hero section with title', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/AI\/ML Researcher/)).toBeInTheDocument();
  });

  it('should render View Projects link', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument();
  });

  it('should render Get in Touch link', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('should render skills section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Core Expertise')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
    expect(screen.getByText('AI/ML Engineering')).toBeInTheDocument();
  });

  it('should render featured projects section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('Librex')).toBeInTheDocument();
    expect(screen.getByText('MEZAN')).toBeInTheDocument();
    expect(screen.getByText('TalAI')).toBeInTheDocument();
  });

  it('should have correct link destinations', () => {
    renderWithRouter(<Home />);
    const projectsLink = screen.getByRole('link', { name: /view projects/i });
    expect(projectsLink).toHaveAttribute('href', '/projects');
    
    const contactLink = screen.getByRole('link', { name: /get in touch/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
