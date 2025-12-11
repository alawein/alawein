/**
 * @file Sidebar.test.tsx
 * @description Tests for Sidebar component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../layout/Sidebar';

describe('Sidebar', () => {
  it('should render navigation heading', () => {
    render(<Sidebar />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <Sidebar>
        <div>Child Content</div>
      </Sidebar>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector('aside');
    expect(aside).toHaveClass('w-64', 'border-r', 'bg-card');
  });
});
