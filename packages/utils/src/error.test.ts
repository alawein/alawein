import { describe, it, expect } from 'vitest';
import {
  AppError,
  ErrorType,
  validationError,
  networkError,
  authError,
  notFoundError,
  isAppError,
  getErrorMessage,
  tryCatch,
  tryCatchSync,
} from './error';

describe('AppError', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.type).toBe(ErrorType.UNKNOWN);
    expect(error.context.timestamp).toBeDefined();
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('AppError');
  });

  it('should create an AppError with specific type', () => {
    const error = new AppError('Validation failed', ErrorType.VALIDATION);
    expect(error.type).toBe(ErrorType.VALIDATION);
  });

  it('should include context information', () => {
    const error = new AppError('Test', ErrorType.INTERNAL, {
      component: 'TestComponent',
      action: 'testAction',
    });
    expect(error.context.component).toBe('TestComponent');
    expect(error.context.action).toBe('testAction');
  });

  it('should store original error', () => {
    const original = new Error('Original error');
    const error = new AppError('Wrapped', ErrorType.UNKNOWN, {}, original);
    expect(error.originalError).toBe(original);
  });

  it('should serialize to JSON correctly', () => {
    const error = new AppError('Test', ErrorType.VALIDATION);
    const json = error.toJSON();
    expect(json.name).toBe('AppError');
    expect(json.message).toBe('Test');
    expect(json.type).toBe(ErrorType.VALIDATION);
  });
});

describe('Error factory functions', () => {
  it('validationError creates VALIDATION type', () => {
    const error = validationError('Invalid input');
    expect(error.type).toBe(ErrorType.VALIDATION);
    expect(error.message).toBe('Invalid input');
  });

  it('networkError creates NETWORK type with original error', () => {
    const original = new Error('fetch failed');
    const error = networkError('Network request failed', {}, original);
    expect(error.type).toBe(ErrorType.NETWORK);
    expect(error.originalError).toBe(original);
  });

  it('authError creates AUTHENTICATION type', () => {
    const error = authError('Invalid credentials');
    expect(error.type).toBe(ErrorType.AUTHENTICATION);
  });

  it('notFoundError creates NOT_FOUND type with resource name', () => {
    const error = notFoundError('User');
    expect(error.type).toBe(ErrorType.NOT_FOUND);
    expect(error.message).toBe('User not found');
  });
});

describe('isAppError', () => {
  it('returns true for AppError instances', () => {
    const error = new AppError('Test');
    expect(isAppError(error)).toBe(true);
  });

  it('returns false for regular Error instances', () => {
    const error = new Error('Test');
    expect(isAppError(error)).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isAppError('string')).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError({})).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('extracts message from Error', () => {
    expect(getErrorMessage(new Error('Test message'))).toBe('Test message');
  });

  it('returns string as-is', () => {
    expect(getErrorMessage('String error')).toBe('String error');
  });

  it('returns default message for unknown types', () => {
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
    expect(getErrorMessage(123)).toBe('An unknown error occurred');
  });
});

describe('tryCatch', () => {
  it('returns success tuple on success', async () => {
    const [result, error] = await tryCatch(async () => 'success');
    expect(result).toBe('success');
    expect(error).toBeNull();
  });

  it('returns error tuple on failure', async () => {
    const [result, error] = await tryCatch(async () => {
      throw new Error('Failed');
    });
    expect(result).toBeNull();
    expect(error).not.toBeNull();
    expect(error?.message).toBe('Failed');
    expect(isAppError(error)).toBe(true);
  });

  it('preserves AppError instances', async () => {
    const original = validationError('Invalid');
    const [, error] = await tryCatch(async () => {
      throw original;
    });
    expect(error).toBe(original);
  });
});

describe('tryCatchSync', () => {
  it('returns success tuple on success', () => {
    const [result, error] = tryCatchSync(() => 'success');
    expect(result).toBe('success');
    expect(error).toBeNull();
  });

  it('returns error tuple on failure', () => {
    const [result, error] = tryCatchSync(() => {
      throw new Error('Failed');
    });
    expect(result).toBeNull();
    expect(error).not.toBeNull();
    expect(isAppError(error)).toBe(true);
  });
});

