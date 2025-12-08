interface MonitorErrorEvent {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

class Monitor {
  private endpoint = import.meta.env.VITE_MONITORING_ENDPOINT;

  captureError(error: Error, context?: Record<string, unknown>) {
    if (!this.endpoint || typeof window === 'undefined') return;

    try {
      const event: MonitorErrorEvent = {
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const blob = new Blob([JSON.stringify({ ...event, ...context })], {
        type: 'application/json',
      });
      navigator.sendBeacon(this.endpoint, blob);
    } catch (err) {
      console.error('Failed to capture error:', err);
    }
  }

  captureMetric(name: string, value: number, tags?: Record<string, string>) {
    if (!this.endpoint || typeof window === 'undefined') return;

    try {
      const blob = new Blob(
        [JSON.stringify({ type: 'metric', name, value, tags, timestamp: Date.now() })],
        { type: 'application/json' }
      );
      navigator.sendBeacon(this.endpoint, blob);
    } catch (err) {
      console.error('Failed to capture metric:', err);
    }
  }
}

export const monitor = new Monitor();
