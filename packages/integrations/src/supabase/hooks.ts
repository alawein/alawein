/**
 * Supabase React Hooks
 *
 * Provides React hooks for authentication and real-time subscriptions.
 * Requires React 18+ as a peer dependency.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { getSupabaseClient } from './client.js';
import { signIn, signUp, signOut, signInWithOAuth, type SignInOptions, type SignUpOptions } from './auth.js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export interface UseAuthReturn extends AuthState {
  signIn: (options: SignInOptions) => Promise<{ error: AuthError | null }>;
  signUp: (options: SignUpOptions) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

/**
 * React hook for Supabase authentication
 *
 * Provides user, session, loading state, and auth methods.
 * Automatically subscribes to auth state changes.
 *
 * @example
 * ```tsx
 * import { useAuth } from '@alawein/integrations/supabase/hooks';
 *
 * function LoginButton() {
 *   const { user, isLoading, signIn, signOut } = useAuth();
 *
 *   if (isLoading) return <Spinner />;
 *   if (user) return <button onClick={signOut}>Sign Out</button>;
 *   return <button onClick={() => signIn({ email, password })}>Sign In</button>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Set up auth state listener FIRST (prevents race conditions)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
        error: null,
      }));
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
        error: error ?? null,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = useCallback(async (options: SignInOptions) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const { error } = await signIn(options);
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false, error }));
    }
    return { error };
  }, []);

  const handleSignUp = useCallback(async (options: SignUpOptions) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const { error } = await signUp(options);
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false, error }));
    }
    return { error };
  }, []);

  const handleSignOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const { error } = await signOut();
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false, error }));
    }
    return { error };
  }, []);

  const handleSignInWithProvider = useCallback(async (provider: Provider) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const { error } = await signInWithOAuth({ provider });
    if (error) {
      setState((prev) => ({ ...prev, isLoading: false, error }));
    }
    return { error };
  }, []);

  const handleRefreshSession = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      setState((prev) => ({ ...prev, error }));
    } else if (data.session) {
      const session = data.session;
      setState((prev) => ({
        ...prev,
        session,
        user: session.user,
        isAuthenticated: true,
        error: null,
      }));
    }
  }, []);

  return {
    ...state,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithProvider: handleSignInWithProvider,
    refreshSession: handleRefreshSession,
  };
}

