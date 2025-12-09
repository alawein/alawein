// Subscription types for REPZ payment system

export type SubscriptionTier = 'free' | 'premium' | 'core' | 'adaptive' | 'performance' | 'longevity';

export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number; // in cents
  billingCycle: BillingCycle;
  stripePriceId?: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'paused' | 'unpaid';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionStatus {
  isActive: boolean;
  tier: SubscriptionTier;
  expiresAt?: Date;
  cancelAtPeriodEnd: boolean;
}

// Premium tier plans (new basic subscription)
export const PREMIUM_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    tier: 'premium',
    price: 1999, // $19.99
    billingCycle: 'monthly',
    features: [
      'Unlimited workout tracking',
      'Video library access',
      'Progress analytics',
      'Community access',
      'Mobile app access'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    tier: 'premium',
    price: 19999, // $199.99 (save ~17%)
    billingCycle: 'yearly',
    features: [
      'Unlimited workout tracking',
      'Video library access',
      'Progress analytics',
      'Community access',
      'Mobile app access',
      'Save $40/year'
    ]
  }
];

export const getSubscriptionPlan = (planId: string): SubscriptionPlan | undefined => {
  return PREMIUM_PLANS.find(plan => plan.id === planId);
};

export const getPlansByTier = (tier: SubscriptionTier): SubscriptionPlan[] => {
  return PREMIUM_PLANS.filter(plan => plan.tier === tier);
};
