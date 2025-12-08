import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create response and apply security headers
  const response = NextResponse.next();

  // Environment-based security header configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = request.nextUrl.protocol === 'https:';

  // Content Security Policy (production only)
  if (isProduction) {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.repzfitness.com https://www.google-analytics.com",
      "media-src 'self' https://cdn.repzfitness.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  }

  // HTTP Strict Transport Security (HTTPS + production only)
  if (isProduction && isHttps) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Frame protection (always enabled)
  response.headers.set('X-Frame-Options', 'DENY');

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content type protection
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Debug logging (development only)
  if (!isProduction) {
    console.log('Security middleware applied to:', request.url);
  }

  return response;
}

// Configure middleware to run on all paths except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
