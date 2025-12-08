/**
 * Formatting Utilities
 * 
 * Provides consistent formatting for dates, currency, numbers, and other data types
 * across all projects.
 */

/**
 * Formats a number as currency with proper locale and symbol.
 * 
 * @example
 * ```tsx
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // "€1,234.56"
 * formatCurrency(1234.56, 'USD', 'en-GB') // "$1,234.56"
 * ```
 * 
 * @param amount - The amount to format
 * @param currency - Currency code (ISO 4217)
 * @param locale - Locale for formatting
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a date according to locale and options.
 * 
 * @example
 * ```tsx
 * formatDate(new Date()) // "Jan 1, 2024"
 * formatDate(new Date(), { dateStyle: 'full' }) // "Monday, January 1, 2024"
 * formatDate(new Date(), { timeStyle: 'short' }) // "12:00 PM"
 * ```
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Formats a date as a relative time string (e.g., "2 hours ago").
 * 
 * @example
 * ```tsx
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 * ```
 * 
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const intervals: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ]

  for (const [unit, secondsInUnit] of intervals) {
    const diff = Math.floor(diffInSeconds / secondsInUnit)
    if (Math.abs(diff) >= 1) {
      return rtf.format(-diff, unit)
    }
  }

  return rtf.format(0, 'second')
}

/**
 * Formats a number with proper thousands separators.
 * 
 * @example
 * ```tsx
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.567, 2) // "1,234.57"
 * ```
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  decimals?: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formats a number as a percentage.
 * 
 * @example
 * ```tsx
 * formatPercent(0.1234) // "12.34%"
 * formatPercent(0.1234, 0) // "12%"
 * ```
 * 
 * @param value - Number to format (0-1 range)
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formats bytes into human-readable file size.
 * 
 * @example
 * ```tsx
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(1048576) // "1 MB"
 * ```
 * 
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Formats a phone number to a standard format.
 * 
 * @example
 * ```tsx
 * formatPhoneNumber('1234567890') // "(123) 456-7890"
 * formatPhoneNumber('+11234567890') // "+1 (123) 456-7890"
 * ```
 * 
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Truncates text to a specified length with ellipsis.
 * 
 * @example
 * ```tsx
 * truncate('Hello World', 8) // "Hello..."
 * truncate('Hello World', 8, '…') // "Hello…"
 * ```
 * 
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncate(
  text: string,
  length: number,
  suffix: string = '...'
): string {
  if (text.length <= length) return text
  return text.slice(0, length - suffix.length) + suffix
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @example
 * ```tsx
 * capitalize('hello world') // "Hello world"
 * ```
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Converts a string to title case.
 * 
 * @example
 * ```tsx
 * titleCase('hello world') // "Hello World"
 * ```
 * 
 * @param text - Text to convert
 * @returns Title cased text
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}
