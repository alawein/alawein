/**
 * Automation TypeScript Library
 * Main entry point for programmatic usage
 */

// Types
export * from './types';

// Utils
export * from './utils/file';

// Executor
export { WorkflowExecutor, createExecutor } from './executor';

// Validation
export { AssetValidator, printValidationResults } from './validation';

// Deployment
export { DeploymentManager } from './deployment';

// Crews
export { CrewManager } from './crews';

// Version
export const VERSION = '1.0.0';
