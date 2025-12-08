/**
 * Feature Flag Evaluator - Evaluation logic
 */

export interface EvaluationContext {
  userId?: string;
  attributes?: Record<string, unknown>;
}

export class FeatureFlagEvaluator {
  evaluate(flagKey: string, context?: EvaluationContext): boolean {
    // Default implementation - override for custom logic
    return false;
  }

  evaluateVariant<T>(flagKey: string, context?: EvaluationContext): T | undefined {
    return undefined;
  }
}
