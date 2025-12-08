// Comprehensive performance audit system for QMLab
// Core Web Vitals, resource optimization, and quantum-specific performance monitoring

import { quantumMetrics } from './monitoring';
import { trackQuantumEvents } from './analytics';
import { ExtendedPerformanceNavigationTiming } from './simple-stubs';

// Performance audit types
interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: {
    good: number;
    needsImprovement: number;
    poor: number;
  };
  status: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface ResourceMetric {
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'fetch' | 'other';
  url: string;
  size: number;
  loadTime: number;
  cached: boolean;
  critical: boolean;
}

interface PerformanceAuditReport {
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connection: string;
  coreWebVitals: {
    lcp: PerformanceMetric;
    fid: PerformanceMetric;
    cls: PerformanceMetric;
    inp: PerformanceMetric;
    ttfb: PerformanceMetric;
  };
  additionalMetrics: {
    fcp: PerformanceMetric;
    tti: PerformanceMetric;
    tbt: PerformanceMetric;
    si: PerformanceMetric;
  };
  resourceAnalysis: {
    totalSize: number;
    totalRequests: number;
    resources: ResourceMetric[];
    largestResources: ResourceMetric[];
    slowestResources: ResourceMetric[];
  };
  quantumSpecific: {
    circuitRenderTime: number;
    blochSpherePerformance: number;
    trainingLatency: number;
    webglSupport: boolean;
    memoryUsage: number;
  };
  recommendations: PerformanceRecommendation[];
  score: number; // 0-100
}

interface PerformanceRecommendation {
  id: string;
  type: 'critical' | 'important' | 'minor';
  category: 'loading' | 'rendering' | 'interactivity' | 'resources' | 'quantum';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  implementation: string;
  resources: string[];
}

// Core Web Vitals thresholds
const CORE_WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000, poor: Infinity },
  FID: { good: 100, needsImprovement: 300, poor: Infinity },
  CLS: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
  INP: { good: 200, needsImprovement: 500, poor: Infinity },
  TTFB: { good: 600, needsImprovement: 1600, poor: Infinity },
  FCP: { good: 1800, needsImprovement: 3000, poor: Infinity },
  TTI: { good: 3800, needsImprovement: 7300, poor: Infinity },
  TBT: { good: 200, needsImprovement: 600, poor: Infinity },
  SI: { good: 3400, needsImprovement: 5800, poor: Infinity }
};

// Performance measurement utilities
class PerformanceMeasurer {
  // Measure Core Web Vitals
  static async measureCoreWebVitals(): Promise<{
    lcp: number;
    fid: number;
    cls: number;
    inp: number;
    ttfb: number;
  }> {
    return new Promise((resolve) => {
      const metrics = {
        lcp: 0,
        fid: 0,
        cls: 0,
        inp: 0,
        ttfb: 0
      };

      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metrics.lcp = entries[entries.length - 1].startTime;
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'first-input') {
              metrics.fid = (entry as any).processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              metrics.cls = clsValue;
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // INP (Interaction to Next Paint) - approximation
        const inpObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'event') {
              const processingTime = (entry as any).processingEnd - (entry as any).processingStart;
              metrics.inp = Math.max(metrics.inp, processingTime);
            }
          });
        });
        try {
          inpObserver.observe({ type: 'event', buffered: true });
        } catch {
          // INP not supported, use approximation
          metrics.inp = 0;
        }
      }

      // TTFB (Time to First Byte)
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        metrics.ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
      }

      // Return metrics after a delay to allow observers to collect data
      setTimeout(() => resolve(metrics), 1000);
    });
  }

  // Measure additional performance metrics
  static measureAdditionalMetrics(): {
    fcp: number;
    tti: number;
    tbt: number;
    si: number;
  } {
    const metrics = {
      fcp: 0,
      tti: 0,
      tbt: 0,
      si: 0
    };

    // FCP (First Contentful Paint)
    const fcpEntries = performance.getEntriesByType('paint');
    const fcpEntry = fcpEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.fcp = fcpEntry.startTime;
    }

    // TTI (Time to Interactive) - approximation
    const navigationEntries = performance.getEntriesByType('navigation') as ExtendedPerformanceNavigationTiming[];
    if (navigationEntries.length > 0 && navigationEntries[0].navigationStart) {
      metrics.tti = navigationEntries[0].loadEventEnd - navigationEntries[0].navigationStart;
    }

    // TBT (Total Blocking Time) - approximation from long tasks
    const longTaskEntries = performance.getEntriesByType('longtask');
    metrics.tbt = longTaskEntries.reduce((total, task) => {
      const blockingTime = Math.max(0, task.duration - 50);
      return total + blockingTime;
    }, 0);

    // SI (Speed Index) - simplified calculation
    metrics.si = metrics.fcp * 1.2; // Rough approximation

    return metrics;
  }

  // Analyze resource loading
  static analyzeResources(): {
    totalSize: number;
    totalRequests: number;
    resources: ResourceMetric[];
    largestResources: ResourceMetric[];
    slowestResources: ResourceMetric[];
  } {
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resources: ResourceMetric[] = resourceEntries.map(entry => {
      const url = entry.name;
      const type = this.getResourceType(url);
      const size = entry.transferSize || entry.decodedBodySize || 0;
      const loadTime = entry.responseEnd - entry.requestStart;
      const cached = entry.transferSize === 0 && entry.decodedBodySize > 0;
      const critical = this.isCriticalResource(url, type);

      return {
        type,
        url,
        size,
        loadTime,
        cached,
        critical
      };
    });

    const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
    const totalRequests = resources.length;

    // Find largest and slowest resources
    const largestResources = [...resources]
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    const slowestResources = [...resources]
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 10);

    return {
      totalSize,
      totalRequests,
      resources,
      largestResources,
      slowestResources
    };
  }

  // Determine resource type from URL
  private static getResourceType(url: string): ResourceMetric['type'] {
    if (url.includes('.js') || url.includes('javascript')) return 'script';
    if (url.includes('.css') || url.includes('stylesheet')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) return 'font';
    if (url.includes('/api/') || url.includes('fetch')) return 'fetch';
    return 'other';
  }

  // Determine if resource is critical for initial render
  private static isCriticalResource(url: string, type: ResourceMetric['type']): boolean {
    // Critical resources that block initial render
    if (type === 'stylesheet') return true;
    if (type === 'script' && !url.includes('async') && !url.includes('defer')) return true;
    if (type === 'font' && url.includes('preload')) return true;
    return false;
  }

  // Measure quantum-specific performance
  static measureQuantumPerformance(): {
    circuitRenderTime: number;
    blochSpherePerformance: number;
    trainingLatency: number;
    webglSupport: boolean;
    memoryUsage: number;
  } {
    const metrics = {
      circuitRenderTime: 0,
      blochSpherePerformance: 0,
      trainingLatency: 0,
      webglSupport: false,
      memoryUsage: 0
    };

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    metrics.webglSupport = !!gl;

    // Memory usage (if available)
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      metrics.memoryUsage = memInfo.usedJSHeapSize;
    }

    // Quantum component performance (if components exist)
    const circuitElements = document.querySelectorAll('[data-component="circuit-builder"]');
    const blochElements = document.querySelectorAll('[data-component="bloch-sphere"]');

    if (circuitElements.length > 0) {
      // Measure circuit rendering time
      const start = performance.now();
      // Simulate circuit operation
      setTimeout(() => {
        metrics.circuitRenderTime = performance.now() - start;
      }, 0);
    }

    if (blochElements.length > 0) {
      // Measure 3D rendering performance
      const renderStart = performance.now();
      requestAnimationFrame(() => {
        metrics.blochSpherePerformance = performance.now() - renderStart;
      });
    }

    return metrics;
  }
}

// Performance audit engine
export class PerformanceAuditor {
  private recommendations: PerformanceRecommendation[] = [];

  // Run comprehensive performance audit
  async runPerformanceAudit(): Promise<PerformanceAuditReport> {
    console.log('⚡ Starting performance audit...');

    const startTime = performance.now();
    
    // Measure all performance metrics
    const coreWebVitals = await PerformanceMeasurer.measureCoreWebVitals();
    const additionalMetrics = PerformanceMeasurer.measureAdditionalMetrics();
    const resourceAnalysis = PerformanceMeasurer.analyzeResources();
    const quantumMetrics = PerformanceMeasurer.measureQuantumPerformance();

    // Convert raw metrics to structured format
    const structuredMetrics = {
      coreWebVitals: {
        lcp: this.createMetric('LCP', coreWebVitals.lcp, 'ms', CORE_WEB_VITALS_THRESHOLDS.LCP),
        fid: this.createMetric('FID', coreWebVitals.fid, 'ms', CORE_WEB_VITALS_THRESHOLDS.FID),
        cls: this.createMetric('CLS', coreWebVitals.cls, '', CORE_WEB_VITALS_THRESHOLDS.CLS),
        inp: this.createMetric('INP', coreWebVitals.inp, 'ms', CORE_WEB_VITALS_THRESHOLDS.INP),
        ttfb: this.createMetric('TTFB', coreWebVitals.ttfb, 'ms', CORE_WEB_VITALS_THRESHOLDS.TTFB)
      },
      additionalMetrics: {
        fcp: this.createMetric('FCP', additionalMetrics.fcp, 'ms', CORE_WEB_VITALS_THRESHOLDS.FCP),
        tti: this.createMetric('TTI', additionalMetrics.tti, 'ms', CORE_WEB_VITALS_THRESHOLDS.TTI),
        tbt: this.createMetric('TBT', additionalMetrics.tbt, 'ms', CORE_WEB_VITALS_THRESHOLDS.TBT),
        si: this.createMetric('SI', additionalMetrics.si, 'ms', CORE_WEB_VITALS_THRESHOLDS.SI)
      }
    };

    // Generate recommendations
    this.generateRecommendations(structuredMetrics, resourceAnalysis, quantumMetrics);

    // Calculate overall performance score
    const score = this.calculatePerformanceScore(structuredMetrics);

    // Get connection info
    const connection = this.getConnectionInfo();

    const auditTime = performance.now() - startTime;
    console.log(`✅ Performance audit completed in ${auditTime.toFixed(2)}ms`);

    const report: PerformanceAuditReport = {
      id: `perf-audit-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection,
      coreWebVitals: structuredMetrics.coreWebVitals,
      additionalMetrics: structuredMetrics.additionalMetrics,
      resourceAnalysis,
      quantumSpecific: quantumMetrics,
      recommendations: this.recommendations,
      score
    };

    // Track audit completion
      trackQuantumEvents.featureDiscovery('performance_audit_completed');

    return report;
  }

  // Create structured metric with status
  private createMetric(
    name: string, 
    value: number, 
    unit: string, 
    thresholds: { good: number; needsImprovement: number; poor: number }
  ): PerformanceMetric {
    let status: 'good' | 'needs-improvement' | 'poor';
    
    if (value <= thresholds.good) {
      status = 'good';
    } else if (value <= thresholds.needsImprovement) {
      status = 'needs-improvement';
    } else {
      status = 'poor';
    }

    return {
      name,
      value,
      unit,
      threshold: thresholds,
      status,
      timestamp: Date.now()
    };
  }

  // Generate performance recommendations
  private generateRecommendations(
    metrics: any,
    resources: any,
    quantum: any
  ): void {
    this.recommendations = [];

    // Core Web Vitals recommendations
    if (metrics.coreWebVitals.lcp.status !== 'good') {
      this.recommendations.push({
        id: 'lcp-optimization',
        type: 'critical',
        category: 'loading',
        title: 'Optimize Largest Contentful Paint (LCP)',
        description: `LCP is ${metrics.coreWebVitals.lcp.value.toFixed(0)}ms, which exceeds the good threshold of ${metrics.coreWebVitals.lcp.threshold.good}ms`,
        impact: 'high',
        effort: 'medium',
        implementation: 'Optimize critical resources, preload important images, reduce server response times',
        resources: [
          'https://web.dev/optimize-lcp/',
          'https://developer.mozilla.org/en-US/docs/Web/Performance/Largest_contentful_paint'
        ]
      });
    }

    if (metrics.coreWebVitals.cls.status !== 'good') {
      this.recommendations.push({
        id: 'cls-optimization',
        type: 'important',
        category: 'rendering',
        title: 'Reduce Cumulative Layout Shift (CLS)',
        description: `CLS is ${metrics.coreWebVitals.cls.value.toFixed(3)}, which exceeds the good threshold of ${metrics.coreWebVitals.cls.threshold.good}`,
        impact: 'high',
        effort: 'low',
        implementation: 'Add size attributes to images, reserve space for dynamic content, use CSS contain property',
        resources: [
          'https://web.dev/optimize-cls/',
          'https://developer.mozilla.org/en-US/docs/Web/Performance/Cumulative_layout_shift'
        ]
      });
    }

    if (metrics.coreWebVitals.fid.status !== 'good') {
      this.recommendations.push({
        id: 'fid-optimization',
        type: 'critical',
        category: 'interactivity',
        title: 'Improve First Input Delay (FID)',
        description: `FID is ${metrics.coreWebVitals.fid.value.toFixed(0)}ms, which exceeds the good threshold of ${metrics.coreWebVitals.fid.threshold.good}ms`,
        impact: 'high',
        effort: 'high',
        implementation: 'Break up long tasks, optimize JavaScript execution, use web workers for heavy computations',
        resources: [
          'https://web.dev/optimize-fid/',
          'https://developer.mozilla.org/en-US/docs/Web/Performance/First_input_delay'
        ]
      });
    }

    // Resource optimization recommendations
    if (resources.totalSize > 5 * 1024 * 1024) { // 5MB
      this.recommendations.push({
        id: 'resource-size-optimization',
        type: 'important',
        category: 'resources',
        title: 'Reduce Total Resource Size',
        description: `Total resource size is ${(resources.totalSize / 1024 / 1024).toFixed(2)}MB, which is quite large`,
        impact: 'medium',
        effort: 'medium',
        implementation: 'Compress images, minify CSS/JS, use tree shaking, implement code splitting',
        resources: [
          'https://web.dev/reduce-network-payloads-using-text-compression/',
          'https://web.dev/serve-images-webp/'
        ]
      });
    }

    if (resources.totalRequests > 100) {
      this.recommendations.push({
        id: 'reduce-requests',
        type: 'minor',
        category: 'resources',
        title: 'Reduce Number of Requests',
        description: `${resources.totalRequests} total requests detected, consider bundling resources`,
        impact: 'low',
        effort: 'medium',
        implementation: 'Bundle CSS/JS files, use image sprites, inline critical CSS',
        resources: [
          'https://web.dev/reduce-network-payloads-using-text-compression/'
        ]
      });
    }

    // Quantum-specific recommendations
    if (!quantum.webglSupport) {
      this.recommendations.push({
        id: 'webgl-fallback',
        type: 'minor',
        category: 'quantum',
        title: 'WebGL Not Supported',
        description: 'WebGL is not available, quantum visualizations may be slower',
        impact: 'medium',
        effort: 'low',
        implementation: 'Implement Canvas 2D fallback for quantum visualizations',
        resources: [
          'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API'
        ]
      });
    }

    if (quantum.circuitRenderTime > 100) {
      this.recommendations.push({
        id: 'circuit-performance',
        type: 'minor',
        category: 'quantum',
        title: 'Optimize Circuit Rendering',
        description: `Circuit rendering takes ${quantum.circuitRenderTime.toFixed(0)}ms`,
        impact: 'low',
        effort: 'medium',
        implementation: 'Use requestAnimationFrame, implement virtualization for large circuits',
        resources: []
      });
    }
  }

  // Calculate overall performance score
  private calculatePerformanceScore(metrics: any): number {
    const coreWebVitalsWeights = {
      lcp: 25,
      fid: 25,
      cls: 25,
      inp: 25
    };

    const additionalWeights = {
      fcp: 5,
      tti: 5,
      tbt: 5,
      si: 5
    };

    let totalScore = 0;
    let totalWeight = 0;

    // Score Core Web Vitals
    Object.entries(coreWebVitalsWeights).forEach(([metric, weight]) => {
      const metricData = metrics.coreWebVitals[metric];
      if (metricData) {
        const score = metricData.status === 'good' ? 100 :
                     metricData.status === 'needs-improvement' ? 75 : 50;
        totalScore += score * weight;
        totalWeight += weight;
      }
    });

    // Score additional metrics
    Object.entries(additionalWeights).forEach(([metric, weight]) => {
      const metricData = metrics.additionalMetrics[metric];
      if (metricData) {
        const score = metricData.status === 'good' ? 100 :
                     metricData.status === 'needs-improvement' ? 75 : 50;
        totalScore += score * weight;
        totalWeight += weight;
      }
    });

    return Math.round(totalScore / totalWeight);
  }

  // Get connection information
  private getConnectionInfo(): string {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return `${conn.effectiveType || 'unknown'} (${conn.downlink || 'unknown'}Mbps)`;
    }
    return 'unknown';
  }
}

// Performance test runner
export class PerformanceTestRunner {
  private auditor = new PerformanceAuditor();
  private reports: PerformanceAuditReport[] = [];

  // Run performance audit
  async runAudit(): Promise<PerformanceAuditReport> {
    const report = await this.auditor.runPerformanceAudit();
    this.reports.push(report);

    // Log results
    console.log(`📊 Performance Score: ${report.score}/100`);
    console.log(`⚡ Core Web Vitals:`);
    console.log(`   LCP: ${report.coreWebVitals.lcp.value.toFixed(0)}ms (${report.coreWebVitals.lcp.status})`);
    console.log(`   FID: ${report.coreWebVitals.fid.value.toFixed(0)}ms (${report.coreWebVitals.fid.status})`);
    console.log(`   CLS: ${report.coreWebVitals.cls.value.toFixed(3)} (${report.coreWebVitals.cls.status})`);

    if (report.recommendations.length > 0) {
      console.group('🔧 Performance Recommendations:');
      report.recommendations.forEach(rec => {
        console.log(`${rec.type.toUpperCase()}: ${rec.title}`);
        console.log(`   ${rec.description}`);
        console.log(`   Fix: ${rec.implementation}`);
      });
      console.groupEnd();
    }

    return report;
  }

  // Get latest report
  getLatestReport(): PerformanceAuditReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  // Export report
  exportReport(report: PerformanceAuditReport): string {
    return JSON.stringify(report, null, 2);
  }
}

// Global performance test runner
export const performanceTestRunner = new PerformanceTestRunner();

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceTestRunner.runAudit();
    }, 3000);
  });
}