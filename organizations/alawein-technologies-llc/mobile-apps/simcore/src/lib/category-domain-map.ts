// Centralized Category → Domain mapping utilities
// Keep exactly one source of truth for both theme domains and sidebar group domains

import type { PhysicsDomain } from '@/lib/domain-theme-controller';

export type ThemeDomain = PhysicsDomain; // 'quantum' | 'statistical' | 'energy' | 'fields'
export type GroupDomain = 'Physics' | 'Mathematics' | 'Scientific ML' | 'Advanced';

// Map UI categories to theme domains used by DomainThemeProvider
const CATEGORY_THEME_DOMAIN_MAP: Record<string, ThemeDomain> = {
  'Band Structure': 'quantum',
  'Quantum Dynamics': 'quantum',
  'Statistical Physics': 'statistical',
  'Materials & Crystals': 'fields',
  'Spin & Magnetism': 'fields',
  'Field Theory': 'fields',
  'Mathematical Methods': 'fields',
  // Scientific ML subfields
  'Physics-Informed Models': 'energy',
  'Operator Learning': 'energy',
  'Symbolic Regression': 'energy',
  'Analytics & Patterns': 'energy',
  'Machine Learning': 'energy',
  'Scientific ML': 'energy',
  // Fallbacks for any future categories can be added here
};

// Map UI categories to top-level sidebar grouping domains
const CATEGORY_GROUP_DOMAIN_MAP: Record<string, GroupDomain> = {
  'Band Structure': 'Physics',
  'Quantum Dynamics': 'Physics',
  'Materials & Crystals': 'Physics',
  'Spin & Magnetism': 'Physics',
  'Statistical Physics': 'Physics',
  'Field Theory': 'Mathematics',
  'Mathematical Methods': 'Mathematics',
  // Scientific ML subfields
  'Physics-Informed Models': 'Scientific ML',
  'Operator Learning': 'Scientific ML',
  'Symbolic Regression': 'Scientific ML',
  'Analytics & Patterns': 'Scientific ML',
  'Scientific ML': 'Scientific ML',
  'Machine Learning': 'Scientific ML',
  'Advanced Features': 'Advanced',
};

// Primary export (for theming)
export function categoryToDomain(category: string): ThemeDomain {
  return CATEGORY_THEME_DOMAIN_MAP[category] ?? 'quantum';
}

// Explicit helpers
export function categoryToThemeDomain(category: string): ThemeDomain {
  return categoryToDomain(category);
}

export function categoryToGroupDomain(category: string): GroupDomain {
  return CATEGORY_GROUP_DOMAIN_MAP[category] ?? 'Physics';
}

// Optionally expose maps for testing
export const __CATEGORY_THEME_DOMAIN_MAP = CATEGORY_THEME_DOMAIN_MAP;
export const __CATEGORY_GROUP_DOMAIN_MAP = CATEGORY_GROUP_DOMAIN_MAP;
