/**
 * Sentry Error Monitoring Integration
 *
 * Provides error tracking and performance monitoring.
 *
 * @example
 * ```ts
 * // In your app's entry point (main.tsx)
 * import { initSentry } from '@alawein/integrations/sentry';
 *
 * initSentry({
 *   dsn: import.meta.env.VITE_SENTRY_DSN,
 *   environment: import.meta.env.VITE_APP_ENV,
 * });
 *
 * // Capture errors manually
 * import { captureError, captureMessage } from '@alawein/integrations/sentry';
 *
 * try {
 *   // risky operation
 * } catch (error) {
 *   captureError(error, { context: 'checkout' });
 * }
 * ```
 */

export {
  initSentry,
  captureError,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  startTransaction,
  withScope,
} from './client.js';
export { SentryErrorBoundary } from './error-boundary.jsx';
export type { SentryConfig, SentryUser, SentryContext } from './types.js';
