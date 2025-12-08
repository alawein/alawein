/**
 * Dark Theme
 *
 * High-contrast dark theme optimized for readability
 * Uses brighter accents on darker backgrounds
 */

import { lovableColors } from '../tokens/lovable-colors';
import { lovableTypography } from '../tokens/lovable-typography';
import { lovableSpacing, lovableBorderRadius } from '../tokens/lovable-spacing';
import { lovableEffects } from '../tokens/lovable-effects';
import { lovableAnimation } from '../tokens/lovable-animation';

export const darkTheme = {
  name: 'dark',
  label: 'Dark',
  description: 'High-contrast dark theme',

  colors: {
    background: '#000000',
    surface: '#1a1a1a',
    surfaceAlt: '#2d2d2d',

    primary: '#FF9500',
    secondary: lovableColors.primary.plasmaPink,
    tertiary: lovableColors.primary.electronCyan,

    text: '#FFFFFF',
    textSecondary: '#D0D0D0',
    textMuted: '#808080',

    success: '#00D084',
    warning: '#FFA500',
    error: '#FF5555',
    info: '#55DDFF',

    border: '#333333',
    glass: 'rgba(255, 255, 255, 0.05)',
  },

  typography: lovableTypography,
  spacing: lovableSpacing,
  borderRadius: lovableBorderRadius,
  shadows: lovableEffects.shadows,
  blur: lovableEffects.blur,
  animation: lovableAnimation,

  gradients: {
    primary: 'linear-gradient(135deg, #FF9500 0%, #FF6B35 100%)',
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    text: 'linear-gradient(90deg, #FF9500 0%, #FF6B35 100%)',
    card: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
  },

  components: {
    button: {
      primaryBg: '#FF9500',
      primaryText: '#000000',
      hoverGlow: 'linear-gradient(135deg, #FF9500 0%, #FF6B35 100%)',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '#333333',
      shadow: lovableEffects.shadows.md,
    },
    input: {
      background: '#1a1a1a',
      border: '#333333',
      text: '#FFFFFF',
      placeholder: '#808080',
    },
  },
};

export type DarkTheme = typeof darkTheme;
