interface MonitoringConfig {
  dsn?: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
}

class MonitoringService {
  private config: MonitoringConfig;
  private initialized = false;

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Initialize Sentry or similar service
    if (this.config.dsn) {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.init({
          dsn: this.config.dsn,
          environment: this.config.environment,
          release: this.config.release,
          tracesSampleRate: this.config.tracesSampleRate,
          beforeSend(event) {
            // Filter out development errors
            if (event.environment === 'development') {
              return null;
            }
            return event;
          },
        });
      });
    }

    // Initialize analytics
    this.initAnalytics();

    this.initialized = true;
  }

  private initAnalytics() {
    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
    }
  }

  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (this.isGtagAvailable()) {
      gtag('event', eventName, parameters);
    }
  }

  trackPageView(path: string) {
    if (this.isGtagAvailable()) {
      gtag('config', this.measurementId, {
        page_path: path,
      });
    }
  }

  private isGtagAvailable(): boolean {
    return typeof gtag === 'function';
  }
}

export const monitoring = new MonitoringService();
