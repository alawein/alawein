/**
 * @file AdminDashboard.test.tsx
 * @description Tests for AdminDashboard page
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AdminDashboard', () => {
  it('should render the page title', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should render platform analytics subtitle', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Platform analytics and metrics')).toBeInTheDocument();
  });

  it('should render time range buttons', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('7 Days')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
    expect(screen.getByText('90 Days')).toBeInTheDocument();
  });

  it('should render key metrics cards', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('API Requests')).toBeInTheDocument();
    expect(screen.getByText('Active Subscriptions')).toBeInTheDocument();
  });

  it('should render platform usage section', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Platform Usage')).toBeInTheDocument();
  });

  it('should render all 5 platforms', () => {
    renderWithRouter(<AdminDashboard />);
    const simcoreElements = screen.getAllByText('SimCore');
    const mezanElements = screen.getAllByText('MEZAN');
    const talaiElements = screen.getAllByText('TalAI');
    const optilibriaElements = screen.getAllByText('OptiLibria');
    const qmlabElements = screen.getAllByText('QMLab');
    expect(simcoreElements.length).toBeGreaterThan(0);
    expect(mezanElements.length).toBeGreaterThan(0);
    expect(talaiElements.length).toBeGreaterThan(0);
    expect(optilibriaElements.length).toBeGreaterThan(0);
    expect(qmlabElements.length).toBeGreaterThan(0);
  });

  it('should render subscription distribution section', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Subscription Distribution')).toBeInTheDocument();
  });

  it('should render subscription tiers', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('should render recent activity section', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('should render activity items', () => {
    renderWithRouter(<AdminDashboard />);
    expect(screen.getByText('New user signup')).toBeInTheDocument();
    expect(screen.getByText('Subscription upgraded')).toBeInTheDocument();
    expect(screen.getByText('API key generated')).toBeInTheDocument();
  });
});
