import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    setUser,
    setSession,
    setLoading,
    logout: clearAuth,
  } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      const result = await authService.signIn({ email, password });

      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        const from = (location.state as { from?: Location })?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast({
          title: 'Sign in failed',
          description: result.error || 'Invalid email or password',
          variant: 'destructive',
        });
      }

      setLoading(false);
      return result;
    },
    [navigate, location, toast, setLoading]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      setLoading(true);
      const result = await authService.signUp({ email, password, fullName });

      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      } else {
        toast({
          title: 'Sign up failed',
          description: result.error || 'Could not create account',
          variant: 'destructive',
        });
      }

      setLoading(false);
      return result;
    },
    [toast, setLoading]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    const result = await authService.signOut();

    if (result.success) {
      clearAuth();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      navigate('/auth', { replace: true });
    } else {
      toast({
        title: 'Sign out failed',
        description: result.error || 'Could not sign out',
        variant: 'destructive',
      });
    }

    setLoading(false);
    return result;
  }, [navigate, toast, clearAuth, setLoading]);

  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      const result = await authService.resetPassword(email);

      if (result.success) {
        toast({
          title: 'Reset link sent',
          description: 'Please check your email for the password reset link.',
        });
      } else {
        toast({
          title: 'Reset failed',
          description: result.error || 'Could not send reset link',
          variant: 'destructive',
        });
      }

      setLoading(false);
      return result;
    },
    [toast, setLoading]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      setLoading(true);
      const result = await authService.updatePassword(newPassword);

      if (result.success) {
        toast({
          title: 'Password updated',
          description: 'Your password has been updated successfully.',
        });
      } else {
        toast({
          title: 'Update failed',
          description: result.error || 'Could not update password',
          variant: 'destructive',
        });
      }

      setLoading(false);
      return result;
    },
    [toast, setLoading]
  );

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
