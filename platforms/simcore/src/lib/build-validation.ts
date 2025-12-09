import { execSync } from 'child_process';
import { promises as fs } from 'fs';

/**
 * Build-time token validation integration
 */
export async function buildTimeValidation() {
  console.log('🔍 Running token validation...');
  
  try {
    const { TokenValidator } = await import('./token-validation.js');
    const validator = new TokenValidator();
    
    // Read the main CSS file
    const cssContent = await fs.readFile('src/index.css', 'utf-8');
    validator.parseTokens(cssContent);
    
    const result = validator.validate();
    
    if (!result.isValid) {
      console.error('❌ Token validation failed:');
      result.errors.forEach(error => {
        console.error(`  • ${error.token}: ${error.message}`);
      });
      process.exit(1);
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️  Token validation warnings:');
      result.warnings.forEach(warning => {
        console.warn(`  • ${warning.token}: ${warning.message}`);
      });
    }
    
    console.log('✅ Token validation passed');
    
    // Generate validation report
    const report = validator.generateReport(result);
    await fs.writeFile('token-validation-report.md', report);
    
    return true;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    process.exit(1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildTimeValidation();
}