/**
 * @file ProtectedRoute.test.tsx
 * @description Tests for ProtectedRoute component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/ProtectedRoute';

const ProtectedContent = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

const renderWithRouter = (isAuthenticated: boolean, isLoading = false) => {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to auth when not authenticated', () => {
    renderWithRouter(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading spinner when isLoading is true', () => {
    renderWithRouter(false, true);
    // Loading spinner should be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to custom path when redirectTo is specified', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/custom-login" element={<div>Custom Login</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute isAuthenticated={false} redirectTo="/custom-login">
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Custom Login')).toBeInTheDocument();
  });
});
