// Comprehensive accessibility audit system for QMLab
// WCAG 2.2 AA/AAA compliance checking and automated testing

import { trackQuantumEvents } from './analytics';
import { logger } from './logger';

// Accessibility audit types
interface AccessibilityViolation {
  id: string;
  type: 'color-contrast' | 'focus-management' | 'aria-labels' | 'keyboard-navigation' | 'touch-targets' | 'text-alternatives';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriterion: string;
  element: string;
  description: string;
  recommendation: string;
  helpUrl: string;
  timestamp: number;
}

export interface AccessibilityReport {
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  score: number; // 0-100
  compliance: {
    wcagA: boolean;
    wcagAA: boolean;
    wcagAAA: boolean;
  };
}

// Color contrast calculation utilities
class ColorContrastAnalyzer {
  // Convert hex to RGB
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Calculate relative luminance
  static getRelativeLuminance(r: number, g: number, b: number): number {
    const sRGB = [r, g, b].map(channel => {
      channel = channel / 255;
      return channel <= 0.03928 
        ? channel / 12.92 
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  }

  // Calculate contrast ratio
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const l1 = this.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = this.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Check if contrast meets WCAG requirements
  static meetsWCAGContrast(ratio: number, level: 'AA' | 'AAA', isLargeText: boolean = false): boolean {
    if (level === 'AA') {
      return ratio >= (isLargeText ? 3.0 : 4.5);
    } else { // AAA
      return ratio >= (isLargeText ? 4.5 : 7.0);
    }
  }
}

// Touch target size analyzer
class TouchTargetAnalyzer {
  static readonly MIN_TOUCH_TARGET_SIZE = 44; // pixels (WCAG 2.2 SC 2.5.8)
  static readonly RECOMMENDED_SIZE = 48; // pixels (Material Design)

  static analyzeTouchTarget(element: Element): {
    width: number;
    height: number;
    meetsWCAG: boolean;
    meetsRecommended: boolean;
  } {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Include padding in touch target calculation
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    
    const effectiveWidth = rect.width + paddingLeft + paddingRight;
    const effectiveHeight = rect.height + paddingTop + paddingBottom;

    return {
      width: effectiveWidth,
      height: effectiveHeight,
      meetsWCAG: effectiveWidth >= this.MIN_TOUCH_TARGET_SIZE && effectiveHeight >= this.MIN_TOUCH_TARGET_SIZE,
      meetsRecommended: effectiveWidth >= this.RECOMMENDED_SIZE && effectiveHeight >= this.RECOMMENDED_SIZE
    };
  }
}

// ARIA and semantic analysis
class ARIAAnalyzer {
  // Check for missing ARIA labels
  static checkMissingLabels(element: Element): string[] {
    const issues: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const ariaDescribedBy = element.getAttribute('aria-describedby');

    // Interactive elements that need accessible names
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'option'];

    if (interactiveElements.includes(tagName) || (role && interactiveRoles.includes(role))) {
      if (!ariaLabel && !ariaLabelledBy && !element.textContent?.trim()) {
        if (tagName === 'input' && !element.getAttribute('placeholder')) {
          issues.push('Interactive element lacks accessible name');
        } else if (tagName !== 'input') {
          issues.push('Interactive element lacks accessible name');
        }
      }
    }

    // Complex widgets that need descriptions
    if (role && ['slider', 'progressbar', 'spinbutton'].includes(role)) {
      if (!ariaDescribedBy && !ariaLabel) {
        issues.push('Complex widget lacks description');
      }
    }

    return issues;
  }

  // Check for proper heading hierarchy
  static checkHeadingHierarchy(): string[] {
    const issues: string[] = [];
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    if (headings.length === 0) {
      issues.push('No headings found on page');
      return issues;
    }

    let previousLevel = 0;
    let hasH1 = false;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        hasH1 = true;
        if (index > 0) {
          issues.push('Multiple H1 elements found');
        }
      }

      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push(`Heading level skipped: ${heading.tagName} follows H${previousLevel}`);
      }

      previousLevel = level;
    });

    if (!hasH1) {
      issues.push('No H1 heading found');
    }

    return issues;
  }

  // Check landmark usage
  static checkLandmarks(): string[] {
    const issues: string[] = [];
    const landmarks = Array.from(document.querySelectorAll('main, nav, aside, header, footer, [role="main"], [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]'));
    
    if (landmarks.length === 0) {
      issues.push('No landmark elements found');
    }

    const mainElements = Array.from(document.querySelectorAll('main, [role="main"]'));
    if (mainElements.length === 0) {
      issues.push('No main landmark found');
    } else if (mainElements.length > 1) {
      issues.push('Multiple main landmarks found');
    }

    return issues;
  }
}

// Keyboard navigation analyzer
class KeyboardNavigationAnalyzer {
  // Check for keyboard traps
  static async checkKeyboardTraps(): Promise<string[]> {
    const issues: string[] = [];
    const focusableElements = Array.from(
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="tab"], [role="menuitem"]'
      )
    ) as HTMLElement[];

    if (focusableElements.length === 0) {
      issues.push('No focusable elements found');
      return issues;
    }

    // Simulate tab navigation to detect traps
    let trapDetected = false;
    let currentIndex = 0;
    const maxIterations = focusableElements.length * 2;
    let iterations = 0;

    while (iterations < maxIterations && !trapDetected) {
      const element = focusableElements[currentIndex];
      element.focus();
      
      // Check if focus moved as expected
      if (document.activeElement !== element) {
        trapDetected = true;
        issues.push('Potential keyboard trap detected');
      }

      currentIndex = (currentIndex + 1) % focusableElements.length;
      iterations++;
    }

    return issues;
  }

  // Check tab order logical flow
  static checkTabOrder(): string[] {
    const issues: string[] = [];
    const focusableElements = Array.from(
      document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    // Check for positive tabindex values (anti-pattern)
    focusableElements.forEach(element => {
      const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
      if (tabIndex > 0) {
        issues.push(`Positive tabindex found: ${element.tagName}[tabindex="${tabIndex}"]`);
      }
    });

    // Check visual vs DOM order
    const visualOrder = focusableElements
      .map(el => ({ element: el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => {
        if (Math.abs(a.rect.top - b.rect.top) < 10) {
          return a.rect.left - b.rect.left;
        }
        return a.rect.top - b.rect.top;
      });

    for (let i = 0; i < Math.min(visualOrder.length, focusableElements.length); i++) {
      if (visualOrder[i].element !== focusableElements[i]) {
        issues.push('Tab order does not match visual order');
        break;
      }
    }

    return issues;
  }
}

// Main accessibility auditor class
export class AccessibilityAuditor {
  private violations: AccessibilityViolation[] = [];
  private passes = 0;
  private incomplete = 0;

  // Run comprehensive accessibility audit
  async runFullAudit(): Promise<AccessibilityReport> {
    this.violations = [];
    this.passes = 0;
    this.incomplete = 0;

    // Run all audit checks
    await this.checkColorContrast();
    await this.checkTouchTargets();
    await this.checkARIAImplementation();
    await this.checkKeyboardNavigation();
    await this.checkQuantumSpecificAccessibility();

    // Generate compliance scores
    const compliance = this.calculateCompliance();
    const score = this.calculateAccessibilityScore();

    const report: AccessibilityReport = {
      id: `audit-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      violations: this.violations,
      passes: this.passes,
      incomplete: this.incomplete,
      inapplicable: 0,
      score,
      compliance
    };

    // Track audit completion
      trackQuantumEvents.featureDiscovery('accessibility_audit_completed');

    return report;
  }

  // Check color contrast compliance
  private async checkColorContrast(): Promise<void> {
    const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, textarea'));

    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Skip if colors are not set or transparent
      if (color === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 0)') {
        this.incomplete++;
        return;
      }

      // Convert to hex and calculate contrast
      try {
        const colorHex = this.rgbToHex(color);
        const bgHex = this.rgbToHex(backgroundColor);
        
        if (colorHex && bgHex) {
          const contrastRatio = ColorContrastAnalyzer.getContrastRatio(colorHex, bgHex);
          const fontSize = parseFloat(computedStyle.fontSize);
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && computedStyle.fontWeight === 'bold');

          if (!ColorContrastAnalyzer.meetsWCAGContrast(contrastRatio, 'AA', isLargeText)) {
            this.addViolation({
              type: 'color-contrast',
              severity: 'serious',
              wcagLevel: 'AA',
              wcagCriterion: '1.4.3 Contrast (Minimum)',
              element: this.getElementSelector(element),
              description: `Insufficient color contrast ratio: ${contrastRatio.toFixed(2)}:1`,
              recommendation: `Increase contrast ratio to at least ${isLargeText ? '3:1' : '4.5:1'} for WCAG AA compliance`,
              helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'
            });
          } else {
            this.passes++;
          }
        }
      } catch (error) {
        this.incomplete++;
      }
    });
  }

  // Check touch target sizes
  private async checkTouchTargets(): Promise<void> {
    const interactiveElements = Array.from(
      document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"]')
    );

    interactiveElements.forEach(element => {
      const analysis = TouchTargetAnalyzer.analyzeTouchTarget(element);
      
      if (!analysis.meetsWCAG) {
        this.addViolation({
          type: 'touch-targets',
          severity: 'serious',
          wcagLevel: 'AA',
          wcagCriterion: '2.5.8 Target Size (Minimum)',
          element: this.getElementSelector(element),
          description: `Touch target too small: ${analysis.width.toFixed(1)}x${analysis.height.toFixed(1)}px`,
          recommendation: 'Increase touch target size to at least 44x44px',
          helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html'
        });
      } else {
        this.passes++;
      }
    });
  }

  // Check ARIA implementation
  private async checkARIAImplementation(): Promise<void> {
    // Check for missing labels
    const elements = Array.from(document.querySelectorAll('*'));
    elements.forEach(element => {
      const issues = ARIAAnalyzer.checkMissingLabels(element);
      issues.forEach(issue => {
        this.addViolation({
          type: 'aria-labels',
          severity: 'serious',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1 Info and Relationships',
          element: this.getElementSelector(element),
          description: issue,
          recommendation: 'Add appropriate aria-label, aria-labelledby, or text content',
          helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
        });
      });
    });

    // Check heading hierarchy
    const headingIssues = ARIAAnalyzer.checkHeadingHierarchy();
    headingIssues.forEach(issue => {
      this.addViolation({
        type: 'aria-labels',
        severity: 'moderate',
        wcagLevel: 'A',
        wcagCriterion: '1.3.1 Info and Relationships',
        element: 'document',
        description: issue,
        recommendation: 'Use proper heading hierarchy (h1-h6) without skipping levels',
        helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
      });
    });

    // Check landmarks
    const landmarkIssues = ARIAAnalyzer.checkLandmarks();
    landmarkIssues.forEach(issue => {
      this.addViolation({
        type: 'aria-labels',
        severity: 'moderate',
        wcagLevel: 'A',
        wcagCriterion: '1.3.1 Info and Relationships',
        element: 'document',
        description: issue,
        recommendation: 'Add appropriate landmark elements (main, nav, aside, etc.)',
        helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html'
      });
    });
  }

  // Check keyboard navigation
  private async checkKeyboardNavigation(): Promise<void> {
    // Check tab order
    const tabOrderIssues = KeyboardNavigationAnalyzer.checkTabOrder();
    tabOrderIssues.forEach(issue => {
      this.addViolation({
        type: 'keyboard-navigation',
        severity: 'serious',
        wcagLevel: 'A',
        wcagCriterion: '2.1.1 Keyboard',
        element: 'document',
        description: issue,
        recommendation: 'Ensure tab order matches visual order and avoid positive tabindex values',
        helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html'
      });
    });

    // Check for keyboard traps
    const trapIssues = await KeyboardNavigationAnalyzer.checkKeyboardTraps();
    trapIssues.forEach(issue => {
      this.addViolation({
        type: 'keyboard-navigation',
        severity: 'critical',
        wcagLevel: 'A',
        wcagCriterion: '2.1.2 No Keyboard Trap',
        element: 'document',
        description: issue,
        recommendation: 'Ensure users can navigate away from all elements using only keyboard',
        helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html'
      });
    });
  }

  // Check quantum-specific accessibility
  private async checkQuantumSpecificAccessibility(): Promise<void> {
    // Check Bloch sphere accessibility
    const blochSpheres = Array.from(document.querySelectorAll('.bloch-sphere, [data-component="bloch-sphere"]'));
    blochSpheres.forEach(element => {
      const hasDescription = element.getAttribute('aria-describedby') || 
                           element.querySelector('.sr-only') ||
                           element.getAttribute('aria-label');
      
      if (!hasDescription) {
        this.addViolation({
          type: 'text-alternatives',
          severity: 'serious',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1 Non-text Content',
          element: this.getElementSelector(element),
          description: 'Quantum visualization lacks text description',
          recommendation: 'Add aria-describedby pointing to detailed quantum state description',
          helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
        });
      } else {
        this.passes++;
      }
    });

    // Check circuit builder accessibility
    const circuitBuilders = Array.from(document.querySelectorAll('.circuit-builder, [data-component="circuit-builder"]'));
    circuitBuilders.forEach(element => {
      const hasInstructions = element.querySelector('[role="region"]') ||
                            element.getAttribute('aria-describedby');
      
      if (!hasInstructions) {
        this.addViolation({
          type: 'text-alternatives',
          severity: 'moderate',
          wcagLevel: 'AA',
          wcagCriterion: '3.3.2 Labels or Instructions',
          element: this.getElementSelector(element),
          description: 'Circuit builder lacks usage instructions',
          recommendation: 'Add instructions for keyboard users and screen reader users',
          helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html'
        });
      } else {
        this.passes++;
      }
    });
  }

  // Add violation to list
  private addViolation(violation: Omit<AccessibilityViolation, 'id' | 'timestamp'>): void {
    this.violations.push({
      ...violation,
      id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    });
  }

  // Calculate WCAG compliance levels
  private calculateCompliance(): { wcagA: boolean; wcagAA: boolean; wcagAAA: boolean } {
    const aViolations = this.violations.filter(v => v.wcagLevel === 'A');
    const aaViolations = this.violations.filter(v => ['A', 'AA'].includes(v.wcagLevel));
    const aaaViolations = this.violations.filter(v => ['A', 'AA', 'AAA'].includes(v.wcagLevel));

    return {
      wcagA: aViolations.length === 0,
      wcagAA: aaViolations.length === 0,
      wcagAAA: aaaViolations.length === 0
    };
  }

  // Calculate overall accessibility score
  private calculateAccessibilityScore(): number {
    const totalChecks = this.violations.length + this.passes + this.incomplete;
    if (totalChecks === 0) return 100;

    const severityWeights = {
      critical: 25,
      serious: 15,
      moderate: 10,
      minor: 5
    };

    const totalPenalty = this.violations.reduce((sum, violation) => {
      return sum + severityWeights[violation.severity];
    }, 0);

    const maxPossibleScore = totalChecks * 15; // Average weight
    const score = Math.max(0, 100 - (totalPenalty / maxPossibleScore) * 100);

    return Math.round(score);
  }

  // Utility methods
  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `${element.tagName.toLowerCase()}.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private rgbToHex(rgb: string): string | null {
    const rgbMatch = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return null;

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

// Automated testing runner
export class AccessibilityTestRunner {
  private auditor = new AccessibilityAuditor();
  private reports: AccessibilityReport[] = [];

  // Run audit and generate report
  async runAudit(): Promise<AccessibilityReport> {
    logger.info('🔍 Starting accessibility audit...');
    
    const report = await this.auditor.runFullAudit();
    this.reports.push(report);
    
    logger.info('✅ Accessibility audit completed', {
      score: report.score,
      wcagAACompliant: report.compliance.wcagAA,
      violations: report.violations.length,
      passes: report.passes
    });
    
    if (report.violations.length > 0) {
      report.violations.forEach(violation => {
        logger.warn(`${violation.severity.toUpperCase()}: ${violation.description}`, {
          element: violation.element,
          fix: violation.recommendation,
          wcag: violation.wcagCriterion
        });
      });
    }

    return report;
  }

  // Get latest report
  getLatestReport(): AccessibilityReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  // Export report as JSON
  exportReport(report: AccessibilityReport): string {
    return JSON.stringify(report, null, 2);
  }

  // Get summary statistics
  getSummary(): {
    totalAudits: number;
    averageScore: number;
    complianceRate: number;
    commonViolations: Array<{ type: string; count: number }>;
  } {
    if (this.reports.length === 0) {
      return {
        totalAudits: 0,
        averageScore: 0,
        complianceRate: 0,
        commonViolations: []
      };
    }

    const averageScore = this.reports.reduce((sum, report) => sum + report.score, 0) / this.reports.length;
    const compliantReports = this.reports.filter(report => report.compliance.wcagAA).length;
    const complianceRate = (compliantReports / this.reports.length) * 100;

    // Count violation types
    const violationCounts = new Map<string, number>();
    this.reports.forEach(report => {
      report.violations.forEach(violation => {
        violationCounts.set(violation.type, (violationCounts.get(violation.type) || 0) + 1);
      });
    });

    const commonViolations = Array.from(violationCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalAudits: this.reports.length,
      averageScore: Math.round(averageScore),
      complianceRate: Math.round(complianceRate),
      commonViolations
    };
  }
}

// Global accessibility test runner
export const accessibilityTestRunner = new AccessibilityTestRunner();

// Auto-run audit in development
if (process.env.NODE_ENV === 'development') {
  // Run audit after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      accessibilityTestRunner.runAudit();
    }, 2000); // Wait for dynamic content to load
  });
}