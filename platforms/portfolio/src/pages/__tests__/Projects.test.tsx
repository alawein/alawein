/**
 * @file Projects.test.tsx
 * @description Tests for Projects page component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

describe('Projects', () => {
  it('should render page title', () => {
    render(<Projects />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should render all projects', () => {
    render(<Projects />);
    expect(screen.getByText('Librex')).toBeInTheDocument();
    expect(screen.getByText('MEZAN')).toBeInTheDocument();
    expect(screen.getByText('TalAI')).toBeInTheDocument();
    expect(screen.getByText('REPZ')).toBeInTheDocument();
    expect(screen.getByText('SimCore')).toBeInTheDocument();
    expect(screen.getByText('QMLab')).toBeInTheDocument();
  });

  it('should render project descriptions', () => {
    render(<Projects />);
    expect(screen.getByText(/High-performance optimization library/)).toBeInTheDocument();
    expect(screen.getByText(/ML\/AI DevOps platform/)).toBeInTheDocument();
  });

  it('should render project tags', () => {
    render(<Projects />);
    // Use getAllByText since tags appear multiple times
    const pythonTags = screen.getAllByText('Python');
    const typescriptTags = screen.getAllByText('TypeScript');
    expect(pythonTags.length).toBeGreaterThan(0);
    expect(typescriptTags.length).toBeGreaterThan(0);
    expect(screen.getByText('CUDA')).toBeInTheDocument();
  });

  it('should render GitHub links', () => {
    render(<Projects />);
    const sourceLinks = screen.getAllByText('Source');
    expect(sourceLinks.length).toBeGreaterThan(0);
  });

  it('should render demo link for TalAI', () => {
    render(<Projects />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });
});
