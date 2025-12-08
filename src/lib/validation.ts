// Input validation and sanitization utilities
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

// Email validation using RFC 5322 compliant regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password strength validation
const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numbers: /[0-9]/,
  specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

// XSS prevention patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
];

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, sanitized: trimmed.toLowerCase() };
}

/**
 * Validates password strength
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < requirements.minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${requirements.minLength} characters long`
    };
  }

  if (requirements.requireUppercase && !PASSWORD_PATTERNS.uppercase.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requirements.requireLowercase && !PASSWORD_PATTERNS.lowercase.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requirements.requireNumbers && !PASSWORD_PATTERNS.numbers.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (requirements.requireSpecialChars && !PASSWORD_PATTERNS.specialChars.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
}

/**
 * Sanitizes input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Remove dangerous patterns
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // HTML entity encoding
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitizeInput(
  input: string,
  options: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    allowHtml?: boolean;
  } = {}
): ValidationResult {
  const { required = false, maxLength, minLength, allowHtml = false } = options;

  if (!input && required) {
    return { isValid: false, error: 'This field is required' };
  }

  if (!input) {
    return { isValid: true, sanitized: '' };
  }

  if (typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }

  let sanitized = allowHtml ? input.trim() : sanitizeInput(input);

  if (maxLength && sanitized.length > maxLength) {
    return { isValid: false, error: `Input must be no more than ${maxLength} characters` };
  }

  if (minLength && sanitized.length < minLength) {
    return { isValid: false, error: `Input must be at least ${minLength} characters` };
  }

  return { isValid: true, sanitized };
}${update}
