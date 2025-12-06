// Application Constants
export const APP_CONFIG = {
  name: 'MateaHub',
  description: 'Full-stack template system with 5 design engines',
  version: '1.0.0',
  author: 'MateaHub Team',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  tooltip: 150,
  toast: 200,
} as const;
