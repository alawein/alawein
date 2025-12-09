/**
 * Error Handling Utilities
 *
 * Standardized error handling patterns for the monorepo.
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  [key: string]: unknown;
}

/**
 * Custom application error with type and context
 */
export class AppError extends Error {
  readonly type: ErrorType;
  readonly context: ErrorContext;
  readonly originalError?: Error;
  readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.context = { timestamp: Date.now(), ...context };
    this.originalError = originalError;
    this.isOperational = true;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Create a validation error
 */
export function validationError(message: string, context?: Partial<ErrorContext>): AppError {
  return new AppError(message, ErrorType.VALIDATION, context);
}

/**
 * Create a network error
 */
export function networkError(message: string, context?: Partial<ErrorContext>, originalError?: Error): AppError {
  return new AppError(message, ErrorType.NETWORK, context, originalError);
}

/**
 * Create an authentication error
 */
export function authError(message: string, context?: Partial<ErrorContext>): AppError {
  return new AppError(message, ErrorType.AUTHENTICATION, context);
}

/**
 * Create a not found error
 */
export function notFoundError(resource: string, context?: Partial<ErrorContext>): AppError {
  return new AppError(`${resource} not found`, ErrorType.NOT_FOUND, context);
}

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

/**
 * Wrap an async function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    onError?: (error: AppError) => void;
    fallback?: ReturnType<T> extends Promise<infer U> ? U : never;
    context?: Partial<ErrorContext>;
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = isAppError(error)
        ? error
        : new AppError(getErrorMessage(error), ErrorType.UNKNOWN, options.context, error instanceof Error ? error : undefined);

      options.onError?.(appError);

      if (options.fallback !== undefined) {
        return options.fallback;
      }

      throw appError;
    }
  }) as T;
}

/**
 * Try-catch wrapper that returns a result tuple
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, AppError]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = isAppError(error)
      ? error
      : new AppError(getErrorMessage(error), ErrorType.UNKNOWN, {}, error instanceof Error ? error : undefined);
    return [null, appError];
  }
}

/**
 * Synchronous try-catch wrapper
 */
export function tryCatchSync<T>(fn: () => T): [T, null] | [null, AppError] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    const appError = isAppError(error)
      ? error
      : new AppError(getErrorMessage(error), ErrorType.UNKNOWN, {}, error instanceof Error ? error : undefined);
    return [null, appError];
  }
}

