#!/usr/bin/env node

/**
 * Document Validation Script
 *
 * Validates markdown documents against governance standards:
 * - Required metadata fields
 * - Proper YAML frontmatter structure
 * - Valid version numbers
 * - Ownership assignments
 * - Classification levels
 * - Date formats
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

// Simple color codes (no external dependencies)
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DocumentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validated = 0;
    this.passed = 0;
  }

  /**
   * Validate a single markdown document
   */
  validateDocument(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.validated++;

      // Check if file has frontmatter
      if (!content.startsWith('---')) {
        this.addError(filePath, 'Missing YAML frontmatter', 'Document must start with ---');
        return false;
      }

      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd === -1) {
        this.addError(filePath, 'Invalid frontmatter', 'Frontmatter must be closed with ---');
        return false;
      }

      const frontmatterContent = content.substring(3, frontmatterEnd).trim();
      let metadata;

      try {
        metadata = yaml.load(frontmatterContent);
      } catch (error) {
        this.addError(filePath, 'Invalid YAML', `YAML parsing error: ${error.message}`);
        return false;
      }

      // Validate required fields
      this.validateRequiredFields(filePath, metadata);
      this.validateDocumentId(filePath, metadata);
      this.validateVersion(filePath, metadata);
      this.validateStatus(filePath, metadata);
      this.validateClassification(filePath, metadata);
      this.validateDates(filePath, metadata);
      this.validateOwnership(filePath, metadata);
      this.validateChangeSummary(filePath, metadata);

      if (this.getDocumentErrors(filePath).length === 0) {
        this.passed++;
        console.log(colors.green(`✓ ${filePath}`));
        return true;
      } else {
        console.log(colors.red(`✗ ${filePath}`));
        this.printDocumentErrors(filePath);
        return false;
      }
    } catch (error) {
      this.addError(filePath, 'File read error', error.message);
      console.log(colors.red(`✗ ${filePath} - ${error.message}`));
      return false;
    }
  }

  /**
   * Validate required fields are present
   */
  validateRequiredFields(filePath, metadata) {
    const requiredFields = [
      'document_metadata.title',
      'document_metadata.document_id',
      'document_metadata.version',
      'document_metadata.status',
      'document_metadata.classification',
      'document_metadata.dates.created',
      'document_metadata.dates.last_updated',
      'document_metadata.dates.next_review',
      'document_metadata.ownership.owner',
      'document_metadata.ownership.maintainer',
      'document_metadata.change_summary',
      'document_metadata.llm_context.purpose',
      'document_metadata.llm_context.scope',
    ];

    requiredFields.forEach((field) => {
      if (!this.getNestedValue(metadata, field)) {
        this.addError(filePath, 'Missing required field', field);
      }
    });
  }

  /**
   * Validate document ID format
   */
  validateDocumentId(filePath, metadata) {
    const documentId = this.getNestedValue(metadata, 'document_metadata.document_id');
    if (documentId) {
      const idPattern = /^[A-Z]{2,}-[A-Z]{2,}-\d{3}$/;
      if (!idPattern.test(documentId)) {
        this.addError(
          filePath,
          'Invalid document ID',
          `Document ID should match pattern: XXX-XXX-001 (current: ${documentId})`,
        );
      }
    }
  }

  /**
   * Validate version number format
   */
  validateVersion(filePath, metadata) {
    const version = this.getNestedValue(metadata, 'document_metadata.version');
    if (version) {
      const versionPattern = /^\d+\.\d+\.\d+$/;
      if (!versionPattern.test(version)) {
        this.addError(
          filePath,
          'Invalid version',
          `Version should follow semantic versioning: X.Y.Z (current: ${version})`,
        );
      }
    }
  }

  /**
   * Validate status value
   */
  validateStatus(filePath, metadata) {
    const status = this.getNestedValue(metadata, 'document_metadata.status');
    if (status) {
      const validStatuses = ['Active', 'Draft', 'Deprecated'];
      if (!validStatuses.includes(status)) {
        this.addError(
          filePath,
          'Invalid status',
          `Status must be one of: ${validStatuses.join(', ')} (current: ${status})`,
        );
      }
    }
  }

  /**
   * Validate classification value
   */
  validateClassification(filePath, metadata) {
    const classification = this.getNestedValue(metadata, 'document_metadata.classification');
    if (classification) {
      const validClassifications = ['Public', 'Internal', 'Confidential', 'Restricted'];
      if (!validClassifications.includes(classification)) {
        this.addError(
          filePath,
          'Invalid classification',
          `Classification must be one of: ${validClassifications.join(', ')} (current: ${classification})`,
        );
      }
    }
  }

  /**
   * Validate date formats
   */
  validateDates(filePath, metadata) {
    const dates = this.getNestedValue(metadata, 'document_metadata.dates');
    if (dates) {
      const dateFields = ['created', 'last_updated', 'next_review'];
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;

      dateFields.forEach((field) => {
        if (dates[field]) {
          if (!datePattern.test(dates[field])) {
            this.addError(filePath, 'Invalid date format', `${field} should be YYYY-MM-DD (current: ${dates[field]})`);
          } else {
            // Validate date is valid
            const date = new Date(dates[field]);
            if (isNaN(date.getTime())) {
              this.addError(filePath, 'Invalid date', `${field} is not a valid date: ${dates[field]}`);
            }
          }
        }
      });

      // Validate next_review is in the future
      if (dates.next_review) {
        const nextReview = new Date(dates.next_review);
        const today = new Date();
        if (nextReview <= today) {
          this.addWarning(
            filePath,
            'Review date passed',
            `next_review date (${dates.next_review}) is in the past or today`,
          );
        }
      }
    }
  }

  /**
   * Validate ownership information
   */
  validateOwnership(filePath, metadata) {
    const ownership = this.getNestedValue(metadata, 'document_metadata.ownership');
    if (ownership) {
      if (!ownership.owner || typeof ownership.owner !== 'string') {
        this.addError(filePath, 'Invalid owner', 'Owner must be a non-empty string');
      }

      if (!ownership.maintainer || typeof ownership.maintainer !== 'string') {
        this.addError(filePath, 'Invalid maintainer', 'Maintainer must be a non-empty string');
      }

      if (ownership.reviewers && !Array.isArray(ownership.reviewers)) {
        this.addError(filePath, 'Invalid reviewers', 'Reviewers must be an array');
      }
    }
  }

  /**
   * Validate change summary format
   */
  validateChangeSummary(filePath, metadata) {
    const changeSummary = this.getNestedValue(metadata, 'document_metadata.change_summary');
    if (changeSummary) {
      if (typeof changeSummary !== 'string') {
        this.addError(filePath, 'Invalid change summary', 'Change summary must be a string');
      } else {
        // Check for date format at beginning
        const datePattern = /^\[\d{4}-\d{2}-\d{2\]/;
        if (!datePattern.test(changeSummary.trim())) {
          this.addWarning(filePath, 'Change summary format', 'Change summary should start with [YYYY-MM-DD]');
        }
      }
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  /**
   * Add error for a document
   */
  addError(filePath, type, message) {
    if (!this.errors[filePath]) {
      this.errors[filePath] = [];
    }
    this.errors[filePath].push({ type, message });
  }

  /**
   * Add warning for a document
   */
  addWarning(filePath, type, message) {
    if (!this.warnings[filePath]) {
      this.warnings[filePath] = [];
    }
    this.warnings[filePath].push({ type, message });
  }

  /**
   * Get errors for a specific document
   */
  getDocumentErrors(filePath) {
    return this.errors[filePath] || [];
  }

  /**
   * Get warnings for a specific document
   */
  getDocumentWarnings(filePath) {
    return this.warnings[filePath] || [];
  }

  /**
   * Print errors for a document
   */
  printDocumentErrors(filePath) {
    const errors = this.getDocumentErrors(filePath);
    const warnings = this.getDocumentWarnings(filePath);

    if (errors.length > 0) {
      console.log(colors.red(`  Errors:`));
      errors.forEach((error) => {
        console.log(colors.red(`    - ${error.type}: ${error.message}`));
      });
    }

    if (warnings.length > 0) {
      console.log(colors.yellow(`  Warnings:`));
      warnings.forEach((warning) => {
        console.log(colors.yellow(`    - ${warning.type}: ${warning.message}`));
      });
    }
  }

  /**
   * Print summary report
   */
  printSummary() {
    console.log('\n' + colors.blue('='.repeat(60)));
    console.log(colors.blue('VALIDATION SUMMARY'));
    console.log(colors.blue('='.repeat(60)));

    console.log(`Documents validated: ${this.validated}`);
    console.log(colors.green(`Documents passed: ${this.passed}`));
    console.log(colors.red(`Documents failed: ${this.validated - this.passed}`));

    const totalErrors = Object.values(this.errors).reduce((sum, errors) => sum + errors.length, 0);
    const totalWarnings = Object.values(this.warnings).reduce((sum, warnings) => sum + warnings.length, 0);

    if (totalErrors > 0) {
      console.log(colors.red(`Total errors: ${totalErrors}`));
    }

    if (totalWarnings > 0) {
      console.log(colors.yellow(`Total warnings: ${totalWarnings}`));
    }

    if (this.validated === this.passed) {
      console.log(colors.green('\n✅ All documents passed validation!'));
    } else {
      console.log(colors.red('\n❌ Some documents failed validation. Please fix the errors above.'));
    }
  }

  /**
   * Get exit code based on validation results
   */
  getExitCode() {
    return this.validated === this.passed ? 0 : 1;
  }
}

/**
 * Find all markdown files in a directory recursively
 */
function findMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and .git directories
        if (item !== 'node_modules' && item !== '.git' && item !== '.next') {
          traverse(fullPath);
        }
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Main execution function
 */
function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || '.';

  console.log(colors.blue('🔍 Document Validation Started'));
  console.log(colors.blue(`Validating documents in: ${targetPath}`));

  const validator = new DocumentValidator();

  // Find and validate all markdown files
  const markdownFiles = findMarkdownFiles(targetPath);

  if (markdownFiles.length === 0) {
    console.log(colors.yellow('No markdown files found.'));
    return 0;
  }

  console.log(colors.blue(`Found ${markdownFiles.length} markdown files`));

  // Validate each file
  markdownFiles.forEach((file) => {
    validator.validateDocument(file);
  });

  // Print summary
  validator.printSummary();

  return validator.getExitCode();
}

// Run the script
process.exit(main());
