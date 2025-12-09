/**
 * Sentry Type Definitions
 */

export interface SentryConfig {
  dsn: string;
  environment?: 'development' | 'staging' | 'production';
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  debug?: boolean;
  enabled?: boolean;
  integrations?: unknown[];
  beforeSend?: (event: unknown) => unknown | null;
  ignoreErrors?: (string | RegExp)[];
}

export interface SentryUser {
  id: string;
  email?: string;
  username?: string;
  ip_address?: string;
  [key: string]: unknown;
}

export interface SentryContext {
  [key: string]: unknown;
}

export interface SentryBreadcrumb {
  category?: string;
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  data?: Record<string, unknown>;
}

export interface SentryTransaction {
  name: string;
  op?: string;
  description?: string;
  data?: Record<string, unknown>;
}

export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
