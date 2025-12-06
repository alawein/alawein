// Centralized error handling utilities

export enum ErrorType {
  PHYSICS_CALCULATION = 'PHYSICS_CALCULATION',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  WEBGPU = 'WEBGPU',
  USER_INPUT = 'USER_INPUT',
  SIMULATION = 'SIMULATION'
}

export interface SimCoreError {
  type: ErrorType;
  message: string;
  context?: string;
  originalError?: Error;
  timestamp: number;
  userId?: string;
}

class ErrorReporter {
  private errors: SimCoreError[] = [];
  private maxErrors = 100; // Keep last 100 errors

  report(error: SimCoreError) {
    this.errors.push(error);
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔴 SimCore Error: ${error.type}`);
      console.error('Message:', error.message);
      if (error.context) console.log('Context:', error.context);
      if (error.originalError) console.error('Original Error:', error.originalError);
      console.groupEnd();
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error);
    }
  }

  private sendToErrorService(error: SimCoreError) {
    // Example integration with error reporting service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error)
    // }).catch(() => {
    //   // Silently fail if error reporting fails
    // });
  }

  getRecentErrors(type?: ErrorType): SimCoreError[] {
    const recentErrors = this.errors.filter(
      error => Date.now() - error.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );
    
    return type ? recentErrors.filter(error => error.type === type) : recentErrors;
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorReporter = new ErrorReporter();

// Utility functions for common error scenarios
export const handlePhysicsError = (
  error: Error | unknown, 
  context: string,
  fallbackValue?: any
) => {
  const simcoreError: SimCoreError = {
    type: ErrorType.PHYSICS_CALCULATION,
    message: error instanceof Error ? error.message : 'Unknown physics calculation error',
    context,
    originalError: error instanceof Error ? error : undefined,
    timestamp: Date.now()
  };

  errorReporter.report(simcoreError);
  
  return fallbackValue;
};

export const handleNetworkError = (
  error: Error | unknown,
  endpoint: string,
  fallbackValue?: any
) => {
  const simcoreError: SimCoreError = {
    type: ErrorType.NETWORK,
    message: error instanceof Error ? error.message : 'Network request failed',
    context: `Endpoint: ${endpoint}`,
    originalError: error instanceof Error ? error : undefined,
    timestamp: Date.now()
  };

  errorReporter.report(simcoreError);
  
  return fallbackValue;
};

export const handleValidationError = (
  message: string,
  context: string,
  value: any
) => {
  const simcoreError: SimCoreError = {
    type: ErrorType.VALIDATION,
    message,
    context: `${context} - Value: ${JSON.stringify(value)}`,
    timestamp: Date.now()
  };

  errorReporter.report(simcoreError);
};

export const handleWebGPUError = (
  error: Error | unknown,
  operation: string
) => {
  const simcoreError: SimCoreError = {
    type: ErrorType.WEBGPU,
    message: error instanceof Error ? error.message : 'WebGPU operation failed',
    context: `Operation: ${operation}`,
    originalError: error instanceof Error ? error : undefined,
    timestamp: Date.now()
  };

  errorReporter.report(simcoreError);
};

export const handleUserInputError = (
  message: string,
  inputField: string,
  value: any
) => {
  const simcoreError: SimCoreError = {
    type: ErrorType.USER_INPUT,
    message,
    context: `Field: ${inputField}, Value: ${value}`,
    timestamp: Date.now()
  };

  errorReporter.report(simcoreError);
};

// Safe execution wrapper
export const safeExecute = async <T>(
  operation: () => Promise<T> | T,
  errorType: ErrorType,
  context: string,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    const simcoreError: SimCoreError = {
      type: errorType,
      message: error instanceof Error ? error.message : 'Operation failed',
      context,
      originalError: error instanceof Error ? error : undefined,
      timestamp: Date.now()
    };

    errorReporter.report(simcoreError);
    return fallbackValue;
  }
};

// Input sanitization utilities
export const sanitizeSearchInput = (input: string): string => {
  if (typeof input !== 'string') {
    handleValidationError('Search input must be a string', 'sanitizeSearchInput', input);
    return '';
  }
  
  // Remove HTML tags and limit length
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&\"']/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 100); // Limit length
};

export const sanitizeNumericInput = (input: any, min?: number, max?: number): number | null => {
  const num = Number(input);
  
  if (isNaN(num) || !isFinite(num)) {
    handleValidationError('Invalid numeric input', 'sanitizeNumericInput', input);
    return null;
  }
  
  if (min !== undefined && num < min) {
    handleValidationError(`Input below minimum: ${min}`, 'sanitizeNumericInput', input);
    return min;
  }
  
  if (max !== undefined && num > max) {
    handleValidationError(`Input above maximum: ${max}`, 'sanitizeNumericInput', input);
    return max;
  }
  
  return num;
};

// Array validation with bounds checking
export const validateArray = (arr: any[], maxLength = 10000): boolean => {
  if (!Array.isArray(arr)) {
    handleValidationError('Expected array input', 'validateArray', arr);
    return false;
  }
  
  if (arr.length > maxLength) {
    handleValidationError(`Array too large: ${arr.length} > ${maxLength}`, 'validateArray', arr.length);
    return false;
  }
  
  return true;
};

export default errorReporter;
