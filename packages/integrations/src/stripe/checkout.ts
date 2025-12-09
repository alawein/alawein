/**
 * Stripe Checkout Helpers
 *
 * Provides checkout session creation and management.
 * Note: Session creation requires a backend/API route.
 */

import { getStripe } from './client.js';
import type { CheckoutOptions, CheckoutSessionResponse, PortalSessionResponse } from './types.js';
import { getAppUrl } from '../env.js';

/**
 * Create a checkout session via API
 * This should call your backend API which uses Stripe server-side SDK
 *
 * @example
 * ```ts
 * // In your API route (e.g., /api/stripe/checkout)
 * import Stripe from 'stripe';
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 * const session = await stripe.checkout.sessions.create({
 *   mode: options.mode || 'subscription',
 *   line_items: [{ price: options.priceId, quantity: options.quantity || 1 }],
 *   success_url: options.successUrl,
 *   cancel_url: options.cancelUrl,
 * });
 * ```
 */
export async function createCheckoutSession(
  options: CheckoutOptions,
  apiEndpoint: string = '/api/stripe/checkout',
): Promise<CheckoutSessionResponse> {
  const appUrl = getAppUrl();

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId: options.priceId,
      quantity: options.quantity || 1,
      successUrl: options.successUrl || `${appUrl}/checkout/success`,
      cancelUrl: options.cancelUrl || `${appUrl}/checkout/cancel`,
      customerId: options.customerId,
      customerEmail: options.customerEmail,
      metadata: options.metadata,
      mode: options.mode || 'subscription',
      allowPromotionCodes: options.allowPromotionCodes,
      trialPeriodDays: options.trialPeriodDays,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();

  if (!stripe) {
    throw new Error('Stripe not loaded');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Create a customer portal session
 * Allows customers to manage their subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl?: string,
  apiEndpoint: string = '/api/stripe/portal',
): Promise<PortalSessionResponse> {
  const appUrl = getAppUrl();

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      returnUrl: returnUrl || `${appUrl}/account`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portal session');
  }

  return response.json();
}

/**
 * Quick checkout - creates session and redirects in one call
 */
export async function quickCheckout(options: CheckoutOptions): Promise<void> {
  const session = await createCheckoutSession(options);
  await redirectToCheckout(session.sessionId);
}
