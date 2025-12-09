import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

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
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-current border-t-transparent text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
