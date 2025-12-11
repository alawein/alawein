/**
 * @file About.test.tsx
 * @description Tests for About page component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About', () => {
  it('should render page title', () => {
    render(<About />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('should render background section', () => {
    render(<About />);
    expect(screen.getByText('Background')).toBeInTheDocument();
  });

  it('should render current focus section', () => {
    render(<About />);
    expect(screen.getByText('Current Focus')).toBeInTheDocument();
  });

  it('should render technical skills section', () => {
    render(<About />);
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('should render companies section', () => {
    render(<About />);
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Alawein Technologies LLC')).toBeInTheDocument();
    expect(screen.getByText('REPZ LLC')).toBeInTheDocument();
    expect(screen.getByText('Live It Iconic LLC')).toBeInTheDocument();
  });

  it('should mention key projects in current focus', () => {
    render(<About />);
    // Use getAllByText since these appear multiple times
    const librexMentions = screen.getAllByText(/Librex/);
    const mezanMentions = screen.getAllByText(/MEZAN/);
    const talaiMentions = screen.getAllByText(/TalAI/);
    expect(librexMentions.length).toBeGreaterThan(0);
    expect(mezanMentions.length).toBeGreaterThan(0);
    expect(talaiMentions.length).toBeGreaterThan(0);
  });
});
