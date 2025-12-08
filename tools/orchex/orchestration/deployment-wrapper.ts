/**
 * Token Optimization Deployment Wrapper
 * Provides CLI interface and metrics tracking for dynamic model routing
 */

import * as fs from 'fs';
import * as path from 'path';

interface Task {
  type: string;
  description: string;
  budget: number;
}

interface RoutingResult {
  selectedModel: string;
  estimatedCost: number;
  reasoning: string;
  timestamp: Date;
}

interface CostStatistics {
  totalTasks: number;
  totalCost: number;
  averageCost: number;
  budgetRemaining: number;
}

interface PerformanceStatistics {
  totalTasks: number;
  averageLatency: number;
  successRate: number;
  modelUsage: Record<string, number>;
}

export class TokenOptimizationService {
  private dailyBudget: number = 10.0; // $10 default
  private totalCost: number = 0;
  private tasks: RoutingResult[] = [];
  private modelRegistry: any[] = [];

  constructor() {
    this.loadModelRegistry();
  }

  /**
   * Load model registry
   */
  private loadModelRegistry(): void {
    try {
      const registryPath = path.join(process.cwd(), 'tools/orchex/model_registry.json');
      if (fs.existsSync(registryPath)) {
        const data = fs.readFileSync(registryPath, 'utf-8');
        this.modelRegistry = JSON.parse(data);
      } else {
        // Default models if registry doesn't exist
        this.modelRegistry = [
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            capabilities: ['code_generation', 'debugging', 'refactoring', 'documentation'],
            costPer1kTokens: 0.005,
            performance: { latency: 2000, quality: 0.95 },
            availability: 0.99
          },
          {
            id: 'claude-sonnet-4',
            name: 'Claude Sonnet 4',
            capabilities: ['code_generation', 'debugging', 'refactoring', 'documentation'],
            costPer1kTokens: 0.003,
            performance: { latency: 1500, quality: 0.93 },
            availability: 0.98
          },
          {
            id: 'gpt-4o-mini',
            name: 'GPT-4o Mini',
            capabilities: ['code_generation', 'debugging', 'documentation'],
            costPer1kTokens: 0.00015,
            performance: { latency: 1000, quality: 0.85 },
            availability: 0.99
          }
        ];
      }
    } catch (error) {
      console.error('Failed to load model registry:', error);
      this.modelRegistry = [];
    }
  }

  /**
   * Route a single task to the optimal model
   */
  async routeTask(type: string, description: string, budget: number): Promise<RoutingResult> {
    // Validate budget
    if (budget < 0) {
      throw new Error(`Invalid budget: Budget cannot be negative (${budget})`);
    }
    
    // Check budget
    if (this.totalCost + budget > this.dailyBudget) {
      throw new Error(`Budget exceeded: $${this.totalCost.toFixed(2)} + $${budget.toFixed(2)} > $${this.dailyBudget.toFixed(2)}`);
    }

    // Filter models by capability
    const capableModels = this.modelRegistry.filter(m => 
      m.capabilities.includes(type)
    );

    if (capableModels.length === 0) {
      throw new Error(`No models available for task type: ${type}`);
    }

    // Score models using weighted algorithm
    const scoredModels = capableModels.map(model => {
      const capabilityScore = model.capabilities.includes(type) ? 1.0 : 0.0;
      const performanceScore = model.performance.quality;
      const availabilityScore = model.availability;
      const costScore = 1 - (model.costPer1kTokens / 0.01); // Normalize to 0-1

      const totalScore = 
        capabilityScore * 0.4 +
        performanceScore * 0.3 +
        availabilityScore * 0.2 +
        costScore * 0.1;

      return {
        model,
        score: totalScore,
        estimatedCost: model.costPer1kTokens * (description.length / 4) * 2 // Rough estimate
      };
    });

    // Sort by score (descending)
    scoredModels.sort((a, b) => b.score - a.score);

    // Select best model within budget
    const selected = scoredModels.find(sm => sm.estimatedCost <= budget) || scoredModels[scoredModels.length - 1];

    const result: RoutingResult = {
      selectedModel: selected.model.name,
      estimatedCost: selected.estimatedCost,
      reasoning: `Selected ${selected.model.name} (score: ${selected.score.toFixed(2)}) for ${type} task. ` +
                `Cost: $${selected.estimatedCost.toFixed(4)}, Quality: ${selected.model.performance.quality}, ` +
                `Latency: ${selected.model.performance.latency}ms`,
      timestamp: new Date()
    };

    // Track cost
    this.totalCost += result.estimatedCost;
    this.tasks.push(result);

    return result;
  }

  /**
   * Route multiple tasks in parallel
   */
  async routeTasks(tasks: Task[]): Promise<RoutingResult[]> {
    const batchSize = 8; // Process 8 tasks concurrently
    const results: RoutingResult[] = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(task => this.routeTask(task.type, task.description, task.budget))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Get cost statistics
   */
  getCostStatistics(): CostStatistics {
    return {
      totalTasks: this.tasks.length,
      totalCost: this.totalCost,
      averageCost: this.tasks.length > 0 ? this.totalCost / this.tasks.length : 0,
      budgetRemaining: this.dailyBudget - this.totalCost
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStatistics(): PerformanceStatistics {
    const modelUsage: Record<string, number> = {};
    
    this.tasks.forEach(task => {
      modelUsage[task.selectedModel] = (modelUsage[task.selectedModel] || 0) + 1;
    });

    return {
      totalTasks: this.tasks.length,
      averageLatency: 1500, // Placeholder - would track actual latency
      successRate: 1.0, // Placeholder - would track failures
      modelUsage
    };
  }

  /**
   * Export metrics to file
   */
  async exportMetrics(format: 'json' | 'csv'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `metrics-${timestamp}.${format}`;
    const filepath = path.join(process.cwd(), filename);

    if (format === 'json') {
      const data = {
        costStatistics: this.getCostStatistics(),
        performanceStatistics: this.getPerformanceStatistics(),
        tasks: this.tasks
      };
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    } else {
      // CSV format
      const headers = 'Model,Cost,Timestamp,Reasoning\n';
      const rows = this.tasks.map(task => 
        `"${task.selectedModel}",${task.estimatedCost},"${task.timestamp.toISOString()}","${task.reasoning.replace(/"/g, '""')}"`
      ).join('\n');
      fs.writeFileSync(filepath, headers + rows);
    }

    return filepath;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new TokenOptimizationService();
  const command = process.argv[2];

  switch (command) {
    case 'route':
      const type = process.argv[3];
      const description = process.argv[4];
      const budget = parseFloat(process.argv[5]);
      
      service.routeTask(type, description, budget)
        .then(result => {
          console.log(JSON.stringify(result, null, 2));
        })
        .catch(error => {
          console.error('Error:', error.message);
          process.exit(1);
        });
      break;

    case 'stats':
      console.log('Cost Statistics:');
      console.log(JSON.stringify(service.getCostStatistics(), null, 2));
      console.log('\nPerformance Statistics:');
      console.log(JSON.stringify(service.getPerformanceStatistics(), null, 2));
      break;

    case 'export':
      const format = (process.argv[3] || 'json') as 'json' | 'csv';
      service.exportMetrics(format)
        .then(filepath => {
          console.log(`Metrics exported to: ${filepath}`);
        })
        .catch(error => {
          console.error('Error:', error.message);
          process.exit(1);
        });
      break;

    default:
      console.log('Usage:');
      console.log('  node deployment-wrapper.js route <type> <description> <budget>');
      console.log('  node deployment-wrapper.js stats');
      console.log('  node deployment-wrapper.js export [json|csv]');
      process.exit(1);
  }
}

export default TokenOptimizationService;
