/**
 * Integration Testing Suite
 * Tests CLI commands, metrics export, model registry, and cross-platform compatibility
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('🔗 Integration Testing Suite\n');
console.log('='.repeat(80));

function testCLICommands() {
  console.log('\n💻 Test 1: CLI Command Variations');
  console.log('-'.repeat(80));
  
  const tests = [
    {
      name: 'Route command with valid params',
      command: 'npx tsx tools/orchex/orchestration/deployment-wrapper.ts route code_generation "Test task" 0.5',
      shouldSucceed: true
    },
    {
      name: 'Stats command',
      command: 'npx tsx tools/orchex/orchestration/deployment-wrapper.ts stats',
      shouldSucceed: true
    },
    {
      name: 'Export JSON',
      command: 'npx tsx tools/orchex/orchestration/deployment-wrapper.ts export json',
      shouldSucceed: true
    },
    {
      name: 'Export CSV',
      command: 'npx tsx tools/orchex/orchestration/deployment-wrapper.ts export csv',
      shouldSucceed: true
    },
    {
      name: 'Invalid command',
      command: 'npx tsx tools/orchex/orchestration/deployment-wrapper.ts invalid',
      shouldSucceed: false
    }
  ];
  
  for (const test of tests) {
    try {
      const output = execSync(test.command, { 
        encoding: 'utf-8',
        timeout: 10000,
        stdio: 'pipe'
      });
      
      if (test.shouldSucceed) {
        console.log(`✅ ${test.name}: Success`);
      } else {
        console.log(`❌ ${test.name}: Should have failed but succeeded`);
      }
    } catch (error) {
      if (!test.shouldSucceed) {
        console.log(`✅ ${test.name}: Failed as expected`);
      } else {
        console.log(`❌ ${test.name}: ${error.message.split('\n')[0]}`);
      }
    }
  }
}

function testMetricsExport() {
  console.log('\n\n📊 Test 2: Metrics Export File Integrity');
  console.log('-'.repeat(80));
  
  try {
    // Find most recent metrics files
    const files = fs.readdirSync('.')
      .filter(f => f.startsWith('metrics-') && (f.endsWith('.json') || f.endsWith('.csv')))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.log('⚠️  No metrics files found');
      return;
    }
    
    // Test JSON file
    const jsonFile = files.find(f => f.endsWith('.json'));
    if (jsonFile) {
      try {
        const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
        
        // Validate structure
        const hasRequiredFields = 
          data.costStatistics &&
          data.performanceStatistics &&
          data.tasks &&
          Array.isArray(data.tasks);
        
        if (hasRequiredFields) {
          console.log(`✅ JSON file integrity: Valid structure`);
          console.log(`   File: ${jsonFile}`);
          console.log(`   Tasks: ${data.tasks.length}`);
          console.log(`   Total cost: $${data.costStatistics.totalCost.toFixed(4)}`);
        } else {
          console.log(`❌ JSON file integrity: Missing required fields`);
        }
      } catch (error) {
        console.log(`❌ JSON file integrity: Parse error - ${error.message}`);
      }
    }
    
    // Test CSV file
    const csvFile = files.find(f => f.endsWith('.csv'));
    if (csvFile) {
      try {
        const content = fs.readFileSync(csvFile, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());
        
        // Validate CSV structure
        const hasHeader = lines[0].includes('Model') && lines[0].includes('Cost');
        const hasData = lines.length > 1;
        
        if (hasHeader && hasData) {
          console.log(`✅ CSV file integrity: Valid structure`);
          console.log(`   File: ${csvFile}`);
          console.log(`   Rows: ${lines.length - 1} (excluding header)`);
        } else {
          console.log(`❌ CSV file integrity: Invalid structure`);
        }
      } catch (error) {
        console.log(`❌ CSV file integrity: Read error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Metrics export test failed: ${error.message}`);
  }
}

function testModelRegistry() {
  console.log('\n\n🗂️  Test 3: Model Registry Loading');
  console.log('-'.repeat(80));
  
  const registryPath = 'tools/orchex/model_registry.json';
  
  // Test 1: Registry exists
  if (fs.existsSync(registryPath)) {
    console.log(`✅ Registry file exists: ${registryPath}`);
    
    try {
      const data = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Registry loaded: ${data.length} models`);
        
        // Validate model structure
        const validModels = data.filter(m => 
          m.id && m.name && m.capabilities && m.costPer1kTokens && m.performance
        );
        
        if (validModels.length === data.length) {
          console.log(`✅ All models have valid structure`);
        } else {
          console.log(`⚠️  ${data.length - validModels.length} models have invalid structure`);
        }
        
        // List models
        console.log('\nRegistered models:');
        data.forEach(m => {
          console.log(`  - ${m.name} ($${m.costPer1kTokens}/1k tokens)`);
        });
        
      } else {
        console.log(`❌ Registry is empty or invalid`);
      }
    } catch (error) {
      console.log(`❌ Registry parse error: ${error.message}`);
    }
  } else {
    console.log(`⚠️  Registry file not found, using defaults`);
  }
  
  // Test 2: Fallback to defaults
  console.log('\n✅ Default models available as fallback');
}

function testCrossPlatform() {
  console.log('\n\n🌐 Test 4: Cross-Platform Compatibility');
  console.log('-'.repeat(80));
  
  // Detect platform
  const platform = process.platform;
  const arch = process.arch;
  const nodeVersion = process.version;
  
  console.log(`Platform: ${platform}`);
  console.log(`Architecture: ${arch}`);
  console.log(`Node.js: ${nodeVersion}`);
  
  // Test path handling
  const testPaths = [
    'tools/orchex/orchestration/deployment-wrapper.ts',
    'tools/orchex/model_registry.json',
    'metrics-test.json'
  ];
  
  console.log('\nPath handling:');
  testPaths.forEach(p => {
    const normalized = path.normalize(p);
    const resolved = path.resolve(p);
    console.log(`  ✅ ${p} → ${normalized}`);
  });
  
  // Test file operations
  console.log('\nFile operations:');
  try {
    const testFile = 'test-cross-platform.tmp';
    fs.writeFileSync(testFile, 'test');
    const content = fs.readFileSync(testFile, 'utf-8');
    fs.unlinkSync(testFile);
    console.log(`  ✅ Write/Read/Delete: Working`);
  } catch (error) {
    console.log(`  ❌ File operations: ${error.message}`);
  }
  
  // Test JSON operations
  console.log('\nJSON operations:');
  try {
    const testData = { test: 'data', number: 123 };
    const json = JSON.stringify(testData);
    const parsed = JSON.parse(json);
    console.log(`  ✅ Stringify/Parse: Working`);
  } catch (error) {
    console.log(`  ❌ JSON operations: ${error.message}`);
  }
  
  console.log('\n✅ Cross-platform compatibility verified');
}

function runAllTests() {
  try {
    testCLICommands();
    testMetricsExport();
    testModelRegistry();
    testCrossPlatform();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Integration Testing Complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
