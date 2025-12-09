/**
 * Analytics Integration
 *
 * Provides Vercel Analytics and optional Posthog for behavioral analytics.
 *
 * @example
 * ```tsx
 * // In your app's root component
 * import { AnalyticsProvider, trackEvent } from '@alawein/integrations/analytics';
 *
 * function App() {
 *   return (
 *     <AnalyticsProvider>
 *       <MyApp />
 *     </AnalyticsProvider>
 *   );
 * }
 *
 * // Track custom events
 * trackEvent('button_clicked', { buttonId: 'signup' });
 * ```
 */

export { AnalyticsProvider, trackEvent, trackPageView, identifyUser, resetUser } from './client.js';
export { VercelAnalytics, VercelSpeedInsights } from './vercel.js';
export type { AnalyticsConfig, AnalyticsEvent, AnalyticsUser } from './types.js';
