/**
 * @alawein/utils
 *
 * Shared utility functions for the Alawein monorepo.
 * Provides common utilities for class names, performance optimization,
 * formatting, and validation.
 *
 * @packageDocumentation
 */

// Class name utilities
export { cn, type ClassValue } from './cn'

// Performance utilities
export {
  debounce,
  throttle,
  memoize,
  sleep,
  retry,
} from './performance'

// Formatting utilities
export {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatBytes,
  formatPhoneNumber,
  truncate,
  capitalize,
  titleCase,
} from './format'

// Validation utilities
export {
  validateEmail,
  validatePhone,
  validateUrl,
  validatePassword,
  validateCreditCard,
  validateZipCode,
  validateSSN,
  validateDateRange,
  validateNumberRange,
  validateLength,
  validateRequired,
  validatePattern,
  validateUsername,
  validateHexColor,
  validateIPv4,
} from './validation'

// React hooks (requires React as peer dependency)
export {
  useUserPreferences,
  type UserPreferences,
  type UseUserPreferencesOptions,
  type UseUserPreferencesReturn,
} from './hooks'

// Error handling utilities
export {
  AppError,
  ErrorType,
  validationError,
  networkError,
  authError,
  notFoundError,
  isAppError,
  getErrorMessage,
  withErrorHandling,
  tryCatch,
  tryCatchSync,
  type ErrorContext,
} from './error'
