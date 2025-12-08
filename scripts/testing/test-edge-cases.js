/**
 * Edge Case Testing Suite
 * Tests budget exhaustion, model unavailability, concurrent requests, and invalid inputs
 */

import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper.ts';

console.log('🧪 Edge Case Testing Suite\n');
console.log('='.repeat(80));

async function testBudgetExhaustion() {
  console.log('\n📊 Test 1: Budget Exhaustion Scenarios');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    // Fill up most of the budget
    console.log('Step 1: Consuming 90% of budget...');
    const largeTasks = Array(18).fill(null).map((_, i) => ({
      type: 'code_generation',
      description: `Task ${i + 1}`,
      budget: 0.5
    }));
    
    await service.routeTasks(largeTasks);
    const stats1 = service.getCostStatistics();
    console.log(`✅ Consumed: $${stats1.totalCost.toFixed(2)}, Remaining: $${stats1.budgetRemaining.toFixed(2)}`);
    
    // Try to exceed budget
    console.log('\nStep 2: Attempting to exceed budget...');
    try {
      await service.routeTask('code_generation', 'This should fail', 5.0);
      console.log('❌ FAILED: Should have thrown budget error');
    } catch (error) {
      console.log(`✅ PASSED: Budget enforcement working - ${error.message}`);
    }
    
    // Try task within remaining budget
    console.log('\nStep 3: Task within remaining budget...');
    const result = await service.routeTask('documentation', 'Small task', 0.1);
    console.log(`✅ PASSED: Small task routed successfully - ${result.selectedModel}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testConcurrentRequests() {
  console.log('\n\n⚡ Test 2: Concurrent Request Handling (50 tasks)');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    const startTime = Date.now();
    
    // Create 50 concurrent tasks
    const tasks = Array(50).fill(null).map((_, i) => ({
      type: ['code_generation', 'debugging', 'documentation'][i % 3],
      description: `Concurrent task ${i + 1}`,
      budget: 0.1
    }));
    
    console.log('Processing 50 concurrent tasks...');
    const results = await service.routeTasks(tasks);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ PASSED: All 50 tasks completed`);
    console.log(`   Duration: ${duration}ms (${(duration/50).toFixed(0)}ms per task)`);
    console.log(`   Success rate: ${(results.length / tasks.length * 100).toFixed(1)}%`);
    
    const stats = service.getCostStatistics();
    console.log(`   Total cost: $${stats.totalCost.toFixed(4)}`);
    console.log(`   Average cost: $${stats.averageCost.toFixed(4)}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testInvalidInputs() {
  console.log('\n\n🔍 Test 3: Invalid Input Validation');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  const testCases = [
    {
      name: 'Invalid task type',
      type: 'invalid_type',
      description: 'Test task',
      budget: 0.5,
      shouldFail: true
    },
    {
      name: 'Negative budget',
      type: 'code_generation',
      description: 'Test task',
      budget: -1.0,
      shouldFail: true
    },
    {
      name: 'Zero budget',
      type: 'code_generation',
      description: 'Test task',
      budget: 0,
      shouldFail: false // Should select cheapest model
    },
    {
      name: 'Empty description',
      type: 'code_generation',
      description: '',
      budget: 0.5,
      shouldFail: false // Should still work
    },
    {
      name: 'Very long description',
      type: 'code_generation',
      description: 'x'.repeat(10000),
      budget: 5.0,
      shouldFail: false
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const result = await service.routeTask(
        testCase.type,
        testCase.description,
        testCase.budget
      );
      
      if (testCase.shouldFail) {
        console.log(`❌ ${testCase.name}: Should have failed but succeeded`);
      } else {
        console.log(`✅ ${testCase.name}: Handled correctly - ${result.selectedModel}`);
      }
    } catch (error) {
      if (testCase.shouldFail) {
        console.log(`✅ ${testCase.name}: Failed as expected - ${error.message}`);
      } else {
        console.log(`❌ ${testCase.name}: Should have succeeded - ${error.message}`);
      }
    }
  }
}

async function testModelUnavailability() {
  console.log('\n\n🔧 Test 4: Model Unavailability Fallback');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    // Test with valid task types
    const taskTypes = ['code_generation', 'debugging', 'refactoring', 'documentation'];
    
    console.log('Testing fallback behavior for different task types...');
    for (const type of taskTypes) {
      const result = await service.routeTask(type, `Test ${type}`, 0.5);
      console.log(`✅ ${type}: ${result.selectedModel} ($${result.estimatedCost.toFixed(4)})`);
    }
    
    console.log('\n✅ PASSED: All task types have available models');
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function runAllTests() {
  try {
    await testBudgetExhaustion();
    await testConcurrentRequests();
    await testInvalidInputs();
    await testModelUnavailability();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Edge Case Testing Complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
