// Basic accessibility testing utilities

interface AccessibilityIssue {
  element: Element;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  recommendation: string;
}

export class AccessibilityTester {
  static async runBasicTests(): Promise<AccessibilityIssue[]> {
    const issues: AccessibilityIssue[] = [];

    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push({
          element: img,
          issue: 'Missing alt text',
          severity: 'error',
          recommendation: 'Add descriptive alt text for screen readers'
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      
      if (!label && !ariaLabel) {
        issues.push({
          element: input,
          issue: 'Missing label',
          severity: 'error',
          recommendation: 'Add a label or aria-label for form accessibility'
        });
      }
    });

    // Check color contrast (basic)
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      if (styles.color === styles.backgroundColor) {
        issues.push({
          element: element,
          issue: 'Poor color contrast',
          severity: 'warning',
          recommendation: 'Ensure sufficient color contrast ratio'
        });
      }
    });

    return issues;
  }

  static logResults(issues: AccessibilityIssue[]) {
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found');
      return;
    }

    console.group('🔍 Accessibility Issues Found:');
    issues.forEach(issue => {
      const emoji = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${emoji} ${issue.issue}: ${issue.recommendation}`);
    });
    console.groupEnd();
  }
}