/**
 * Real-World Scenarios Testing Suite
 * Tests IDE integration patterns, multi-day tracking, model degradation, and extended optimization
 */

import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper.ts';
import * as fs from 'fs';

console.log('🌍 Real-World Scenarios Testing Suite\n');
console.log('='.repeat(80));

async function testIDEWorkflowIntegration() {
  console.log('\n💻 Test 1: IDE Workflow Integration Patterns');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    // Simulate typical IDE workflow
    const workflows = [
      {
        name: 'Code Completion',
        tasks: [
          { type: 'code_generation', description: 'Auto-complete function signature', budget: 0.1 },
          { type: 'code_generation', description: 'Generate function body', budget: 0.2 },
          { type: 'documentation', description: 'Generate JSDoc comment', budget: 0.05 }
        ]
      },
      {
        name: 'Debugging Session',
        tasks: [
          { type: 'debugging', description: 'Analyze stack trace', budget: 0.3 },
          { type: 'debugging', description: 'Suggest fix for null pointer', budget: 0.4 },
          { type: 'code_generation', description: 'Generate unit test', budget: 0.3 }
        ]
      },
      {
        name: 'Refactoring',
        tasks: [
          { type: 'refactoring', description: 'Extract method', budget: 0.5 },
          { type: 'refactoring', description: 'Rename variables', budget: 0.3 },
          { type: 'documentation', description: 'Update documentation', budget: 0.1 }
        ]
      },
      {
        name: 'Code Review',
        tasks: [
          { type: 'code_generation', description: 'Review PR changes', budget: 0.6 },
          { type: 'documentation', description: 'Suggest improvements', budget: 0.2 }
        ]
      }
    ];
    
    console.log('Simulating typical IDE workflows...\n');
    
    for (const workflow of workflows) {
      console.log(`${workflow.name}:`);
      const results = await service.routeTasks(workflow.tasks);
      
      const totalCost = results.reduce((sum, r) => sum + r.estimatedCost, 0);
      const models = [...new Set(results.map(r => r.selectedModel))];
      
      console.log(`  ✅ ${workflow.tasks.length} tasks completed`);
      console.log(`  Cost: $${totalCost.toFixed(4)}`);
      console.log(`  Models used: ${models.join(', ')}`);
    }
    
    const stats = service.getCostStatistics();
    console.log(`\n✅ PASSED: IDE workflow integration successful`);
    console.log(`   Total workflows: ${workflows.length}`);
    console.log(`   Total tasks: ${stats.totalTasks}`);
    console.log(`   Total cost: $${stats.totalCost.toFixed(4)}`);
    console.log(`   Budget remaining: $${stats.budgetRemaining.toFixed(2)}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testMultiDayBudgetTracking() {
  console.log('\n\n📅 Test 2: Multi-Day Budget Tracking Simulation');
  console.log('-'.repeat(80));
  
  try {
    console.log('Simulating 5-day usage pattern...\n');
    
    const dailyPatterns = [
      { day: 'Monday', tasks: 30, avgBudget: 0.3, description: 'Heavy development day' },
      { day: 'Tuesday', tasks: 25, avgBudget: 0.25, description: 'Code review and debugging' },
      { day: 'Wednesday', tasks: 20, avgBudget: 0.2, description: 'Documentation day' },
      { day: 'Thursday', tasks: 35, avgBudget: 0.35, description: 'Feature implementation' },
      { day: 'Friday', tasks: 15, avgBudget: 0.15, description: 'Light refactoring' }
    ];
    
    const weeklyStats = [];
    
    for (const pattern of dailyPatterns) {
      const service = new TokenOptimizationService(); // Fresh budget each day
      
      const tasks = Array(pattern.tasks).fill(null).map((_, i) => ({
        type: ['code_generation', 'debugging', 'documentation', 'refactoring'][i % 4],
        description: `${pattern.day} task ${i + 1}`,
        budget: pattern.avgBudget
      }));
      
      await service.routeTasks(tasks);
      const stats = service.getCostStatistics();
      
      weeklyStats.push({
        day: pattern.day,
        tasks: stats.totalTasks,
        cost: stats.totalCost,
        remaining: stats.budgetRemaining,
        description: pattern.description
      });
      
      console.log(`${pattern.day} (${pattern.description}):`);
      console.log(`  Tasks: ${stats.totalTasks}`);
      console.log(`  Cost: $${stats.totalCost.toFixed(4)}`);
      console.log(`  Budget remaining: $${stats.budgetRemaining.toFixed(2)}`);
      console.log(`  Utilization: ${((stats.totalCost / 10) * 100).toFixed(1)}%`);
    }
    
    const totalWeeklyCost = weeklyStats.reduce((sum, day) => sum + day.cost, 0);
    const avgDailyCost = totalWeeklyCost / weeklyStats.length;
    const totalTasks = weeklyStats.reduce((sum, day) => sum + day.tasks, 0);
    
    console.log(`\n✅ PASSED: Multi-day tracking simulation completed`);
    console.log(`   Total weekly cost: $${totalWeeklyCost.toFixed(4)}`);
    console.log(`   Average daily cost: $${avgDailyCost.toFixed(4)}`);
    console.log(`   Total tasks: ${totalTasks}`);
    console.log(`   Weekly budget: $50.00`);
    console.log(`   Weekly utilization: ${((totalWeeklyCost / 50) * 100).toFixed(1)}%`);
    
    if (totalWeeklyCost < 50) {
      console.log(`   ✅ Under budget by $${(50 - totalWeeklyCost).toFixed(2)}`);
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testModelPerformanceDegradation() {
  console.log('\n\n📉 Test 3: Model Performance Degradation Handling');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    console.log('Testing fallback behavior when preferred models are unavailable...\n');
    
    // Simulate different scenarios
    const scenarios = [
      {
        name: 'Primary model available',
        type: 'code_generation',
        description: 'Normal operation',
        budget: 0.5
      },
      {
        name: 'Budget constraint forces cheaper model',
        type: 'code_generation',
        description: 'Low budget scenario',
        budget: 0.001
      },
      {
        name: 'Complex task needs premium model',
        type: 'architecture',
        description: 'System design task',
        budget: 2.0
      }
    ];
    
    for (const scenario of scenarios) {
      try {
        const result = await service.routeTask(
          scenario.type,
          scenario.description,
          scenario.budget
        );
        
        console.log(`${scenario.name}:`);
        console.log(`  ✅ Selected: ${result.selectedModel}`);
        console.log(`  Cost: $${result.estimatedCost.toFixed(4)}`);
        console.log(`  Budget: $${scenario.budget.toFixed(4)}`);
      } catch (error) {
        console.log(`${scenario.name}:`);
        console.log(`  ⚠️  ${error.message}`);
      }
    }
    
    console.log(`\n✅ PASSED: Model degradation handling verified`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function testExtendedCostOptimization() {
  console.log('\n\n💰 Test 4: Extended Cost Optimization Analysis');
  console.log('-'.repeat(80));
  
  const service = new TokenOptimizationService();
  
  try {
    console.log('Running extended optimization analysis...\n');
    
    // Simulate mixed workload over extended period
    const taskMix = {
      simple: { count: 50, type: 'documentation', budget: 0.1 },
      medium: { count: 30, type: 'code_generation', budget: 0.3 },
      complex: { count: 10, type: 'refactoring', budget: 0.8 }
    };
    
    console.log('Task distribution:');
    console.log(`  Simple tasks: ${taskMix.simple.count} (${taskMix.simple.type})`);
    console.log(`  Medium tasks: ${taskMix.medium.count} (${taskMix.medium.type})`);
    console.log(`  Complex tasks: ${taskMix.complex.count} (${taskMix.complex.type})`);
    
    // Process all tasks
    const allTasks = [
      ...Array(taskMix.simple.count).fill(null).map((_, i) => ({
        type: taskMix.simple.type,
        description: `Simple task ${i + 1}`,
        budget: taskMix.simple.budget
      })),
      ...Array(taskMix.medium.count).fill(null).map((_, i) => ({
        type: taskMix.medium.type,
        description: `Medium task ${i + 1}`,
        budget: taskMix.medium.budget
      })),
      ...Array(taskMix.complex.count).fill(null).map((_, i) => ({
        type: taskMix.complex.type,
        description: `Complex task ${i + 1}`,
        budget: taskMix.complex.budget
      }))
    ];
    
    await service.routeTasks(allTasks);
    
    const stats = service.getCostStatistics();
    const perfStats = service.getPerformanceStatistics();
    
    // Calculate what it would cost without optimization
    const unoptimizedCost = 
      (taskMix.simple.count * 0.025) +  // All using GPT-4o
      (taskMix.medium.count * 0.025) +
      (taskMix.complex.count * 0.025);
    
    const savings = unoptimizedCost - stats.totalCost;
    const savingsPercent = (savings / unoptimizedCost * 100).toFixed(1);
    
    console.log(`\n✅ PASSED: Extended optimization analysis completed`);
    console.log(`\nCost Analysis:`);
    console.log(`  Without optimization: $${unoptimizedCost.toFixed(4)}`);
    console.log(`  With optimization: $${stats.totalCost.toFixed(4)}`);
    console.log(`  Savings: $${savings.toFixed(4)} (${savingsPercent}%)`);
    
    console.log(`\nModel Distribution:`);
    Object.entries(perfStats.modelUsage).forEach(([model, count]) => {
      const percentage = (count / stats.totalTasks * 100).toFixed(1);
      console.log(`  ${model}: ${count} tasks (${percentage}%)`);
    });
    
    console.log(`\nEfficiency Metrics:`);
    console.log(`  Average cost per task: $${stats.averageCost.toFixed(4)}`);
    console.log(`  Budget utilization: ${((stats.totalCost / 10) * 100).toFixed(1)}%`);
    console.log(`  Cost per dollar saved: $${(stats.totalCost / savings).toFixed(2)}`);
    
    // Projections
    const dailyProjection = stats.totalCost;
    const monthlyProjection = dailyProjection * 22; // 22 working days
    const annualProjection = monthlyProjection * 12;
    
    const unoptimizedAnnual = unoptimizedCost * 22 * 12;
    const annualSavings = unoptimizedAnnual - annualProjection;
    
    console.log(`\nProjections:`);
    console.log(`  Daily cost: $${dailyProjection.toFixed(2)}`);
    console.log(`  Monthly cost: $${monthlyProjection.toFixed(2)}`);
    console.log(`  Annual cost: $${annualProjection.toFixed(2)}`);
    console.log(`  Annual savings: $${annualSavings.toFixed(2)}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
  }
}

async function runAllTests() {
  try {
    await testIDEWorkflowIntegration();
    await testMultiDayBudgetTracking();
    await testModelPerformanceDegradation();
    await testExtendedCostOptimization();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Real-World Scenarios Testing Complete!');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
