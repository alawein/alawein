/**
 * Rate limiting middleware for API protection
 * Implements token bucket algorithm with sliding window
 */

import { getConfig } from './environment';

export interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;         // Maximum requests per window
  keyGenerator?: (context: unknown) => string; // Function to generate unique keys
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean;     // Don't count failed requests
  message?: string;            // Custom error message
  headers?: boolean;           // Send rate limit headers
  draft_polli_ratelimit_headers?: boolean; // Use draft RFC headers
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// Default rate limit configurations
export const RateLimitPresets = {
  // Strict: 10 requests per minute
  strict: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    headers: true,
  },
  
  // Normal: 60 requests per minute
  normal: {
    windowMs: 60 * 1000,
    maxRequests: 60,
    headers: true,
  },
  
  // Relaxed: 100 requests per minute
  relaxed: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    headers: true,
  },
  
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    headers: true,
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later',
    headers: true,
  },
  
  // Search endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    headers: true,
  },
  
  // Heavy computation endpoints
  compute: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Rate limit exceeded for compute-intensive operations',
    headers: true,
  },
};

/**
 * Token bucket implementation
 */
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number;
  
  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  
  /**
   * Try to consume tokens from the bucket
   */
  tryConsume(count: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    
    return false;
  }
  
  /**
   * Get current token count
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
  
  /**
   * Get time until next token is available
   */
  getRetryAfter(): number {
    if (this.tokens > 0) return 0;
    
    const msPerToken = 1000 / this.refillRate;
    return Math.ceil(msPerToken);
  }
  
  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / 1000) * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

/**
 * Sliding window rate limiter
 */
class SlidingWindowLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  
  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    
    // Clean up old entries periodically
    setInterval(() => this.cleanup(), windowMs);
  }
  
  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get or create request history for this key
    let timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps outside the window
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      this.requests.set(key, timestamps);
      return false;
    }
    
    // Add current timestamp and allow request
    timestamps.push(now);
    this.requests.set(key, timestamps);
    return true;
  }
  
  /**
   * Get rate limit info for a key
   */
  getInfo(key: string): RateLimitInfo {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    let timestamps = this.requests.get(key) || [];
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    const used = timestamps.length;
    const remaining = Math.max(0, this.maxRequests - used);
    
    // Calculate reset time (end of current window)
    const oldestTimestamp = timestamps[0] || now;
    const reset = new Date(oldestTimestamp + this.windowMs);
    
    // Calculate retry after if limit exceeded
    let retryAfter: number | undefined;
    if (remaining === 0 && timestamps.length > 0) {
      retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);
    }
    
    return {
      limit: this.maxRequests,
      remaining,
      reset,
      retryAfter,
    };
  }
  
  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(ts => ts > windowStart);
      
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

/**
 * Main rate limiter class
 */
export class RateLimiter {
  private limiter: SlidingWindowLimiter;
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig) {
    this.config = config;
    this.limiter = new SlidingWindowLimiter(config.windowMs, config.maxRequests);
  }
  
  /**
   * Check if request should be rate limited
   */
  async checkLimit(context?: unknown): Promise<{ allowed: boolean; info: RateLimitInfo }> {
    const key = this.generateKey(context);
    const allowed = this.limiter.isAllowed(key);
    const info = this.limiter.getInfo(key);
    
    return { allowed, info };
  }
  
  /**
   * Express/Connect middleware
   */
  middleware() {
    return async (req: any, res: any, next: any) => {
      const { allowed, info } = await this.checkLimit(req);
      
      // Add rate limit headers if configured
      if (this.config.headers) {
        this.setHeaders(res, info);
      }
      
      if (!allowed) {
        const message = this.config.message || 'Too many requests, please try again later';
        
        res.status(429).json({
          error: message,
          retryAfter: info.retryAfter,
        });
        return;
      }
      
      next();
    };
  }
  
  /**
   * Generate unique key for rate limiting
   */
  private generateKey(context: unknown): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(context);
    }
    
    // Default key generation based on IP address
    if (typeof context === 'object' && context !== null) {
      const req = context as any;
      
      // Try to get IP from various headers
      const ip = req.ip ||
        req.headers?.['x-forwarded-for']?.split(',')[0] ||
        req.headers?.['x-real-ip'] ||
        req.connection?.remoteAddress ||
        'unknown';
      
      return `rate-limit:${ip}`;
    }
    
    return 'rate-limit:global';
  }
  
  /**
   * Set rate limit headers on response
   */
  private setHeaders(res: any, info: RateLimitInfo): void {
    if (this.config.draft_polli_ratelimit_headers) {
      // Draft RFC headers
      res.setHeader('RateLimit-Limit', info.limit);
      res.setHeader('RateLimit-Remaining', info.remaining);
      res.setHeader('RateLimit-Reset', info.reset.toISOString());
    } else {
      // Standard headers
      res.setHeader('X-RateLimit-Limit', info.limit);
      res.setHeader('X-RateLimit-Remaining', info.remaining);
      res.setHeader('X-RateLimit-Reset', Math.floor(info.reset.getTime() / 1000));
    }
    
    if (info.retryAfter !== undefined) {
      res.setHeader('Retry-After', info.retryAfter);
    }
  }
}

/**
 * Create rate limiter with preset configuration
 */
export function createRateLimiter(
  preset: keyof typeof RateLimitPresets,
  overrides?: Partial<RateLimitConfig>
): RateLimiter {
  const config = { ...RateLimitPresets[preset], ...overrides };
  return new RateLimiter(config);
}

/**
 * Global rate limiter for client-side API calls
 */
class ClientRateLimiter {
  private limiters: Map<string, TokenBucket> = new Map();
  
  /**
   * Check if API call is allowed
   */
  async checkApiCall(endpoint: string, weight: number = 1): Promise<boolean> {
    const config = getConfig();
    
    if (!config.security.rateLimiting) {
      return true;
    }
    
    let limiter = this.limiters.get(endpoint);
    
    if (!limiter) {
      // Create limiter based on endpoint type
      const capacity = this.getCapacityForEndpoint(endpoint);
      const refillRate = capacity / 60; // Refill over 1 minute
      
      limiter = new TokenBucket(capacity, refillRate);
      this.limiters.set(endpoint, limiter);
    }
    
    return limiter.tryConsume(weight);
  }
  
  /**
   * Get retry after time for an endpoint
   */
  getRetryAfter(endpoint: string): number {
    const limiter = this.limiters.get(endpoint);
    return limiter ? limiter.getRetryAfter() : 0;
  }
  
  /**
   * Get capacity based on endpoint type
   */
  private getCapacityForEndpoint(endpoint: string): number {
    if (endpoint.includes('/auth')) return 5;
    if (endpoint.includes('/compute')) return 10;
    if (endpoint.includes('/search')) return 30;
    return 60; // Default
  }
}

// Global client rate limiter instance
export const clientRateLimiter = new ClientRateLimiter();

/**
 * Decorator for rate limiting async functions
 */
export function rateLimit(
  windowMs: number = 60000,
  maxCalls: number = 10
) {
  const limiters = new Map<string, SlidingWindowLimiter>();
  
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: unknown[]) {
      const key = `${target.constructor.name}.${propertyKey}`;
      
      let limiter = limiters.get(key);
      if (!limiter) {
        limiter = new SlidingWindowLimiter(windowMs, maxCalls);
        limiters.set(key, limiter);
      }
      
      if (!limiter.isAllowed(key)) {
        const info = limiter.getInfo(key);
        throw new Error(
          `Rate limit exceeded for ${key}. Retry after ${info.retryAfter} seconds`
        );
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Initialize rate limiting system
 */
export function initRateLimiting(): void {
  const config = getConfig();
  
  if (config.security.rateLimiting) {
    console.log('Rate limiting enabled');
    
    // Set up global rate limiter for debugging
    if (config.features.debugMode && typeof window !== 'undefined') {
      (window as any).__llm_works_rate_limiter = {
        checkApiCall: (endpoint: string) => clientRateLimiter.checkApiCall(endpoint),
        getRetryAfter: (endpoint: string) => clientRateLimiter.getRetryAfter(endpoint),
      };
    }
  }
}