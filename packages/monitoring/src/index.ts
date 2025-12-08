export * from './sentry';
export * from './analytics';

export function healthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: typeof process !== 'undefined' ? process.uptime() : 0,
  };
}
