import { useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, _password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Placeholder for actual auth logic
      void _password; // Used for authentication
      const user = { id: '1', email, name: 'User' };
      setState({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}

