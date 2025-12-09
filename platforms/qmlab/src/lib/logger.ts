/**
 * Centralized logging utility for QMLab
 * Provides structured logging with levels and optional persistence
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    // Store in history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const logFn = console[level] || console.log;
      const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
      logFn(`[${level.toUpperCase()}] ${message}${contextStr}`);
    }

    // In production, only log errors and warnings
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      const logFn = console[level];
      logFn(`[${level.toUpperCase()}] ${message}`, context);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory() {
    this.logHistory = [];
  }
}

export const logger = new Logger();
