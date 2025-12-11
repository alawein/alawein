/**
 * @file useABTesting.ts
 * @description A/B testing hook for experiment management and variant assignment
 */
import { useState, useEffect, useCallback } from 'react';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  targetPercentage: number;
}

export interface Variant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, unknown>;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  assignedAt: Date;
}

// Predefined experiments for the platform
const EXPERIMENTS: Experiment[] = [
  {
    id: 'pricing-page-layout',
    name: 'Pricing Page Layout',
    description: 'Test different pricing page layouts for conversion',
    status: 'running',
    targetPercentage: 100,
    variants: [
      { id: 'control', name: 'Control', weight: 50, config: { layout: 'grid' } },
      { id: 'variant-a', name: 'Horizontal Cards', weight: 50, config: { layout: 'horizontal' } },
    ],
  },
  {
    id: 'cta-button-color',
    name: 'CTA Button Color',
    description: 'Test primary CTA button colors',
    status: 'running',
    targetPercentage: 100,
    variants: [
      { id: 'control', name: 'Default Blue', weight: 33, config: { color: 'blue' } },
      { id: 'variant-a', name: 'Green', weight: 33, config: { color: 'green' } },
      { id: 'variant-b', name: 'Purple', weight: 34, config: { color: 'purple' } },
    ],
  },
  {
    id: 'onboarding-flow',
    name: 'Onboarding Flow',
    description: 'Test simplified vs detailed onboarding',
    status: 'running',
    targetPercentage: 50,
    variants: [
      { id: 'control', name: 'Full Onboarding', weight: 50, config: { steps: 4 } },
      { id: 'variant-a', name: 'Quick Start', weight: 50, config: { steps: 2 } },
    ],
  },
];

const STORAGE_KEY = 'ab_test_assignments';

/** Get or create a stable user ID for experiment assignment */
function getUserId(): string {
  const storageKey = 'ab_test_user_id';
  let userId = localStorage.getItem(storageKey);
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(storageKey, userId);
  }
  return userId;
}

/** Deterministic hash function for consistent variant assignment */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** Assign a variant based on user ID and experiment */
function assignVariant(userId: string, experiment: Experiment): Variant {
  const hash = hashString(userId + '_' + experiment.id);
  const normalizedHash = (hash % 100) / 100;
  
  let cumulativeWeight = 0;
  for (const variant of experiment.variants) {
    cumulativeWeight += variant.weight / 100;
    if (normalizedHash < cumulativeWeight) {
      return variant;
    }
  }
  
  return experiment.variants[experiment.variants.length - 1];
}

export function useABTesting() {
  const [assignments, setAssignments] = useState<Map<string, ExperimentAssignment>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, ExperimentAssignment>();
        Object.entries(parsed).forEach(([key, value]) => {
          map.set(key, value as ExperimentAssignment);
        });
        setAssignments(map);
      }
    } catch (error) {
      console.error('Failed to load A/B test assignments:', error);
    }
    setIsLoaded(true);
  }, []);

  const saveAssignments = useCallback((newAssignments: Map<string, ExperimentAssignment>) => {
    const obj: Record<string, ExperimentAssignment> = {};
    newAssignments.forEach((value, key) => { obj[key] = value; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }, []);

  const getVariant = useCallback((experimentId: string): Variant | null => {
    const experiment = EXPERIMENTS.find(e => e.id === experimentId);
    if (!experiment || experiment.status !== 'running') return null;
    const userId = getUserId();
    const targetHash = hashString(userId + '_' + experimentId + '_target') % 100;
    if (targetHash >= experiment.targetPercentage) return null;
    const existing = assignments.get(experimentId);
    if (existing) {
      const variant = experiment.variants.find(v => v.id === existing.variantId);
      if (variant) return variant;
    }
    const variant = assignVariant(userId, experiment);
    const newAssignment: ExperimentAssignment = { experimentId, variantId: variant.id, assignedAt: new Date() };
    const newAssignments = new Map(assignments);
    newAssignments.set(experimentId, newAssignment);
    setAssignments(newAssignments);
    saveAssignments(newAssignments);
    return variant;
  }, [assignments, saveAssignments]);

  const trackConversion = useCallback((experimentId: string, eventName: string, value?: number) => {
    const assignment = assignments.get(experimentId);
    if (!assignment) return;
    console.log('A/B Test Conversion:', { experimentId, variantId: assignment.variantId, eventName, value, timestamp: new Date().toISOString() });
  }, [assignments]);

  const getExperiments = useCallback(() => EXPERIMENTS, []);
  const getExperiment = useCallback((id: string) => EXPERIMENTS.find(e => e.id === id), []);

  return { getVariant, trackConversion, getExperiments, getExperiment, isLoaded, assignments: Array.from(assignments.values()) };
}

export default useABTesting;

