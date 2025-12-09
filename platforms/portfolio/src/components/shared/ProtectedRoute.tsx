import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  isAuthenticated,
  isLoading = false,
  redirectTo = '/auth',
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
