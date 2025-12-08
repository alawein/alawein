// Structured error handling utilities

export enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_RATE_LIMIT = 'AUTH_RATE_LIMIT',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_EMAIL_INVALID = 'VALIDATION_EMAIL_INVALID',
  VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',

  // API errors
  API_NETWORK_ERROR = 'API_NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_NOT_FOUND = 'API_NOT_FOUND',
  API_BAD_REQUEST = 'API_BAD_REQUEST',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_FORBIDDEN = 'RESOURCE_FORBIDDEN',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.context = context;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}

// Specific error classes
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: Record<string, any>) {
    super(message, ErrorCode.AUTH_INVALID_CREDENTIALS, 401, true, context);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_FAILED, 400, true, context);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred', context?: Record<string, any>) {
    super(message, ErrorCode.API_NETWORK_ERROR, 0, true, context);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout', context?: Record<string, any>) {
    super(message, ErrorCode.API_TIMEOUT, 408, true, context);
    this.name = 'TimeoutError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: Record<string, any>) {
    super(message, ErrorCode.RESOURCE_NOT_FOUND, 404, true, context);
    this.name = 'NotFoundError';
  }
}

/**
 * Handles unknown errors and converts them to AppError
 */
export function handleError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.UNKNOWN_ERROR,
      500,
      false,
      { originalError: error.name }
    );
  }

  // Unknown error type
  return new AppError(
    'An unknown error occurred',
    ErrorCode.UNKNOWN_ERROR,
    500,
    false,
    { error: String(error) }
  );
}

/**
 * Checks if error is operational (expected) or programming error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Gets user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
    [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
    [ErrorCode.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
    [ErrorCode.AUTH_UNAUTHORIZED]: 'You are not authorized to perform this action',
    [ErrorCode.AUTH_RATE_LIMIT]: 'Too many attempts. Please try again later',
    [ErrorCode.VALIDATION_FAILED]: 'Please check your input and try again',
    [ErrorCode.VALIDATION_EMAIL_INVALID]: 'Please enter a valid email address',
    [ErrorCode.VALIDATION_PASSWORD_WEAK]: 'Password does not meet security requirements',
    [ErrorCode.API_NETWORK_ERROR]: 'Network error. Please check your connection',
    [ErrorCode.API_TIMEOUT]: 'Request timed out. Please try again',
    [ErrorCode.API_SERVER_ERROR]: 'Server error. Please try again later',
    [ErrorCode.API_NOT_FOUND]: 'The requested resource was not found',
    [ErrorCode.API_BAD_REQUEST]: 'Invalid request. Please check your input',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
    [ErrorCode.RESOURCE_CONFLICT]: 'This resource already exists',
    [ErrorCode.RESOURCE_FORBIDDEN]: 'You do not have permission to access this resource',
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred',
    [ErrorCode.INTERNAL_ERROR]: 'Internal error. Please contact support',
  };

  return messages[error.code] || error.message;
}
