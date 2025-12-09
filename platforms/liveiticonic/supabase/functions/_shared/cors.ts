/**
 * Shared CORS Configuration for Supabase Edge Functions
 *
 * Usage:
 * ```typescript
 * import { corsHeaders, handleCors, createCorsResponse } from '../_shared/cors.ts';
 *
 * Deno.serve(async (req) => {
 *   // Handle preflight
 *   if (req.method === 'OPTIONS') {
 *     return handleCors(req);
 *   }
 *
 *   // Your logic here...
 *   return createCorsResponse({ data: result });
 * });
 * ```
 */

// Allowed origins - configure per environment
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'https://liveiticonic.com',
  'https://www.liveiticonic.com',
  'https://shop.liveiticonic.com',
  // Lovable.dev preview URLs
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovableproject\.com$/,
];

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  return ALLOWED_ORIGINS.some((allowed) => {
    if (typeof allowed === 'string') {
      return allowed === origin;
    }
    return allowed.test(origin);
  });
}

/**
 * Get CORS headers for a request
 */
export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin');
  const allowedOrigin = isOriginAllowed(origin) ? origin! : (ALLOWED_ORIGINS[0] as string);

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-request-id, stripe-signature',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Default CORS headers (for backwards compatibility)
 * Use getCorsHeaders(req) for dynamic origin handling
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id, stripe-signature',
};

/**
 * Handle CORS preflight request
 */
export function handleCors(req: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

/**
 * Create a JSON response with CORS headers
 */
export function createCorsResponse<T>(
  data: T,
  options: {
    status?: number;
    headers?: Record<string, string>;
    req?: Request;
  } = {},
): Response {
  const { status = 200, headers = {}, req } = options;
  const cors = req ? getCorsHeaders(req) : corsHeaders;

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Create an error response with CORS headers
 */
export function createErrorResponse(
  error: string | { code: string; message: string; details?: unknown },
  options: {
    status?: number;
    req?: Request;
  } = {},
): Response {
  const { status = 400, req } = options;
  const cors = req ? getCorsHeaders(req) : corsHeaders;

  const errorBody = typeof error === 'string' ? { error: { code: 'ERROR', message: error } } : { error };

  return new Response(JSON.stringify(errorBody), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Wrap a handler with CORS support
 */
export function withCors(handler: (req: Request) => Promise<Response>): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return handleCors(req);
    }

    // Call handler and add CORS headers to response
    const response = await handler(req);
    const cors = getCorsHeaders(req);

    // Clone response with CORS headers
    const newHeaders = new Headers(response.headers);
    Object.entries(cors).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}
