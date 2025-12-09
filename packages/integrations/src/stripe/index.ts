/**
 * Stripe Integration
 *
 * Provides payment processing, subscriptions, and checkout functionality.
 *
 * @example
 * ```ts
 * import { createCheckoutSession, getStripe } from '@alawein/integrations/stripe';
 *
 * // Create checkout session
 * const session = await createCheckoutSession({
 *   priceId: 'price_xxx',
 *   successUrl: '/success',
 *   cancelUrl: '/cancel',
 * });
 *
 * // Redirect to checkout
 * const stripe = await getStripe();
 * await stripe.redirectToCheckout({ sessionId: session.id });
 * ```
 */

export { getStripe, stripePromise } from './client.js';
export { createCheckoutSession, redirectToCheckout, createPortalSession } from './checkout.js';
export { getSubscription, cancelSubscription, updateSubscription, getSubscriptionPlans } from './subscriptions.js';
export type {
  StripeConfig,
  CheckoutOptions,
  SubscriptionPlan,
  CheckoutSessionResponse,
  PortalSessionResponse,
} from './types.js';
