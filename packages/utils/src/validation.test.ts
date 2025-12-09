import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateUrl,
  validatePassword,
  validateRequired,
  validateLength,
  validateNumberRange,
  validatePattern,
} from './validation';

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.org')).toBe(true);
    expect(validateEmail('user+tag@example.co.uk')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
    expect(validateEmail('spaces @email.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts valid US phone numbers', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
    expect(validatePhone('(123) 456-7890')).toBe(true);
    expect(validatePhone('11234567890')).toBe(true); // With country code
  });

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('123456')).toBe(false);
    expect(validatePhone('12345678901234')).toBe(false);
  });
});

describe('validateUrl', () => {
  it('accepts valid URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://localhost:3000')).toBe(true);
    expect(validateUrl('ftp://files.example.com/path')).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('example.com')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts valid passwords with defaults', () => {
    expect(validatePassword('Password1!')).toBe(true);
    expect(validatePassword('MyP@ssw0rd')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(validatePassword('weak')).toBe(false);
    expect(validatePassword('nocaps123!')).toBe(false);
    expect(validatePassword('NOLOWER123!')).toBe(false);
    expect(validatePassword('NoNumbers!!')).toBe(false);
  });

  it('respects custom options', () => {
    expect(validatePassword('short', { minLength: 3, requireUppercase: false, requireLowercase: true, requireNumbers: false, requireSpecialChars: false })).toBe(true);
  });
});

describe('validateRequired', () => {
  it('validates non-empty values', () => {
    expect(validateRequired('value')).toBe(true);
    expect(validateRequired('  value  ')).toBe(true);
  });

  it('rejects empty values', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
    expect(validateRequired(null as unknown as string)).toBe(false);
    expect(validateRequired(undefined as unknown as string)).toBe(false);
  });
});

describe('validateLength', () => {
  it('validates length within bounds', () => {
    expect(validateLength('test', 1, 10)).toBe(true);
    expect(validateLength('abc', 3, 3)).toBe(true);
  });

  it('rejects values outside bounds', () => {
    expect(validateLength('', 1, 10)).toBe(false);
    expect(validateLength('too long for limit', 1, 5)).toBe(false);
  });
});

describe('validateNumberRange', () => {
  it('validates numbers within range', () => {
    expect(validateNumberRange(5, 1, 10)).toBe(true);
    expect(validateNumberRange(1, 1, 10)).toBe(true);
    expect(validateNumberRange(10, 1, 10)).toBe(true);
  });

  it('rejects numbers outside range', () => {
    expect(validateNumberRange(0, 1, 10)).toBe(false);
    expect(validateNumberRange(11, 1, 10)).toBe(false);
  });
});

describe('validatePattern', () => {
  it('validates matching patterns', () => {
    expect(validatePattern('abc123', /^[a-z0-9]+$/)).toBe(true);
    expect(validatePattern('ABC', /^[A-Z]+$/)).toBe(true);
  });

  it('rejects non-matching patterns', () => {
    expect(validatePattern('abc!@#', /^[a-z0-9]+$/)).toBe(false);
    expect(validatePattern('123', /^[A-Z]+$/)).toBe(false);
  });
});

