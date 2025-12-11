import React from 'react';

interface WithAuthenticatorProps {
  children: React.ReactNode;
}

// Higher-order component for authentication
export default function withAuthenticator<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithAuthenticatorProps> {
  return function AuthenticatedComponent(props: P & WithAuthenticatorProps) {
    // Placeholder implementation - would check actual auth state
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      // Simulate auth check
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1000);
    }, []);

    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <div>Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Sign In</h2>
          <input type="email" placeholder="Email" style={{ padding: '0.5rem' }} />
          <input type="password" placeholder="Password" style={{ padding: '0.5rem' }} />
          <button
            onClick={() => setIsAuthenticated(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#5b21b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Sign In
          </button>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
