interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observer?: PerformanceObserver;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Observe web vitals
    this.observeWebVitals();

    // Custom metrics
    this.observeCustomMetrics();

    // Navigation timing
    this.observeNavigation();
  }

  private observeWebVitals() {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.onPerfEntry);
      getFID(this.onPerfEntry);
      getFCP(this.onPerfEntry);
      getLCP(this.onPerfEntry);
      getTTFB(this.onPerfEntry);
    });
  }

  private onPerfEntry = (metric: any) => {
    if (this.isGtagAvailable()) {
      window.gtag?.('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  };

  private observeCustomMetrics() {
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.recordMetric({
            name: entry.name,
            value: entry.duration,
            rating: this.getRating(entry.name, entry.duration),
          });
        }
      }
    });
    this.observer.observe({ entryTypes: ['measure'] });
  }

  private observeNavigation() {
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.recordMetric({
        name: 'page_load_time',
        value: navEntry.loadEventEnd - navEntry.loadEventStart,
        rating: this.getRating('page_load_time', navEntry.loadEventEnd - navEntry.loadEventStart),
      });
    }
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.set(metric.name, metric);

    // Send to analytics
    if (this.isGtagAvailable()) {
      window.gtag?.('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    }

    // Log poor performance
    if (metric.rating === 'poor') {
      console.warn(`Poor performance detected: ${metric.name} = ${metric.value}ms`);
    }
  }

  private getRating(name: string, value: number): PerformanceMetrics['rating'] {
    const thresholds: Record<string, { good: number; poor: number }> = {
      page_load_time: { good: 1000, poor: 3000 },
      dom_interactive: { good: 500, poor: 1500 },
      first_contentful_paint: { good: 800, poor: 2000 },
    };

    const threshold = thresholds[name];
    if (!threshold) return 'needs-improvement';

    const { good, poor } = threshold;
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  private isGtagAvailable(): boolean {
    return typeof window.gtag === 'function';
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  measure(name: string, fn: () => void): void {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
}

export const performanceMonitor = new PerformanceMonitor();
