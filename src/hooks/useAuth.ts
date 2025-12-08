import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { storageService } from '@/services/storage';
import { apiService } from '@/services/api';
import { validateEmail, validatePassword } from '@/lib/validation';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  role: 'coach' | 'client';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, profile: { firstName: string; lastName: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (profile: Partial<User['profile']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await storageService.get<string>('refreshToken');
        if (token) {
          await refreshToken();
        }
      } catch (error) {
        logger.warn('Failed to initialize auth', { error });
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new ValidationError(emailValidation.error);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.error);
      }

      logger.info('Attempting login', { email: emailValidation.sanitized });

      const response = await apiService.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', {
        email: emailValidation.sanitized,
        password,
      });

      // Store tokens securely
      apiService.setAccessToken(response.accessToken);
      await storageService.set('refreshToken', response.refreshToken);

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.info('Login successful', { userId: response.user.id });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      logger.error('Login failed', error as Error, { email });
      throw error;
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    profile: { firstName: string; lastName: string }
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new ValidationError(emailValidation.error);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new ValidationError(passwordValidation.error);
      }

      logger.info('Attempting registration', { email: emailValidation.sanitized });

      const response = await apiService.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', {
        email: emailValidation.sanitized,
        password,
        profile,
      });

      // Store tokens securely
      apiService.setAccessToken(response.accessToken);
      await storageService.set('refreshToken', response.refreshToken);

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.info('Registration successful', { userId: response.user.id });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      logger.error('Registration failed', error as Error, { email });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      logger.info('Logging out', { userId: state.user?.id });
      await apiService.post('/auth/logout', {});
    } catch (error) {
      logger.error('Logout error', error as Error);
    } finally {
      apiService.setAccessToken(null);
      await storageService.remove('refreshToken');
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      logger.info('Logout complete');
    }
  }, [state.user?.id]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = await storageService.get<string>('refreshToken');
      if (!refreshToken) {
        throw new AuthenticationError('No refresh token');
      }

      logger.debug('Refreshing token');

      const response = await apiService.post<{
        user: User;
        accessToken: string;
      }>('/auth/refresh', { refreshToken });

      apiService.setAccessToken(response.accessToken);

      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      }));

      logger.info('Token refreshed', { userId: response.user.id });
    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      await logout();
      throw error;
    }
  }, [logout]);

  const updateProfile = useCallback(async (profile: Partial<User['profile']>) => {
    try {
      logger.info('Updating profile', { userId: state.user?.id });

      const response = await apiService.put<{ user: User }>('/auth/profile', profile);

      setState(prev => ({
        ...prev,
        user: response.user,
      }));

      logger.info('Profile updated', { userId: response.user.id });
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      throw error;
    }
  }, [state.user?.id]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshToken,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
