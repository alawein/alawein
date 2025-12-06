// Core types for the automation system
// Converted from Python dataclasses and enums

export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  BLOCKED = "blocked",
  CANCELLED = "cancelled"
}

export enum Severity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface TaskResult {
  taskId: string;
  status: TaskStatus;
  output?: any;
  error?: string;
  durationMs: number;
  metadata: Record<string, any>;
}

export interface WorkflowContext {
  workflowId: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  stageResults: Record<string, TaskResult>;
  checkpoints: Array<Record<string, any>>;
  startTime: Date;

  getStageOutput(stageName: string): any;
  setOutput(key: string, value: any): void;
  checkpoint(stageName: string): void;
}

export interface ValidationIssue {
  severity: Severity;
  message: string;
  path?: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  target: string;
  issues: ValidationIssue[];

  addError(message: string, path?: string, suggestion?: string): void;
  addWarning(message: string, path?: string, suggestion?: string): void;
  addInfo(message: string, path?: string): void;

  readonly errorCount: number;
  readonly warningCount: number;
}

export interface AgentConfig {
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  llmConfig?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface WorkflowStage {
  name?: string;
  agent?: string;
  action?: string;
  inputs?: string[];
  outputs?: string[];
  dependsOn?: string[];
  condition?: string;
}

export interface WorkflowConfig {
  name?: string;
  pattern?: string;
  description?: string;
  stages: WorkflowStage[];
  successCriteria?: string[];
}

export interface AgentCategory {
  description?: string;
  agents: string[];
}

export interface AgentsConfig {
  version?: string;
  agents: Record<string, AgentConfig>;
  categories: Record<string, AgentCategory>;
}

export interface WorkflowsConfig {
  version?: string;
  workflows: Record<string, WorkflowConfig>;
  categories: Record<string, { description?: string; workflows: string[] }>;
}

export interface OrchestrationConfig {
  version?: string;
  toolRouting: {
    intentExtraction: {
      keywords: Record<string, string[]>;
    };
    rules: Record<string, {
      tools: string[];
      confidenceThreshold?: number;
    }>;
  };
}

export interface TelemetryEvent {
  timestamp: string;
  eventType: string;
  data: Record<string, any>;
}

export interface AgentHandler {
  invoke: (agentId: string, input: Record<string, any>) => Promise<any> | any;
}
