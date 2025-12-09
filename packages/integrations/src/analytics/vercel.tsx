/**
 * Vercel Analytics Components
 *
 * Drop-in components for Vercel Analytics and Speed Insights.
 */

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * Vercel Analytics Component
 * Add this to your app's root layout
 *
 * @example
 * ```tsx
 * import { VercelAnalytics } from '@alawein/integrations/analytics';
 *
 * function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <VercelAnalytics />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function VercelAnalytics() {
  return <Analytics />;
}

/**
 * Vercel Speed Insights Component
 * Add this to your app's root layout for Core Web Vitals tracking
 *
 * @example
 * ```tsx
 * import { VercelSpeedInsights } from '@alawein/integrations/analytics';
 *
 * function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <VercelSpeedInsights />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function VercelSpeedInsights() {
  return <SpeedInsights />;
}
