// Unified Project Types for AlaweinOS Platforms

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  version: string;
  status: 'active' | 'development' | 'beta' | 'deprecated';
  category: ProjectCategory;
  features: string[];
  techStack: TechStack;
  theme: ProjectTheme;
  routes: ProjectRoute[];
  apiEndpoints?: APIEndpoint[];
}

export type ProjectCategory =
  | 'scientific-computing'
  | 'enterprise-automation'
  | 'ai-research'
  | 'optimization'
  | 'quantum-mechanics'
  | 'portfolio';

export interface TechStack {
  frontend: string[];
  backend: string[];
  infrastructure: string[];
  databases?: string[];
}

export interface ProjectTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  gradient?: string;
}

export interface ProjectRoute {
  path: string;
  name: string;
  description: string;
  isProtected?: boolean;
  icon?: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requiresAuth?: boolean;
}

// Platform-specific types
export interface SimCoreProject extends Project {
  simulationTypes: string[];
  algorithms: string[];
}

export interface MEZANProject extends Project {
  workflowTypes: string[];
  integrations: string[];
}

export interface TalAIProject extends Project {
  models: string[];
  researchAreas: string[];
}

export interface OptiLibriaProject extends Project {
  algorithmCount: number;
  problemTypes: string[];
}

export interface QMLabProject extends Project {
  quantumSystems: string[];
  visualizations: string[];
}
