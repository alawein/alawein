export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  
  console.log('Event tracked:', event);
  // Analytics integration would go here
}

export function trackPageView(path: string) {
  trackEvent({ name: 'page_view', properties: { path } });
}
