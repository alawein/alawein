/**
 * Security Headers Package
 * Provides consistent security headers across applications
 */

export interface SecurityHeadersOptions {
  /** Enable Content Security Policy */
  csp?: boolean;
  /** Custom CSP directives */
  cspDirectives?: Record<string, string>;
  /** Environment mode */
  mode?: 'development' | 'production';
}

const defaultCSP = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: blob: https:",
  'font-src': "'self' data:",
  'connect-src': "'self' https: wss:",
  'frame-ancestors': "'self'",
  'base-uri': "'self'",
  'form-action': "'self'",
};

const productionCSP = {
  ...defaultCSP,
  'script-src': "'self'",
  'upgrade-insecure-requests': '',
};

/**
 * Generate security headers for HTTP responses
 */
export function getSecurityHeaders(
  mode: 'development' | 'production' = 'production',
  options: SecurityHeadersOptions = {}
): Record<string, string> {
  const cspDirectives = mode === 'production' ? productionCSP : defaultCSP;
  const mergedCSP = { ...cspDirectives, ...options.cspDirectives };

  const cspString = Object.entries(mergedCSP)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ');

  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...(options.csp !== false && { 'Content-Security-Policy': cspString }),
  };
}

/**
 * Generate security headers for Vite dev server
 */
export function getViteSecurityHeaders(mode: 'development' | 'production'): Record<string, string> {
  return getSecurityHeaders(mode, {
    csp: mode === 'production', // Disable CSP in dev for HMR
  });
}

export default getSecurityHeaders;
