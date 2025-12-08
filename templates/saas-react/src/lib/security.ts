import { getSecurityHeaders } from '@alawein/security-headers';

/**
 * Apply security headers to fetch requests
 */
export function applySecurityHeaders(headers: HeadersInit = {}): HeadersInit {
  const securityHeaders = getSecurityHeaders(import.meta.env.MODE as 'development' | 'production');
  
  return {
    ...headers,
    ...Object.fromEntries(
      Object.entries(securityHeaders).filter(([key]) => 
        !['Strict-Transport-Security', 'Content-Security-Policy'].includes(key)
      )
    ),
  };
}

/**
 * Secure fetch wrapper with security headers
 */
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = applySecurityHeaders(options.headers);
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin',
  });
}
