/**
 * Shadow System
 *
 * Elevation-based shadow scales
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Glassmorphism shadows
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glassXs: '0 2px 8px 0 rgba(31, 38, 135, 0.1)',
  glassLg: '0 16px 64px 0 rgba(31, 38, 135, 0.5)',

  // Quantum glow effect
  quantumGlow: '0 0 20px rgba(168, 85, 247, 0.4)',
  quantumGlowLg: '0 0 40px rgba(168, 85, 247, 0.6)',
};

export type Shadows = typeof shadows;
