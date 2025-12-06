/**
 * Typography System
 *
 * Based on Lovable Design System Superprompt
 * Type scale uses 1.25 ratio (Major Third)
 */

export const typography = {
  // Font Families
  fonts: {
    display: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
    body: "'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    serif: "'Instrument Serif', 'Playfair Display', Georgia, serif",
  },

  // Type Scale (1.25 ratio - Major Third)
  scale: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
  },

  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    wider: '0.05em',
  },
};

export type Typography = typeof typography;
