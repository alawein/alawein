import React, { createContext, useContext, useEffect, useState } from 'react';
import { vercelBackend } from '@/services/vercelBackend';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'client' | 'coach' | 'admin' | 'medical';
  tier?: 'core' | 'adaptive' | 'performance' | 'longevity';
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  authChecked: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, profileData?: any) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('repz_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setRole(userData.role);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // For demo: accept any email/password and create a mock user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' :
              email.includes('coach') ? 'coach' :
              email.includes('medical') ? 'medical' : 'client',
        tier: email.includes('performance') ? 'performance' :
              email.includes('longevity') ? 'longevity' :
              email.includes('adaptive') ? 'adaptive' : 'core'
      };

      // Store in localStorage
      localStorage.setItem('repz_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setRole(mockUser.role);

      return { error: null };
    } catch (error) {
      console.error('Sign in failed:', error);
      return { error: 'Failed to sign in' };
    }
  };

  const signUp = async (email: string, password: string, profileData?: any) => {
    try {
      // Create new user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        full_name: profileData?.fullName || email.split('@')[0],
        role: 'client',
        tier: 'core'
      };

      // Store in localStorage
      localStorage.setItem('repz_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setRole(mockUser.role);

      return { error: null };
    } catch (error) {
      console.error('Sign up failed:', error);
      return { error: 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('repz_user');
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const refreshUserData = async () => {
    // In a real app, this would fetch fresh data from the API
    console.log('Refreshing user data...');
  };

  const value: AuthContextType = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    authChecked,
    signIn,
    signUp,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
