// Automation-related types

export interface Prompt {
  id: string;
  name: string;
  content: string;
  category: 'system' | 'project' | 'task';
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'prompt' | 'agent' | 'tool';
  config: Record<string, any>;
}
