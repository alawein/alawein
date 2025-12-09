/**
 * Stripe Subscription Management
 *
 * Provides subscription CRUD operations via API.
 */

import type { Subscription, SubscriptionPlan } from './types.js';

/**
 * Get current user's subscription
 */
export async function getSubscription(apiEndpoint: string = '/api/stripe/subscription'): Promise<Subscription | null> {
  const response = await fetch(apiEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscription');
  }

  return response.json();
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately: boolean = false,
  apiEndpoint: string = '/api/stripe/subscription/cancel',
): Promise<Subscription> {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriptionId,
      cancelImmediately,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel subscription');
  }

  return response.json();
}

/**
 * Update subscription (change plan)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
  apiEndpoint: string = '/api/stripe/subscription/update',
): Promise<Subscription> {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriptionId,
      priceId: newPriceId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update subscription');
  }

  return response.json();
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(
  subscriptionId: string,
  apiEndpoint: string = '/api/stripe/subscription/resume',
): Promise<Subscription> {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriptionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to resume subscription');
  }

  return response.json();
}

/**
 * Get available subscription plans
 * This typically comes from your database or Stripe products
 */
export async function getSubscriptionPlans(apiEndpoint: string = '/api/stripe/plans'): Promise<SubscriptionPlan[]> {
  const response = await fetch(apiEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscription plans');
  }

  return response.json();
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getSubscription();
  if (!subscription) return false;
  return ['active', 'trialing'].includes(subscription.status);
}
