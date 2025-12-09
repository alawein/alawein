/**
 * Analytics Type Definitions
 */

export interface AnalyticsConfig {
  posthogKey?: string;
  posthogHost?: string;
  enableVercelAnalytics?: boolean;
  enableSpeedInsights?: boolean;
  debug?: boolean;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface AnalyticsUser {
  id: string;
  email?: string;
  name?: string;
  plan?: string;
  [key: string]: unknown;
}

export interface PageViewEvent {
  path: string;
  referrer?: string;
  title?: string;
  properties?: Record<string, unknown>;
}

// Common event names for consistency
export const ANALYTICS_EVENTS = {
  // Auth events
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  PASSWORD_RESET: 'password_reset',

  // Subscription events
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Checkout events
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_ABANDONED: 'checkout_abandoned',

  // Feature usage
  FEATURE_USED: 'feature_used',
  BUTTON_CLICKED: 'button_clicked',
  FORM_SUBMITTED: 'form_submitted',

  // Errors
  ERROR_OCCURRED: 'error_occurred',

  // Navigation
  PAGE_VIEWED: 'page_viewed',
  LINK_CLICKED: 'link_clicked',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
