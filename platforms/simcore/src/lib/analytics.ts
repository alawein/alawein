// Analytics and performance tracking

import React from 'react';
import { PerformanceMetrics } from '@/types/interfaces';
import { handlePhysicsError } from './error-handling';

interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PageView {
  page: string;
  title: string;
  timestamp: number;
  referrer?: string;
  userAgent: string;
}

interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: PageView[];
  events: AnalyticsEvent[];
  performance: PerformanceMetrics[];
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    screen: { width: number; height: number };
    devicePixelRatio: number;
    connection?: string;
  };
}

class AnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private session: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline = navigator.onLine;
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.setupEventListeners();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      id: this.sessionId,
      startTime: Date.now(),
      pageViews: [],
      events: [],
      performance: [],
      deviceInfo: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: screen.width,
          height: screen.height,
        },
        devicePixelRatio: window.devicePixelRatio,
        connection: (navigator as any).connection?.effectiveType,
      },
    };
  }

  private setupEventListeners() {
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visible: !document.hidden,
      });
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.track('connection_change', { status: 'online' });
      this.flush(); // Send queued events
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.track('connection_change', { status: 'offline' });
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.track('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      });
    });

    // Track beforeunload (user leaving)
    window.addEventListener('beforeunload', () => {
      this.endSession();
      this.flush(true); // Force immediate flush
    });
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  // Track custom events
  track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.session.events.push(event);
    this.eventQueue.push(event);

    // Auto-flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  // Track page views
  trackPageView(page: string, title: string = document.title) {
    const pageView: PageView = {
      page,
      title,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    };

    this.session.pageViews.push(pageView);
    
    this.track('page_view', {
      page,
      title,
      referrer: document.referrer,
    });
  }

  // Track performance metrics
  trackPerformance(metrics: PerformanceMetrics) {
    this.session.performance.push(metrics);
    
    this.track('performance_metrics', {
      renderTime: metrics.renderTime,
      computeTime: metrics.computeTime,
      memoryUsage: metrics.memoryUsage,
      fps: metrics.fps,
    });
  }

  // Track physics simulation events
  trackSimulation(simulationType: string, parameters: Record<string, any>, success: boolean, duration?: number) {
    this.track('physics_simulation', {
      type: simulationType,
      parameters,
      success,
      duration,
      timestamp: Date.now(),
    });
  }

  // Track user interactions
  trackInteraction(action: string, target: string, properties: Record<string, any> = {}) {
    this.track('user_interaction', {
      action,
      target,
      ...properties,
    });
  }

  // Track module usage
  trackModuleUsage(moduleId: string, action: 'enter' | 'exit' | 'parameter_change', data?: Record<string, any>) {
    this.track('module_usage', {
      moduleId,
      action,
      data,
    });
  }

  // Set user ID
  setUserId(userId: string) {
    this.userId = userId;
    this.track('user_identified', { userId });
  }

  // Get current session data
  getSession(): UserSession {
    return { ...this.session };
  }

  // End current session
  endSession() {
    this.session.endTime = Date.now();
    this.track('session_end', {
      duration: this.session.endTime - this.session.startTime,
      pageViews: this.session.pageViews.length,
      events: this.session.events.length,
    });
  }

  // Flush events to server
  private async flush(force = false) {
    if (this.eventQueue.length === 0) return;
    if (!this.isOnline && !force) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real implementation, send to your analytics service
      if (this.isOnline) {
        await this.sendEvents(events);
      } else {
        // Store offline for later
        this.storeOfflineEvents(events);
      }
    } catch (error) {
      handlePhysicsError(error, 'Analytics flush failed');
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  private async sendEvents(events: AnalyticsEvent[]) {
    // Example implementation - replace with your analytics service
    const payload = {
      session: this.session,
      events,
      timestamp: Date.now(),
    };

    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Events:', payload);
      return;
    }

    // In production, send to your analytics endpoint
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
  }

  private storeOfflineEvents(events: AnalyticsEvent[]) {
    try {
      const stored = localStorage.getItem('simcore_offline_analytics') || '[]';
      const offlineEvents = JSON.parse(stored);
      offlineEvents.push(...events);
      
      // Keep only last 1000 events to prevent storage overflow
      const recentEvents = offlineEvents.slice(-1000);
      localStorage.setItem('simcore_offline_analytics', JSON.stringify(recentEvents));
    } catch (error) {
      handlePhysicsError(error, 'Storing offline analytics');
    }
  }

  // Load and send offline events when back online
  private async loadOfflineEvents() {
    try {
      const stored = localStorage.getItem('simcore_offline_analytics');
      if (!stored) return;

      const offlineEvents = JSON.parse(stored);
      if (offlineEvents.length > 0) {
        await this.sendEvents(offlineEvents);
        localStorage.removeItem('simcore_offline_analytics');
      }
    } catch (error) {
      handlePhysicsError(error, 'Loading offline analytics');
    }
  }

  // Clean up
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.endSession();
    this.flush(true);
  }
}

// Create global instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export function useAnalytics() {
  const trackPageView = React.useCallback((page: string, title?: string) => {
    analytics.trackPageView(page, title);
  }, []);

  const trackEvent = React.useCallback((name: string, properties?: Record<string, any>) => {
    analytics.track(name, properties);
  }, []);

  const trackInteraction = React.useCallback((action: string, target: string, properties?: Record<string, any>) => {
    analytics.trackInteraction(action, target, properties);
  }, []);

  const trackSimulation = React.useCallback((type: string, parameters: Record<string, any>, success: boolean, duration?: number) => {
    analytics.trackSimulation(type, parameters, success, duration);
  }, []);

  const trackModuleUsage = React.useCallback((moduleId: string, action: 'enter' | 'exit' | 'parameter_change', data?: Record<string, any>) => {
    analytics.trackModuleUsage(moduleId, action, data);
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackInteraction,
    trackSimulation,
    trackModuleUsage,
  };
}

// Performance tracking utilities
export function trackRenderTime<T>(componentName: string, renderFn: () => T): T {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();
  
  analytics.trackPerformance({
    renderTime: endTime - startTime,
    computeTime: 0,
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
  });

  return result;
}

export function trackAsyncOperation<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return operation()
    .then((result) => {
      const endTime = performance.now();
      analytics.track('async_operation_success', {
        operation: operationName,
        duration: endTime - startTime,
      });
      return result;
    })
    .catch((error) => {
      const endTime = performance.now();
      analytics.track('async_operation_error', {
        operation: operationName,
        duration: endTime - startTime,
        error: error.message,
      });
      throw error;
    });
}

export default analytics;
