/**
 * Environment variable utilities for integrations
 */

export interface EnvConfig {
  // Supabase
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // Stripe
  VITE_STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;

  // Resend
  RESEND_API_KEY?: string;

  // Sentry
  VITE_SENTRY_DSN?: string;
  SENTRY_AUTH_TOKEN?: string;

  // Analytics
  VITE_POSTHOG_KEY?: string;
  VITE_POSTHOG_HOST?: string;

  // General
  VITE_APP_ENV?: 'development' | 'staging' | 'production';
  VITE_APP_URL?: string;
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  // Support both Vite and Node.js environments
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as Record<string, string>)[key] ?? fallback;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
}

/**
 * Require environment variable (throws if missing)
 */
export function requireEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Validate all required environment variables for a specific integration
 */
export function validateEnv(integration: 'supabase' | 'stripe' | 'resend' | 'sentry' | 'all'): {
  valid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  const requiredVars: Record<string, string[]> = {
    supabase: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'],
    stripe: ['VITE_STRIPE_PUBLISHABLE_KEY'],
    resend: ['RESEND_API_KEY'],
    sentry: ['VITE_SENTRY_DSN'],
  };

  const optionalVars: Record<string, string[]> = {
    supabase: ['SUPABASE_SERVICE_ROLE_KEY'],
    stripe: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
    resend: [],
    sentry: ['SENTRY_AUTH_TOKEN'],
  };

  const integrations = integration === 'all' ? Object.keys(requiredVars) : [integration];

  for (const int of integrations) {
    for (const key of requiredVars[int] || []) {
      if (!getEnvVar(key)) {
        missing.push(key);
      }
    }
    for (const key of optionalVars[int] || []) {
      if (!getEnvVar(key)) {
        warnings.push(`${key} not set (optional for ${int})`);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvVar('VITE_APP_ENV') === 'production' || getEnvVar('NODE_ENV') === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnvVar('VITE_APP_ENV') === 'development' || getEnvVar('NODE_ENV') === 'development';
}

/**
 * Get the app URL
 */
export function getAppUrl(): string {
  return getEnvVar('VITE_APP_URL') || 'http://localhost:5173';
}
