/**
 * Performance Optimization Utilities
 *
 * Provides debounce and throttle functions for optimizing event handlers
 * and expensive operations.
 */

/**
 * Debounces a function, delaying its execution until after a specified wait time
 * has elapsed since the last time it was invoked.
 *
 * @example
 * ```tsx
 * const handleSearch = debounce((query: string) => {
 *   fetchResults(query)
 * }, 300)
 *
 * <input onChange={(e) => handleSearch(e.target.value)} />
 * ```
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function, ensuring it's only called at most once per specified time period.
 *
 * @example
 * ```tsx
 * const handleScroll = throttle(() => {
 *   updateScrollPosition()
 * }, 100)
 *
 * window.addEventListener('scroll', handleScroll)
 * ```
 *
 * @param func - The function to throttle
 * @param limit - The minimum time between function calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Creates a memoized version of a function that caches results based on arguments.
 *
 * @example
 * ```tsx
 * const expensiveCalculation = memoize((n: number) => {
 *   return n * n
 * })
 * ```
 *
 * @param func - The function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Delays execution of a function by specified milliseconds.
 *
 * @example
 * ```tsx
 * await sleep(1000) // Wait 1 second
 * console.log('Executed after 1 second')
 * ```
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a function multiple times with exponential backoff.
 *
 * @example
 * ```tsx
 * const data = await retry(
 *   () => fetchData(),
 *   { maxAttempts: 3, delay: 1000 }
 * )
 * ```
 *
 * @param func - The async function to retry
 * @param options - Retry configuration
 * @returns Promise with the function result
 */
export async function retry<T>(
  func: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
  } = {},
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1);
        await sleep(waitTime);
      }
    }
  }

  throw lastError!;
}

/**
 * Configuration for exponential backoff with jitter
 */
export interface BackoffOptions {
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  multiplier?: number;
  /** Maximum jitter as a fraction of delay (default: 0.1) */
  jitterFactor?: number;
  /** Maximum number of attempts (default: 5) */
  maxAttempts?: number;
  /** Function to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
  /** Callback for each retry attempt */
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

/**
 * Calculate delay with exponential backoff and jitter.
 * Uses "decorrelated jitter" algorithm for optimal retry distribution.
 *
 * @example
 * ```typescript
 * const delay = calculateBackoffDelay(3, { initialDelay: 1000, maxDelay: 30000 });
 * console.log(`Waiting ${delay}ms before retry`);
 * ```
 */
export function calculateBackoffDelay(
  attempt: number,
  options: Pick<BackoffOptions, 'initialDelay' | 'maxDelay' | 'multiplier' | 'jitterFactor'> = {},
): number {
  const { initialDelay = 1000, maxDelay = 30000, multiplier = 2, jitterFactor = 0.1 } = options;

  // Calculate base delay with exponential backoff
  const baseDelay = initialDelay * Math.pow(multiplier, attempt - 1);

  // Apply jitter: random value between -jitter and +jitter
  const jitter = baseDelay * jitterFactor * (Math.random() * 2 - 1);

  // Clamp to maxDelay
  return Math.min(maxDelay, Math.max(0, baseDelay + jitter));
}

/**
 * Retry a function with exponential backoff and jitter.
 * More robust than simple retry for production use.
 *
 * @example
 * ```typescript
 * const data = await retryWithBackoff(
 *   () => fetch('/api/data').then(r => r.json()),
 *   {
 *     maxAttempts: 5,
 *     initialDelay: 1000,
 *     maxDelay: 30000,
 *     isRetryable: (error) => error.message.includes('network'),
 *     onRetry: (attempt, delay) => console.log(`Retry ${attempt} in ${delay}ms`),
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(func: () => Promise<T>, options: BackoffOptions = {}): Promise<T> {
  const { maxAttempts = 5, isRetryable = () => true, onRetry, ...backoffOptions } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      if (attempt >= maxAttempts || !isRetryable(lastError)) {
        throw lastError;
      }

      // Calculate delay with jitter
      const delay = calculateBackoffDelay(attempt, backoffOptions);

      // Notify about retry
      onRetry?.(attempt, delay, lastError);

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Check if an HTTP error is retryable based on status code.
 * Retries on: 408, 429, 500, 502, 503, 504
 */
export function isRetryableHttpError(error: Error & { status?: number }): boolean {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return error.status !== undefined && retryableStatuses.includes(error.status);
}
