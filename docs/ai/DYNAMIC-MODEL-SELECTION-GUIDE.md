# Dynamic Model Selection Guide

**How to Save Tokens with Intelligent Model Routing**

---

## 🎯 Overview

Yes! You can dynamically change models based on task requirements to optimize token usage and costs. This guide explains how the token optimization system works and how to leverage it across your workflow.

---

## 💡 The Problem

Different AI tasks have different requirements:
- **Simple tasks** (documentation, boilerplate) → Don't need expensive models
- **Complex tasks** (architecture, refactoring) → Benefit from premium models
- **Budget constraints** → Need to stay within daily/monthly limits
- **Performance requirements** → Balance speed vs quality

**Without dynamic routing:** You pay premium prices for all tasks, even simple ones.

**With dynamic routing:** Each task gets the optimal model, saving 60-80% on costs.

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Task Request                             │
│  { type, description, budget, constraints }                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Token Optimization Service                      │
│  • Model Registry (500+ models)                              │
│  • Routing Algorithm (weighted scoring)                      │
│  • Budget Enforcement                                        │
│  • Cost Tracking                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Model Selection                             │
│  Score = Capability×0.4 + Performance×0.3 +                  │
│          Availability×0.2 + Cost×0.1                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Selected Model Execution                        │
│  • GPT-4o Mini (simple tasks)                                │
│  • Claude Sonnet 4 (balanced)                                │
│  • GPT-4o (complex tasks)                                    │
└─────────────────────────────────────────────────────────────┘
```

### Routing Algorithm

The system scores each model based on four factors:

```typescript
Score = (Capability × 0.4) +      // Can it do the task?
        (Performance × 0.3) +      // How well does it perform?
        (Availability × 0.2) +     // Is it reliable?
        (Cost × 0.1)               // How expensive is it?
```

**Example Scoring:**

| Model | Capability | Performance | Availability | Cost | **Total Score** |
|-------|------------|-------------|--------------|------|-----------------|
| GPT-4o | 1.0 | 0.95 | 0.99 | 0.5 | **0.938** |
| Claude Sonnet 4 | 1.0 | 0.93 | 0.98 | 0.7 | **0.942** |
| GPT-4o Mini | 1.0 | 0.85 | 0.99 | 0.985 | **0.950** ✅ |

For simple tasks, GPT-4o Mini wins due to excellent cost efficiency.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Models

Edit `tools/orchex/model_registry.json`:

```json
{
  "id": "gpt-4o-mini",
  "name": "GPT-4o Mini",
  "capabilities": ["code_generation", "debugging", "documentation"],
  "costPer1kTokens": 0.00015,
  "performance": {
    "latency": 1000,
    "quality": 0.85
  },
  "availability": 0.99
}
```

### 3. Set Budget

In `tools/orchex/orchestration/deployment-wrapper.ts`:

```typescript
private dailyBudget: number = 10.0; // $10 per day
```

### 4. Route Tasks

```bash
# Single task
npx tsx tools/orchex/orchestration/deployment-wrapper.ts route \
  code_generation \
  "Create a React component" \
  0.5

# View stats
npx tsx tools/orchex/orchestration/deployment-wrapper.ts stats

# Export metrics
npx tsx tools/orchex/orchestration/deployment-wrapper.ts export json
```

---

## 📊 Cost Savings Examples

### Scenario 1: Documentation Generation

**Without Dynamic Routing:**
- Model: GPT-4o (premium)
- Cost per task: $0.025
- 100 tasks/day: **$2.50/day**

**With Dynamic Routing:**
- Model: GPT-4o Mini (selected automatically)
- Cost per task: $0.0015
- 100 tasks/day: **$0.15/day**

**Savings: 94% ($2.35/day)**

### Scenario 2: Mixed Workload

**Daily Tasks:**
- 50 simple tasks (docs, boilerplate)
- 20 medium tasks (debugging, refactoring)
- 5 complex tasks (architecture, design)

**Without Dynamic Routing:**
- All tasks use GPT-4o
- Total cost: **$1.875/day**

**With Dynamic Routing:**
- Simple → GPT-4o Mini: $0.075
- Medium → Claude Sonnet 4: $0.180
- Complex → GPT-4o: $0.125
- Total cost: **$0.380/day**

**Savings: 80% ($1.495/day)**

### Annual Savings

| Scenario | Without Routing | With Routing | Annual Savings |
|----------|----------------|--------------|----------------|
| Documentation | $912.50 | $54.75 | **$857.75** |
| Mixed Workload | $684.38 | $138.70 | **$545.68** |
| Heavy Usage | $2,737.50 | $547.50 | **$2,190.00** |

---

## 🔧 Integration Patterns

### Pattern 1: IDE Integration

Configure your IDE to use the routing service:

**Cursor/Cline/Windsurf:**
```json
{
  "ai.modelRouter": {
    "enabled": true,
    "endpoint": "http://localhost:3000/route",
    "budget": 10.0
  }
}
```

### Pattern 2: CI/CD Pipeline

```yaml
# .github/workflows/ai-review.yml
- name: AI Code Review
  run: |
    npx tsx tools/orchex/orchestration/deployment-wrapper.ts route \
      code_review \
      "Review PR #${{ github.event.pull_request.number }}" \
      1.0
```

### Pattern 3: Batch Processing

```typescript
import { TokenOptimizationService } from './tools/orchex/orchestration/deployment-wrapper';

const service = new TokenOptimizationService();

const tasks = [
  { type: 'code_generation', description: 'Create API endpoint', budget: 0.5 },
  { type: 'documentation', description: 'Generate README', budget: 0.2 },
  { type: 'refactoring', description: 'Optimize algorithm', budget: 1.0 }
];

// Process 8 tasks concurrently
const results = await service.routeTasks(tasks);

// Track costs
const stats = service.getCostStatistics();
console.log(`Total cost: $${stats.totalCost.toFixed(2)}`);
console.log(`Budget remaining: $${stats.budgetRemaining.toFixed(2)}`);
```

### Pattern 4: Multi-Agent Orchestration

```typescript
// Route different agent tasks to optimal models
const agents = [
  { agent: 'Planner', task: 'architecture', budget: 2.0 },
  { agent: 'Executor', task: 'code_generation', budget: 0.5 },
  { agent: 'Critic', task: 'code_review', budget: 0.3 }
];

for (const { agent, task, budget } of agents) {
  const result = await service.routeTask(task, `${agent} task`, budget);
  console.log(`${agent} → ${result.selectedModel} ($${result.estimatedCost})`);
}
```

---

## 📈 Monitoring & Optimization

### Real-Time Metrics

```bash
# View current statistics
npx tsx tools/orchex/orchestration/deployment-wrapper.ts stats
```

**Output:**
```json
{
  "costStatistics": {
    "totalTasks": 125,
    "totalCost": 0.875,
    "averageCost": 0.007,
    "budgetRemaining": 9.125
  },
  "performanceStatistics": {
    "totalTasks": 125,
    "averageLatency": 1200,
    "successRate": 0.992,
    "modelUsage": {
      "GPT-4o Mini": 85,
      "Claude Sonnet 4": 30,
      "GPT-4o": 10
    }
  }
}
```

### Export for Analysis

```bash
# JSON format (for dashboards)
npx tsx tools/orchex/orchestration/deployment-wrapper.ts export json

# CSV format (for spreadsheets)
npx tsx tools/orchex/orchestration/deployment-wrapper.ts export csv
```

### Optimization Tips

1. **Adjust Weights:** Modify scoring weights based on your priorities
   ```typescript
   const totalScore = 
     capabilityScore * 0.5 +    // Increase if quality is critical
     performanceScore * 0.2 +
     availabilityScore * 0.2 +
     costScore * 0.1;            // Increase to prioritize cost savings
   ```

2. **Set Task-Specific Budgets:**
   ```typescript
   const budgets = {
     documentation: 0.1,
     code_generation: 0.5,
     architecture: 2.0,
     refactoring: 1.0
   };
   ```

3. **Monitor Model Performance:**
   - Track success rates per model
   - Adjust quality scores based on actual performance
   - Remove underperforming models

4. **Implement Fallbacks:**
   ```typescript
   try {
     result = await service.routeTask(type, desc, budget);
   } catch (error) {
     // Fallback to cheaper model if budget exceeded
     result = await service.routeTask(type, desc, budget * 0.5);
   }
   ```

---

## 🎓 Best Practices

### 1. Start Conservative
- Begin with higher budgets
- Monitor actual costs
- Gradually reduce budgets as you understand patterns

### 2. Task Classification
- **Tier 1 (Simple):** Documentation, boilerplate, formatting
- **Tier 2 (Medium):** Debugging, testing, refactoring
- **Tier 3 (Complex):** Architecture, design, optimization

### 3. Budget Allocation
```typescript
const dailyBudget = 10.0;
const allocation = {
  tier1: dailyBudget * 0.2,  // $2 for simple tasks
  tier2: dailyBudget * 0.5,  // $5 for medium tasks
  tier3: dailyBudget * 0.3   // $3 for complex tasks
};
```

### 4. Regular Audits
```bash
# Weekly audit
node quick-audit.js

# Monthly cost review
npx tsx tools/orchex/orchestration/deployment-wrapper.ts export json
```

---

## 🔒 Security & Compliance

### Budget Enforcement
- Hard limits prevent overspending
- Alerts when approaching budget
- Automatic degradation to cheaper models

### Data Privacy
- No sensitive data in model selection
- Task descriptions sanitized
- Metrics anonymized

### Audit Trail
- All routing decisions logged
- Cost tracking per task
- Model performance metrics

---

## 📚 Additional Resources

- [AI Tools Orchestration](./AI-TOOLS-ORCHESTRATION.md)
- [Agents Compendium](../reference/ai-tools/AGENTS_COMPENDIUM.md)
- [LLM Model Catalog](../governance/LLM-MODEL-CATALOG.md)
- [Token Optimization Deployment Summary](../../TOKEN-OPTIMIZATION-DEPLOYMENT-SUMMARY.md)

---

## 🤝 Support

For questions or issues:
1. Check the [deployment summary](../../TOKEN-OPTIMIZATION-DEPLOYMENT-SUMMARY.md)
2. Review test cases in `test-deployment-wrapper.js`
3. Run diagnostics: `npx tsx tools/orchex/orchestration/deployment-wrapper.ts stats`

---

**Last Updated:** December 8, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
