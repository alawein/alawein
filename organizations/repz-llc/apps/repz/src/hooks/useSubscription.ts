import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { SubscriptionStatus, SubscriptionTier, UserSubscription } from '@/types/subscription';
import type { Subscription } from '@/integrations/supabase/types';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch current subscription status
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query subscriptions table with tier information
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_tiers (
            name,
            display_name
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error
        throw fetchError;
      }

      if (data) {
        // Map database status to our type
        const mappedStatus = data.status === 'paused' ? 'canceled' : 
                           data.status === 'unpaid' ? 'past_due' : 
                           data.status as 'active' | 'trialing' | 'past_due' | 'canceled';

        setSubscription({
          id: data.id,
          userId: data.user_id,
          tier: (data.subscription_tiers as any)?.name as SubscriptionTier || 'free',
          status: mappedStatus,
          stripeSubscriptionId: data.stripe_subscription_id || undefined,
          stripeCustomerId: data.stripe_customer_id || undefined,
          currentPeriodStart: data.current_period_start ? new Date(data.current_period_start) : new Date(),
          currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : new Date(),
          cancelAtPeriodEnd: data.cancel_at_period_end || false,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      toast.error('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    fetchSubscription();

    // Set up real-time subscription
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription]);

  // Get subscription status
  const getStatus = useCallback((): SubscriptionStatus => {
    if (!subscription) {
      return {
        isActive: false,
        tier: 'free',
        cancelAtPeriodEnd: false
      };
    }

    return {
      isActive: subscription.status === 'active',
      tier: subscription.tier,
      expiresAt: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    };
  }, [subscription]);

  // Check if user has access to a specific tier
  const hasTierAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (!subscription || subscription.status !== 'active') {
      return requiredTier === 'free';
    }

    const tierHierarchy: SubscriptionTier[] = ['free', 'premium', 'core', 'adaptive', 'performance', 'longevity'];
    const userTierIndex = tierHierarchy.indexOf(subscription.tier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

    return userTierIndex >= requiredTierIndex;
  }, [subscription]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!subscription?.stripeSubscriptionId) {
      toast.error('No active subscription to cancel');
      return false;
    }

    try {
      const { error: cancelError } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId
        }
      });

      if (cancelError) throw cancelError;

      toast.success('Subscription will be canceled at the end of the billing period');
      await fetchSubscription();
      return true;
    } catch (err) {
      console.error('Error canceling subscription:', err);
      toast.error('Failed to cancel subscription');
      return false;
    }
  }, [subscription, fetchSubscription]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    if (!subscription?.stripeSubscriptionId) {
      toast.error('No subscription to reactivate');
      return false;
    }

    try {
      const { error: reactivateError } = await supabase.functions.invoke('reactivate-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId
        }
      });

      if (reactivateError) throw reactivateError;

      toast.success('Subscription reactivated successfully');
      await fetchSubscription();
      return true;
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      toast.error('Failed to reactivate subscription');
      return false;
    }
  }, [subscription, fetchSubscription]);

  // Update payment method
  const updatePaymentMethod = useCallback(async () => {
    if (!subscription?.stripeCustomerId) {
      toast.error('No customer found');
      return null;
    }

    try {
      const { data, error: portalError } = await supabase.functions.invoke('create-customer-portal', {
        body: {
          customerId: subscription.stripeCustomerId,
          returnUrl: window.location.href
        }
      });

      if (portalError) throw portalError;

      if (data?.url) {
        window.location.href = data.url;
        return data.url;
      }

      throw new Error('No portal URL received');
    } catch (err) {
      console.error('Error opening customer portal:', err);
      toast.error('Failed to open payment settings');
      return null;
    }
  }, [subscription]);

  return {
    subscription,
    loading,
    error,
    status: getStatus(),
    hasTierAccess,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    refetch: fetchSubscription
  };
}
