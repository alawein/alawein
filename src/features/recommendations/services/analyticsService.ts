import { ViewHistoryItem, UserPreferences } from '../types';

interface AnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  trackProductView(productId: string, category: string, duration?: number): void {
    this.trackEvent('product_view', {
      productId,
      category,
      duration,
    });
  }

  trackRecommendationView(recommendationId: string, source: string, position: number): void {
    this.trackEvent('recommendation_view', {
      recommendationId,
      source,
      position,
    });
  }

  trackRecommendationClick(recommendationId: string, productId: string, source: string): void {
    this.trackEvent('recommendation_click', {
      recommendationId,
      productId,
      source,
    });
  }

  trackAddToCart(productId: string, source?: string, recommendationId?: string): void {
    this.trackEvent('add_to_cart', {
      productId,
      source,
      recommendationId,
    });
  }

  trackPreferenceUpdate(preferences: Partial<UserPreferences>): void {
    this.trackEvent('preference_update', {
      preferences,
    });
  }

  trackSearchQuery(query: string, resultsCount: number): void {
    this.trackEvent('search', {
      query,
      resultsCount,
    });
  }

  private trackEvent(type: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    this.events.push(event);

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(event);
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Replace with your analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      // Store failed events for retry
      this.storeFailedEvent(event);
    }
  }

  private storeFailedEvent(event: AnalyticsEvent): void {
    try {
      const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');
      failedEvents.push(event);
      localStorage.setItem('failed_analytics_events', JSON.stringify(failedEvents));
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }
  }

  async retryFailedEvents(): Promise<void> {
    try {
      const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');

      for (const event of failedEvents) {
        await this.sendToAnalytics(event);
      }

      localStorage.removeItem('failed_analytics_events');
    } catch (error) {
      console.error('Failed to retry analytics events:', error);
    }
  }
}
