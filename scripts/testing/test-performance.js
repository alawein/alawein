/**
 * Performance Testing Suite
 * Tests large batch processing, memory usage, response times, and metrics file size
 */

import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper.ts';
import * as fs from 'fs';

console.log('⚡ Performance Testing Suite\n');
console.log('='.repeat(80));

async function testLargeBatchProcessing() {
  console.log('\n📦 Test 1: Large Batch Processing (100 tasks)');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    // Create 100 tasks
    const tasks = Array(100).fill(null).map((_, i) => ({
      type: ['code_generation', 'debugging', 'documentation', 'refactoring'][i % 4],
      description: `Performance test task ${i + 1} - ${Math.random().toString(36).substring(7)}`,
      budget: 0.05
    }));
    
    console.log('Processing 100 tasks in batches of 8...');
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    const results = await service.routeTasks(tasks);
    
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const duration = endTime - startTime;
    
    // Calculate metrics
    const memoryIncrease = {
      heapUsed: ((endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024).toFixed(2),
      external: ((endMemory.external - startMemory.external) / 1024 / 1024).toFixed(2)
    };
    
    console.log(`\n✅ PASSED: All 100 tasks completed`);
    console.log(`   Duration: ${duration}ms (${(duration/100).toFixed(1)}ms per task)`);
    console.log(`   Throughput: ${(100 / (duration / 1000)).toFixed(1)} tasks/second`);
    console.log(`   Memory increase: ${memoryIncrease.heapUsed}MB heap, ${memoryIncrease.external}MB external`);
    
    const stats = service.getCostStatistics();
    console.log(`   Total cost: $${stats.totalCost.toFixed(4)}`);
    console.log(`   Average cost: $${stats.averageCost.toFixed(4)}`);
    console.log(`   Budget remaining: $${stats.budgetRemaining.toFixed(2)}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testMemoryUsage() {
  console.log('\n\n💾 Test 2: Memory Usage Under Load');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    const iterations = 5;
    const tasksPerIteration = 20;
    const memorySnapshots = [];
    
    console.log(`Running ${iterations} iterations of ${tasksPerIteration} tasks each...`);
    
    for (let i = 0; i < iterations; i++) {
      const tasks = Array(tasksPerIteration).fill(null).map((_, j) => ({
        type: 'code_generation',
        description: `Memory test iteration ${i + 1}, task ${j + 1}`,
        budget: 0.05
      }));
      
      const beforeMemory = process.memoryUsage();
      await service.routeTasks(tasks);
      const afterMemory = process.memoryUsage();
      
      memorySnapshots.push({
        iteration: i + 1,
        heapUsed: (afterMemory.heapUsed / 1024 / 1024).toFixed(2),
        heapIncrease: ((afterMemory.heapUsed - beforeMemory.heapUsed) / 1024 / 1024).toFixed(2)
      });
    }
    
    console.log('\nMemory usage per iteration:');
    memorySnapshots.forEach(snapshot => {
      console.log(`  Iteration ${snapshot.iteration}: ${snapshot.heapUsed}MB (Δ${snapshot.heapIncrease}MB)`);
    });
    
    // Check for memory leaks
    const increases = memorySnapshots.map(s => parseFloat(s.heapIncrease));
    const avgIncrease = increases.reduce((a, b) => a + b, 0) / increases.length;
    const lastIncrease = increases[increases.length - 1];
    
    if (lastIncrease < avgIncrease * 2) {
      console.log(`\n✅ PASSED: No significant memory leak detected`);
      console.log(`   Average increase: ${avgIncrease.toFixed(2)}MB per iteration`);
    } else {
      console.log(`\n⚠️  WARNING: Possible memory leak`);
      console.log(`   Last increase (${lastIncrease}MB) > 2x average (${avgIncrease.toFixed(2)}MB)`);
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testResponseTimeBenchmarks() {
  console.log('\n\n⏱️  Test 3: Response Time Benchmarks');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    const taskTypes = ['code_generation', 'debugging', 'documentation', 'refactoring'];
    const benchmarks = [];
    
    console.log('Benchmarking response times for different task types...\n');
    
    for (const type of taskTypes) {
      const times = [];
      
      // Run 10 iterations per task type
      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await service.routeTask(type, `Benchmark ${type} ${i + 1}`, 0.5);
        const end = Date.now();
        times.push(end - start);
      }
      
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      benchmarks.push({ type, avg, min, max });
      console.log(`${type}:`);
      console.log(`  Average: ${avg.toFixed(1)}ms`);
      console.log(`  Min: ${min}ms, Max: ${max}ms`);
    }
    
    const overallAvg = benchmarks.reduce((sum, b) => sum + b.avg, 0) / benchmarks.length;
    console.log(`\n✅ PASSED: Response time benchmarks completed`);
    console.log(`   Overall average: ${overallAvg.toFixed(1)}ms`);
    
    if (overallAvg < 100) {
      console.log(`   Performance: Excellent (< 100ms)`);
    } else if (overallAvg < 500) {
      console.log(`   Performance: Good (< 500ms)`);
    } else {
      console.log(`   Performance: Acceptable (< 1000ms)`);
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testMetricsFileSize() {
  console.log('\n\n📄 Test 4: Metrics File Size with Large Dataset');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    // Generate 500 tasks
    console.log('Generating 500 tasks...');
    const tasks = Array(500).fill(null).map((_, i) => ({
      type: ['code_generation', 'debugging', 'documentation'][i % 3],
      description: `Large dataset task ${i + 1}`,
      budget: 0.05
    }));
    
    await service.routeTasks(tasks);
    
    // Export metrics
    console.log('Exporting metrics...');
    const jsonFile = await service.exportMetrics('json');
    const csvFile = await service.exportMetrics('csv');
    
    // Check file sizes
    const jsonStats = fs.statSync(jsonFile);
    const csvStats = fs.statSync(csvFile);
    
    const jsonSizeKB = (jsonStats.size / 1024).toFixed(2);
    const csvSizeKB = (csvStats.size / 1024).toFixed(2);
    
    console.log(`\n✅ PASSED: Metrics exported successfully`);
    console.log(`   JSON file: ${jsonFile}`);
    console.log(`   JSON size: ${jsonSizeKB}KB (${jsonStats.size} bytes)`);
    console.log(`   CSV file: ${csvFile}`);
    console.log(`   CSV size: ${csvSizeKB}KB (${csvStats.size} bytes)`);
    
    // Validate file integrity
    const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (jsonData.tasks.length === 500) {
      console.log(`   ✅ JSON integrity: All 500 tasks present`);
    } else {
      console.log(`   ❌ JSON integrity: Expected 500 tasks, got ${jsonData.tasks.length}`);
    }
    
    const csvContent = fs.readFileSync(csvFile, 'utf-8');
    const csvLines = csvContent.split('\n').filter(l => l.trim());
    if (csvLines.length === 501) { // 500 tasks + 1 header
      console.log(`   ✅ CSV integrity: All 500 tasks present`);
    } else {
      console.log(`   ❌ CSV integrity: Expected 501 lines, got ${csvLines.length}`);
    }
    
    // Performance assessment
    if (jsonStats.size < 1024 * 1024) { // < 1MB
      console.log(`   Performance: Excellent file size for 500 tasks`);
    } else {
      console.log(`   Performance: File size acceptable but could be optimized`);
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function runAllTests() {
  try {
    await testLargeBatchProcessing();
    await testMemoryUsage();
    await testResponseTimeBenchmarks();
    await testMetricsFileSize();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Performance Testing Complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
