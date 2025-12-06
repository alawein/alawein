// Performance optimization utilities and monitoring

import { PerformanceMetrics, OptimizationSettings } from '@/types/interfaces';
import { handlePhysicsError } from './error-handling';

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 100;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    try {
      // Memory usage observer
      if ('memory' in performance) {
        const memoryObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              renderTime: 0,
              computeTime: 0,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
            });
          }
        });
        
        this.observers.push(memoryObserver);
      }

      // Long task observer
      if ('PerformanceObserver' in window) {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn(`Long task detected: ${entry.duration}ms`);
            }
          }
        });

        try {
          longTaskObserver.observe({ entryTypes: ['longtask'] });
          this.observers.push(longTaskObserver);
        } catch (e) {
          // longtask not supported in this browser
        }
      }
    } catch (error) {
      handlePhysicsError(error, 'PerformanceMonitor initialization');
    }
  }

  recordMetric(metric: Partial<PerformanceMetrics>) {
    const fullMetric: PerformanceMetrics = {
      renderTime: metric.renderTime || 0,
      computeTime: metric.computeTime || 0,
      memoryUsage: metric.memoryUsage || this.getMemoryUsage(),
      fps: metric.fps,
      bundleSize: metric.bundleSize,
    };

    this.metrics.push(fullMetric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMemoryUsage(): number {
    try {
      return (performance as any).memory?.usedJSHeapSize || 0;
    } catch {
      return 0;
    }
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        renderTime: 0,
        computeTime: 0,
        memoryUsage: 0,
      };
    }

    const total = this.metrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        computeTime: acc.computeTime + metric.computeTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        fps: (acc.fps || 0) + (metric.fps || 0),
      }),
      { renderTime: 0, computeTime: 0, memoryUsage: 0, fps: 0 }
    );

    return {
      renderTime: total.renderTime / this.metrics.length,
      computeTime: total.computeTime / this.metrics.length,
      memoryUsage: total.memoryUsage / this.metrics.length,
      fps: total.fps / this.metrics.length || undefined,
    };
  }

  getRecentMetrics(count = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }

  clearMetrics() {
    this.metrics = [];
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Optimization utilities
export class OptimizationManager {
  private settings: OptimizationSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): OptimizationSettings {
    try {
      const saved = localStorage.getItem('simcore-optimization-settings');
      if (saved) {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch (error) {
      handlePhysicsError(error, 'Loading optimization settings');
    }
    
    return this.getDefaultSettings();
  }

  private getDefaultSettings(): OptimizationSettings {
    // Detect device capabilities
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const hasWebGPU = 'gpu' in navigator;
    const hasWebWorkers = 'Worker' in window;
    const memoryGB = (navigator as any).deviceMemory || 4;

    return {
      enableWebGPU: hasWebGPU && !isMobile,
      enableWebWorkers: hasWebWorkers,
      maxArraySize: memoryGB >= 8 ? 1000000 : 100000,
      renderQuality: isMobile ? 'medium' : memoryGB >= 8 ? 'high' : 'medium',
      enableAnimations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  }

  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<OptimizationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    try {
      localStorage.setItem('simcore-optimization-settings', JSON.stringify(this.settings));
    } catch (error) {
      handlePhysicsError(error, 'Saving optimization settings');
    }
  }

  shouldUseWebGPU(): boolean {
    return this.settings.enableWebGPU && 'gpu' in navigator;
  }

  shouldUseWebWorkers(): boolean {
    return this.settings.enableWebWorkers && 'Worker' in window;
  }

  getMaxArraySize(): number {
    return this.settings.maxArraySize;
  }

  getRenderQuality(): OptimizationSettings['renderQuality'] {
    return this.settings.renderQuality;
  }

  shouldEnableAnimations(): boolean {
    return this.settings.enableAnimations;
  }
}

export const optimizationManager = new OptimizationManager();

// Performance measurement utilities
export function measurePerformance<T>(
  operation: () => T | Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  
  return Promise.resolve(operation())
    .then(result => {
      const duration = performance.now() - startTime;
      
      if (label && duration > 10) {
        console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
      }
      
      performanceMonitor.recordMetric({
        computeTime: duration,
        renderTime: 0,
        memoryUsage: performanceMonitor.getMemoryUsage(),
      });
      
      return { result, duration };
    })
    .catch(error => {
      const duration = performance.now() - startTime;
      handlePhysicsError(error, `Performance measurement: ${label || 'unknown operation'}`);
      throw error;
    });
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memory optimization utilities
export function optimizeArrays<T>(arrays: T[][], maxSize?: number): T[][] {
  const limit = maxSize || optimizationManager.getMaxArraySize();
  
  return arrays.map(array => {
    if (array.length > limit) {
      console.warn(`Array truncated from ${array.length} to ${limit} elements for performance`);
      return array.slice(0, limit);
    }
    return array;
  });
}

export function cleanupArrays(...arrays: (any[] | undefined)[]): void {
  arrays.forEach(array => {
    if (array) {
      array.length = 0;
    }
  });
}

// Bundle size optimization
export function lazyImport<T>(
  importFn: () => Promise<{ default: T }>
): () => Promise<T> {
  let cached: T | null = null;
  
  return async () => {
    if (cached) {
      return cached;
    }
    
    const module = await importFn();
    cached = module.default;
    return cached;
  };
}

// WebWorker utilities
export function createOptimizedWorker(
  workerScript: string,
  fallback: (...args: any[]) => any
) {
  if (!optimizationManager.shouldUseWebWorkers()) {
    return {
      postMessage: (data: any) => {
        try {
          return Promise.resolve(fallback(data));
        } catch (error) {
          return Promise.reject(error);
        }
      },
      terminate: () => {},
    };
  }

  try {
    const worker = new Worker(workerScript);
    
    return {
      postMessage: (data: any) => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Worker timeout'));
          }, 30000); // 30 second timeout

          worker.onmessage = (e) => {
            clearTimeout(timeout);
            resolve(e.data);
          };

          worker.onerror = (error) => {
            clearTimeout(timeout);
            reject(error);
          };

          worker.postMessage(data);
        });
      },
      terminate: () => worker.terminate(),
    };
  } catch (error) {
    handlePhysicsError(error, 'Creating optimized worker');
    return {
      postMessage: (data: any) => Promise.resolve(fallback(data)),
      terminate: () => {},
    };
  }
}

export default {
  performanceMonitor,
  optimizationManager,
  measurePerformance,
  debounce,
  throttle,
  optimizeArrays,
  cleanupArrays,
  lazyImport,
  createOptimizedWorker,
};
