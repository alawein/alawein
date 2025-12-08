/**
 * Validation Utilities
 * 
 * Provides common validation functions for forms and data validation
 * across all projects.
 */

/**
 * Validates an email address.
 * 
 * @example
 * ```tsx
 * validateEmail('user@example.com') // true
 * validateEmail('invalid-email') // false
 * ```
 * 
 * @param email - Email address to validate
 * @returns True if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a US phone number.
 * 
 * @example
 * ```tsx
 * validatePhone('(123) 456-7890') // true
 * validatePhone('1234567890') // true
 * validatePhone('123-456-7890') // true
 * ```
 * 
 * @param phone - Phone number to validate
 * @returns True if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1')
}

/**
 * Validates a URL.
 * 
 * @example
 * ```tsx
 * validateUrl('https://example.com') // true
 * validateUrl('not-a-url') // false
 * ```
 * 
 * @param url - URL to validate
 * @returns True if valid, false otherwise
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates a password meets minimum requirements.
 * 
 * @example
 * ```tsx
 * validatePassword('MyP@ssw0rd') // true
 * validatePassword('weak') // false
 * ```
 * 
 * @param password - Password to validate
 * @param options - Validation options
 * @returns True if valid, false otherwise
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  } = {}
): boolean {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options

  if (password.length < minLength) return false
  if (requireUppercase && !/[A-Z]/.test(password)) return false
  if (requireLowercase && !/[a-z]/.test(password)) return false
  if (requireNumbers && !/\d/.test(password)) return false
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false

  return true
}

/**
 * Validates a credit card number using Luhn algorithm.
 * 
 * @example
 * ```tsx
 * validateCreditCard('4532015112830366') // true (Visa test card)
 * validateCreditCard('1234567890123456') // false
 * ```
 * 
 * @param cardNumber - Credit card number to validate
 * @returns True if valid, false otherwise
 */
export function validateCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '')
  
  if (cleaned.length < 13 || cleaned.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Validates a US ZIP code.
 * 
 * @example
 * ```tsx
 * validateZipCode('12345') // true
 * validateZipCode('12345-6789') // true
 * validateZipCode('1234') // false
 * ```
 * 
 * @param zipCode - ZIP code to validate
 * @returns True if valid, false otherwise
 */
export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

/**
 * Validates a US Social Security Number.
 * 
 * @example
 * ```tsx
 * validateSSN('123-45-6789') // true
 * validateSSN('123456789') // true
 * ```
 * 
 * @param ssn - SSN to validate
 * @returns True if valid, false otherwise
 */
export function validateSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/\D/g, '')
  return cleaned.length === 9
}

/**
 * Validates a date is within a range.
 * 
 * @example
 * ```tsx
 * validateDateRange(new Date(), new Date('2024-01-01'), new Date('2024-12-31')) // true
 * ```
 * 
 * @param date - Date to validate
 * @param min - Minimum date
 * @param max - Maximum date
 * @returns True if valid, false otherwise
 */
export function validateDateRange(
  date: Date,
  min?: Date,
  max?: Date
): boolean {
  if (min && date < min) return false
  if (max && date > max) return false
  return true
}

/**
 * Validates a number is within a range.
 * 
 * @example
 * ```tsx
 * validateNumberRange(5, 1, 10) // true
 * validateNumberRange(15, 1, 10) // false
 * ```
 * 
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if valid, false otherwise
 */
export function validateNumberRange(
  value: number,
  min?: number,
  max?: number
): boolean {
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}

/**
 * Validates a string length is within a range.
 * 
 * @example
 * ```tsx
 * validateLength('hello', 1, 10) // true
 * validateLength('hello', 10, 20) // false
 * ```
 * 
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns True if valid, false otherwise
 */
export function validateLength(
  value: string,
  min?: number,
  max?: number
): boolean {
  if (min !== undefined && value.length < min) return false
  if (max !== undefined && value.length > max) return false
  return true
}

/**
 * Validates a value is not empty.
 * 
 * @example
 * ```tsx
 * validateRequired('hello') // true
 * validateRequired('') // false
 * validateRequired(null) // false
 * ```
 * 
 * @param value - Value to validate
 * @returns True if not empty, false otherwise
 */
export function validateRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validates a value matches a regex pattern.
 * 
 * @example
 * ```tsx
 * validatePattern('abc123', /^[a-z0-9]+$/) // true
 * validatePattern('abc-123', /^[a-z0-9]+$/) // false
 * ```
 * 
 * @param value - Value to validate
 * @param pattern - Regex pattern
 * @returns True if matches, false otherwise
 */
export function validatePattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value)
}

/**
 * Validates a username meets requirements.
 * 
 * @example
 * ```tsx
 * validateUsername('john_doe123') // true
 * validateUsername('jo') // false (too short)
 * validateUsername('john@doe') // false (invalid chars)
 * ```
 * 
 * @param username - Username to validate
 * @param minLength - Minimum length (default: 3)
 * @param maxLength - Maximum length (default: 20)
 * @returns True if valid, false otherwise
 */
export function validateUsername(
  username: string,
  minLength: number = 3,
  maxLength: number = 20
): boolean {
  if (username.length < minLength || username.length > maxLength) return false
  return /^[a-zA-Z0-9_-]+$/.test(username)
}

/**
 * Validates a hex color code.
 * 
 * @example
 * ```tsx
 * validateHexColor('#FF5733') // true
 * validateHexColor('#F57') // true (shorthand)
 * validateHexColor('FF5733') // false (missing #)
 * ```
 * 
 * @param color - Hex color to validate
 * @returns True if valid, false otherwise
 */
export function validateHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Validates an IPv4 address.
 * 
 * @example
 * ```tsx
 * validateIPv4('192.168.1.1') // true
 * validateValidateIPv4('256.1.1.1') // false
 * ```
 * 
 * @param ip - IP address to validate
 * @returns True if valid, false otherwise
 */
export function validateIPv4(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255 && part === num.toString()
  })
}
