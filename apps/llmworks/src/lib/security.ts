/**
 * Security utilities for LLM Works platform
 * Implements security best practices for client-side applications
 */

// Content Security Policy configuration
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Vite requires inline scripts in development
    "'unsafe-eval'", // Required for development hot reload
    'https://api.llmworks.dev',
    'https://vercel.live',
    'https://vercel.app',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS solutions
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:', // For base64 images
    'https:', // Allow HTTPS images
    'blob:', // For generated images
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.llmworks.dev',
    'https://api.openai.com',
    'https://api.anthropic.com',
    'https://generativelanguage.googleapis.com',
    'wss://api.llmworks.dev',
    import.meta.env.DEV ? 'ws://localhost:*' : '',
    import.meta.env.DEV ? 'http://localhost:*' : '',
  ].filter(Boolean),
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
};

// Security headers for production
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), clipboard-read=(), clipboard-write=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 10000); // Limit length
};

/**
 * Validate and sanitize API keys
 */
export const sanitizeApiKey = (apiKey: string): string => {
  if (typeof apiKey !== 'string') {
    return '';
  }

  // Remove any potential malicious content
  const sanitized = apiKey
    .replace(/[^\w\-_.]/g, '')
    .trim()
    .slice(0, 200); // Reasonable max length for API keys

  // Basic format validation
  if (sanitized.length < 10 || sanitized.length > 200) {
    throw new Error('Invalid API key format');
  }

  return sanitized;
};

/**
 * Validate URLs to prevent SSRF attacks
 */
export const validateUrl = (url: string): boolean => {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTPS in production
    if (import.meta.env.PROD && parsedUrl.protocol !== 'https:') {
      return false;
    }

    // Allow HTTP only for localhost in development
    if (parsedUrl.protocol === 'http:' && !parsedUrl.hostname.includes('localhost')) {
      return false;
    }

    // Prevent access to private networks
    const privateNetworks = [
      '10.', '172.16.', '172.17.', '172.18.', '172.19.',
      '172.20.', '172.21.', '172.22.', '172.23.', '172.24.',
      '172.25.', '172.26.', '172.27.', '172.28.', '172.29.',
      '172.30.', '172.31.', '192.168.', '127.', '0.'
    ];

    if (privateNetworks.some(network => parsedUrl.hostname.startsWith(network))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Secure local storage operations
 */
export const secureStorage = {
  get: (key: string): string | null => {
    try {
      const item = localStorage.getItem(`llmworks_${key}`);
      if (!item) return null;

      // Basic integrity check
      const parsed = JSON.parse(item);
      if (parsed.timestamp && Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000) {
        // Remove expired items (30 days)
        secureStorage.remove(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      const item = {
        value: sanitizeInput(value),
        timestamp: Date.now(),
      };
      localStorage.setItem(`llmworks_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`llmworks_${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('llmworks_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  },
};

/**
 * Rate limiting for API calls
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const apiRateLimiter = new RateLimiter();

/**
 * Secure API request wrapper
 */
export const secureApiCall = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Validate URL
  if (!validateUrl(url)) {
    throw new Error('Invalid or unsafe URL');
  }

  // Rate limiting
  const domain = new URL(url).hostname;
  if (!apiRateLimiter.isAllowed(domain)) {
    throw new Error('Rate limit exceeded');
  }

  // Secure headers
  const secureHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-cache',
    ...options.headers,
  };

  // Timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: secureHeaders,
      signal: controller.signal,
      credentials: 'omit', // Don't send cookies to third-party APIs
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Cryptographically secure random string generation
 */
export const generateSecureId = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('');
};

/**
 * Hash sensitive data for logging (without exposing actual values)
 */
export const hashForLogging = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
};

/**
 * Security event logging
 */
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  if (import.meta.env.PROD) {
    // In production, you might want to send to a security monitoring service
    console.warn(`[SECURITY] ${event}`, details);
  }
};

/**
 * Initialize security configurations
 */
export const initSecurity = () => {
  // Set up Content Security Policy if supported
  if (document.head && !document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    
    const cspString = Object.entries(CSP_DIRECTIVES)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
    
    cspMeta.content = cspString;
    document.head.appendChild(cspMeta);
  }

  // Monitor for potential XSS attempts
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.error && event.error.message && event.error.message.includes('script')) {
        logSecurityEvent('Potential XSS attempt detected', {
          message: event.error.message,
          source: event.filename,
          line: event.lineno,
        });
      }
    });
  }

  // Set up postMessage security
  window.addEventListener('message', (event) => {
    // Only accept messages from same origin or trusted domains
    const trustedOrigins = [
      window.location.origin,
      'https://llmworks.dev',
      'https://api.llmworks.dev',
    ];

    if (!trustedOrigins.includes(event.origin)) {
      logSecurityEvent('Untrusted postMessage received', {
        origin: event.origin,
        data: typeof event.data,
      });
      return;
    }
  });

  console.log('🛡️ Security features initialized');
};