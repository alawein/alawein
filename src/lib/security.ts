interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  corsOrigins: string[];
  rateLimiting: {
    windowMs: number;
    max: number;
  };
}

class SecurityService {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  generateCSPHeader(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.repzfitness.com https://www.google-analytics.com",
      "media-src 'self' https://cdn.repzfitness.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];

    return directives.join('; ');
  }

  sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  validateFileUpload(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large' };
    }

    return { valid: true };
  }

  encryptSensitiveData(data: string): string {
    // In production, use proper encryption
    if (typeof window !== 'undefined') {
      return btoa(data); // Basic encoding for demo
    }
    return data;
  }

  decryptSensitiveData(encryptedData: string): string {
    // In production, use proper decryption
    if (typeof window !== 'undefined') {
      try {
        return atob(encryptedData);
      } catch {
        return '';
      }
    }
    return encryptedData;
  }

  generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  validateJWT(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;

      return payload.exp > now;
    } catch {
      return false;
    }
  }
}

export const security = new SecurityService({
  enableCSP: process.env.NODE_ENV === 'production',
  enableHSTS: process.env.NODE_ENV === 'production',
  corsOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
});
