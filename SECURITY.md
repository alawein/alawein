# Security Implementation

This repository provides a comprehensive security system for web applications with unified configuration, utilities, and templates.

## 🛡️ Security Components

### 1. Security Configuration (`src/config/security.config.ts`)

Unified security configuration with environment-based settings:

```typescript
import { securityConfig, getSecurityHeaders, securityService } from '@/config/security.config';
```

**Features:**
- Environment-based security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting configuration
- CORS origin management
- Authentication token settings
- Encryption and logging configuration

**Usage:**
```typescript
// Get security headers for HTTP responses
const headers = getSecurityHeaders();

// Access security configuration
const config = securityConfig;
console.log(config.auth.tokenExpiry); // 15 minutes

// Use configured security service
const sanitized = securityService.sanitizeInput('<script>alert("xss")</script>');
```

### 2. Security Service (`src/lib/security.ts`)

Core security utilities for application-level protection:

```typescript
import { security } from '@/lib/security';
```

**Features:**
- **Input Sanitization**: XSS prevention for user inputs
- **File Upload Validation**: Type and size limits for file uploads
- **JWT Token Validation**: Expiration checking for authentication tokens
- **CSP Header Generation**: Content Security Policy for browser protection

**Usage:**
```typescript
// Sanitize user input
const cleanInput = security.sanitizeInput(userInput);

// Validate file uploads
const validation = security.validateFileUpload(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Validate JWT tokens
const isValid = security.validateToken(token);

// Generate CSP headers
const cspHeader = security.generateCSPHeader();
```

### 3. Next.js Middleware Template (`templates/nextjs/middleware.ts`)

Production-ready Next.js middleware for automatic security header application:

**Features:**
- Edge runtime compatible
- Environment-aware security headers
- HTTPS detection for HSTS
- Comprehensive CSP directives
- Development debug logging

**Usage:**
Copy `templates/nextjs/middleware.ts` to the root of your Next.js application to automatically apply security headers to all HTTP responses.

## 🔧 Configuration

### Environment Variables

```bash
# Production environment
NODE_ENV=production

# Allowed CORS origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# API endpoint configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Security Headers Applied

- **Content Security Policy**: Prevents XSS and code injection
- **HTTP Strict Transport Security**: Enforces HTTPS in production
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-XSS-Protection**: Legacy XSS protection
- **Referrer Policy**: Controls referrer information leakage
- **Permissions Policy**: Restricts browser feature access

## 🧪 Testing

Run the security test suite:

```bash
npm test
```

The tests cover:
- Security header generation in different environments
- Input sanitization effectiveness
- File upload validation
- JWT token validation
- Configuration validation

## 📋 Integration Guide

### For React Applications

```typescript
// Import security configuration
import { getSecurityHeaders } from '@/config/security.config';

// Apply to fetch requests
const response = await fetch(url, {
  headers: {
    ...getSecurityHeaders(),
    'Content-Type': 'application/json',
  },
});
```

### For Node.js/Express Applications

```typescript
import { getSecurityHeaders } from '@/config/security.config';

// Apply to all responses
app.use((req, res, next) => {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});
```

### For Next.js Applications

1. Copy `templates/nextjs/middleware.ts` to your project root
2. The middleware automatically applies security headers to all responses
3. Configure environment variables for your specific needs

## 🔒 Security Best Practices

### Input Validation
Always sanitize user inputs before processing or displaying:

```typescript
import { securityService } from '@/config/security.config';

const cleanInput = securityService.sanitizeInput(userInput);
```

### File Upload Security
Validate all file uploads before processing:

```typescript
const validation = securityService.validateFileUpload(uploadedFile);
if (!validation.valid) {
  throw new Error(`Invalid file: ${validation.error}`);
}
```

### Authentication Security
Use the configured token settings for secure authentication:

```typescript
// Access token expiration (15 minutes)
const accessTokenExpiry = securityConfig.auth.tokenExpiry;

// Refresh token expiration (7 days)
const refreshTokenExpiry = securityConfig.auth.refreshTokenExpiry;
```

## 🚨 Important Notes

- **This is a tools monorepo**: The security utilities are libraries, not a running application
- **Middleware is a template**: Use `templates/nextjs/middleware.ts` as a starting point for actual Next.js applications
- **Environment-based**: Security headers are only applied in production environment
- **HTTPS required**: HSTS headers are only applied when serving over HTTPS

## 📞 Support

For security issues or questions:
1. Check the test suite for usage examples
2. Review the implementation in `src/config/security.config.ts`
3. Use the middleware template as a reference for integration

---

**Security Version**: 1.0.0  
**Last Updated**: December 7, 2025  
**Compatible**: Node.js 18+, Next.js 13+, React 18+
