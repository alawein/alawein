// Simple feature flags system for controlled feature rollout

export interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetGroups?: string[];
  conditions?: FeatureCondition[];
}

export interface FeatureCondition {
  type: 'user' | 'group' | 'property' | 'time' | 'custom';
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'regex';
  field: string;
  value: unknown;
}

export interface UserContext {
  id?: string;
  email?: string;
  groups?: string[];
  properties?: Record<string, unknown>;
}

/**
 * Simple feature flag checker
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  userContext?: UserContext
): boolean {
  // If flag is disabled, return false
  if (!flag.enabled) {
    return false;
  }

  // If no user context, check rollout percentage
  if (!userContext) {
    if (flag.rolloutPercentage === undefined) {
      return true; // Enabled for all if no rollout limit
    }
    return Math.random() * 100 < flag.rolloutPercentage;
  }

  // Check specific user targeting
  if (flag.targetUsers?.includes(userContext.id || '')) {
    return true;
  }

  // Check group targeting
  if (flag.targetGroups && userContext.groups) {
    const hasMatchingGroup = flag.targetGroups.some(group =>
      userContext.groups?.includes(group)
    );
    if (hasMatchingGroup) {
      return true;
    }
  }

  // Check conditions
  if (flag.conditions) {
    return evaluateConditions(flag.conditions, userContext);
  }

  // Check rollout percentage for specific users
  if (flag.rolloutPercentage !== undefined) {
    const hash = hashString(userContext.id || userContext.email || '');
    return (hash % 100) < flag.rolloutPercentage;
  }

  return true;
}

/**
 * Evaluate feature flag conditions
 */
function evaluateConditions(
  conditions: FeatureCondition[],
  userContext: UserContext
): boolean {
  return conditions.every(condition => {
    const fieldValue = getFieldValue(userContext, condition.field);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greater':
        return Number(fieldValue) > Number(condition.value);
      case 'less':
        return Number(fieldValue) < Number(condition.value);
      case 'between':
        const [min, max] = condition.value as [number, number];
        const num = Number(fieldValue);
        return num >= min && num <= max;
      case 'regex':
        return new RegExp(String(condition.value)).test(String(fieldValue));
      default:
        return false;
    }
  });
}

/**
 * Get field value from user context
 */
function getFieldValue(userContext: UserContext, field: string): unknown {
  if (field.includes('.')) {
    const [parent, child] = field.split('.');
    const parentValue = (userContext as any)[parent];
    return parentValue?.[child];
  }
  return (userContext as any)[field];
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
