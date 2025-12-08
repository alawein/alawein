/**
 * Token Optimization System - Live Demo
 */

import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper.ts';

console.log('🚀 Token Optimization System - Live Demo\n');
console.log('='.repeat(80));

const service = new TokenOptimizationService();

async function runDemo() {
  try {
    console.log('\n📋 Demo Tasks:');
    console.log('-'.repeat(80));
    
    const tasks = [
      { type: 'documentation', description: 'Generate API documentation for REST endpoints', budget: 0.2 },
      { type: 'code_generation', description: 'Create React authentication component', budget: 0.5 },
      { type: 'debugging', description: 'Fix memory leak in data processing pipeline', budget: 0.3 },
      { type: 'refactoring', description: 'Optimize database query performance', budget: 1.0 },
      { type: 'code_generation', description: 'Implement WebSocket real-time updates', budget: 0.8 }
    ];

    console.log(`\nProcessing ${tasks.length} tasks...\n`);

    // Route tasks
    const results = await service.routeTasks(tasks);

    // Display results
    console.log('✅ Routing Results:');
    console.log('-'.repeat(80));
    results.forEach((result, i) => {
      console.log(`\n${i + 1}. ${tasks[i].type.toUpperCase()}`);
      console.log(`   Task: ${tasks[i].description}`);
      console.log(`   Selected Model: ${result.selectedModel}`);
      console.log(`   Estimated Cost: $${result.estimatedCost.toFixed(4)}`);
      console.log(`   Budget: $${tasks[i].budget.toFixed(2)}`);
    });

    // Cost statistics
    console.log('\n\n💰 Cost Statistics:');
    console.log('-'.repeat(80));
    const costStats = service.getCostStatistics();
    console.log(`Total Tasks: ${costStats.totalTasks}`);
    console.log(`Total Cost: $${costStats.totalCost.toFixed(4)}`);
    console.log(`Average Cost: $${costStats.averageCost.toFixed(4)}`);
    console.log(`Budget Remaining: $${costStats.budgetRemaining.toFixed(2)}`);

    // Performance statistics
    console.log('\n\n📊 Performance Statistics:');
    console.log('-'.repeat(80));
    const perfStats = service.getPerformanceStatistics();
    console.log(`Total Tasks: ${perfStats.totalTasks}`);
    console.log(`Average Latency: ${perfStats.averageLatency}ms`);
    console.log(`Success Rate: ${(perfStats.successRate * 100).toFixed(1)}%`);
    console.log('\nModel Usage:');
    Object.entries(perfStats.modelUsage).forEach(([model, count]) => {
      const percentage = ((count / perfStats.totalTasks) * 100).toFixed(1);
      console.log(`  - ${model}: ${count} tasks (${percentage}%)`);
    });

    // Cost savings calculation
    console.log('\n\n💡 Cost Savings Analysis:');
    console.log('-'.repeat(80));
    const premiumCost = tasks.length * 0.025; // If all used GPT-4o
    const actualCost = costStats.totalCost;
    const savings = premiumCost - actualCost;
    const savingsPercent = ((savings / premiumCost) * 100).toFixed(1);
    
    console.log(`Without Dynamic Routing (all GPT-4o): $${premiumCost.toFixed(4)}`);
    console.log(`With Dynamic Routing: $${actualCost.toFixed(4)}`);
    console.log(`Savings: $${savings.toFixed(4)} (${savingsPercent}%)`);
    console.log(`\nAnnual Savings (at this rate): $${(savings * 365).toFixed(2)}`);

    // Export metrics
    console.log('\n\n📄 Exporting Metrics:');
    console.log('-'.repeat(80));
    const jsonFile = await service.exportMetrics('json');
    const csvFile = await service.exportMetrics('csv');
    console.log(`✅ JSON: ${jsonFile}`);
    console.log(`✅ CSV: ${csvFile}`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Demo Complete!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

runDemo();
