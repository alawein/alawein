export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate?: number;
}

export function initSentry(config: SentryConfig) {
  if (typeof window === 'undefined') return;
  
  console.log('Sentry initialized:', config.environment);
  // Actual Sentry SDK integration would go here
  // import * as Sentry from '@sentry/react';
  // Sentry.init({ ...config });
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error, context);
  // Sentry.captureException(error, { extra: context });
}
