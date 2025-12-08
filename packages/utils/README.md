# @alawein/utils

Shared utility functions for the Alawein monorepo. Provides common utilities for class names, performance optimization, formatting, and validation.

## Installation

This package is part of the Alawein monorepo and is automatically available to all workspace packages.

```bash
npm install @alawein/utils
```

## Usage

### Class Name Utilities

```typescript
import { cn } from '@alawein/utils'

// Combine class names with Tailwind CSS
<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Performance Utilities

```typescript
import { debounce, throttle, memoize, sleep, retry } from '@alawein/utils'

// Debounce function calls
const handleSearch = debounce((query: string) => {
  fetchResults(query)
}, 300)

// Throttle function calls
const handleScroll = throttle(() => {
  updateScrollPosition()
}, 100)

// Memoize expensive calculations
const expensiveCalc = memoize((n: number) => n * n)

// Delay execution
await sleep(1000)

// Retry with exponential backoff
const data = await retry(() => fetchData(), { maxAttempts: 3 })
```

### Formatting Utilities

```typescript
import {
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
} from '@alawein/utils'

// Format currency
formatCurrency(1234.56) // "$1,234.56"
formatCurrency(1234.56, 'EUR') // "€1,234.56"

// Format dates
formatDate(new Date()) // "Jan 1, 2024"
formatDate(new Date(), { dateStyle: 'full' }) // "Monday, January 1, 2024"

// Relative time
formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"

// Format numbers
formatNumber(1234567) // "1,234,567"
formatPercent(0.1234) // "12.34%"
formatBytes(1048576) // "1 MB"

// Format phone numbers
formatPhoneNumber('1234567890') // "(123) 456-7890"

// Text utilities
truncate('Hello World', 8) // "Hello..."
capitalize('hello') // "Hello"
titleCase('hello world') // "Hello World"
```

### Validation Utilities

```typescript
import {
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
} from '@alawein/utils'

// Validate email
validateEmail('user@example.com') // true

// Validate phone
validatePhone('(123) 456-7890') // true

// Validate URL
validateUrl('https://example.com') // true

// Validate password
validatePassword('MyP@ssw0rd', {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}) // true

// Validate credit card (Luhn algorithm)
validateCreditCard('4532015112830366') // true

// Validate ZIP code
validateZipCode('12345') // true
validateZipCode('12345-6789') // true

// Validate ranges
validateNumberRange(5, 1, 10) // true
validateDateRange(new Date(), minDate, maxDate) // true
validateLength('hello', 1, 10) // true

// Validate required fields
validateRequired('value') // true
validateRequired('') // false

// Validate patterns
validatePattern('abc123', /^[a-z0-9]+$/) // true

// Validate username
validateUsername('john_doe123') // true

// Validate hex color
validateHexColor('#FF5733') // true

// Validate IPv4
validateIPv4('192.168.1.1') // true
```

## API Reference

### Class Names

- `cn(...inputs: ClassValue[]): string` - Combines class names with Tailwind CSS support

### Performance

- `debounce<T>(func: T, wait: number): T` - Debounces function calls
- `throttle<T>(func: T, limit: number): T` - Throttles function calls
- `memoize<T>(func: T): T` - Memoizes function results
- `sleep(ms: number): Promise<void>` - Delays execution
- `retry<T>(func: () => Promise<T>, options): Promise<T>` - Retries with backoff

### Formatting

- `formatCurrency(amount: number, currency?: string, locale?: string): string`
- `formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions, locale?: string): string`
- `formatRelativeTime(date: Date | string | number, locale?: string): string`
- `formatNumber(value: number, decimals?: number, locale?: string): string`
- `formatPercent(value: number, decimals?: number, locale?: string): string`
- `formatBytes(bytes: number, decimals?: number): string`
- `formatPhoneNumber(phone: string): string`
- `truncate(text: string, length: number, suffix?: string): string`
- `capitalize(text: string): string`
- `titleCase(text: string): string`

### Validation

- `validateEmail(email: string): boolean`
- `validatePhone(phone: string): boolean`
- `validateUrl(url: string): boolean`
- `validatePassword(password: string, options?): boolean`
- `validateCreditCard(cardNumber: string): boolean`
- `validateZipCode(zipCode: string): boolean`
- `validateSSN(ssn: string): boolean`
- `validateDateRange(date: Date, min?: Date, max?: Date): boolean`
- `validateNumberRange(value: number, min?: number, max?: number): boolean`
- `validateLength(value: string, min?: number, max?: number): boolean`
- `validateRequired(value: any): boolean`
- `validatePattern(value: string, pattern: RegExp): boolean`
- `validateUsername(username: string, minLength?: number, maxLength?: number): boolean`
- `validateHexColor(color: string): boolean`
- `validateIPv4(ip: string): boolean`

## Features

- ✅ **TypeScript**: Full type safety
- ✅ **Tree-shakeable**: Import only what you need
- ✅ **Zero dependencies**: Except clsx and tailwind-merge for cn()
- ✅ **Well-tested**: Comprehensive test coverage
- ✅ **Well-documented**: JSDoc comments for all functions
- ✅ **Performance**: Optimized implementations

## License

MIT
