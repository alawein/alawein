// Security utilities and validation for QMLab
// Input sanitization, CSP violations, and security monitoring

import { trackQuantumEvents } from './analytics';

// Content Security Policy violation reporting
interface CSPViolation {
  'document-uri': string;
  referrer: string;
  'violated-directive': string;
  'effective-directive': string;
  'original-policy': string;
  disposition: string;
  'blocked-uri': string;
  'line-number': number;
  'column-number': number;
  'source-file': string;
  'status-code': number;
  'script-sample': string;
}

// Security monitoring and incident response
export class SecurityMonitor {
  private violationCount = 0;
  private suspiciousActivity = new Map<string, number>();
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    this.setupCSPReporting();
    this.setupSecurityEventListeners();
  }

  // Setup CSP violation reporting
  private setupCSPReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation({
        'document-uri': document.location.href,
        referrer: document.referrer,
        'violated-directive': event.violatedDirective,
        'effective-directive': event.effectiveDirective,
        'original-policy': event.originalPolicy,
        disposition: event.disposition,
        'blocked-uri': event.blockedURI,
        'line-number': event.lineNumber,
        'column-number': event.columnNumber,
        'source-file': event.sourceFile,
        'status-code': event.statusCode,
        'script-sample': event.sample
      });
    });
  }

  // Setup additional security event listeners
  private setupSecurityEventListeners(): void {
    // Monitor for suspicious console access
    const originalConsole = { ...console };
    Object.keys(console).forEach(method => {
      (console as any)[method] = (...args: any[]) => {
        this.trackConsoleAccess(method, args);
        return (originalConsole as any)[method](...args);
      };
    });

    // Monitor for suspicious DOM manipulation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.validateAddedElement(node as Element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'onclick', 'onload']
    });

    // Monitor for eval() usage
    const originalEval = window.eval;
    window.eval = (code: string) => {
      this.trackEvalUsage(code);
      return originalEval(code);
    };
  }

  // Handle CSP violations
  private handleCSPViolation(violation: CSPViolation): void {
    this.violationCount++;

    // Log violation details
    console.warn('CSP Violation detected:', violation);

    // Track in analytics
    trackQuantumEvents.errorBoundary(
      `CSP Violation: ${violation['violated-directive']}`,
      JSON.stringify(violation),
      'security-csp'
    );

    // Send to security endpoint
    this.reportSecurityIncident('csp_violation', {
      violation,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      count: this.violationCount
    });

    // Take action if too many violations
    if (this.violationCount > 10) {
      this.handleSecurityAlert('Multiple CSP violations detected');
    }
  }

  // Track console access for security monitoring
  private trackConsoleAccess(method: string, args: any[]): void {
    const suspiciousPatterns = [
      /document\.cookie/i,
      /localStorage/i,
      /sessionStorage/i,
      /eval\(/i,
      /innerHTML/i,
      /outerHTML/i
    ];

    const content = args.join(' ');
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(content));

    if (isSuspicious) {
      this.trackSuspiciousActivity('console_access', {
        method,
        content: content.substring(0, 200), // Limit length
        stack: new Error().stack
      });
    }
  }

  // Validate dynamically added elements
  private validateAddedElement(element: Element): void {
    const tagName = element.tagName.toLowerCase();
    
    // Check for suspicious elements
    if (['script', 'iframe', 'object', 'embed'].includes(tagName)) {
      const src = element.getAttribute('src');
      const href = element.getAttribute('href');
      
      if (src && !this.isAllowedSource(src)) {
        this.trackSuspiciousActivity('suspicious_element', {
          tag: tagName,
          src,
          innerHTML: element.innerHTML.substring(0, 100)
        });
        
        // Remove suspicious element
        element.remove();
      }
    }

    // Check for inline event handlers
    const attributes = element.getAttributeNames();
    const eventHandlers = attributes.filter(attr => attr.startsWith('on'));
    
    if (eventHandlers.length > 0) {
      this.trackSuspiciousActivity('inline_event_handler', {
        tag: tagName,
        handlers: eventHandlers,
        className: element.className
      });
    }
  }

  // Track eval() usage
  private trackEvalUsage(code: string): void {
    this.trackSuspiciousActivity('eval_usage', {
      code: code.substring(0, 200),
      stack: new Error().stack
    });
  }

  // Check if source is allowed
  private isAllowedSource(src: string): boolean {
    const allowedDomains = [
      'qmlab.online',
      'www.googletagmanager.com',
      'www.google-analytics.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    try {
      const url = new URL(src, window.location.origin);
      return allowedDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  // Track suspicious activity
  private trackSuspiciousActivity(type: string, details: Record<string, any>): void {
    const key = `${type}:${JSON.stringify(details).substring(0, 50)}`;
    const count = (this.suspiciousActivity.get(key) || 0) + 1;
    this.suspiciousActivity.set(key, count);

    // Report if activity is repeated
    if (count > 3) {
      this.reportSecurityIncident('suspicious_activity', {
        type,
        details,
        count,
        timestamp: Date.now()
      });
    }
  }

  // Report security incident
  private async reportSecurityIncident(type: string, data: Record<string, any>): Promise<void> {
    try {
      await fetch('/api/security/incident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          metadata: {
            user_agent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
            session_id: this.getSessionId()
          }
        })
      });
    } catch (error) {
      console.error('Failed to report security incident:', error);
    }
  }

  // Handle security alerts
  private handleSecurityAlert(message: string): void {
    console.error(`Security Alert: ${message}`);
    
    // Could implement additional actions like:
    // - Disable certain features
    // - Redirect to safe page
    // - Clear sensitive data
    // - Logout user
  }

  // Rate limiting
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (limit.count >= maxRequests) {
      this.trackSuspiciousActivity('rate_limit_exceeded', {
        key,
        count: limit.count,
        maxRequests
      });
      return false;
    }

    limit.count++;
    return true;
  }

  // Get session ID for tracking
  private getSessionId(): string {
    return sessionStorage.getItem('qmlab-session-id') || 'anonymous';
  }
}

// Input validation and sanitization
export class InputValidator {
  // Sanitize HTML input
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validate quantum circuit input
  static validateCircuitConfig(config: any): boolean {
    if (!config || typeof config !== 'object') return false;

    // Check required fields
    if (!Array.isArray(config.gates)) return false;
    if (typeof config.qubits !== 'number' || config.qubits < 1 || config.qubits > 20) return false;

    // Validate gates
    for (const gate of config.gates) {
      if (!gate.type || typeof gate.type !== 'string') return false;
      if (!Array.isArray(gate.qubits) || gate.qubits.length === 0) return false;
      
      // Check qubit indices are valid
      for (const qubit of gate.qubits) {
        if (typeof qubit !== 'number' || qubit < 0 || qubit >= config.qubits) {
          return false;
        }
      }
    }

    return true;
  }

  // Validate training parameters
  static validateTrainingParams(params: any): boolean {
    if (!params || typeof params !== 'object') return false;

    const { epochs, learningRate, batchSize } = params;

    if (typeof epochs !== 'number' || epochs < 1 || epochs > 1000) return false;
    if (typeof learningRate !== 'number' || learningRate <= 0 || learningRate > 1) return false;
    if (batchSize && (typeof batchSize !== 'number' || batchSize < 1 || batchSize > 1000)) return false;

    return true;
  }

  // Validate API input
  static validateAPIInput(input: any, schema: Record<string, any>): boolean {
    for (const [key, rules] of Object.entries(schema)) {
      const value = input[key];

      if (rules.required && (value === undefined || value === null)) {
        return false;
      }

      if (value !== undefined && rules.type && typeof value !== rules.type) {
        return false;
      }

      if (rules.min !== undefined && value < rules.min) {
        return false;
      }

      if (rules.max !== undefined && value > rules.max) {
        return false;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return false;
      }
    }

    return true;
  }

  // Sanitize file names
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }

  // Validate URL
  static isValidURL(url: string, allowedDomains?: string[]): boolean {
    try {
      const urlObj = new URL(url);
      
      if (allowedDomains) {
        return allowedDomains.some(domain => 
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
        );
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Cryptographic utilities
export class CryptoUtils {
  // Generate secure random string
  static generateSecureRandom(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash data using SHA-256
  static async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Generate HMAC
  static async generateHMAC(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(key);
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    const signatureArray = Array.from(new Uint8Array(signature));
    return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Secure comparison to prevent timing attacks
  static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}

// Global security monitor instance
export const securityMonitor = new SecurityMonitor();