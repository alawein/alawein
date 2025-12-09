// Advanced telemetry and analytics system for QMLab
// Comprehensive tracking of quantum operations, user behavior, and system performance

import { trackQuantumEvents } from './analytics';

// OpenTelemetry-style interfaces for standardized tracking
interface Span {
  traceId: string;
  spanId: string;
  parentId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, any>;
  logs: LogEntry[];
  status: 'ok' | 'error' | 'timeout';
  baggage: Record<string, string>;
}

interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, any>;
}

interface QuantumMetrics {
  // Circuit metrics
  circuitComplexity: number;
  gateCount: number;
  qubitCount: number;
  circuitDepth: number;
  
  // Performance metrics
  compilationTime: number;
  executionTime: number;
  memoryUsage: number;
  
  // Quality metrics
  fidelity?: number;
  accuracy?: number;
  convergenceRate?: number;
}

interface UserBehaviorMetrics {
  sessionId: string;
  userId?: string;
  sessionDuration: number;
  interactions: InteractionEvent[];
  features: FeatureUsage[];
  errors: ErrorEvent[];
  performance: PerformanceMetrics;
}

interface InteractionEvent {
  type: 'click' | 'drag' | 'scroll' | 'keyboard' | 'touch';
  element: string;
  timestamp: number;
  position?: { x: number; y: number };
  value?: any;
  duration?: number;
}

interface FeatureUsage {
  feature: string;
  usage_count: number;
  total_time: number;
  first_used: number;
  last_used: number;
  success_rate: number;
}

interface ErrorEvent {
  type: 'javascript' | 'network' | 'quantum' | 'user';
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: number;
  resolved: boolean;
}

interface PerformanceMetrics {
  page_load_time: number;
  time_to_interactive: number;
  memory_usage: number;
  cpu_usage?: number;
  network_latency: number;
  render_time: number;
}

// Advanced telemetry system
export class TelemetrySystem {
  private spans = new Map<string, Span>();
  private activeSpans = new Set<string>();
  private metrics = new Map<string, number>();
  private userSession: UserBehaviorMetrics;
  private samplingRate: number = 0.1; // 10% sampling for performance
  private batchSize: number = 50;
  private flushInterval: number = 30000; // 30 seconds
  private pendingEvents: any[] = [];
  private flushTimer?: number;

  constructor() {
    this.userSession = this.initializeUserSession();
    this.setupAutoFlush();
    this.setupErrorHandling();
    this.setupPerformanceObserver();
  }

  // Initialize user session tracking
  private initializeUserSession(): UserBehaviorMetrics {
    return {
      sessionId: crypto.randomUUID(),
      sessionDuration: 0,
      interactions: [],
      features: [],
      errors: [],
      performance: {
        page_load_time: 0,
        time_to_interactive: 0,
        memory_usage: 0,
        network_latency: 0,
        render_time: 0
      }
    };
  }

  // Create and start a new span
  startSpan(operationName: string, parentId?: string, tags: Record<string, any> = {}): string {
    const spanId = crypto.randomUUID();
    const traceId = parentId ? this.spans.get(parentId)?.traceId || crypto.randomUUID() : crypto.randomUUID();

    const span: Span = {
      traceId,
      spanId,
      parentId,
      operationName,
      startTime: performance.now(),
      tags: {
        ...tags,
        'quantum.lab': true,
        'user.session_id': this.userSession.sessionId
      },
      logs: [],
      status: 'ok',
      baggage: {}
    };

    this.spans.set(spanId, span);
    this.activeSpans.add(spanId);

    // Log span start
    this.addLog(spanId, 'info', `Started ${operationName}`, tags);

    return spanId;
  }

  // End a span
  endSpan(spanId: string, status: 'ok' | 'error' | 'timeout' = 'ok', finalTags: Record<string, any> = {}): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = performance.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;
    span.tags = { ...span.tags, ...finalTags };

    this.activeSpans.delete(spanId);

    // Log span completion
    this.addLog(spanId, status === 'ok' ? 'info' : 'error', 
      `Completed ${span.operationName} in ${span.duration.toFixed(2)}ms`);

    // Send span data for analysis
    this.reportSpan(span);
  }

  // Add log entry to span
  addLog(spanId: string, level: LogEntry['level'], message: string, fields?: Record<string, any>): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.logs.push({
      timestamp: Date.now(),
      level,
      message,
      fields
    });
  }

  // Track quantum operation with detailed metrics
  trackQuantumOperation(
    operation: 'circuit_build' | 'simulation' | 'training' | 'visualization',
    metrics: QuantumMetrics,
    metadata: Record<string, any> = {}
  ): string {
    const spanId = this.startSpan(`quantum.${operation}`, undefined, {
      'quantum.operation': operation,
      'quantum.complexity': metrics.circuitComplexity,
      'quantum.gates': metrics.gateCount,
      'quantum.qubits': metrics.qubitCount,
      'quantum.depth': metrics.circuitDepth,
      ...metadata
    });

    // Track specific quantum metrics
    this.recordMetric(`quantum.${operation}.complexity`, metrics.circuitComplexity);
    this.recordMetric(`quantum.${operation}.gates`, metrics.gateCount);
    this.recordMetric(`quantum.${operation}.qubits`, metrics.qubitCount);
    this.recordMetric(`quantum.${operation}.compilation_time`, metrics.compilationTime);
    this.recordMetric(`quantum.${operation}.execution_time`, metrics.executionTime);

    if (metrics.fidelity !== undefined) {
      this.recordMetric(`quantum.${operation}.fidelity`, metrics.fidelity);
    }

    if (metrics.accuracy !== undefined) {
      this.recordMetric(`quantum.${operation}.accuracy`, metrics.accuracy);
    }

    // Add quantum-specific logs
    this.addLog(spanId, 'info', `Quantum ${operation} started`, {
      gates: metrics.gateCount,
      qubits: metrics.qubitCount,
      complexity: metrics.circuitComplexity
    });

    return spanId;
  }

  // Track user interaction
  trackInteraction(
    type: InteractionEvent['type'],
    element: string,
    value?: any,
    position?: { x: number; y: number }
  ): void {
    const interaction: InteractionEvent = {
      type,
      element,
      timestamp: Date.now(),
      position,
      value
    };

    this.userSession.interactions.push(interaction);

    // Update feature usage
    this.updateFeatureUsage(element);

    // Track in analytics
    trackQuantumEvents.featureDiscovery('user_interaction');

    // Sample interactions for detailed analysis
    if (Math.random() < this.samplingRate) {
      this.queueEvent('interaction', interaction);
    }
  }

  // Track feature usage patterns
  private updateFeatureUsage(feature: string): void {
    const existingFeature = this.userSession.features.find(f => f.feature === feature);
    const now = Date.now();

    if (existingFeature) {
      existingFeature.usage_count++;
      existingFeature.last_used = now;
    } else {
      this.userSession.features.push({
        feature,
        usage_count: 1,
        total_time: 0,
        first_used: now,
        last_used: now,
        success_rate: 1.0
      });
    }
  }

  // Record custom metrics
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.set(name, value);

    // Queue metric for batched sending
    this.queueEvent('metric', {
      name,
      value,
      tags: {
        ...tags,
        session_id: this.userSession.sessionId,
        timestamp: Date.now()
      }
    });
  }

  // Track errors with context
  trackError(
    type: ErrorEvent['type'],
    error: Error | string,
    context: Record<string, any> = {}
  ): void {
    const errorEvent: ErrorEvent = {
      type,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        ...context,
        user_agent: navigator.userAgent,
        url: window.location.href,
        session_id: this.userSession.sessionId
      },
      timestamp: Date.now(),
      resolved: false
    };

    this.userSession.errors.push(errorEvent);

    // Track in analytics
    trackQuantumEvents.errorBoundary(
      errorEvent.message,
      errorEvent.stack || 'No stack trace',
      `telemetry-${type}`
    );

    // Queue for immediate sending (errors are high priority)
    this.queueEvent('error', errorEvent);
    this.flush(); // Immediate flush for errors
  }

  // Performance monitoring
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.userSession.performance.page_load_time = navEntry.loadEventEnd - navEntry.fetchStart;
            this.userSession.performance.time_to_interactive = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
            this.userSession.performance.network_latency = navEntry.responseStart - navEntry.requestStart;
            
            this.recordMetric('performance.page_load_time', this.userSession.performance.page_load_time);
            this.recordMetric('performance.time_to_interactive', this.userSession.performance.time_to_interactive);
          }
        }
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('Navigation timing not supported');
      }

      // Monitor long tasks
      const taskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Long task threshold
            this.trackError('javascript', `Long task detected: ${entry.duration}ms`, {
              task_duration: entry.duration,
              task_start: entry.startTime
            });
          }
        }
      });

      try {
        taskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        this.userSession.performance.memory_usage = memInfo.usedJSHeapSize;
        this.recordMetric('performance.memory_usage', memInfo.usedJSHeapSize);
      }, 10000); // Every 10 seconds
    }
  }

  // Error handling setup
  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError('javascript', event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('javascript', event.reason, {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  // Queue event for batched sending
  private queueEvent(type: string, data: any): void {
    this.pendingEvents.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Flush if batch size reached
    if (this.pendingEvents.length >= this.batchSize) {
      this.flush();
    }
  }

  // Report completed span
  private reportSpan(span: Span): void {
    this.queueEvent('span', {
      trace_id: span.traceId,
      span_id: span.spanId,
      parent_id: span.parentId,
      operation_name: span.operationName,
      start_time: span.startTime,
      end_time: span.endTime,
      duration: span.duration,
      status: span.status,
      tags: span.tags,
      log_count: span.logs.length
    });
  }

  // Setup automatic flushing
  private setupAutoFlush(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Flush on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  // Flush pending events
  private async flush(): Promise<void> {
    if (this.pendingEvents.length === 0) return;

    const events = [...this.pendingEvents];
    this.pendingEvents = [];

    try {
      // Send to telemetry endpoint
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: this.userSession.sessionId,
          events,
          metadata: {
            user_agent: navigator.userAgent,
            timestamp: Date.now(),
            version: '1.0.0'
          }
        })
      });

      console.log(`📊 Flushed ${events.length} telemetry events`);

    } catch (error) {
      console.error('Failed to send telemetry data:', error);
      // Re-queue events for retry
      this.pendingEvents.unshift(...events);
    }
  }

  // Get current session metrics
  getSessionMetrics(): UserBehaviorMetrics {
    return {
      ...this.userSession,
      sessionDuration: Date.now() - (this.userSession.interactions[0]?.timestamp || Date.now())
    };
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Global telemetry instance
export const telemetry = new TelemetrySystem();

// Convenience functions for common operations
export const withTelemetry = async <T>(
  operation: string,
  fn: () => Promise<T>,
  tags?: Record<string, any>
): Promise<T> => {
  const spanId = telemetry.startSpan(operation, undefined, tags);
  
  try {
    const result = await fn();
    telemetry.endSpan(spanId, 'ok');
    return result;
  } catch (error) {
    telemetry.endSpan(spanId, 'error', { error: (error as Error).message });
    telemetry.trackError('javascript', error as Error, { operation });
    throw error;
  }
};