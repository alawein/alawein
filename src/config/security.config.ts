// Environment-based security configuration
import { SecurityService } from '@/lib/security';

export interface SecurityConfig {
  // Authentication
  auth: {
    tokenExpiry: number;
    refreshTokenExpiry: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  
  // API Security
  api: {
    timeout: number;
    maxRetries: number;
    retryDelay: number;
    baseUrl: string;
  };
  
  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  
  // CORS
  cors: {
    allowedOrigins: string[];
    allowCredentials: boolean;
  };
  
  // Headers
  headers: {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableFrameProtection: boolean;
    customHeaders?: Record<string, string>;
  };
  
  // Encryption
  encryption: {
    algorithm: string;
    keyLength: number;
  };
  
  // Logging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableAuditTrail: boolean;
  };
}

// Default security configuration
const defaultConfig: SecurityConfig = {
  auth: {
    tokenExpiry: 15 * 60, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  api: {
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: true,
  },
  
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    allowCredentials: true,
  },
  
  headers: {
    enableCSP: process.env.NODE_ENV === 'production',
    enableHSTS: process.env.NODE_ENV === 'production',
    enableFrameProtection: true,
    customHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 32, // 256 bits
  },
  
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    enableAuditTrail: process.env.NODE_ENV === 'production',
  },
};

// Create and export configured security service
export const securityService = new SecurityService({
  enableCSP: defaultConfig.headers.enableCSP,
  enableHSTS: defaultConfig.headers.enableHSTS,
  corsOrigins: defaultConfig.cors.allowedOrigins,
  rateLimiting: {
    windowMs: defaultConfig.rateLimit.windowMs,
    max: defaultConfig.rateLimit.maxRequests,
  },
});

// Export configuration
export const securityConfig = defaultConfig;

// Export security headers function
export const getSecurityHeaders = () => {
  const headers: Record<string, string> = {
    ...defaultConfig.headers.customHeaders,
  };

  if (defaultConfig.headers.enableCSP) {
    headers['Content-Security-Policy'] = securityService.generateCSPHeader();
  }

  if (defaultConfig.headers.enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  if (defaultConfig.headers.enableFrameProtection) {
    headers['X-Frame-Options'] = 'DENY';
  }

  return headers;
};

// Validate configuration on module load
const validateSecurityConfig = () => {
  const errors: string[] = [];
  
  if (defaultConfig.auth.tokenExpiry < 60) {
    errors.push('Token expiry should be at least 60 seconds');
  }
  
  if (defaultConfig.auth.refreshTokenExpiry <= defaultConfig.auth.tokenExpiry) {
    errors.push('Refresh token expiry should be greater than access token expiry');
  }
  
  if (defaultConfig.rateLimit.maxRequests < 1) {
    errors.push('Rate limit max requests should be at least 1');
  }
  
  if (defaultConfig.cors.allowedOrigins.length === 0) {
    errors.push('At least one CORS origin should be allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get security configuration summary for debugging
 */
export function getSecurityConfigSummary(): Record<string, unknown> {
  return {
    environment: process.env.NODE_ENV || 'development',
    auth: {
      tokenExpiry: `${securityConfig.auth.tokenExpiry}s`,
      maxLoginAttempts: securityConfig.auth.maxLoginAttempts,
    },
    api: {
      timeout: `${securityConfig.api.timeout}ms`,
      maxRetries: securityConfig.api.maxRetries,
    },
    headers: securityConfig.headers,
    logging: {
      level: securityConfig.logging.level,
      remoteEnabled: securityConfig.logging.enableAuditTrail,
    },
  };
}

/**
 * Get security headers for HTTP responses
 */
export function getResponseHeaders(): Record<string, string> {
  const headers = securityConfig.headers.customHeaders || {};
  
  if (!securityConfig.headers.enableHSTS) {
    delete headers['Strict-Transport-Security'];
  }
  
  if (!securityConfig.headers.enableCSP) {
    delete headers['Content-Security-Policy'];
  }
  
  if (!securityConfig.headers.enableFrameProtection) {
    delete headers['X-Frame-Options'];
  }
  
  return headers;
}

// Validate configuration on module load
const validation = validateSecurityConfig();
if (!validation.valid) {
  console.warn('Security configuration warnings:', validation.errors);
}