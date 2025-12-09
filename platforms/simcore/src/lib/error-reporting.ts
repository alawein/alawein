/**
 * Error Reporting and Analytics System
 * Centralized error handling and reporting for scientific modules
 */

export interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  moduleName?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  errorType: 'physics' | 'ui' | 'network' | 'system' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface PerformanceMetrics {
  calculationTime?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  renderTime?: number;
  errorRecoveryTime?: number;
}

class ErrorReportingService {
  private reports: ErrorReport[] = [];
  private sessionId: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        error: new Error(event.reason),
        errorType: 'system',
        severity: 'high',
        context: { type: 'unhandled_rejection' }
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.reportError({
        error: event.error || new Error(event.message),
        errorType: 'system',
        severity: 'medium',
        context: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  public reportError(options: {
    error: Error;
    moduleName?: string;
    errorType?: ErrorReport['errorType'];
    severity?: ErrorReport['severity'];
    context?: Record<string, any>;
    componentStack?: string;
  }): string {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const report: ErrorReport = {
      errorId,
      message: options.error.message,
      stack: options.error.stack,
      componentStack: options.componentStack,
      moduleName: options.moduleName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      errorType: options.errorType || 'unknown',
      severity: options.severity || 'medium',
      context: options.context
    };

    this.reports.push(report);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error Report:', report);
    }

    // Send to external service in production
    if (import.meta.env.PROD && this.isEnabled) {
      this.sendToService(report);
    }

    return errorId;
  }

  public reportPhysicsError(options: {
    error: Error;
    moduleName: string;
    calculationParams?: Record<string, any>;
    performanceMetrics?: PerformanceMetrics;
    severity?: ErrorReport['severity'];
  }): string {
    return this.reportError({
      ...options,
      errorType: 'physics',
      context: {
        calculationParams: options.calculationParams,
        performanceMetrics: options.performanceMetrics
      }
    });
  }

  public reportUIError(options: {
    error: Error;
    componentName?: string;
    props?: Record<string, any>;
    severity?: ErrorReport['severity'];
  }): string {
    return this.reportError({
      ...options,
      errorType: 'ui',
      moduleName: options.componentName,
      context: { props: options.props }
    });
  }

  public reportNetworkError(options: {
    error: Error;
    url?: string;
    method?: string;
    statusCode?: number;
    severity?: ErrorReport['severity'];
  }): string {
    return this.reportError({
      ...options,
      errorType: 'network',
      context: {
        requestUrl: options.url,
        method: options.method,
        statusCode: options.statusCode
      }
    });
  }

  private async sendToService(report: ErrorReport) {
    try {
      // In a real application, send to error reporting service
      // like Sentry, LogRocket, or custom endpoint
      console.log('Sending error report to service:', report.errorId);
      
      // Placeholder for actual service call
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report)
      // });
    } catch (sendError) {
      console.warn('Failed to send error report:', sendError);
    }
  }

  public getReports(filter?: {
    errorType?: ErrorReport['errorType'];
    severity?: ErrorReport['severity'];
    moduleName?: string;
    since?: Date;
  }): ErrorReport[] {
    let filtered = this.reports;

    if (filter) {
      filtered = filtered.filter(report => {
        if (filter.errorType && report.errorType !== filter.errorType) return false;
        if (filter.severity && report.severity !== filter.severity) return false;
        if (filter.moduleName && report.moduleName !== filter.moduleName) return false;
        if (filter.since && new Date(report.timestamp) < filter.since) return false;
        return true;
      });
    }

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byModule: Record<string, number>;
    recentErrors: number;
  } {
    const reports = this.reports;
    const recent = new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

    return {
      total: reports.length,
      byType: this.groupBy(reports, 'errorType'),
      bySeverity: this.groupBy(reports, 'severity'),
      byModule: this.groupBy(reports, 'moduleName'),
      recentErrors: reports.filter(r => new Date(r.timestamp) > recent).length
    };
  }

  private groupBy(array: ErrorReport[], key: keyof ErrorReport): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key] || 'unknown');
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  public clearReports(): void {
    this.reports = [];
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public enable(): void {
    this.isEnabled = true;
  }
}

// Singleton instance
export const errorReporter = new ErrorReportingService();

// Utility functions for common error scenarios
export const reportPhysicsCalculationError = (
  error: Error,
  moduleName: string,
  params?: Record<string, any>
) => {
  return errorReporter.reportPhysicsError({
    error,
    moduleName,
    calculationParams: params,
    severity: 'high'
  });
};

export const reportComponentError = (
  error: Error,
  componentName: string,
  props?: Record<string, any>
) => {
  return errorReporter.reportUIError({
    error,
    componentName,
    props,
    severity: 'medium'
  });
};

export const reportAsyncError = (
  error: Error,
  context?: Record<string, any>
) => {
  return errorReporter.reportError({
    error,
    errorType: 'system',
    severity: 'medium',
    context
  });
};

export default errorReporter;