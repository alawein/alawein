/**
 * @file ABTestingDashboard.test.tsx
 * @description Tests for ABTestingDashboard page
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ABTestingDashboard from '../ABTestingDashboard';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ABTestingDashboard', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should render the page title', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('A/B Testing')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Manage experiments and analyze results')).toBeInTheDocument();
  });

  it('should render create experiment button', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Create Experiment')).toBeInTheDocument();
  });

  it('should render running experiments count', () => {
    renderWithRouter(<ABTestingDashboard />);
    const runningElements = screen.getAllByText('Running');
    expect(runningElements.length).toBeGreaterThan(0);
  });

  it('should render total experiments count', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Total Experiments')).toBeInTheDocument();
  });

  it('should render active variants count', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Active Variants')).toBeInTheDocument();
  });

  it('should render experiment cards', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Pricing Page Layout')).toBeInTheDocument();
    expect(screen.getByText('CTA Button Color')).toBeInTheDocument();
    expect(screen.getByText('Onboarding Flow')).toBeInTheDocument();
  });

  it('should render experiment descriptions', () => {
    renderWithRouter(<ABTestingDashboard />);
    expect(screen.getByText('Test different pricing page layouts for conversion')).toBeInTheDocument();
    expect(screen.getByText('Test primary CTA button colors')).toBeInTheDocument();
  });

  it('should render variant names', () => {
    renderWithRouter(<ABTestingDashboard />);
    const controlElements = screen.getAllByText('Control');
    expect(controlElements.length).toBeGreaterThan(0);
  });

  it('should render view details buttons', () => {
    renderWithRouter(<ABTestingDashboard />);
    const viewButtons = screen.getAllByText('View Details');
    expect(viewButtons.length).toBeGreaterThan(0);
  });
});
