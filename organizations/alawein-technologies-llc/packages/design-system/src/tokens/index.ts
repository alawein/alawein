/**
 * Lovable Design Tokens
 *
 * Complete token system for Alawein Design System
 * Includes colors, typography, spacing, effects, and animations
 */

export * from './lovable-colors';
export * from './lovable-typography';
export * from './lovable-spacing';
export * from './lovable-effects';
export * from './lovable-animation';

// Aggregated tokens object
import { lovableColors } from './lovable-colors';
import { lovableTypography } from './lovable-typography';
import { lovableSpacing, lovableBorderRadius } from './lovable-spacing';
import { lovableEffects } from './lovable-effects';
import { lovableAnimation } from './lovable-animation';

export const allLovableTokens = {
  colors: lovableColors,
  typography: lovableTypography,
  spacing: lovableSpacing,
  borderRadius: lovableBorderRadius,
  effects: lovableEffects,
  animation: lovableAnimation,
};

export type AllLovableTokens = typeof allLovableTokens;
