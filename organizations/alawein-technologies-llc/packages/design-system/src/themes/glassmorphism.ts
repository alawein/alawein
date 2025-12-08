/**
 * Glassmorphism Theme
 *
 * Modern glassmorphism aesthetic with frosted glass effects
 * Semi-transparent surfaces with blur backdrop
 * Great for contemporary, elegant, and premium interfaces
 */

import { lovableColors } from '../tokens/lovable-colors';
import { lovableTypography } from '../tokens/lovable-typography';
import { lovableSpacing, lovableBorderRadius } from '../tokens/lovable-spacing';
import { lovableEffects } from '../tokens/lovable-effects';
import { lovableAnimation } from '../tokens/lovable-animation';

export const glassmorphismTheme = {
  name: 'glassmorphism',
  label: 'Glassmorphism',
  description: 'Modern frosted glass aesthetic with transparency',

  // Colors
  colors: {
    background: lovableColors.backgrounds.voidStart,
    surface: 'rgba(26, 27, 61, 0.7)', // Semi-transparent
    surfaceAlt: 'rgba(42, 27, 77, 0.5)',

    primary: lovableColors.primary.quantumPurple,
    secondary: lovableColors.primary.plasmaPink,
    tertiary: lovableColors.primary.electronCyan,

    text: lovableColors.text.primary,
    textSecondary: lovableColors.text.secondary,
    textMuted: lovableColors.text.muted,

    success: lovableColors.status.success,
    warning: lovableColors.status.warning,
    error: lovableColors.status.error,
    info: lovableColors.status.info,

    border: 'rgba(255, 255, 255, 0.08)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },

  // Typography
  typography: lovableTypography,

  // Spacing
  spacing: lovableSpacing,
  borderRadius: lovableBorderRadius,

  // Effects
  shadows: {
    ...lovableEffects.shadows,
    default: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    sm: '0 2px 8px 0 rgba(31, 38, 135, 0.1)',
    lg: '0 16px 64px 0 rgba(31, 38, 135, 0.5)',
  },
  blur: lovableEffects.blur,

  // Animation
  animation: lovableAnimation,

  // Gradients
  gradients: {
    primary: lovableColors.gradients.buttonGradient,
    background: lovableColors.gradients.bgGradient,
    text: lovableColors.gradients.textGradient,
    card: lovableColors.gradients.cardGradient,
  },

  // Component-specific settings
  components: {
    button: {
      primaryBg: 'rgba(168, 85, 247, 0.2)',
      primaryBgHover: 'rgba(168, 85, 247, 0.3)',
      primaryText: lovableColors.text.primary,
      hoverGlow: lovableColors.gradients.buttonGradient,
      backdrop: lovableEffects.blur.glass,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdrop: lovableEffects.blur.glass,
      border: 'rgba(255, 255, 255, 0.15)',
      shadow: lovableEffects.shadows.default,
    },
    input: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdrop: lovableEffects.blur.md,
      border: 'rgba(255, 255, 255, 0.08)',
      text: lovableColors.text.primary,
      placeholder: lovableColors.text.muted,
    },
  },
};

export type GlassmorphismTheme = typeof glassmorphismTheme;
