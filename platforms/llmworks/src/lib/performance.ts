/**
 * Performance monitoring and optimization utilities
 * Tracks Core Web Vitals and provides performance insights
 */

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Other metrics
  ttfb?: number; // Time to First Byte
  fcp?: number;  // First Contentful Paint
  
  // Navigation timing
  loadTime?: number;
  domReady?: number;
}

interface PerformanceConfig {
  trackCoreWebVitals?: boolean;
  trackNavigation?: boolean;
  reportingEndpoint?: string;
  debug?: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private config: PerformanceConfig;
  private observers: PerformanceObserver[] = [];

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      trackCoreWebVitals: true,
      trackNavigation: true,
      debug: import.meta.env.DEV,
      ...config,
    };

    this.init();
  }

  private init(): void {
    if (this.config.trackCoreWebVitals) {
      this.setupCoreWebVitals();
    }
    
    if (this.config.trackNavigation) {
      this.setupNavigationTiming();
    }

    // Track when page becomes visible
    if (document.visibilityState === 'hidden') {
      document.addEventListener('visibilitychange', this.onVisibilityChange, { once: true });
    } else {
      this.startTracking();
    }
  }

  private onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.startTracking();
    }
  };

  private startTracking(): void {
    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      this.trackInitialMetrics();
    } else {
      window.addEventListener('load', () => this.trackInitialMetrics(), { once: true });
    }
  }

  private setupCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
          this.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('[Performance] LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.log('FID:', this.metrics.fid);
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('[Performance] FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.log('CLS:', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('[Performance] CLS observer not supported');
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.log('FCP:', entry.startTime);
            }
          });
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('[Performance] FCP observer not supported');
      }
    }
  }

  private setupNavigationTiming(): void {
    if ('performance' in window && performance.getEntriesByType) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.metrics.loadTime = entry.loadEventEnd - entry.navigationStart;
            this.metrics.domReady = entry.domContentLoadedEventEnd - entry.navigationStart;
            
            this.log('TTFB:', this.metrics.ttfb);
            this.log('Load Time:', this.metrics.loadTime);
            this.log('DOM Ready:', this.metrics.domReady);
          }
        });
      });
      
      observer.observe({ type: 'navigation', buffered: true });
      this.observers.push(observer);
    }
  }

  private trackInitialMetrics(): void {
    // Fallback navigation timing using performance.timing (deprecated but widely supported)
    if (performance.timing) {
      const timing = performance.timing;
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      this.metrics.ttfb = timing.responseStart - timing.requestStart;
    }
  }

  private log(message: string, value?: number): void {
    if (this.config.debug) {
      console.log(`[Performance] ${message}`, value);
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    const { lcp, fid, cls } = this.metrics;
    let score = 100;

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (lcp !== undefined) {
      if (lcp > 4000) score -= 40;
      else if (lcp > 2500) score -= 20;
    }

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (fid !== undefined) {
      if (fid > 300) score -= 30;
      else if (fid > 100) score -= 15;
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls !== undefined) {
      if (cls > 0.25) score -= 30;
      else if (cls > 0.1) score -= 15;
    }

    return Math.max(0, score);
  }

  // Report metrics to endpoint
  async reportMetrics(): Promise<void> {
    if (!this.config.reportingEndpoint) return;

    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          timestamp: Date.now(),
          metrics: this.metrics,
          score: this.getPerformanceScore(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.warn('[Performance] Failed to report metrics:', error);
    }
  }

  // Cleanup observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

// Initialize performance monitoring
export const initPerformanceMonitoring = (config?: PerformanceConfig): PerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(config);
  }
  return performanceMonitor;
};

// Get current performance metrics
export const getPerformanceMetrics = (): PerformanceMetrics => {
  return performanceMonitor?.getMetrics() || {};
};

// Get performance score
export const getPerformanceScore = (): number => {
  return performanceMonitor?.getPerformanceScore() || 0;
};

// Measure function execution time
export const measureAsync = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name} (failed): ${duration.toFixed(2)}ms`);
    throw error;
  }
};

// Measure sync function execution time
export const measure = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name} (failed): ${duration.toFixed(2)}ms`);
    throw error;
  }
};

// Resource timing analysis
export const analyzeResourceTiming = (): void => {
  const resources = performance.getEntriesByType('resource');
  const analysis = {
    totalResources: resources.length,
    totalSize: 0,
    slowestResources: [] as any[],
    resourceTypes: {} as Record<string, number>,
  };

  resources.forEach((resource: any) => {
    // Calculate load time
    const loadTime = resource.responseEnd - resource.startTime;
    
    // Track resource types
    const extension = resource.name.split('.').pop()?.toLowerCase() || 'other';
    analysis.resourceTypes[extension] = (analysis.resourceTypes[extension] || 0) + 1;
    
    // Track slowest resources
    analysis.slowestResources.push({
      name: resource.name,
      loadTime,
      size: resource.transferSize || 0,
    });
  });

  // Sort by load time
  analysis.slowestResources.sort((a, b) => b.loadTime - a.loadTime);
  analysis.slowestResources = analysis.slowestResources.slice(0, 10);

  console.log('[Performance] Resource Analysis:', analysis);
};