/**
 * Nexus Security Middleware
 * Provides security headers, CSP, and protection mechanisms
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { NexusConfig } from '@nexus/shared';

export interface SecurityOptions {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXFrame?: boolean;
  customHeaders?: Record<string, string>;
  cspDirectives?: Record<string, string[]>;
}

export function createSecurityMiddleware(
  config: NexusConfig,
  options: SecurityOptions = {}
) {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableXFrame = true,
    customHeaders = {},
    cspDirectives = {},
  } = options;

  // Default security headers
  const securityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // Custom headers
    ...customHeaders,
  };

  // Add HSTS if enabled and in production
  if (enableHSTS && process.env.NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] =
      'max-age=31536000; includeSubDomains; preload';
  }

  // Add X-Frame-Options if enabled
  if (enableXFrame) {
    securityHeaders['X-Frame-Options'] = 'DENY';
  }

  return (req: Request, res: Response, next: NextFunction) => {
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Apply CSP if enabled
    if (enableCSP) {
      const csp = generateCSP(cspDirectives);
      res.setHeader('Content-Security-Policy', csp);
    }

    next();
  };
}

function generateCSP(customDirectives: Record<string, string[]>): string {
  const defaultDirectives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  };

  // Merge with custom directives
  const directives = { ...defaultDirectives, ...customDirectives };

  // Build CSP string
  return Object.entries(directives)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

/**
 * Rate limiting middleware
 */
export function createRateLimitMiddleware(options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) {
  const { windowMs, max, message = 'Too many requests', skipSuccessfulRequests = false } = options;
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    // Clean up expired entries
    for (const [k, v] of requests.entries()) {
      if (now > v.resetTime) {
        requests.delete(k);
      }
    }

    // Get or create request record
    let record = requests.get(key);
    if (!record) {
      record = { count: 0, resetTime: now + windowMs };
      requests.set(key, record);
    }

    // Check if rate limit exceeded
    if (record.count >= max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    // Increment count
    record.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

    // Skip successful requests if configured
    if (skipSuccessfulRequests) {
      const originalSend = res.send;
      res.send = function(data) {
        if (res.statusCode < 400) {
          requests.delete(key);
        }
        return originalSend.call(this, data);
      };
    }

    next();
  };
}

/**
 * Authentication middleware
 */
export function createAuthMiddleware(options: {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
}) {
  const { required = false, roles = [], permissions = [] } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        if (required) {
          return res.status(401).json({ error: 'Authentication required' });
        }
        return next();
      }

      // Verify token (this would integrate with your auth system)
      const user = await verifyToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check roles
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Check permissions
      if (permissions.length > 0) {
        const hasPermission = permissions.some(p => user.permissions?.includes(p));
        if (!hasPermission) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      // Attach user to request
      (req as any).user = user;
      next();

    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ error: 'Authentication error' });
    }
  };
}

/**
 * Audit logging middleware
 */
export function createAuditMiddleware(options: {
  logLevel?: 'info' | 'warn' | 'error';
  excludePaths?: string[];
  sensitiveFields?: string[];
}) {
  const { logLevel = 'info', excludePaths = [], sensitiveFields = [] } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Capture original send
    const originalSend = res.send;
    let responseData: any;

    res.send = function(data) {
      responseData = data;
      return originalSend.call(this, data);
    };

    // Log after response
    res.on('finish', () => {
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        userId: (req as any).user?.id,
        duration: Date.now() - (req as any).startTime,
      };

      // Sanitize sensitive data
      if (req.body && Object.keys(req.body).length > 0) {
        logData.body = sanitizeData(req.body, sensitiveFields);
      }

      // Log based on status code
      if (res.statusCode >= 500) {
        console.error('[AUDIT]', logData);
      } else if (res.statusCode >= 400) {
        console.warn('[AUDIT]', logData);
      } else {
        console.log('[AUDIT]', logData);
      }
    });

    // Track start time
    (req as any).startTime = Date.now();
    next();
  };
}

/**
 * CORS middleware
 */
export function createCorsMiddleware(options: {
  origins?: string[];
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
}) {
  const {
    origins = ['http://localhost:3000'],
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (origin && origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Set other CORS headers
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', headers.join(', '));

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  };
}

/**
 * Input validation middleware
 */
export function createValidationMiddleware(schema: any, source = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = (req as any)[source];
      const validated = schema.parse(data);
      (req as any)[source] = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
}

/**
 * Secret validation middleware
 */
export function createSecretValidationMiddleware(requiredSecrets: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);

    if (missingSecrets.length > 0) {
      console.error(`Missing required secrets: ${missingSecrets.join(', ')}`);
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Required environment variables are missing',
      });
    }

    next();
  };
}

// Helper functions
async function verifyToken(token: string): Promise<any> {
  // This would integrate with your auth system
  // For now, return mock user
  try {
    // Example: JWT verification
    // return jwt.verify(token, process.env.JWT_SECRET);

    // Mock implementation
    return {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user',
      permissions: ['read', 'write'],
    };
  } catch (error) {
    return null;
  }
}

function sanitizeData(data: any, sensitiveFields: string[]): any {
  if (!data || typeof data !== 'object') return data;

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  for (const key in sanitized) {
    if (sensitiveFields.includes(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key], sensitiveFields);
    }
  }

  return sanitized;
}

/**
 * Security configuration generator
 */
export function generateSecurityConfig(config: NexusConfig): SecurityOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    enableCSP: true,
    enableHSTS: isProduction,
    enableXFrame: true,
    customHeaders: {
      'X-Nexus-Security': 'enabled',
      'X-API-Version': config.platform.type || '1.0.0',
    },
    cspDirectives: isProduction ? {
      'script-src': ["'self'"],
      'style-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'https:'],
    } : {},
  };
}
