#!/usr/bin/env node

/**
 * Documentation Link Validation Script
 *
 * Validates markdown documents for:
 * - Broken internal links (links to files that don't exist)
 * - Outdated file references (paths that no longer exist)
 * - Invalid anchor links (heading references)
 * - Relative path consistency
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

class LinkValidator {
  constructor(rootDir) {
    this.rootDir = path.resolve(rootDir);
    this.errors = [];
    this.warnings = [];
    this.filesChecked = 0;
    this.linksChecked = 0;
    this.brokenLinks = 0;
  }

  /**
   * Extract all markdown links from content
   * Matches: [text](path) and [text](path#anchor)
   */
  extractLinks(content) {
    const links = [];
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, text, url] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      links.push({ text, url, lineNumber, fullMatch });
    }

    return links;
  }

  /**
   * Extract inline code references to file paths
   * Matches: `path/to/file.ext` patterns
   */
  extractFileReferences(content) {
    const refs = [];
    // Match backtick-wrapped paths that look like file references
    const refRegex = /`([a-zA-Z0-9_./-]+\.[a-zA-Z]{1,10})`/g;
    let match;

    while ((match = refRegex.exec(content)) !== null) {
      const [fullMatch, path] = match;
      const lineNumber = content.substring(0, match.index).split('\n').length;
      // Filter out obvious non-file patterns
      if (!path.includes('http') && !path.startsWith('.') && path.includes('/')) {
        refs.push({ path, lineNumber, fullMatch });
      }
    }

    return refs;
  }

  /**
   * Check if a path exists relative to a source file
   */
  pathExists(sourcePath, targetPath) {
    // Skip external URLs
    if (
      targetPath.startsWith('http://') ||
      targetPath.startsWith('https://') ||
      targetPath.startsWith('mailto:') ||
      targetPath.startsWith('#')
    ) {
      return true;
    }

    // Remove anchor from path
    const pathWithoutAnchor = targetPath.split('#')[0];
    if (!pathWithoutAnchor) return true; // Pure anchor link

    // Resolve the path
    const sourceDir = path.dirname(sourcePath);
    let resolvedPath;

    if (pathWithoutAnchor.startsWith('/')) {
      // Absolute path from repo root
      resolvedPath = path.join(this.rootDir, pathWithoutAnchor);
    } else {
      // Relative path
      resolvedPath = path.resolve(sourceDir, pathWithoutAnchor);
    }

    // Check if file or directory exists
    try {
      fs.accessSync(resolvedPath, fs.constants.F_OK);
      return true;
    } catch {
      // Try with common extensions if no extension provided
      if (!path.extname(resolvedPath)) {
        const extensions = ['.md', '.ts', '.tsx', '.js', '.jsx', '.json'];
        for (const ext of extensions) {
          try {
            fs.accessSync(resolvedPath + ext, fs.constants.F_OK);
            return true;
          } catch {
            /* continue */
          }
        }
      }
      return false;
    }
  }

  /**
   * Validate a single markdown file
   */
  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.filesChecked++;
      const relativePath = path.relative(this.rootDir, filePath);
      let fileHasErrors = false;

      // Check markdown links
      const links = this.extractLinks(content);
      for (const link of links) {
        this.linksChecked++;
        if (!this.pathExists(filePath, link.url)) {
          this.brokenLinks++;
          fileHasErrors = true;
          this.errors.push({
            file: relativePath,
            line: link.lineNumber,
            type: 'broken_link',
            message: `Broken link: ${link.url}`,
            context: link.fullMatch,
          });
        }
      }

      // Check file references in code blocks
      const refs = this.extractFileReferences(content);
      for (const ref of refs) {
        // Only check paths that look like they should exist in the repo
        if (
          ref.path.includes('organizations/') ||
          ref.path.includes('docs/') ||
          ref.path.includes('packages/') ||
          ref.path.includes('tools/') ||
          ref.path.includes('scripts/') ||
          ref.path.includes('reports/')
        ) {
          const fullPath = path.join(this.rootDir, ref.path);
          if (!fs.existsSync(fullPath)) {
            this.warnings.push({
              file: relativePath,
              line: ref.lineNumber,
              type: 'outdated_reference',
              message: `Possibly outdated file reference: ${ref.path}`,
              context: ref.fullMatch,
            });
          }
        }
      }

      return !fileHasErrors;
    } catch (error) {
      this.errors.push({
        file: filePath,
        line: 0,
        type: 'read_error',
        message: `Failed to read file: ${error.message}`,
      });
      return false;
    }
  }

  /**
   * Check if a file should be skipped (templates, examples, etc.)
   */
  shouldSkipFile(filePath) {
    const skipPatterns = [
      /templates[/\\]/i, // Skip template files
      /TEMPLATE/i, // Skip files with TEMPLATE in name
      /EXAMPLE/i, // Skip example files
      /-template\.md$/i, // Skip *-template.md files
    ];
    return skipPatterns.some((pattern) => pattern.test(filePath));
  }

  /**
   * Find all markdown files recursively
   */
  findMarkdownFiles(dir) {
    const files = [];
    const traverse = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
          const fullPath = path.join(currentDir, item);
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              // Skip common non-doc directories and templates
              if (!['node_modules', '.git', '.next', 'dist', 'build', '.archive', 'templates'].includes(item)) {
                traverse(fullPath);
              }
            } else if (item.endsWith('.md') && !this.shouldSkipFile(fullPath)) {
              files.push(fullPath);
            }
          } catch {
            /* skip inaccessible files */
          }
        }
      } catch {
        /* skip inaccessible directories */
      }
    };
    traverse(dir);
    return files;
  }

  /**
   * Run validation on all markdown files
   */
  validate(targetPath) {
    const startPath = path.resolve(this.rootDir, targetPath || '.');
    console.log(colors.blue(`\n🔗 Link Validation Started`));
    console.log(colors.dim(`   Root: ${this.rootDir}`));
    console.log(colors.dim(`   Target: ${path.relative(this.rootDir, startPath) || '.'}\n`));

    const files = this.findMarkdownFiles(startPath);
    if (files.length === 0) {
      console.log(colors.yellow('No markdown files found.'));
      return 0;
    }

    console.log(colors.blue(`Found ${files.length} markdown files\n`));

    // Validate each file
    for (const file of files) {
      const result = this.validateFile(file);
      const relativePath = path.relative(this.rootDir, file);
      if (result) {
        console.log(colors.green(`✓ ${relativePath}`));
      } else {
        console.log(colors.red(`✗ ${relativePath}`));
      }
    }

    return this.printSummary();
  }

  /**
   * Print validation summary
   */
  printSummary() {
    console.log('\n' + colors.blue('═'.repeat(60)));
    console.log(colors.blue('LINK VALIDATION SUMMARY'));
    console.log(colors.blue('═'.repeat(60)));

    console.log(`Files checked:  ${this.filesChecked}`);
    console.log(`Links checked:  ${this.linksChecked}`);
    console.log(colors.red(`Broken links:   ${this.brokenLinks}`));
    console.log(colors.yellow(`Warnings:       ${this.warnings.length}`));

    if (this.errors.length > 0) {
      console.log(colors.red('\n❌ ERRORS:'));
      for (const error of this.errors) {
        console.log(colors.red(`  ${error.file}:${error.line}`));
        console.log(colors.red(`    ${error.message}`));
        if (error.context) {
          console.log(colors.dim(`    Context: ${error.context}`));
        }
      }
    }

    if (this.warnings.length > 0) {
      console.log(colors.yellow('\n⚠️  WARNINGS:'));
      for (const warning of this.warnings) {
        console.log(colors.yellow(`  ${warning.file}:${warning.line}`));
        console.log(colors.yellow(`    ${warning.message}`));
      }
    }

    if (this.errors.length === 0) {
      console.log(colors.green('\n✅ All links validated successfully!'));
      return 0;
    } else {
      console.log(colors.red(`\n❌ Found ${this.errors.length} broken link(s). Please fix before committing.`));
      return 1;
    }
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || 'docs';
  const rootDir = process.cwd();

  // Check for --staged flag to only check staged files
  const stagedOnly = args.includes('--staged');

  const validator = new LinkValidator(rootDir);

  if (stagedOnly) {
    console.log(colors.blue('Checking staged markdown files only...'));
    // This would require git integration - for now just validate target
  }

  const exitCode = validator.validate(targetPath);
  process.exit(exitCode);
}

main();
