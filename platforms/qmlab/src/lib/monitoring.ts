// Advanced monitoring and observability for QMLab
// Real-time metrics, alerting, and quantum-specific monitoring

import { trackQuantumEvents } from './analytics';

// Performance metrics types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags: Record<string, string>;
  dimensions: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number; // ms
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  cooldown: number; // ms
}

export interface Alert {
  id: string;
  rule: AlertRule;
  triggeredAt: number;
  resolvedAt?: number;
  value: number;
  message: string;
  status: 'active' | 'resolved' | 'silenced';
}

// Quantum-specific metrics collector
export class QuantumMetricsCollector {
  private metrics: PerformanceMetric[] = [];
  private circuitMetrics = new Map<string, any>();
  private trainingMetrics = new Map<string, any>();
  private simulationMetrics = new Map<string, any>();
  
  // Collect circuit performance metrics
  collectCircuitMetrics(circuitId: string, metrics: {
    gateCount: number;
    qubitCount: number;
    depth: number;
    compilationTime: number;
    executionTime: number;
    fidelity?: number;
    errorRate?: number;
  }): void {
    const timestamp = Date.now();
    
    this.circuitMetrics.set(circuitId, {
      ...metrics,
      timestamp,
      lastUpdated: timestamp
    });

    // Create performance metrics
    this.addMetric({
      name: 'circuit.compilation_time',
      value: metrics.compilationTime,
      unit: 'ms',
      timestamp,
      tags: { circuit_id: circuitId },
      dimensions: { 
        gate_count: metrics.gateCount,
        qubit_count: metrics.qubitCount,
        depth: metrics.depth
      }
    });

    this.addMetric({
      name: 'circuit.execution_time',
      value: metrics.executionTime,
      unit: 'ms',
      timestamp,
      tags: { circuit_id: circuitId },
      dimensions: { 
        gate_count: metrics.gateCount,
        qubit_count: metrics.qubitCount
      }
    });

    if (metrics.fidelity !== undefined) {
      this.addMetric({
        name: 'circuit.fidelity',
        value: metrics.fidelity,
        unit: 'ratio',
        timestamp,
        tags: { circuit_id: circuitId },
        dimensions: { gate_count: metrics.gateCount }
      });
    }

    if (metrics.errorRate !== undefined) {
      this.addMetric({
        name: 'circuit.error_rate',
        value: metrics.errorRate,
        unit: 'ratio',
        timestamp,
        tags: { circuit_id: circuitId },
        dimensions: { gate_count: metrics.gateCount }
      });
    }
  }

  // Collect training performance metrics
  collectTrainingMetrics(sessionId: string, metrics: {
    epoch: number;
    loss: number;
    accuracy: number;
    learningRate: number;
    batchSize: number;
    epochTime: number;
    gradientNorm?: number;
    memoryUsage?: number;
  }): void {
    const timestamp = Date.now();
    
    this.trainingMetrics.set(sessionId, {
      ...metrics,
      timestamp,
      lastUpdated: timestamp
    });

    // Training progress metrics
    this.addMetric({
      name: 'training.loss',
      value: metrics.loss,
      unit: 'scalar',
      timestamp,
      tags: { session_id: sessionId },
      dimensions: { 
        epoch: metrics.epoch,
        learning_rate: metrics.learningRate,
        batch_size: metrics.batchSize
      }
    });

    this.addMetric({
      name: 'training.accuracy',
      value: metrics.accuracy,
      unit: 'ratio',
      timestamp,
      tags: { session_id: sessionId },
      dimensions: { epoch: metrics.epoch }
    });

    this.addMetric({
      name: 'training.epoch_time',
      value: metrics.epochTime,
      unit: 'ms',
      timestamp,
      tags: { session_id: sessionId },
      dimensions: { 
        epoch: metrics.epoch,
        batch_size: metrics.batchSize
      }
    });

    if (metrics.gradientNorm !== undefined) {
      this.addMetric({
        name: 'training.gradient_norm',
        value: metrics.gradientNorm,
        unit: 'scalar',
        timestamp,
        tags: { session_id: sessionId },
        dimensions: { epoch: metrics.epoch }
      });
    }

    if (metrics.memoryUsage !== undefined) {
      this.addMetric({
        name: 'training.memory_usage',
        value: metrics.memoryUsage,
        unit: 'bytes',
        timestamp,
        tags: { session_id: sessionId },
        dimensions: { epoch: metrics.epoch }
      });
    }
  }

  // Collect quantum simulation metrics
  collectSimulationMetrics(simulationId: string, metrics: {
    stateVectorSize: number;
    simulationTime: number;
    memoryPeak: number;
    entanglementMeasures?: Record<string, number>;
    coherenceTime?: number;
    decoherenceRate?: number;
  }): void {
    const timestamp = Date.now();
    
    this.simulationMetrics.set(simulationId, {
      ...metrics,
      timestamp,
      lastUpdated: timestamp
    });

    this.addMetric({
      name: 'simulation.execution_time',
      value: metrics.simulationTime,
      unit: 'ms',
      timestamp,
      tags: { simulation_id: simulationId },
      dimensions: { state_vector_size: metrics.stateVectorSize }
    });

    this.addMetric({
      name: 'simulation.memory_peak',
      value: metrics.memoryPeak,
      unit: 'bytes',
      timestamp,
      tags: { simulation_id: simulationId },
      dimensions: { state_vector_size: metrics.stateVectorSize }
    });

    if (metrics.entanglementMeasures) {
      Object.entries(metrics.entanglementMeasures).forEach(([measure, value]) => {
        this.addMetric({
          name: `simulation.entanglement.${measure}`,
          value,
          unit: 'scalar',
          timestamp,
          tags: { simulation_id: simulationId, measure },
          dimensions: { state_vector_size: metrics.stateVectorSize }
        });
      });
    }

    if (metrics.coherenceTime !== undefined) {
      this.addMetric({
        name: 'simulation.coherence_time',
        value: metrics.coherenceTime,
        unit: 'ms',
        timestamp,
        tags: { simulation_id: simulationId },
        dimensions: {}
      });
    }

    if (metrics.decoherenceRate !== undefined) {
      this.addMetric({
        name: 'simulation.decoherence_rate',
        value: metrics.decoherenceRate,
        unit: 'hz',
        timestamp,
        tags: { simulation_id: simulationId },
        dimensions: {}
      });
    }
  }

  // Add metric to collection
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics (last 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }

  // Get metrics for time range
  getMetrics(
    name?: string, 
    startTime?: number, 
    endTime?: number
  ): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (startTime) {
      filtered = filtered.filter(m => m.timestamp >= startTime);
    }

    if (endTime) {
      filtered = filtered.filter(m => m.timestamp <= endTime);
    }

    return filtered.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Get aggregated metrics
  getAggregatedMetrics(
    name: string,
    aggregation: 'avg' | 'min' | 'max' | 'sum' | 'count',
    timeWindow: number = 5 * 60 * 1000 // 5 minutes default
  ): number {
    const endTime = Date.now();
    const startTime = endTime - timeWindow;
    const metrics = this.getMetrics(name, startTime, endTime);

    if (metrics.length === 0) return 0;

    const values = metrics.map(m => m.value);

    switch (aggregation) {
      case 'avg':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'count':
        return values.length;
      default:
        return 0;
    }
  }

  // Get current quantum system health score
  getQuantumHealthScore(): number {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    // Get recent metrics
    const recentMetrics = this.metrics.filter(m => m.timestamp > fiveMinutesAgo);
    
    if (recentMetrics.length === 0) return 100; // No recent activity = healthy

    let healthScore = 100;
    
    // Check error rates
    const errorRateMetrics = recentMetrics.filter(m => m.name.includes('error_rate'));
    const avgErrorRate = errorRateMetrics.length > 0 
      ? errorRateMetrics.reduce((sum, m) => sum + m.value, 0) / errorRateMetrics.length 
      : 0;
    
    healthScore -= avgErrorRate * 50; // Error rate impact

    // Check performance degradation
    const executionTimeMetrics = recentMetrics.filter(m => m.name.includes('execution_time'));
    const avgExecutionTime = executionTimeMetrics.length > 0
      ? executionTimeMetrics.reduce((sum, m) => sum + m.value, 0) / executionTimeMetrics.length
      : 0;
    
    if (avgExecutionTime > 5000) { // >5s is concerning
      healthScore -= Math.min((avgExecutionTime - 5000) / 1000 * 5, 30);
    }

    // Check memory usage
    const memoryMetrics = recentMetrics.filter(m => m.name.includes('memory'));
    const avgMemory = memoryMetrics.length > 0
      ? memoryMetrics.reduce((sum, m) => sum + m.value, 0) / memoryMetrics.length
      : 0;
    
    const memoryGB = avgMemory / (1024 * 1024 * 1024);
    if (memoryGB > 2) { // >2GB is concerning
      healthScore -= Math.min((memoryGB - 2) * 10, 20);
    }

    return Math.max(0, Math.min(100, healthScore));
  }

  // Export metrics for external monitoring
  exportMetrics(format: 'json' | 'prometheus' = 'json'): string {
    if (format === 'prometheus') {
      return this.exportPrometheusMetrics();
    }

    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.metrics,
      quantum_health_score: this.getQuantumHealthScore(),
      summary: {
        total_metrics: this.metrics.length,
        circuit_sessions: this.circuitMetrics.size,
        training_sessions: this.trainingMetrics.size,
        simulations: this.simulationMetrics.size
      }
    }, null, 2);
  }

  // Export in Prometheus format
  private exportPrometheusMetrics(): string {
    const lines: string[] = [];
    const metricGroups = new Map<string, PerformanceMetric[]>();

    // Group metrics by name
    this.metrics.forEach(metric => {
      if (!metricGroups.has(metric.name)) {
        metricGroups.set(metric.name, []);
      }
      metricGroups.get(metric.name)!.push(metric);
    });

    // Generate Prometheus format
    metricGroups.forEach((metrics, name) => {
      const prometheusName = name.replace(/\./g, '_');
      
      lines.push(`# HELP ${prometheusName} Quantum computing metric`);
      lines.push(`# TYPE ${prometheusName} gauge`);
      
      metrics.forEach(metric => {
        const labels = Object.entries(metric.tags)
          .map(([key, value]) => `${key}="${value}"`)
          .join(',');
        
        lines.push(`${prometheusName}{${labels}} ${metric.value} ${metric.timestamp}`);
      });
    });

    // Add health score
    lines.push('# HELP quantum_health_score Overall quantum system health');
    lines.push('# TYPE quantum_health_score gauge');
    lines.push(`quantum_health_score ${this.getQuantumHealthScore()} ${Date.now()}`);

    return lines.join('\n');
  }
}

// Alerting system for quantum metrics
export class QuantumAlertManager {
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private alertHistory: Alert[] = [];
  private lastEvaluationTime = 0;
  private evaluationInterval = 30000; // 30 seconds

  constructor(private metricsCollector: QuantumMetricsCollector) {
    this.setupDefaultRules();
    this.startAlertEvaluation();
  }

  // Setup default alert rules for quantum systems
  private setupDefaultRules(): void {
    this.rules = [
      {
        id: 'high-error-rate',
        name: 'High Quantum Error Rate',
        metric: 'circuit.error_rate',
        operator: 'gt',
        threshold: 0.1, // 10%
        duration: 60000, // 1 minute
        severity: 'critical',
        enabled: true,
        cooldown: 300000 // 5 minutes
      },
      {
        id: 'slow-execution',
        name: 'Slow Quantum Execution',
        metric: 'circuit.execution_time',
        operator: 'gt',
        threshold: 10000, // 10 seconds
        duration: 120000, // 2 minutes
        severity: 'warning',
        enabled: true,
        cooldown: 600000 // 10 minutes
      },
      {
        id: 'training-stalled',
        name: 'Training Progress Stalled',
        metric: 'training.loss',
        operator: 'eq', // No improvement
        threshold: 0, // Will be dynamically set
        duration: 600000, // 10 minutes
        severity: 'warning',
        enabled: true,
        cooldown: 1800000 // 30 minutes
      },
      {
        id: 'low-fidelity',
        name: 'Low Circuit Fidelity',
        metric: 'circuit.fidelity',
        operator: 'lt',
        threshold: 0.85, // 85%
        duration: 180000, // 3 minutes
        severity: 'warning',
        enabled: true,
        cooldown: 900000 // 15 minutes
      },
      {
        id: 'high-memory-usage',
        name: 'High Memory Usage',
        metric: 'simulation.memory_peak',
        operator: 'gt',
        threshold: 2 * 1024 * 1024 * 1024, // 2GB
        duration: 60000, // 1 minute
        severity: 'warning',
        enabled: true,
        cooldown: 300000 // 5 minutes
      },
      {
        id: 'quantum-health-degraded',
        name: 'Quantum System Health Degraded',
        metric: 'quantum.health_score',
        operator: 'lt',
        threshold: 70, // 70%
        duration: 300000, // 5 minutes
        severity: 'critical',
        enabled: true,
        cooldown: 600000 // 10 minutes
      }
    ];
  }

  // Start continuous alert evaluation
  private startAlertEvaluation(): void {
    const evaluate = () => {
      this.evaluateRules();
      setTimeout(evaluate, this.evaluationInterval);
    };

    evaluate();
  }

  // Evaluate all alert rules
  private evaluateRules(): void {
    const now = Date.now();
    this.lastEvaluationTime = now;

    this.rules.filter(rule => rule.enabled).forEach(rule => {
      this.evaluateRule(rule, now);
    });

    // Clean up resolved alerts
    this.alerts = this.alerts.filter(alert => 
      alert.status === 'active' || (now - alert.triggeredAt) < 86400000 // Keep for 24 hours
    );
  }

  // Evaluate a single alert rule
  private evaluateRule(rule: AlertRule, currentTime: number): void {
    // Check if rule is in cooldown
    const lastAlert = this.alertHistory
      .filter(alert => alert.rule.id === rule.id && alert.status === 'resolved')
      .sort((a, b) => b.triggeredAt - a.triggeredAt)[0];

    if (lastAlert && (currentTime - lastAlert.triggeredAt) < rule.cooldown) {
      return; // Still in cooldown
    }

    // Get metric value for evaluation
    let metricValue: number;
    
    if (rule.metric === 'quantum.health_score') {
      metricValue = this.metricsCollector.getQuantumHealthScore();
    } else {
      metricValue = this.metricsCollector.getAggregatedMetrics(
        rule.metric,
        'avg',
        rule.duration
      );
    }

    // Evaluate condition
    const isTriggered = this.evaluateCondition(metricValue, rule.operator, rule.threshold);
    
    // Find existing alert for this rule
    const existingAlert = this.alerts.find(alert => 
      alert.rule.id === rule.id && alert.status === 'active'
    );

    if (isTriggered && !existingAlert) {
      // Create new alert
      const alert: Alert = {
        id: `alert-${rule.id}-${currentTime}`,
        rule,
        triggeredAt: currentTime,
        value: metricValue,
        message: this.generateAlertMessage(rule, metricValue),
        status: 'active'
      };

      this.alerts.push(alert);
      this.alertHistory.push(alert);
      this.handleAlert(alert);

    } else if (!isTriggered && existingAlert) {
      // Resolve existing alert
      existingAlert.resolvedAt = currentTime;
      existingAlert.status = 'resolved';
      this.handleAlertResolution(existingAlert);
    }
  }

  // Evaluate alert condition
  private evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case 'gt': return value > threshold;
      case 'gte': return value >= threshold;
      case 'lt': return value < threshold;
      case 'lte': return value <= threshold;
      case 'eq': return Math.abs(value - threshold) < 0.001;
      default: return false;
    }
  }

  // Generate alert message
  private generateAlertMessage(rule: AlertRule, value: number): string {
    return `${rule.name}: ${rule.metric} is ${value.toFixed(3)} (threshold: ${rule.threshold})`;
  }

  // Handle new alert
  private handleAlert(alert: Alert): void {
    console.warn(`🚨 ALERT: ${alert.message}`);
    
    // Track alert in analytics
    trackQuantumEvents.errorBoundary(
      alert.message,
      JSON.stringify({ alert: alert.rule.id, value: alert.value }),
      'monitoring-alert'
    );

    // Could implement additional alert actions:
    // - Send notifications
    // - Trigger automated remediation
    // - Create incidents in external systems
    // - Send to monitoring dashboards
  }

  // Handle alert resolution
  private handleAlertResolution(alert: Alert): void {
    console.info(`✅ RESOLVED: ${alert.message}`);
    
    trackQuantumEvents.featureDiscovery('alert_resolved', JSON.stringify({
      alert_id: alert.id,
      duration: alert.resolvedAt! - alert.triggeredAt
    }));
  }

  // Get current active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === 'active');
  }

  // Get alert history
  getAlertHistory(hours: number = 24): Alert[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.alertHistory.filter(alert => alert.triggeredAt > cutoff);
  }

  // Add custom alert rule
  addRule(rule: Omit<AlertRule, 'id'>): void {
    const newRule: AlertRule = {
      ...rule,
      id: `custom-${Date.now()}`
    };
    
    this.rules.push(newRule);
  }

  // Update alert rule
  updateRule(id: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) return false;

    this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    return true;
  }

  // Delete alert rule
  deleteRule(id: string): boolean {
    const ruleIndex = this.rules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) return false;

    this.rules.splice(ruleIndex, 1);
    
    // Resolve any active alerts for this rule
    this.alerts
      .filter(alert => alert.rule.id === id && alert.status === 'active')
      .forEach(alert => {
        alert.status = 'resolved';
        alert.resolvedAt = Date.now();
      });

    return true;
  }
}

export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Mock Sentry-like interface for development
class QMLabErrorReporter {
  private isInitialized = false;
  private errorQueue: ErrorDetails[] = [];
  private performanceQueue: PerformanceMetrics[] = [];

  init(config: { dsn?: string; environment?: string; release?: string }) {
    // In production, this would initialize Sentry
    console.log('🔍 QMLab Error Reporter initialized:', {
      environment: config.environment || 'development',
      release: config.release || 'unknown',
      dsn: config.dsn ? '***configured***' : 'not set'
    });
    
    this.isInitialized = true;
    this.flushQueue();
    
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  captureError(error: Error, details?: Partial<ErrorDetails>) {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion(),
      ...details
    };

    if (this.isInitialized) {
      this.reportError(errorDetails);
    } else {
      this.errorQueue.push(errorDetails);
    }
  }

  captureException(exception: any, context?: Record<string, any>) {
    const error = exception instanceof Error ? exception : new Error(String(exception));
    this.captureError(error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', extra?: any) {
    const errorDetails: ErrorDetails = {
      message,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion(),
      ...extra
    };

    if (this.isInitialized) {
      console.log(`📊 [${level.toUpperCase()}] ${message}`, extra);
    }
  }

  capturePerformance(metrics: PerformanceMetrics) {
    if (this.isInitialized) {
      this.reportPerformance(metrics);
    } else {
      this.performanceQueue.push(metrics);
    }
  }

  addBreadcrumb(breadcrumb: { message: string; category: string; level?: string; data?: any }) {
    // Log breadcrumb for debugging
    console.log('🍞 Breadcrumb:', breadcrumb);
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    console.log('👤 User context set:', { id: user.id });
  }

  setTag(key: string, value: string) {
    console.log('🏷️ Tag set:', { [key]: value });
  }

  setContext(key: string, context: any) {
    console.log('📝 Context set:', { [key]: context });
  }

  private setupGlobalHandlers() {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        componentStack: 'Global unhandled promise rejection'
      });
    });

    // Global errors
    window.addEventListener('error', (event) => {
      this.captureError(new Error(event.message), {
        componentStack: `${event.filename}:${event.lineno}:${event.colno}`
      });
    });

    // Console error interception
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.captureMessage(`Console Error: ${args.join(' ')}`, 'error');
      originalConsoleError(...args);
    };
  }

  private reportError(errorDetails: ErrorDetails) {
    // In production, this would send to Sentry
    console.error('🚨 QMLab Error:', errorDetails);
    
    // Also send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: errorDetails.message,
        fatal: false,
        custom_map: {
          error_boundary: errorDetails.errorBoundary,
          component_stack: errorDetails.componentStack
        }
      });
    }
  }

  private reportPerformance(metrics: PerformanceMetrics) {
    console.log('⚡ Performance Metric:', metrics);
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: metrics.componentName,
        value: metrics.renderTime
      });
    }
  }

  private flushQueue() {
    this.errorQueue.forEach(error => this.reportError(error));
    this.performanceQueue.forEach(perf => this.reportPerformance(perf));
    this.errorQueue = [];
    this.performanceQueue = [];
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('qmlab-session-id');
    if (!sessionId) {
      sessionId = `qmlab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('qmlab-session-id', sessionId);
    }
    return sessionId;
  }

  private getBuildVersion(): string {
    return import.meta.env.MODE === 'production' ? 
      (import.meta.env.VITE_APP_VERSION || 'unknown') : 
      'development';
  }
}

// Global monitoring instances
export const quantumMetrics = new QuantumMetricsCollector();
export const quantumAlerts = new QuantumAlertManager(quantumMetrics);

// Create singleton instance
export const errorReporter = new QMLabErrorReporter();

// Initialize error reporting
export const initErrorReporting = (config?: { 
  dsn?: string; 
  environment?: string; 
  release?: string;
  enablePerformanceMonitoring?: boolean;
}) => {
  errorReporter.init({
    dsn: config?.dsn || import.meta.env.VITE_SENTRY_DSN,
    environment: config?.environment || import.meta.env.MODE,
    release: config?.release || import.meta.env.VITE_APP_VERSION
  });

  if (config?.enablePerformanceMonitoring !== false) {
    setupPerformanceMonitoring();
  }

  // Set up React error boundary integration
  errorReporter.setTag('framework', 'react');
  errorReporter.setTag('app', 'qmlab');
};

// Performance monitoring setup
const setupPerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // LCP monitoring
    const lcpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        errorReporter.capturePerformance({
          componentName: 'LCP',
          loadTime: entry.startTime,
          renderTime: entry.startTime,
          timestamp: Date.now()
        });
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FID monitoring
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fid = (entry as any).processingStart - entry.startTime;
        errorReporter.capturePerformance({
          componentName: 'FID',
          loadTime: fid,
          renderTime: fid,
          timestamp: Date.now()
        });
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  }
};

// Helper for error reporting in components
export const reportComponentError = (
  error: Error,
  componentName: string,
  errorBoundary: string = 'manual'
) => {
  errorReporter.captureError(error, {
    componentStack: `Error in ${componentName}`,
    errorBoundary
  });
};