/**
 * Analytics Client
 *
 * Unified analytics interface supporting Vercel Analytics and Posthog.
 */

import { track } from '@vercel/analytics';
import { getEnvVar } from '../env.js';
import type { AnalyticsConfig, AnalyticsUser, AnalyticsEvent } from './types.js';
import type { ReactNode } from 'react';
import { VercelAnalytics, VercelSpeedInsights } from './vercel.js';

// Optional Posthog integration
let posthog: {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (id: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
} | null = null;

/**
 * Initialize Posthog (if configured)
 */
async function initPosthog(config: AnalyticsConfig): Promise<void> {
  if (!config.posthogKey) return;

  try {
    const ph = await import('posthog-js');
    ph.default.init(config.posthogKey, {
      api_host: config.posthogHost || 'https://app.posthog.com',
      loaded: () => {
        if (config.debug) {
          console.log('[Analytics] Posthog initialized');
        }
      },
    });
    posthog = ph.default;
  } catch (error) {
    console.warn('[Analytics] Failed to load Posthog:', error);
  }
}

/**
 * Track a custom event
 */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  // Vercel Analytics
  track(name, properties);

  // Posthog
  if (posthog) {
    posthog.capture(name, properties);
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, properties?: Record<string, unknown>): void {
  trackEvent('page_viewed', {
    path,
    ...properties,
  });
}

/**
 * Identify a user
 */
export function identifyUser(user: AnalyticsUser): void {
  if (posthog) {
    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      plan: user.plan,
      ...user,
    });
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUser(): void {
  if (posthog) {
    posthog.reset();
  }
}

/**
 * Track multiple events
 */
export function trackEvents(events: AnalyticsEvent[]): void {
  events.forEach((event) => {
    trackEvent(event.name, event.properties);
  });
}

interface AnalyticsProviderProps {
  children: ReactNode;
  config?: AnalyticsConfig;
}

/**
 * Analytics Provider Component
 * Wrap your app with this to enable all analytics
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider } from '@alawein/integrations/analytics';
 *
 * function App() {
 *   return (
 *     <AnalyticsProvider config={{ posthogKey: 'phc_xxx' }}>
 *       <MyApp />
 *     </AnalyticsProvider>
 *   );
 * }
 * ```
 */
export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const mergedConfig: AnalyticsConfig = {
    posthogKey: getEnvVar('VITE_POSTHOG_KEY'),
    posthogHost: getEnvVar('VITE_POSTHOG_HOST'),
    enableVercelAnalytics: true,
    enableSpeedInsights: true,
    ...config,
  };

  // Initialize Posthog on mount
  if (typeof window !== 'undefined' && mergedConfig.posthogKey) {
    initPosthog(mergedConfig);
  }

  return (
    <>
      {children}
      {mergedConfig.enableVercelAnalytics && <VercelAnalytics />}
      {mergedConfig.enableSpeedInsights && <VercelSpeedInsights />}
    </>
  );
}
