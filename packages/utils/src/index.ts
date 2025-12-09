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
export { cn, type ClassValue } from './cn';

// Performance utilities
export {
  debounce,
  throttle,
  memoize,
  sleep,
  retry,
  retryWithBackoff,
  calculateBackoffDelay,
  isRetryableHttpError,
  type BackoffOptions,
} from './performance';

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
} from './format';

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
} from './validation';

// React hooks (requires React as peer dependency)
export {
  useUserPreferences,
  usePlatformStatus,
  useSSE,
  type UserPreferences,
  type UseUserPreferencesOptions,
  type UseUserPreferencesReturn,
  type PlatformStatus,
  type UsePlatformStatusOptions,
  type UsePlatformStatusReturn,
  type UseSSEOptions,
  type UseSSEReturn,
} from './hooks';

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
} from './error';

// Cross-platform notification system
export {
  useNotifications,
  createNotificationStore,
  getNotificationStore,
  DEFAULT_CONFIG as NOTIFICATION_DEFAULT_CONFIG,
  type Notification,
  type NotificationType,
  type NotificationPriority,
  type NotificationAction,
  type NotificationOptions,
  type NotificationState,
  type NotificationStore,
  type NotificationConfig,
  type UseNotificationsOptions,
  type UseNotificationsReturn,
} from './notifications';
