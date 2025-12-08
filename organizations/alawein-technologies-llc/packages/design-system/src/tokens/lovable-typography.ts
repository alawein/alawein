/**
 * Lovable Typography System
 *
 * Type scale uses 1.25 ratio (Major Third)
 * Carefully curated font families for scientific and elegant aesthetic
 *
 * @source LOVABLE_TEMPLATE_SUPERPROMPT.md
 */

export const lovableTypography = {
  // Font Families
  fonts: {
    display: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
    body: "'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    serif: "'Instrument Serif', 'Playfair Display', Georgia, serif",
  },

  // Type Scale (1.25 ratio - Major Third)
  scale: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '4rem', // 64px
  },

  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter Spacing
  tracking: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Line Heights
  leading: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export type LovableTypography = typeof lovableTypography;
