/**
 * Test script for Token Optimization Deployment Wrapper
 */

import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper.ts';

console.log('🧪 Testing Token Optimization Deployment Wrapper\n');
console.log('='.repeat(80));

const service = new TokenOptimizationService();

// Test 1: Route a single task
console.log('\n📝 Test 1: Route Single Task');
console.log('-'.repeat(80));
try {
  const result = await service.routeTask(
    'code_generation',
    'Write a TypeScript function to calculate fibonacci numbers',
    0.5
  );
  console.log('✅ Task routed successfully');
  console.log(`   Model: ${result.selectedModel}`);
  console.log(`   Estimated Cost: $${result.estimatedCost.toFixed(4)}`);
  console.log(`   Reasoning: ${result.reasoning.substring(0, 100)}...`);
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 2: Route multiple tasks in parallel
console.log('\n📝 Test 2: Route Multiple Tasks (Batch)');
console.log('-'.repeat(80));
try {
  const tasks = [
    { type: 'code_generation', description: 'Create a React component', budget: 0.3 },
    { type: 'debugging', description: 'Fix memory leak', budget: 0.4 },
    { type: 'documentation', description: 'Write API docs', budget: 0.2 },
    { type: 'refactoring', description: 'Optimize algorithm', budget: 0.5 }
  ];

  const results = await service.routeTasks(tasks);
  console.log(`✅ Routed ${results.length} tasks successfully`);
  
  const totalCost = results.reduce((sum, r) => sum + r.estimatedCost, 0);
  console.log(`   Total Estimated Cost: $${totalCost.toFixed(4)}`);
  
  const modelUsage = {};
  results.forEach(r => {
    modelUsage[r.selectedModel] = (modelUsage[r.selectedModel] || 0) + 1;
  });
  console.log('   Model Distribution:');
  Object.entries(modelUsage).forEach(([model, count]) => {
    console.log(`     - ${model}: ${count} tasks`);
  });
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 3: Get cost statistics
console.log('\n📝 Test 3: Cost Statistics');
console.log('-'.repeat(80));
try {
  const stats = service.getCostStatistics();
  console.log('✅ Cost statistics retrieved');
  console.log(`   Total Tasks: ${stats.totalTasks}`);
  console.log(`   Total Cost: $${stats.totalCost.toFixed(4)}`);
  console.log(`   Average Cost: $${stats.averageCost.toFixed(4)}`);
  console.log(`   Budget Remaining: $${stats.budgetRemaining.toFixed(2)}`);
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 4: Get performance statistics
console.log('\n📝 Test 4: Performance Statistics');
console.log('-'.repeat(80));
try {
  const stats = service.getPerformanceStatistics();
  console.log('✅ Performance statistics retrieved');
  console.log(`   Total Tasks: ${stats.totalTasks}`);
  console.log(`   Average Latency: ${stats.averageLatency.toFixed(0)}ms`);
  console.log(`   Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
  console.log('   Model Usage:');
  Object.entries(stats.modelUsage).forEach(([model, count]) => {
    console.log(`     - ${model}: ${count} tasks`);
  });
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 5: Export metrics (JSON)
console.log('\n📝 Test 5: Export Metrics (JSON)');
console.log('-'.repeat(80));
try {
  const jsonPath = await service.exportMetrics('json');
  console.log('✅ Metrics exported to JSON');
  console.log(`   File: ${jsonPath}`);
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 6: Export metrics (CSV)
console.log('\n📝 Test 6: Export Metrics (CSV)');
console.log('-'.repeat(80));
try {
  const csvPath = await service.exportMetrics('csv');
  console.log('✅ Metrics exported to CSV');
  console.log(`   File: ${csvPath}`);
} catch (error) {
  console.log(`❌ Failed: ${error.message}`);
}

// Test 7: Budget enforcement
console.log('\n📝 Test 7: Budget Enforcement');
console.log('-'.repeat(80));
try {
  // Try to route a task with budget exceeding daily limit
  const result = await service.routeTask(
    'code_generation',
    'Very expensive task',
    15.0 // Exceeds $10 daily limit
  );
  console.log('⚠️  Budget enforcement may not be working - task was routed');
} catch (error) {
  if (error.message.includes('budget') || error.message.includes('limit')) {
    console.log('✅ Budget enforcement working correctly');
    console.log(`   Error: ${error.message}`);
  } else {
    console.log(`❌ Unexpected error: ${error.message}`);
  }
}

// Test 8: Error handling - invalid task type
console.log('\n📝 Test 8: Error Handling (Invalid Task Type)');
console.log('-'.repeat(80));
try {
  const result = await service.routeTask(
    'invalid_task_type',
    'This should fail',
    0.5
  );
  console.log('⚠️  Error handling may not be working - invalid task was routed');
} catch (error) {
  console.log('✅ Error handling working correctly');
  console.log(`   Error: ${error.message}`);
}

console.log('\n' + '='.repeat(80));
console.log('🎉 Testing Complete!');
console.log('='.repeat(80));
