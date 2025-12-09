/**
 * Supabase Authentication Helpers
 *
 * Provides authentication utilities for sign in, sign up, OAuth, and session management.
 */

import type { AuthError, AuthResponse, OAuthResponse, Provider, Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from './client.js';
import { getAppUrl } from '../env.js';

export interface SignInOptions {
  email: string;
  password: string;
}

export interface SignUpOptions extends SignInOptions {
  metadata?: Record<string, unknown>;
  redirectTo?: string;
}

export interface OAuthOptions {
  provider: Provider;
  redirectTo?: string;
  scopes?: string;
}

/**
 * Sign in with email and password
 */
export async function signIn({ email, password }: SignInOptions): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUp({ email, password, metadata, redirectTo }: SignUpOptions): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: redirectTo || `${getAppUrl()}/auth/callback`,
    },
  });
}

/**
 * Sign in with OAuth provider (Google, GitHub, Apple, etc.)
 */
export async function signInWithOAuth({ provider, redirectTo, scopes }: OAuthOptions): Promise<OAuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${getAppUrl()}/auth/callback`,
      scopes,
    },
  });
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = getSupabaseClient();
  return supabase.auth.signOut();
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string,
  redirectTo?: string,
): Promise<{
  data: object;
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${getAppUrl()}/auth/reset-password`,
  });
}

/**
 * Update user password (requires user to be logged in)
 */
export async function updatePassword(newPassword: string): Promise<{
  data: { user: User | null };
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.auth.updateUser({ password: newPassword });
}

/**
 * Get current session
 */
export async function getSession(): Promise<{
  data: { session: Session | null };
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.auth.getSession();
}

/**
 * Get current user
 */
export async function getUser(): Promise<{
  data: { user: User | null };
  error: AuthError | null;
}> {
  const supabase = getSupabaseClient();
  return supabase.auth.getUser();
}

// Note: useAuth React hook is available in './hooks.js'
// import { useAuth } from '@alawein/integrations/supabase/hooks';

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.refreshSession();
}

/**
 * Exchange auth code for session (for OAuth callbacks)
 */
export async function exchangeCodeForSession(code: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.exchangeCodeForSession(code);
}
