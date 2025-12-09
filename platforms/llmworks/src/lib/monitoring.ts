/**
 * Production monitoring utilities for LLM Works platform
 * Implements comprehensive error tracking, performance monitoring, and alerting
 */

export interface ErrorContext {
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  timestamp: number;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface AlertConfig {
  type: 'error' | 'performance' | 'security' | 'availability';
  threshold?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

/**
 * Enhanced error tracking with context
 */
class ErrorTracker {
  private static instance: ErrorTracker;
  private sessionId: string;
  private errorQueue: Array<{error: Error; context: ErrorContext}> = [];
  private maxQueueSize = 100;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(new Error(event.message), {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript'
        }
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        {
          sessionId: this.sessionId,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
          metadata: {
            reason: event.reason,
            type: 'promise'
          }
        }
      );
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.captureError(new Error(`Resource loading failed: ${target.tagName}`), {
          sessionId: this.sessionId,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
          metadata: {
            element: target.tagName,
            source: (target as any).src || (target as any).href,
            type: 'resource'
          }
        });
      }
    }, true);
  }

  captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    const fullContext: ErrorContext = {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      ...context
    };

    this.errorQueue.push({ error, context: fullContext });

    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log error
    console.error('[ErrorTracker]', error, fullContext);

    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(error, fullContext);
    }
  }

  private async sendToMonitoringService(error: Error, context: ErrorContext): Promise<void> {
    try {
      // In a real application, send to services like Sentry, LogRocket, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
        }),
      });
    } catch (sendError) {
      console.warn('Failed to send error to monitoring service:', sendError);
    }
  }

  getErrorHistory(): Array<{error: Error; context: ErrorContext}> {
    return [...this.errorQueue];
  }

  clearErrorHistory(): void {
    this.errorQueue = [];
  }
}

/**
 * Performance monitoring with Core Web Vitals
 */
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  private constructor() {
    this.setupPerformanceObserver();
    this.trackCoreWebVitals();
    this.trackCustomMetrics();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            value: entry.duration || (entry as any).value || 0,
            unit: 'ms',
            timestamp: Date.now(),
            tags: {
              type: entry.entryType,
              initiatorType: (entry as any).initiatorType || 'unknown'
            }
          });
        }
      });

      try {
        this.observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift'] });
      } catch (e) {
        console.warn('Some performance entry types not supported:', e);
      }
    }
  }

  private async trackCoreWebVitals(): Promise<void> {
    try {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

      onCLS((metric) => this.recordWebVital('CLS', metric.value));
      onINP((metric) => this.recordWebVital('INP', metric.value));
      onFCP((metric) => this.recordWebVital('FCP', metric.value));
      onLCP((metric) => this.recordWebVital('LCP', metric.value));
      onTTFB((metric) => this.recordWebVital('TTFB', metric.value));
    } catch (error) {
      console.warn('Web Vitals not available:', error);
    }
  }

  private recordWebVital(name: string, value: number): void {
    this.recordMetric({
      name: `web_vital_${name.toLowerCase()}`,
      value,
      unit: name === 'CLS' ? 'score' : 'ms',
      timestamp: Date.now(),
      tags: { category: 'core_web_vitals' }
    });

    // Send to analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }
  }

  private trackCustomMetrics(): void {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordMetric({
        name: 'page_load_time',
        value: loadTime,
        unit: 'ms',
        timestamp: Date.now(),
        tags: { page: window.location.pathname }
      });
    });

    // Track route changes
    let previousPath = window.location.pathname;
    const trackRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== previousPath) {
        this.recordMetric({
          name: 'route_change',
          value: performance.now(),
          unit: 'ms',
          timestamp: Date.now(),
          tags: {
            from: previousPath,
            to: currentPath
          }
        });
        previousPath = currentPath;
      }
    };

    // Track pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackRouteChange, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackRouteChange, 0);
    };

    window.addEventListener('popstate', trackRouteChange);
  }

  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Maintain metrics array size
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    // Send to monitoring service
    if (import.meta.env.PROD) {
      this.sendMetric(metric);
    }
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn('Failed to send metric:', error);
    }
  }

  getMetrics(filter?: { name?: string; category?: string }): PerformanceMetric[] {
    if (!filter) return [...this.metrics];

    return this.metrics.filter(metric => {
      if (filter.name && !metric.name.includes(filter.name)) return false;
      if (filter.category && metric.tags?.category !== filter.category) return false;
      return true;
    });
  }

  generateReport(): {
    summary: Record<string, number>;
    coreWebVitals: Record<string, number>;
    performance: Record<string, number>;
  } {
    const summary: Record<string, number> = {};
    const coreWebVitals: Record<string, number> = {};
    const performance: Record<string, number> = {};

    this.metrics.forEach(metric => {
      if (metric.tags?.category === 'core_web_vitals') {
        coreWebVitals[metric.name] = metric.value;
      } else {
        performance[metric.name] = metric.value;
      }

      summary[metric.name] = metric.value;
    });

    return { summary, coreWebVitals, performance };
  }
}

/**
 * User behavior and interaction tracking
 */
class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private interactions: Array<{type: string; target: string; timestamp: number}> = [];
  private sessionStart: number;

  private constructor() {
    this.sessionStart = Date.now();
    this.setupInteractionTracking();
  }

  static getInstance(): UserBehaviorTracker {
    if (!UserBehaviorTracker.instance) {
      UserBehaviorTracker.instance = new UserBehaviorTracker();
    }
    return UserBehaviorTracker.instance;
  }

  private setupInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.recordInteraction('click', this.getElementSelector(target));
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLElement;
      this.recordInteraction('submit', this.getElementSelector(target));
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.recordInteraction(
        document.visibilityState === 'visible' ? 'page_visible' : 'page_hidden',
        window.location.pathname
      );
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) { // Track 25%, 50%, 75%, 100%
          this.recordInteraction('scroll_depth', `${maxScrollDepth}%`);
        }
      }
    });
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private recordInteraction(type: string, target: string): void {
    this.interactions.push({
      type,
      target,
      timestamp: Date.now()
    });

    // Maintain array size
    if (this.interactions.length > 500) {
      this.interactions.shift();
    }
  }

  getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }

  getInteractionHistory(): Array<{type: string; target: string; timestamp: number}> {
    return [...this.interactions];
  }

  generateUserReport(): {
    sessionDuration: number;
    interactions: number;
    topInteractions: Array<{type: string; count: number}>;
  } {
    const interactionCounts: Record<string, number> = {};
    
    this.interactions.forEach(interaction => {
      const key = `${interaction.type}:${interaction.target}`;
      interactionCounts[key] = (interactionCounts[key] || 0) + 1;
    });

    const topInteractions = Object.entries(interactionCounts)
      .map(([key, count]) => {
        const [type] = key.split(':');
        return { type, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      sessionDuration: this.getSessionDuration(),
      interactions: this.interactions.length,
      topInteractions
    };
  }
}

/**
 * Health check system
 */
class HealthChecker {
  private static instance: HealthChecker;
  private checks: Array<() => Promise<boolean>> = [];
  private lastCheckTime = 0;
  private checkInterval = 60000; // 1 minute

  private constructor() {
    this.setupDefaultChecks();
    this.startPeriodicChecks();
  }

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  private setupDefaultChecks(): void {
    // Check local storage availability
    this.addCheck(async () => {
      try {
        const testKey = 'health_check_test';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    });

    // Check network connectivity
    this.addCheck(async () => {
      return navigator.onLine;
    });

    // Check service worker status
    this.addCheck(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          return registration.active !== null;
        } catch {
          return false;
        }
      }
      return true; // Not having SW isn't necessarily a failure
    });
  }

  addCheck(check: () => Promise<boolean>): void {
    this.checks.push(check);
  }

  private startPeriodicChecks(): void {
    setInterval(async () => {
      await this.runAllChecks();
    }, this.checkInterval);
  }

  async runAllChecks(): Promise<{healthy: boolean; results: boolean[]}> {
    this.lastCheckTime = Date.now();
    const results = await Promise.all(
      this.checks.map(check => check().catch(() => false))
    );

    const healthy = results.every(result => result);

    if (!healthy) {
      ErrorTracker.getInstance().captureError(
        new Error('Health check failed'),
        {
          sessionId: '',
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now(),
          metadata: {
            failedChecks: results.map((result, index) => ({ index, passed: result })),
            type: 'health_check'
          }
        }
      );
    }

    return { healthy, results };
  }

  getHealthStatus(): {
    healthy: boolean;
    lastCheck: number;
    uptime: number;
  } {
    return {
      healthy: true, // This would be set by the last check
      lastCheck: this.lastCheckTime,
      uptime: performance.now()
    };
  }
}

/**
 * Initialize all monitoring systems
 */
export const initMonitoring = () => {
  // Initialize all monitoring systems
  ErrorTracker.getInstance();
  PerformanceMonitor.getInstance();
  UserBehaviorTracker.getInstance();
  HealthChecker.getInstance();

  // Add monitoring endpoint
  if (import.meta.env.PROD) {
    // Expose health check endpoint
    (window as any).__health_check = async () => {
      const errorTracker = ErrorTracker.getInstance();
      const performanceMonitor = PerformanceMonitor.getInstance();
      const userTracker = UserBehaviorTracker.getInstance();
      const healthChecker = HealthChecker.getInstance();

      return {
        errors: errorTracker.getErrorHistory().length,
        performance: performanceMonitor.generateReport(),
        user: userTracker.generateUserReport(),
        health: await healthChecker.runAllChecks(),
        timestamp: Date.now()
      };
    };
  }

  console.log('📊 Production monitoring initialized');
};

// Export singletons for external use
export const errorTracker = ErrorTracker.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
export const userBehaviorTracker = UserBehaviorTracker.getInstance();
export const healthChecker = HealthChecker.getInstance();