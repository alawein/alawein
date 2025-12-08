/**
 * Performance Monitoring System
 * Tracks application performance metrics and user interactions
 */

export interface PerformanceMetrics {
  timestamp: number;
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, any>;
}

export interface UserInteraction {
  timestamp: number;
  type: 'click' | 'scroll' | 'navigation' | 'calculation' | 'simulation';
  target: string;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private interactions: UserInteraction[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.setupPerformanceObserver();
    this.trackNavigationTiming();
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            metric: entry.entryType,
            value: entry.duration || entry.startTime,
            unit: 'ms',
            context: {
              name: entry.name,
              entryType: entry.entryType
            }
          });
        }
      });

      this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }
  }

  private trackNavigationTiming() {
    if ('performance' in window && 'navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.recordMetric({ metric: 'dom_content_loaded', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, unit: 'ms' });
      this.recordMetric({ metric: 'load_complete', value: navigation.loadEventEnd - navigation.loadEventStart, unit: 'ms' });
      this.recordMetric({ metric: 'first_byte', value: navigation.responseStart - navigation.requestStart, unit: 'ms' });
    }
  }

  public recordMetric(metric: Omit<PerformanceMetrics, 'timestamp'>) {
    this.metrics.push({
      timestamp: Date.now(),
      ...metric
    });

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  public recordInteraction(interaction: Omit<UserInteraction, 'timestamp'>) {
    this.interactions.push({
      timestamp: Date.now(),
      ...interaction
    });

    // Keep only last 500 interactions
    if (this.interactions.length > 500) {
      this.interactions = this.interactions.slice(-500);
    }
  }

  public measurePhysicsCalculation<T>(
    name: string,
    calculation: () => T,
    context?: Record<string, any>
  ): T {
    const start = performance.now();
    const result = calculation();
    const end = performance.now();

    this.recordMetric({
      metric: `physics_calculation_${name}`,
      value: end - start,
      unit: 'ms',
      context
    });

    return result;
  }

  public async measureAsyncOperation<T>(
    name: string,
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();

    this.recordMetric({
      metric: `async_operation_${name}`,
      value: end - start,
      unit: 'ms',
      context
    });

    return result;
  }

  public getMetrics(filter?: {
    metric?: string;
    since?: number;
    limit?: number;
  }): PerformanceMetrics[] {
    let filtered = this.metrics;

    if (filter?.metric) {
      filtered = filtered.filter(m => m.metric.includes(filter.metric!));
    }

    if (filter?.since) {
      filtered = filtered.filter(m => m.timestamp > filter.since!);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  public getInteractions(filter?: {
    type?: UserInteraction['type'];
    since?: number;
    limit?: number;
  }): UserInteraction[] {
    let filtered = this.interactions;

    if (filter?.type) {
      filtered = filtered.filter(i => i.type === filter.type);
    }

    if (filter?.since) {
      filtered = filtered.filter(i => i.timestamp > filter.since);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  public getPerformanceStats() {
    const recentMetrics = this.getMetrics({ since: Date.now() - 60000 }); // Last minute
    const recentInteractions = this.getInteractions({ since: Date.now() - 60000 });

    const avgLoadTime = recentMetrics
      .filter(m => m.metric.includes('load'))
      .reduce((sum, m, _, arr) => sum + m.value / arr.length, 0);

    const avgCalculationTime = recentMetrics
      .filter(m => m.metric.includes('physics_calculation'))
      .reduce((sum, m, _, arr) => sum + m.value / arr.length, 0);

    return {
      totalMetrics: this.metrics.length,
      totalInteractions: this.interactions.length,
      recentMetrics: recentMetrics.length,
      recentInteractions: recentInteractions.length,
      averageLoadTime: avgLoadTime,
      averageCalculationTime: avgCalculationTime,
      memoryUsage: this.getMemoryUsage()
    };
  }

  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    return null;
  }

  public clearData() {
    this.metrics = [];
    this.interactions = [];
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility hooks for React components
export const usePerformanceTracking = () => {
  const trackInteraction = (type: UserInteraction['type'], target: string, metadata?: Record<string, any>) => {
    performanceMonitor.recordInteraction({ type, target, metadata });
  };

  const measureCalculation = <T>(name: string, calculation: () => T, context?: Record<string, any>): T => {
    return performanceMonitor.measurePhysicsCalculation(name, calculation, context);
  };

  return { trackInteraction, measureCalculation };
};

export default performanceMonitor;
