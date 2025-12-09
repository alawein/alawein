/**
 * Stripe Client Configuration
 *
 * Provides browser-side Stripe.js client for checkout and payment elements.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { getEnvVar } from '../env.js';

let stripeInstance: Promise<Stripe | null> | null = null;

/**
 * Get or create Stripe.js instance (singleton)
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripeInstance) {
    const publishableKey = getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY');

    if (!publishableKey) {
      console.warn('Stripe publishable key not found. ' + 'Set VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
      return Promise.resolve(null);
    }

    stripeInstance = loadStripe(publishableKey);
  }

  return stripeInstance;
}

/**
 * Promise that resolves to Stripe instance
 * Use this for lazy loading
 */
export const stripePromise = getStripe();

/**
 * Create a new Stripe instance with custom key
 * Useful for testing or multi-tenant scenarios
 */
export function createStripeClient(publishableKey: string): Promise<Stripe | null> {
  return loadStripe(publishableKey);
}
