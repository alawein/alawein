/**
 * Advanced user analytics and behavior tracking system
 * GDPR compliant with user consent management
 */

import { getConfig, isFeatureEnabled } from './environment';

export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
  user_properties?: Record<string, string | number | boolean>;
  // Legacy support for existing code
  type?: string;
  name?: string;
  payload?: any;
  path?: string;
  title?: string;
  referrer?: string;
  action?: string;
  timestamp?: number;
  source?: string;
  target?: string;
  period?: string;
  alertId?: string;
  [key: string]: any;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  start_time: number;
  end_time?: number;
  page_views: number;
  events: AnalyticsEvent[];
  user_agent: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface ConversionFunnel {
  name: string;
  steps: string[];
  user_id?: string;
  session_id: string;
  started_at: number;
  completed_at?: number;
  dropped_at_step?: number;
  metadata?: Record<string, unknown>;
}

class AnalyticsManager {
  private session: UserSession | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private consentGiven = false;
  private initialized = false;
  private funnels: Map<string, ConversionFunnel> = new Map();
  private heatmapData: Array<{ x: number; y: number; timestamp: number }> = [];
  private performanceMetrics: Array<{ name: string; value: number; timestamp: number }> = [];

  /**
   * Initialize analytics system
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    const config = getConfig();
    if (!config.features.analytics) {
      console.log('Analytics disabled in configuration');
      return;
    }

    // Check for stored consent
    this.consentGiven = this.getStoredConsent();

    if (this.consentGiven) {
      await this.initializeTracking();
    } else {
      this.showConsentBanner();
    }

    this.setupEventListeners();
    this.initialized = true;

    console.log('Analytics system initialized');
  }

  /**
   * Initialize tracking systems
   */
  private async initializeTracking(): Promise<void> {
    this.startSession();
    this.initializeGoogleAnalytics();
    this.setupPerformanceTracking();
    this.setupScrollTracking();
    this.setupClickTracking();
    this.setupFormTracking();
    this.setupErrorTracking();
  }

  /**
   * Show consent banner
   */
  private showConsentBanner(): void {
    // Check if banner already exists
    if (document.querySelector('#analytics-consent-banner')) {
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'analytics-consent-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1a1a1a;
      color: white;
      padding: 16px;
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    `;

    banner.innerHTML = `
      <div style="flex: 1; margin-right: 16px;">
        <strong>Cookie Consent</strong><br>
        We use analytics cookies to improve your experience and understand how our platform is used.
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="accept-analytics" style="background: #4F83F0; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
          Accept
        </button>
        <button id="decline-analytics" style="background: transparent; color: white; border: 1px solid #666; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
          Decline
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Handle accept
    banner.querySelector('#accept-analytics')?.addEventListener('click', async () => {
      this.consentGiven = true;
      this.storeConsent(true);
      banner.remove();
      await this.initializeTracking();
      this.track('consent_given', { category: 'privacy', value: 1 });
    });

    // Handle decline
    banner.querySelector('#decline-analytics')?.addEventListener('click', () => {
      this.consentGiven = false;
      this.storeConsent(false);
      banner.remove();
      this.track('consent_declined', { category: 'privacy', value: 0 });
    });
  }

  /**
   * Get stored consent preference
   */
  private getStoredConsent(): boolean {
    try {
      return localStorage.getItem('analytics_consent') === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Store consent preference
   */
  private storeConsent(consent: boolean): void {
    try {
      localStorage.setItem('analytics_consent', consent.toString());
      localStorage.setItem('analytics_consent_date', new Date().toISOString());
    } catch (error) {
      console.error('Failed to store consent:', error);
    }
  }

  /**
   * Track custom event
   */
  track(event: string, parameters: Partial<AnalyticsEvent> = {}): void {
    if (!this.consentGiven) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category: parameters.category || 'general',
      label: parameters.label,
      value: parameters.value,
      custom_parameters: {
        timestamp: Date.now(),
        session_id: this.session?.session_id,
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        ...parameters.custom_parameters,
      },
      user_properties: parameters.user_properties,
    };

    this.eventQueue.push(analyticsEvent);
    
    if (this.session) {
      this.session.events.push(analyticsEvent);
    }

    console.log('Analytics event tracked:', analyticsEvent);
  }

  // Placeholder methods for remaining functionality
  private startSession(): void {
    this.session = {
      session_id: crypto.randomUUID(),
      start_time: Date.now(),
      page_views: 1,
      events: [],
      user_agent: navigator.userAgent,
    };
  }

  private initializeGoogleAnalytics(): void {
    console.log('Google Analytics initialization placeholder');
  }

  private setupPerformanceTracking(): void {
    console.log('Performance tracking setup placeholder');
  }

  private setupScrollTracking(): void {
    console.log('Scroll tracking setup placeholder');
  }

  private setupClickTracking(): void {
    console.log('Click tracking setup placeholder');
  }

  private setupFormTracking(): void {
    console.log('Form tracking setup placeholder');
  }

  private setupErrorTracking(): void {
    console.log('Error tracking setup placeholder');
  }

  private setupEventListeners(): void {
    console.log('Event listeners setup placeholder');
  }
}

// Global analytics manager
export const analyticsManager = new AnalyticsManager();

/**
 * Initialize analytics system
 */
export async function initAnalytics(): Promise<void> {
  if (!isFeatureEnabled('analytics')) {
    console.log('Analytics disabled via feature flag');
    return;
  }

  try {
    await analyticsManager.init();
    console.log('Analytics system initialized');
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
}

/**
 * Track custom event
 */
export function trackEvent(event: string, parameters?: Partial<AnalyticsEvent>): void {
  analyticsManager.track(event, parameters);
}

// Legacy interface support
type EventPayload = Record<string, unknown>;

interface LegacyAnalyticsEvent {
  type: string;
  name?: string;
  path?: string;
  title?: string;
  referrer?: string;
  payload?: EventPayload;
  ts: number;
  sessionId: string;
  userId?: string;
  userAgent: string;
}

const STORAGE_KEY = "llmworks_analytics_events";
const SESSION_KEY = "llmworks_session_id";
const USER_KEY = "llmworks_user_id";

// Generate session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Get or generate user ID
function getUserId(): string {
  let userId = localStorage.getItem(USER_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_KEY, userId);
  }
  return userId;
}

function save(event: Partial<AnalyticsEvent>) {
  try {
    const enrichedEvent: AnalyticsEvent = {
      ...event,
      ts: Date.now(),
      sessionId: getSessionId(),
      userId: getUserId(),
      userAgent: navigator.userAgent,
    } as AnalyticsEvent;

    const existing: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(enrichedEvent);
    const trimmed = existing.slice(-1000); // Keep last 1000 events
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    
    // Also send to console for debugging
    console.debug("[analytics]", enrichedEvent);
  } catch (error) {
    console.warn("Analytics save failed:", error);
  }
}

export function trackPageView(path: string, title?: string) {
  const evt = { 
    type: "page_view", 
    path, 
    title: title || document.title, 
    referrer: document.referrer 
  };
  save(evt);
}

export function trackLegacyEvent(name: string, payload?: EventPayload) {
  const evt = { type: "event", name, payload };
  save(evt);
}

export function trackError(error: Error, context?: string) {
  const evt = {
    type: "error",
    name: "error_occurred",
    payload: {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
    }
  };
  save(evt);
}

export function trackPerformance(name: string, duration: number, additionalData?: EventPayload) {
  const evt = {
    type: "performance",
    name,
    payload: {
      duration,
      ...additionalData,
      url: window.location.href,
    }
  };
  save(evt);
}

export function getAnalyticsData(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearAnalyticsData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Track page load performance
export function trackPageLoad() {
  if (performance.getEntriesByType) {
    const perfEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (perfEntries.length > 0) {
      const entry = perfEntries[0];
      trackPerformance("page_load", entry.loadEventEnd - entry.fetchStart, {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.fetchStart,
        firstPaint: entry.responseEnd - entry.fetchStart,
      });
    }
  }
}
