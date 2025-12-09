/**
 * Stripe Type Definitions
 */

export interface StripeConfig {
  publishableKey: string;
  secretKey?: string;
  webhookSecret?: string;
}

export interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  successUrl?: string;
  cancelUrl?: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  mode?: 'payment' | 'subscription' | 'setup';
  allowPromotionCodes?: boolean;
  trialPeriodDays?: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

export interface PortalSessionResponse {
  url: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | 'week' | 'day';
  intervalCount: number;
  features: string[];
  metadata?: Record<string, string>;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  plan: SubscriptionPlan;
}

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
    previous_attributes?: Record<string, unknown>;
  };
  created: number;
  livemode: boolean;
}

export interface InvoiceData {
  id: string;
  customerId: string;
  subscriptionId: string | null;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amountDue: number;
  amountPaid: number;
  currency: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
  created: Date;
  dueDate: Date | null;
}

export interface PaymentIntentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
  metadata: Record<string, string>;
}
