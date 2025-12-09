/**
 * Stripe Client Initialization
 *
 * Provides a singleton Stripe instance for client-side operations.
 * Uses lazy loading to only initialize when needed.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance (lazy loaded singleton)
 * @returns Promise resolving to Stripe instance or null
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Payment features will be disabled.');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

/**
 * Check if Stripe is configured
 * @returns boolean indicating if Stripe key is available
 */
export function isStripeConfigured(): boolean {
  return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

/**
 * Create a Stripe Checkout session and redirect
 * @param options Checkout session options
 */
export async function createCheckoutSession(options: {
  items: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>;
  customerEmail?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ url: string; sessionId: string }> {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      items: options.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      customer_email: options.customerEmail,
      shipping_address: options.shippingAddress,
      success_url: options.successUrl || `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: options.cancelUrl || `${window.location.origin}/checkout`,
      mode: 'payment',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

// Legacy export for backward compatibility
export const stripe = {
  init: getStripe,
  getStripe,
  isConfigured: isStripeConfigured,
  createCheckoutSession,
};
