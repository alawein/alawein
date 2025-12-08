/**
 * Light Theme
 *
 * Clean light theme with soft, welcoming aesthetics
 * Perfect for productivity and clarity
 */

import { lovableColors } from '../tokens/lovable-colors';
import { lovableTypography } from '../tokens/lovable-typography';
import { lovableSpacing, lovableBorderRadius } from '../tokens/lovable-spacing';
import { lovableEffects } from '../tokens/lovable-effects';
import { lovableAnimation } from '../tokens/lovable-animation';

export const lightTheme = {
  name: 'light',
  label: 'Light',
  description: 'Clean light theme with soft aesthetics',

  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F7',
    surfaceAlt: '#EBEBF0',

    primary: '#8B5CF6',
    secondary: '#D946EF',
    tertiary: '#0EA5E9',

    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    border: '#E5E7EB',
    glass: 'rgba(255, 255, 255, 0.7)',
  },

  typography: lovableTypography,
  spacing: lovableSpacing,
  borderRadius: lovableBorderRadius,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glowPurple: '0 0 20px rgba(139, 92, 246, 0.15)',
    glowCyan: '0 0 20px rgba(6, 182, 212, 0.15)',
  },
  blur: {
    sm: 'blur(4px)',
    default: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
  },
  animation: lovableAnimation,

  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)',
    text: 'linear-gradient(90deg, #8B5CF6 0%, #D946EF 100%)',
    card: 'linear-gradient(135deg, #F5F5F7 0%, #EBEBF0 100%)',
  },

  components: {
    button: {
      primaryBg: '#8B5CF6',
      primaryText: '#FFFFFF',
      hoverGlow: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    },
    card: {
      background: '#F5F5F7',
      border: '#E5E7EB',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    input: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      text: '#1F2937',
      placeholder: '#9CA3AF',
    },
  },
};

export type LightTheme = typeof lightTheme;
