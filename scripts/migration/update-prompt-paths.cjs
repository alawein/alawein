#!/usr/bin/env node

/**
 * Update Prompt Tool Path References
 * 
 * Updates all references from old paths to new consolidated paths:
 * - tools/prompts/adaptive/ → tools/prompts/adaptive/
 * - tools/prompts/meta/ → tools/prompts/meta/
 * - tools/prompts/composer/ → tools/prompts/composer/
 * - tools/prompts/testing/ → tools/prompts/testing/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path mappings
const pathMappings = {
  'tools/prompts/adaptive': 'tools/prompts/adaptive',
  'tools/prompts/meta': 'tools/prompts/meta',
  'tools/prompts/composer': 'tools/prompts/composer',
  'tools/prompts/testing': 'tools/prompts/testing',
  
  // Also handle .ai-system paths (if any)
  '.ai-system/tools/prompts/adaptive': '.ai-system/tools/prompts/adaptive',
  '.ai-system/tools/prompts/meta': '.ai-system/tools/prompts/meta',
  '.ai-system/tools/prompts/composer': '.ai-system/tools/prompts/composer',
  '.ai-system/tools/prompts/testing': '.ai-system/tools/prompts/testing',
};

// File patterns to search
const filePatterns = [
  '**/*.md',
  '**/*.py',
  '**/*.ts',
  '**/*.js',
  '**/*.json',
  '**/*.yml',
  '**/*.yaml',
  '**/*.sh',
  '**/*.bat',
];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  'dist',
  'build',
  '.vscode',
  'archive',
];

console.log('🔍 Updating prompt tool path references...\n');

let totalFiles = 0;
let totalReplacements = 0;

// Function to update file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    // Apply each path mapping
    for (const [oldPath, newPath] of Object.entries(pathMappings)) {
      const regex = new RegExp(oldPath.replace(/\//g, '\\/'), 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, newPath);
        fileReplacements += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath} (${fileReplacements} replacements)`);
      totalFiles++;
      totalReplacements += fileReplacements;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Function to find files
function findFiles(dir, pattern) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip excluded directories
      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        // Check if file matches any pattern
        const ext = path.extname(entry.name);
        if (pattern.test(entry.name) || pattern.test(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
try {
  console.log('📁 Scanning for files...\n');
  
  // Create regex pattern from file patterns
  const patternRegex = new RegExp(
    filePatterns
      .map(p => p.replace('**/', '').replace('*', '.*'))
      .join('|')
  );
  
  // Find all matching files
  const files = findFiles('.', patternRegex);
  console.log(`Found ${files.length} files to check\n`);
  
  // Update each file
  files.forEach(updateFile);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  console.log(`Files updated: ${totalFiles}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log('='.repeat(60));
  
  if (totalFiles > 0) {
    console.log('\n✅ Path references updated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the changes');
    console.log('2. Test the updated paths');
    console.log('3. Commit the changes');
  } else {
    console.log('\n✅ No path references found to update.');
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
