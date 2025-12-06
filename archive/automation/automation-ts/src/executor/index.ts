/**
 * Workflow Execution Engine
 * Executes workflows with support for multiple orchestration patterns
 */

import {
  TaskStatus,
  TaskResult,
  WorkflowContext,
  WorkflowConfig,
  WorkflowStage,
  AgentHandler
} from '../types';

export class WorkflowExecutor {
  private agentHandler: AgentHandler;
  private maxRetries: number;
  private timeoutMs: number;

  constructor(options?: {
    agentHandler?: AgentHandler;
    maxRetries?: number;
    timeoutMs?: number;
  }) {
    // Default agent handler that logs actions (for CLI use)
    this.agentHandler = options?.agentHandler ?? {
      invoke: async (agentId: string, input: Record<string, any>) => {
        console.log(`[Agent] Invoking ${agentId} with input:`, JSON.stringify(input).substring(0, 100));
        return { agentId, status: 'simulated', input };
      }
    };
    this.maxRetries = options?.maxRetries ?? 3;
    this.timeoutMs = options?.timeoutMs ?? 30000;
  }

  async execute(workflow: WorkflowConfig, inputs: Record<string, any> = {}): Promise<WorkflowContext> {
    const context = this.createContext(workflow, inputs);

    console.log(`[Executor] Starting workflow: ${workflow.name || 'unnamed'}`);
    console.log(`[Executor] Pattern: ${workflow.pattern || 'sequential'}`);

    try {
      switch (workflow.pattern) {
        case 'prompt_chaining':
          await this.executeChaining(workflow, context);
          break;
        case 'parallelization':
          await this.executeParallel(workflow, context);
          break;
        case 'routing':
          await this.executeRouting(workflow, context);
          break;
        case 'orchestrator_workers':
          await this.executeOrchestratorWorkers(workflow, context);
          break;
        case 'evaluator_optimizer':
          await this.executeEvaluatorOptimizer(workflow, context);
          break;
        default:
          await this.executeSequential(workflow, context);
      }
    } catch (error) {
      console.error(`[Executor] Workflow failed:`, error);
      throw error;
    }

    return context;
  }

  private createContext(workflow: WorkflowConfig, inputs: Record<string, any>): WorkflowContext {
    const context: WorkflowContext = {
      workflowId: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      inputs,
      outputs: {},
      stageResults: {},
      checkpoints: [],
      startTime: new Date(),

      getStageOutput(stageName: string): any {
        return this.stageResults[stageName]?.output;
      },

      setOutput(key: string, value: any): void {
        this.outputs[key] = value;
      },

      checkpoint(stageName: string): void {
        this.checkpoints.push({
          stage: stageName,
          timestamp: new Date().toISOString(),
          outputs: { ...this.outputs }
        });
      }
    };

    return context;
  }

  private async executeSequential(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    for (const stage of workflow.stages) {
      await this.executeStage(stage, context);
    }
  }

  private async executeChaining(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    let previousOutput: any = context.inputs;

    for (const stage of workflow.stages) {
      // Pass previous output as input to next stage
      const stageInputs = { ...context.inputs, previousOutput };
      const result = await this.executeStage(stage, context, stageInputs);
      previousOutput = result.output;
    }
  }

  private async executeParallel(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    // Group stages by dependencies
    const independentStages = workflow.stages.filter(s => !s.dependsOn || s.dependsOn.length === 0);
    const dependentStages = workflow.stages.filter(s => s.dependsOn && s.dependsOn.length > 0);

    // Execute independent stages in parallel
    await Promise.all(independentStages.map(stage => this.executeStage(stage, context)));

    // Execute dependent stages sequentially (respecting dependencies)
    for (const stage of dependentStages) {
      // Wait for dependencies
      const depsReady = stage.dependsOn?.every(dep => context.stageResults[dep]?.status === TaskStatus.COMPLETED);
      if (depsReady) {
        await this.executeStage(stage, context);
      }
    }
  }

  private async executeRouting(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    // First stage determines routing
    const routerStage = workflow.stages[0];
    const routeResult = await this.executeStage(routerStage, context);

    const selectedRoute = routeResult.output?.route || routeResult.output;

    // Find and execute the matching route stage
    const targetStage = workflow.stages.find(s => s.name === selectedRoute);
    if (targetStage) {
      await this.executeStage(targetStage, context);
    }
  }

  private async executeOrchestratorWorkers(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    // First stage is orchestrator
    const orchestratorStage = workflow.stages[0];
    const plan = await this.executeStage(orchestratorStage, context);

    const tasks = plan.output?.tasks || [];

    // Execute worker stages for each task
    const workerStages = workflow.stages.slice(1);

    for (const task of tasks) {
      const workerStage = workerStages.find(s => s.name === task.worker) || workerStages[0];
      if (workerStage) {
        await this.executeStage(workerStage, context, { task });
      }
    }
  }

  private async executeEvaluatorOptimizer(workflow: WorkflowConfig, context: WorkflowContext): Promise<void> {
    const maxIterations = 5;
    let iteration = 0;
    let satisfied = false;

    while (!satisfied && iteration < maxIterations) {
      iteration++;
      console.log(`[Executor] Evaluator-Optimizer iteration ${iteration}`);

      // Execute all stages
      for (const stage of workflow.stages) {
        await this.executeStage(stage, context);
      }

      // Check success criteria
      satisfied = this.checkSuccessCriteria(workflow, context);
    }
  }

  private async executeStage(
    stage: WorkflowStage,
    context: WorkflowContext,
    additionalInputs: Record<string, any> = {}
  ): Promise<TaskResult> {
    const stageName = stage.name || `stage_${Date.now()}`;
    const startTime = Date.now();

    console.log(`[Executor] Executing stage: ${stageName}`);

    // Check condition
    if (stage.condition) {
      const conditionMet = this.evaluateCondition(stage.condition, context);
      if (!conditionMet) {
        console.log(`[Executor] Skipping stage ${stageName}: condition not met`);
        const result: TaskResult = {
          taskId: stageName,
          status: TaskStatus.CANCELLED,
          durationMs: 0,
          metadata: { skipped: true, reason: 'condition_not_met' }
        };
        context.stageResults[stageName] = result;
        return result;
      }
    }

    // Gather inputs
    const stageInputs: Record<string, any> = { ...additionalInputs };
    for (const inputKey of stage.inputs || []) {
      if (inputKey in context.inputs) {
        stageInputs[inputKey] = context.inputs[inputKey];
      } else if (inputKey in context.outputs) {
        stageInputs[inputKey] = context.outputs[inputKey];
      }
    }

    try {
      // Execute via agent handler
      const output = await this.agentHandler.invoke(
        stage.agent || 'default',
        { action: stage.action || 'execute', ...stageInputs }
      );

      const result: TaskResult = {
        taskId: stageName,
        status: TaskStatus.COMPLETED,
        output,
        durationMs: Date.now() - startTime,
        metadata: { agent: stage.agent }
      };

      context.stageResults[stageName] = result;

      // Store outputs
      for (const outputKey of stage.outputs || []) {
        if (output && typeof output === 'object' && outputKey in output) {
          context.outputs[outputKey] = output[outputKey];
        }
      }

      context.checkpoint(stageName);
      return result;

    } catch (error) {
      const result: TaskResult = {
        taskId: stageName,
        status: TaskStatus.FAILED,
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - startTime,
        metadata: { agent: stage.agent }
      };

      context.stageResults[stageName] = result;
      throw error;
    }
  }

  private evaluateCondition(condition: string, context: WorkflowContext): boolean {
    // Simple condition evaluation
    // Format: "output.key == value" or "stage.status == completed"
    try {
      const [left, op, right] = condition.split(/\s*(==|!=|>|<)\s*/);

      let leftValue: any;
      if (left.startsWith('output.')) {
        leftValue = context.outputs[left.replace('output.', '')];
      } else if (left.startsWith('input.')) {
        leftValue = context.inputs[left.replace('input.', '')];
      } else {
        leftValue = left;
      }

      const rightValue = right.replace(/['"]/g, '');

      switch (op) {
        case '==': return String(leftValue) === rightValue;
        case '!=': return String(leftValue) !== rightValue;
        case '>': return Number(leftValue) > Number(rightValue);
        case '<': return Number(leftValue) < Number(rightValue);
        default: return true;
      }
    } catch {
      return true;
    }
  }

  private checkSuccessCriteria(workflow: WorkflowConfig, context: WorkflowContext): boolean {
    if (!workflow.successCriteria || workflow.successCriteria.length === 0) {
      return true;
    }

    return workflow.successCriteria.every(criterion => {
      return this.evaluateCondition(criterion, context);
    });
  }
}

// Factory function for creating executor with default agent handler
export function createExecutor(agentHandler?: AgentHandler): WorkflowExecutor {
  const defaultHandler: AgentHandler = {
    invoke: async (agentId: string, input: Record<string, any>) => {
      console.log(`[Agent:${agentId}] Input:`, JSON.stringify(input, null, 2));
      return { success: true, agent: agentId, ...input };
    }
  };

  return new WorkflowExecutor({
    agentHandler: agentHandler || defaultHandler
  });
}
