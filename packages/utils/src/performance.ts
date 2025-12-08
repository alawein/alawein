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
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
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
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
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
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
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
  return new Promise(resolve => setTimeout(resolve, ms))
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
    maxAttempts?: number
    delay?: number
    backoff?: number
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await func()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxAttempts) {
        const waitTime = delay * Math.pow(backoff, attempt - 1)
        await sleep(waitTime)
      }
    }
  }

  throw lastError!
}
