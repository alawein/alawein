/**
 * @alawein/integrations
 *
 * Shared integration clients for the Alawein monorepo.
 * Provides unified access to Supabase, Stripe, Resend, Sentry, and Vercel Analytics.
 *
 * @example
 * ```ts
 * // Import specific integrations
 * import { createSupabaseClient } from '@alawein/integrations/supabase';
 * import { stripeClient } from '@alawein/integrations/stripe';
 * import { sendEmail } from '@alawein/integrations/resend';
 * import { initSentry } from '@alawein/integrations/sentry';
 * ```
 */

// Re-export all integrations
export * from './supabase/index.js';
export * from './stripe/index.js';
export * from './resend/index.js';
export * from './sentry/index.js';
export * from './analytics/index.js';

// Export types
export type { Database } from './supabase/types.js';
export type { StripeConfig, CheckoutOptions, SubscriptionPlan } from './stripe/types.js';
export type { EmailOptions, EmailTemplate } from './resend/types.js';
export type { SentryConfig } from './sentry/types.js';

// Export environment validation
export { validateEnv, getEnvVar, requireEnvVar } from './env.js';
