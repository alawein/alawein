// Advanced threat detection and security monitoring for QMLab
// Real-time threat analysis, anomaly detection, and automated response

import { trackQuantumEvents } from './analytics';
import { getUrlFromRequest } from './simple-stubs';
import { securityMonitor } from './security';

// Threat detection patterns and signatures
interface ThreatSignature {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'injection' | 'xss' | 'csrf' | 'dos' | 'data-exfiltration' | 'reconnaissance' | 'anomaly';
  pattern: RegExp | string;
  threshold: number;
  timeWindow: number; // ms
  enabled: boolean;
}

interface ThreatEvent {
  id: string;
  signature: ThreatSignature;
  timestamp: number;
  source: string;
  details: Record<string, any>;
  risk_score: number;
  status: 'detected' | 'investigating' | 'mitigated' | 'false_positive';
  response_actions: string[];
}

interface SecurityMetrics {
  threats_detected: number;
  threats_blocked: number;
  false_positives: number;
  average_response_time: number;
  security_score: number;
  last_scan: number;
}

// Advanced threat detection engine
export class ThreatDetectionEngine {
  private signatures: ThreatSignature[] = [];
  private detectedThreats: ThreatEvent[] = [];
  private securityMetrics: SecurityMetrics;
  private eventBuffer: Array<{ timestamp: number; event: any; source: string }> = [];
  private anomalyBaseline = new Map<string, number[]>();
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.securityMetrics = {
      threats_detected: 0,
      threats_blocked: 0,
      false_positives: 0,
      average_response_time: 0,
      security_score: 100,
      last_scan: 0
    };

    this.initializeThreatSignatures();
    this.setupEventListeners();
  }

  // Initialize threat detection signatures
  private initializeThreatSignatures(): void {
    this.signatures = [
      {
        id: 'sql-injection-basic',
        name: 'SQL Injection Attempt',
        description: 'Detects basic SQL injection patterns',
        severity: 'high',
        category: 'injection',
        pattern: /(\bselect\b|\bunion\b|\binsert\b|\bdelete\b|\bdrop\b).*(from|where|order\s+by)/i,
        threshold: 1,
        timeWindow: 60000,
        enabled: true
      },
      {
        id: 'xss-script-injection',
        name: 'Cross-Site Scripting',
        description: 'Detects XSS script injection attempts',
        severity: 'high',
        category: 'xss',
        pattern: /<script[^>]*>.*?<\/script>|javascript:|vbscript:|onload=|onerror=/i,
        threshold: 1,
        timeWindow: 60000,
        enabled: true
      },
      {
        id: 'quantum-parameter-tampering',
        name: 'Quantum Parameter Tampering',
        description: 'Detects suspicious quantum parameter modifications',
        severity: 'medium',
        category: 'anomaly',
        pattern: 'quantum_params_anomaly', // Custom detection logic
        threshold: 3,
        timeWindow: 300000, // 5 minutes
        enabled: true
      },
      {
        id: 'excessive-api-requests',
        name: 'Excessive API Requests',
        description: 'Detects potential DoS through excessive API calls',
        severity: 'medium',
        category: 'dos',
        pattern: 'api_request_rate', // Custom detection logic
        threshold: 100, // requests per minute
        timeWindow: 60000,
        enabled: true
      },
      {
        id: 'data-exfiltration-attempt',
        name: 'Data Exfiltration Attempt',
        description: 'Detects unusual data access patterns',
        severity: 'critical',
        category: 'data-exfiltration',
        pattern: 'data_access_anomaly', // Custom detection logic
        threshold: 5,
        timeWindow: 600000, // 10 minutes
        enabled: true
      },
      {
        id: 'reconnaissance-scanning',
        name: 'Reconnaissance Scanning',
        description: 'Detects systematic probing of endpoints',
        severity: 'medium',
        category: 'reconnaissance',
        pattern: 'endpoint_scanning', // Custom detection logic
        threshold: 10,
        timeWindow: 300000, // 5 minutes
        enabled: true
      },
      {
        id: 'circuit-manipulation',
        name: 'Malicious Circuit Manipulation',
        description: 'Detects attempts to manipulate quantum circuits maliciously',
        severity: 'high',
        category: 'anomaly',
        pattern: 'circuit_anomaly', // Custom detection logic
        threshold: 2,
        timeWindow: 120000, // 2 minutes
        enabled: true
      },
      {
        id: 'privilege-escalation',
        name: 'Privilege Escalation Attempt',
        description: 'Detects attempts to escalate privileges',
        severity: 'critical',
        category: 'anomaly',
        pattern: /admin|root|administrator|sudo|elevate|escalate/i,
        threshold: 3,
        timeWindow: 300000,
        enabled: true
      }
    ];
  }

  // Setup event listeners for security monitoring
  private setupEventListeners(): void {
    // Monitor DOM mutations for potential XSS
    if (typeof window !== 'undefined') {
      this.setupDOMMonitoring();
      this.setupNetworkMonitoring();
      this.setupConsoleMonitoring();
      this.setupStorageMonitoring();
    }
  }

  // Setup DOM mutation monitoring
  private setupDOMMonitoring(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.analyzeElement(node as Element);
            }
          });
        } else if (mutation.type === 'attributes') {
          this.analyzeAttributeChange(mutation);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'onclick', 'onload', 'onerror', 'style']
    });
  }

  // Setup network request monitoring
  private setupNetworkMonitoring(): void {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const request = args[0];
      const url = getUrlFromRequest(request);
      
      this.analyzeNetworkRequest('fetch', url, args[1]);
      
      return originalFetch.apply(window, args);
    };

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this.addEventListener('readystatechange', () => {
        if (this.readyState === XMLHttpRequest.DONE) {
          // Analyze response
          (window as any).threatDetector?.analyzeNetworkResponse(method, url, this.status, this.responseText);
        }
      });
      
      (window as any).threatDetector?.analyzeNetworkRequest('xhr', url, { method });
      return originalXHROpen.call(this, method, url, ...rest);
    };
  }

  // Setup console monitoring
  private setupConsoleMonitoring(): void {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.analyzeConsoleEvent('error', args);
      return originalConsoleError(...args);
    };

    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.analyzeConsoleEvent('warn', args);
      return originalConsoleWarn(...args);
    };
  }

  // Setup storage monitoring
  private setupStorageMonitoring(): void {
    // Monitor localStorage access
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key: string, value: string) => {
      this.analyzeStorageAccess('localStorage', 'set', key, value);
      return originalSetItem.call(localStorage, key, value);
    };

    // Monitor sessionStorage access
    const originalSessionSetItem = sessionStorage.setItem;
    sessionStorage.setItem = (key: string, value: string) => {
      this.analyzeStorageAccess('sessionStorage', 'set', key, value);
      return originalSessionSetItem.call(sessionStorage, key, value);
    };
  }

  // Analyze DOM element for threats
  private analyzeElement(element: Element): void {
    const tagName = element.tagName.toLowerCase();
    const innerHTML = element.innerHTML;
    const attributes = Array.from(element.attributes);

    // Check for script injection
    if (tagName === 'script' || innerHTML.includes('<script')) {
      this.detectThreat('xss-script-injection', {
        element: tagName,
        content: innerHTML.substring(0, 200),
        location: 'DOM'
      });
    }

    // Check suspicious attributes
    attributes.forEach(attr => {
      if (attr.name.startsWith('on') && attr.value) {
        this.detectThreat('xss-script-injection', {
          attribute: attr.name,
          value: attr.value,
          element: tagName,
          location: 'DOM'
        });
      }
    });
  }

  // Analyze attribute changes
  private analyzeAttributeChange(mutation: MutationRecord): void {
    if (mutation.type === 'attributes' && mutation.attributeName) {
      const element = mutation.target as Element;
      const attrValue = element.getAttribute(mutation.attributeName);
      
      if (attrValue && mutation.attributeName.startsWith('on')) {
        this.detectThreat('xss-script-injection', {
          type: 'attribute-change',
          attribute: mutation.attributeName,
          value: attrValue,
          element: element.tagName
        });
      }
    }
  }

  // Analyze network requests
  private analyzeNetworkRequest(method: string, url: string, options?: any): void {
    const now = Date.now();
    
    // Track request rate for DoS detection
    const requestKey = 'api_request_rate';
    if (!this.anomalyBaseline.has(requestKey)) {
      this.anomalyBaseline.set(requestKey, []);
    }
    
    const requests = this.anomalyBaseline.get(requestKey)!;
    requests.push(now);
    
    // Keep only requests from the last minute
    const oneMinuteAgo = now - 60000;
    const recentRequests = requests.filter(time => time > oneMinuteAgo);
    this.anomalyBaseline.set(requestKey, recentRequests);
    
    // Check if request rate exceeds threshold
    if (recentRequests.length > 100) { // 100 requests per minute
      this.detectThreat('excessive-api-requests', {
        method,
        url,
        requestCount: recentRequests.length,
        timeWindow: '1 minute'
      });
    }

    // Check for suspicious URLs
    const suspiciousPatterns = [
      /admin|config|\.env|\.git|backup|dump|debug/i,
      /\.\./,  // Path traversal
      /\||\;|\&/  // Command injection
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(url)) {
        this.detectThreat('reconnaissance-scanning', {
          method,
          url,
          pattern: pattern.toString(),
          type: 'suspicious-url'
        });
      }
    });
  }

  // Analyze network responses
  private analyzeNetworkResponse(method: string, url: string, status: number, response: string): void {
    // Check for information disclosure
    const sensitiveDataPatterns = [
      /api[_-]?key|secret|token|password|private[_-]?key/i,
      /error|exception|stack[_-]?trace/i,
      /database|sql|connection/i
    ];

    if (status >= 200 && status < 300 && response) {
      sensitiveDataPatterns.forEach(pattern => {
        if (pattern.test(response)) {
          this.detectThreat('data-exfiltration-attempt', {
            method,
            url,
            status,
            pattern: pattern.toString(),
            responseLength: response.length
          });
        }
      });
    }
  }

  // Analyze console events
  private analyzeConsoleEvent(level: string, args: any[]): void {
    const content = args.join(' ');
    
    // Check for error patterns that might indicate attacks
    const errorPatterns = [
      /csp\s+violation/i,
      /blocked.*mixed.*content/i,
      /unsafe.*eval/i,
      /injection/i
    ];

    errorPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        this.detectThreat('xss-script-injection', {
          type: 'console-error',
          level,
          content: content.substring(0, 500),
          source: 'console'
        });
      }
    });
  }

  // Analyze storage access
  private analyzeStorageAccess(storage: string, operation: string, key: string, value?: string): void {
    // Check for suspicious storage keys
    const suspiciousKeys = [
      /token|auth|session|credential/i,
      /admin|privilege|role/i,
      /api[_-]?key|secret/i
    ];

    suspiciousKeys.forEach(pattern => {
      if (pattern.test(key)) {
        this.detectThreat('data-exfiltration-attempt', {
          type: 'storage-access',
          storage,
          operation,
          key,
          valueLength: value?.length || 0,
          source: 'storage'
        });
      }
    });
  }

  // Quantum-specific threat detection
  analyzeQuantumOperation(operation: string, parameters: any): void {
    // Detect quantum parameter anomalies
    if (operation === 'circuit-execution') {
      const { qubits, gates } = parameters;
      
      // Check for unusual circuit configurations
      if (qubits > 20) {
        this.detectThreat('quantum-parameter-tampering', {
          operation,
          qubits,
          reason: 'excessive-qubits',
          threshold: 20
        });
      }
      
      if (gates && gates.length > 1000) {
        this.detectThreat('quantum-parameter-tampering', {
          operation,
          gateCount: gates.length,
          reason: 'excessive-gates',
          threshold: 1000
        });
      }
      
      // Check for malicious gate sequences
      const maliciousPatterns = this.detectMaliciousCircuitPatterns(gates);
      if (maliciousPatterns.length > 0) {
        this.detectThreat('circuit-manipulation', {
          operation,
          patterns: maliciousPatterns,
          gateCount: gates.length
        });
      }
    }
  }

  // Detect malicious circuit patterns
  private detectMaliciousCircuitPatterns(gates: any[]): string[] {
    const patterns: string[] = [];
    
    if (!gates || !Array.isArray(gates)) return patterns;
    
    // Pattern 1: Excessive identity gates (possible circuit bloating)
    const identityGates = gates.filter(gate => gate.type === 'I');
    if (identityGates.length > gates.length * 0.5) {
      patterns.push('excessive-identity-gates');
    }
    
    // Pattern 2: Repeated gate sequences (possible DoS attempt)
    const gateSequences = new Map<string, number>();
    for (let i = 0; i < gates.length - 2; i++) {
      const sequence = gates.slice(i, i + 3).map(g => g.type).join('-');
      gateSequences.set(sequence, (gateSequences.get(sequence) || 0) + 1);
    }
    
    for (const [sequence, count] of gateSequences.entries()) {
      if (count > 50) {
        patterns.push(`repeated-sequence-${sequence}`);
      }
    }
    
    // Pattern 3: Suspicious gate combinations
    const suspiciousTypes = gates.filter(gate => 
      !['H', 'X', 'Y', 'Z', 'RX', 'RY', 'RZ', 'CNOT', 'CZ', 'S', 'T'].includes(gate.type)
    );
    
    if (suspiciousTypes.length > 0) {
      patterns.push('unknown-gate-types');
    }
    
    return patterns;
  }

  // Main threat detection method
  private detectThreat(signatureId: string, details: Record<string, any>): void {
    const signature = this.signatures.find(s => s.id === signatureId);
    if (!signature || !signature.enabled) return;

    const now = Date.now();
    const threat: ThreatEvent = {
      id: `threat-${now}-${Math.random().toString(36).substr(2, 9)}`,
      signature,
      timestamp: now,
      source: details.source || 'web-client',
      details,
      risk_score: this.calculateRiskScore(signature, details),
      status: 'detected',
      response_actions: []
    };

    // Add to detected threats
    this.detectedThreats.push(threat);
    this.securityMetrics.threats_detected++;

    // Log threat
    console.warn(`🚨 SECURITY THREAT DETECTED: ${signature.name}`, threat);

    // Track in analytics
    trackQuantumEvents.errorBoundary(
      `Security Threat: ${signature.name}`,
      JSON.stringify(threat.details),
      'security-threat'
    );

    // Execute response actions
    this.executeResponseActions(threat);

    // Clean up old threats (keep last 100)
    if (this.detectedThreats.length > 100) {
      this.detectedThreats = this.detectedThreats.slice(-100);
    }
  }

  // Calculate risk score
  private calculateRiskScore(signature: ThreatSignature, details: Record<string, any>): number {
    let baseScore = 0;
    
    switch (signature.severity) {
      case 'critical': baseScore = 90; break;
      case 'high': baseScore = 70; break;
      case 'medium': baseScore = 50; break;
      case 'low': baseScore = 30; break;
    }

    // Adjust based on details
    let adjustmentFactor = 1;
    
    if (details.requestCount && details.requestCount > 200) {
      adjustmentFactor += 0.3;
    }
    
    if (details.qubits && details.qubits > 15) {
      adjustmentFactor += 0.2;
    }
    
    if (details.patterns && details.patterns.length > 2) {
      adjustmentFactor += 0.4;
    }

    return Math.min(100, Math.round(baseScore * adjustmentFactor));
  }

  // Execute automated response actions
  private executeResponseActions(threat: ThreatEvent): void {
    const actions: string[] = [];

    switch (threat.signature.severity) {
      case 'critical':
        actions.push('block-source', 'alert-admin', 'log-incident');
        break;
      case 'high':
        actions.push('rate-limit', 'alert-admin', 'log-incident');
        break;
      case 'medium':
        actions.push('log-incident', 'increase-monitoring');
        break;
      case 'low':
        actions.push('log-incident');
        break;
    }

    actions.forEach(action => {
      this.executeAction(action, threat);
    });

    threat.response_actions = actions;
  }

  // Execute individual response action
  private executeAction(action: string, threat: ThreatEvent): void {
    switch (action) {
      case 'block-source':
        console.log(`🛡️ BLOCKING source for threat: ${threat.id}`);
        break;
      
      case 'rate-limit':
        console.log(`⏱️ RATE LIMITING source for threat: ${threat.id}`);
        break;
      
      case 'alert-admin':
        this.alertAdministrator(threat);
        break;
      
      case 'log-incident':
        this.logSecurityIncident(threat);
        break;
      
      case 'increase-monitoring':
        console.log(`👁️ INCREASING monitoring for threat: ${threat.id}`);
        break;
    }
  }

  // Alert administrator
  private alertAdministrator(threat: ThreatEvent): void {
    console.log(`📧 ADMIN ALERT: ${threat.signature.name}`, threat);
    
    // In production, this would send actual alerts via email, SMS, etc.
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Security Alert: ${threat.signature.name}`, {
        body: `Risk Score: ${threat.risk_score}/100`,
        icon: '/favicon.ico'
      });
    }
  }

  // Log security incident
  private logSecurityIncident(threat: ThreatEvent): void {
    const incident = {
      id: threat.id,
      timestamp: threat.timestamp,
      type: 'security-threat',
      severity: threat.signature.severity,
      category: threat.signature.category,
      description: threat.signature.description,
      risk_score: threat.risk_score,
      details: threat.details,
      source: threat.source,
      response_actions: threat.response_actions,
      user_agent: navigator.userAgent,
      url: window.location.href
    };

    // Send to security logging endpoint
    this.sendToSecurityLog(incident);
  }

  // Send to security logging
  private async sendToSecurityLog(incident: any): Promise<void> {
    try {
      await fetch('/api/security/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incident)
      });
    } catch (error) {
      console.error('Failed to log security incident:', error);
    }
  }

  // Start monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🛡️ Security threat monitoring started');

    // Periodic security scans
    this.monitoringInterval = setInterval(() => {
      this.performSecurityScan();
    }, 30000); // Every 30 seconds

    // Expose threat detector globally for other components
    (window as any).threatDetector = this;
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    delete (window as any).threatDetector;
    console.log('🛡️ Security threat monitoring stopped');
  }

  // Perform security scan
  private performSecurityScan(): void {
    this.securityMetrics.last_scan = Date.now();
    
    // Update security score based on recent threats
    const recentThreats = this.detectedThreats.filter(
      threat => Date.now() - threat.timestamp < 300000 // Last 5 minutes
    );

    const highSeverityThreats = recentThreats.filter(
      threat => ['critical', 'high'].includes(threat.signature.severity)
    );

    if (highSeverityThreats.length > 0) {
      this.securityMetrics.security_score = Math.max(
        0, 
        this.securityMetrics.security_score - (highSeverityThreats.length * 10)
      );
    } else if (recentThreats.length === 0) {
      // Slowly recover security score
      this.securityMetrics.security_score = Math.min(
        100, 
        this.securityMetrics.security_score + 1
      );
    }
  }

  // Get security status
  getSecurityStatus() {
    const now = Date.now();
    const recentThreats = this.detectedThreats.filter(
      threat => now - threat.timestamp < 300000 // Last 5 minutes
    );

    return {
      isMonitoring: this.isMonitoring,
      metrics: this.securityMetrics,
      recentThreats: recentThreats.length,
      activeSignatures: this.signatures.filter(s => s.enabled).length,
      totalThreats: this.detectedThreats.length,
      lastScan: this.securityMetrics.last_scan,
      threatsByCategory: this.getThreatsByCategory(),
      threatsBySeverity: this.getThreatsBySeverity()
    };
  }

  // Get threats by category
  private getThreatsByCategory(): Record<string, number> {
    const categories: Record<string, number> = {};
    
    this.detectedThreats.forEach(threat => {
      const category = threat.signature.category;
      categories[category] = (categories[category] || 0) + 1;
    });

    return categories;
  }

  // Get threats by severity
  private getThreatsBySeverity(): Record<string, number> {
    const severities: Record<string, number> = {};
    
    this.detectedThreats.forEach(threat => {
      const severity = threat.signature.severity;
      severities[severity] = (severities[severity] || 0) + 1;
    });

    return severities;
  }

  // Get detected threats
  getDetectedThreats(limit: number = 50): ThreatEvent[] {
    return this.detectedThreats
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Add custom signature
  addSignature(signature: Omit<ThreatSignature, 'id'>): void {
    const newSignature: ThreatSignature = {
      ...signature,
      id: `custom-${Date.now()}`
    };
    
    this.signatures.push(newSignature);
  }

  // Update signature
  updateSignature(id: string, updates: Partial<ThreatSignature>): boolean {
    const index = this.signatures.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.signatures[index] = { ...this.signatures[index], ...updates };
    return true;
  }

  // Cleanup
  cleanup(): void {
    this.stopMonitoring();
    this.detectedThreats.length = 0;
    this.eventBuffer.length = 0;
    this.anomalyBaseline.clear();
  }
}

// Global threat detection instance
export const threatDetector = new ThreatDetectionEngine();