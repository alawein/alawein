/**
 * Quantum Theme
 *
 * Primary theme featuring quantum spectrum colors
 * Deep space backgrounds with glowing accents
 * Perfect for scientific, technical, and premium brands
 */

import { lovableColors } from '../tokens/lovable-colors';
import { lovableTypography } from '../tokens/lovable-typography';
import { lovableSpacing, lovableBorderRadius } from '../tokens/lovable-spacing';
import { lovableEffects } from '../tokens/lovable-effects';
import { lovableAnimation } from '../tokens/lovable-animation';

export const quantumTheme = {
  name: 'quantum',
  label: 'Quantum',
  description: 'Physics-inspired quantum spectrum theme',

  // Colors
  colors: {
    background: lovableColors.backgrounds.voidStart,
    surface: lovableColors.backgrounds.voidMid,
    surfaceAlt: lovableColors.backgrounds.voidEnd,

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

    border: lovableColors.surfaces.cardBorder,
    glass: lovableColors.surfaces.glass,
  },

  // Typography
  typography: lovableTypography,

  // Spacing
  spacing: lovableSpacing,
  borderRadius: lovableBorderRadius,

  // Effects
  shadows: lovableEffects.shadows,
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
      primaryBg: lovableColors.primary.quantumPurple,
      primaryText: lovableColors.text.primary,
      hoverGlow: lovableColors.gradients.buttonGradient,
    },
    card: {
      background: `rgba(168, 85, 247, 0.05)`,
      border: lovableColors.surfaces.cardBorder,
      shadow: lovableEffects.shadows.glowPurple,
    },
    input: {
      background: lovableColors.backgrounds.voidMid,
      border: lovableColors.surfaces.cardBorder,
      text: lovableColors.text.primary,
      placeholder: lovableColors.text.muted,
    },
  },
};

export type QuantumTheme = typeof quantumTheme;
