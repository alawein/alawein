/**
 * Sentry Client Configuration
 *
 * Provides error tracking and performance monitoring for React/Vite applications.
 */

import * as Sentry from '@sentry/react';
import { getEnvVar, isProduction } from '../env.js';
import type { SentryConfig, SentryUser, SentryBreadcrumb, SeverityLevel } from './types.js';

let isInitialized = false;

/**
 * Initialize Sentry
 * Call this once in your app's entry point
 */
export function initSentry(config?: Partial<SentryConfig>): void {
  if (isInitialized) {
    console.warn('Sentry is already initialized');
    return;
  }

  const dsn = config?.dsn || getEnvVar('VITE_SENTRY_DSN');

  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking disabled. ' + 'Set VITE_SENTRY_DSN environment variable.');
    return;
  }

  const environment = config?.environment || getEnvVar('VITE_APP_ENV') || 'development';
  const enabled = config?.enabled ?? isProduction();

  Sentry.init({
    dsn,
    environment,
    release: config?.release,
    debug: config?.debug ?? false,
    enabled,

    // Performance monitoring
    tracesSampleRate: config?.tracesSampleRate ?? (isProduction() ? 0.1 : 1.0),

    // Session Replay
    replaysSessionSampleRate: config?.replaysSessionSampleRate ?? 0.1,
    replaysOnErrorSampleRate: config?.replaysOnErrorSampleRate ?? 1.0,

    // Filter out common noise
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error exception captured',
      ...(config?.ignoreErrors || []),
    ],

    beforeSend: config?.beforeSend,
    integrations: config?.integrations as Sentry.Integration[] | undefined,
  });

  isInitialized = true;
}

/**
 * Capture an error
 */
export function captureError(error: Error | string, context?: Record<string, unknown>): string {
  const eventId = Sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
    extra: context,
  });
  return eventId;
}

/**
 * Capture a message
 */
export function captureMessage(
  message: string,
  level: SeverityLevel = 'info',
  context?: Record<string, unknown>,
): string {
  return Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user context
 */
export function setUser(user: SentryUser | null): void {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
  Sentry.addBreadcrumb({
    category: breadcrumb.category,
    message: breadcrumb.message,
    level: breadcrumb.level,
    data: breadcrumb.data,
  });
}

/**
 * Start a performance transaction
 */
export function startTransaction(name: string, op?: string): ReturnType<typeof Sentry.startInactiveSpan> {
  return Sentry.startInactiveSpan({
    name,
    op,
  });
}

/**
 * Execute callback within an isolated scope
 */
export function withScope(callback: (scope: Sentry.Scope) => void): void {
  Sentry.withScope(callback);
}

/**
 * Set extra context data
 */
export function setContext(name: string, context: Record<string, unknown>): void {
  Sentry.setContext(name, context);
}

/**
 * Set a tag
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}
