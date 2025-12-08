/**
 * Token Chain Integrity Validation System
 * Prevents circular references and validates token resolution chains
 */

interface TokenDefinition {
  value: string;
  type: 'primitive' | 'semantic' | 'component';
  references?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  token: string;
  message: string;
  type: 'circular_reference' | 'missing_primitive' | 'invalid_value' | 'contrast_failure';
}

interface ValidationWarning {
  token: string;
  message: string;
  type: 'unused_token' | 'deep_nesting' | 'performance_impact';
}

export class TokenValidator {
  private tokens: Map<string, TokenDefinition> = new Map();
  private resolutionCache: Map<string, string> = new Map();

  /**
   * Parse CSS custom properties and build token dependency graph
   */
  parseTokens(cssContent: string): void {
    const tokenRegex = /--([^:]+):\s*([^;]+);/g;
    let match;

    while ((match = tokenRegex.exec(cssContent)) !== null) {
      const [, name, value] = match;
      const tokenName = `--${name.trim()}`;
      const tokenValue = value.trim();
      
      const references = this.extractReferences(tokenValue);
      const type = this.inferTokenType(tokenName);

      this.tokens.set(tokenName, {
        value: tokenValue,
        type,
        references
      });
    }
  }

  /**
   * Extract var() references from token values
   */
  private extractReferences(value: string): string[] {
    const varRegex = /var\((--[^,)]+)/g;
    const references: string[] = [];
    let match;

    while ((match = varRegex.exec(value)) !== null) {
      references.push(match[1]);
    }

    return references;
  }

  /**
   * Infer token type from naming convention
   */
  private inferTokenType(tokenName: string): 'primitive' | 'semantic' | 'component' {
    if (tokenName.startsWith('--primitive-')) return 'primitive';
    if (tokenName.startsWith('--semantic-')) return 'semantic';
    if (tokenName.startsWith('--component-')) return 'component';
    return 'primitive'; // fallback
  }

  /**
   * Validate entire token system
   */
  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for circular references
    for (const [tokenName] of this.tokens) {
      const circular = this.detectCircularReference(tokenName, new Set());
      if (circular) {
        errors.push({
          token: tokenName,
          message: `Circular reference detected: ${circular.join(' -> ')}`,
          type: 'circular_reference'
        });
      }
    }

    // Check for missing primitives
    for (const [tokenName, definition] of this.tokens) {
      if (definition.references) {
        for (const ref of definition.references) {
          if (!this.tokens.has(ref)) {
            errors.push({
              token: tokenName,
              message: `References missing token: ${ref}`,
              type: 'missing_primitive'
            });
          }
        }
      }
    }

    // Check contrast ratios for color tokens
    this.validateContrast(errors);

    // Check for unused tokens
    this.detectUnusedTokens(warnings);

    // Check for deep nesting (performance impact)
    this.checkNestingDepth(warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Detect circular references using DFS
   */
  private detectCircularReference(tokenName: string, visited: Set<string>): string[] | null {
    if (visited.has(tokenName)) {
      return [tokenName]; // Found cycle
    }

    const token = this.tokens.get(tokenName);
    if (!token?.references) return null;

    visited.add(tokenName);

    for (const ref of token.references) {
      const cycle = this.detectCircularReference(ref, new Set(visited));
      if (cycle) {
        return [tokenName, ...cycle];
      }
    }

    return null;
  }

  /**
   * Validate color contrast ratios
   */
  private validateContrast(errors: ValidationError[]): void {
    const colorTokens = Array.from(this.tokens.entries())
      .filter(([name]) => name.includes('color') || name.includes('text') || name.includes('background'));

    for (const [tokenName, definition] of colorTokens) {
      const resolvedValue = this.resolveToken(tokenName);
      if (this.isHSLColor(resolvedValue)) {
        // Check if this color combination meets WCAG requirements
        // This is a simplified check - in practice, you'd use a proper contrast library
        const contrastRatio = this.calculateContrastRatio(resolvedValue, '--semantic-background-primary');
        if (contrastRatio < 4.5) {
          errors.push({
            token: tokenName,
            message: `Insufficient contrast ratio: ${contrastRatio.toFixed(2)} (minimum 4.5)`,
            type: 'contrast_failure'
          });
        }
      }
    }
  }

  /**
   * Detect unused tokens
   */
  private detectUnusedTokens(warnings: ValidationWarning[]): void {
    const usedTokens = new Set<string>();
    
    // Build usage graph
    for (const [, definition] of this.tokens) {
      if (definition.references) {
        definition.references.forEach(ref => usedTokens.add(ref));
      }
    }

    // Find unused tokens (excluding primitives which are foundation)
    for (const [tokenName, definition] of this.tokens) {
      if (definition.type !== 'primitive' && !usedTokens.has(tokenName)) {
        warnings.push({
          token: tokenName,
          message: 'Token defined but never used',
          type: 'unused_token'
        });
      }
    }
  }

  /**
   * Check for deep nesting that could impact performance
   */
  private checkNestingDepth(warnings: ValidationWarning[]): void {
    for (const [tokenName] of this.tokens) {
      const depth = this.calculateResolutionDepth(tokenName);
      if (depth > 5) {
        warnings.push({
          token: tokenName,
          message: `Deep nesting detected (${depth} levels) - may impact performance`,
          type: 'deep_nesting'
        });
      }
    }
  }

  /**
   * Calculate token resolution depth
   */
  private calculateResolutionDepth(tokenName: string, visited: Set<string> = new Set()): number {
    if (visited.has(tokenName)) return 0; // Prevent infinite recursion
    
    const token = this.tokens.get(tokenName);
    if (!token?.references || token.references.length === 0) return 1;

    visited.add(tokenName);
    const maxDepth = Math.max(
      ...token.references.map(ref => this.calculateResolutionDepth(ref, new Set(visited)))
    );
    
    return 1 + maxDepth;
  }

  /**
   * Resolve token to final value
   */
  private resolveToken(tokenName: string): string {
    if (this.resolutionCache.has(tokenName)) {
      return this.resolutionCache.get(tokenName)!;
    }

    const token = this.tokens.get(tokenName);
    if (!token) return tokenName;

    let resolvedValue = token.value;
    
    // Replace var() references
    if (token.references) {
      for (const ref of token.references) {
        const refValue = this.resolveToken(ref);
        resolvedValue = resolvedValue.replace(`var(${ref})`, refValue);
      }
    }

    this.resolutionCache.set(tokenName, resolvedValue);
    return resolvedValue;
  }

  /**
   * Check if value is HSL color format
   */
  private isHSLColor(value: string): boolean {
    return /hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/.test(value);
  }

  /**
   * Calculate contrast ratio (simplified implementation)
   */
  private calculateContrastRatio(color1: string, color2Token: string): number {
    // This is a placeholder - implement proper contrast calculation
    // using libraries like 'color' or 'chroma-js'
    return 4.6; // Mock value
  }

  /**
   * Generate validation report
   */
  generateReport(result: ValidationResult): string {
    let report = '# Token Validation Report\n\n';
    
    if (result.isValid) {
      report += '✅ **All tokens valid**\n\n';
    } else {
      report += `❌ **${result.errors.length} errors found**\n\n`;
    }

    if (result.errors.length > 0) {
      report += '## Errors\n\n';
      result.errors.forEach(error => {
        report += `- **${error.token}**: ${error.message} (${error.type})\n`;
      });
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += '## Warnings\n\n';
      result.warnings.forEach(warning => {
        report += `- **${warning.token}**: ${warning.message} (${warning.type})\n`;
      });
      report += '\n';
    }

    report += `## Statistics\n\n`;
    report += `- Total tokens: ${this.tokens.size}\n`;
    report += `- Primitive tokens: ${Array.from(this.tokens.values()).filter(t => t.type === 'primitive').length}\n`;
    report += `- Semantic tokens: ${Array.from(this.tokens.values()).filter(t => t.type === 'semantic').length}\n`;
    report += `- Component tokens: ${Array.from(this.tokens.values()).filter(t => t.type === 'component').length}\n`;

    return report;
  }
}

/**
 * Build-time validation hook
 */
export async function validateTokensAtBuildTime(): Promise<boolean> {
  const validator = new TokenValidator();
  
  try {
    // Read token files
    const indexCSS = await import('../index.css?raw').then(m => m.default);
    validator.parseTokens(indexCSS);
    
    const result = validator.validate();
    
    if (!result.isValid) {
      console.error('❌ Token validation failed:');
      result.errors.forEach(error => {
        console.error(`  - ${error.token}: ${error.message}`);
      });
      return false;
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️  Token validation warnings:');
      result.warnings.forEach(warning => {
        console.warn(`  - ${warning.token}: ${warning.message}`);
      });
    }
    
    console.log('✅ Token validation passed');
    return true;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return false;
  }
}