// Design Engines - Placeholder
// These are defined via CSS themes in index.css

export const designEngines = {
  quantum: 'quantum',
  glassmorphism: 'glassmorphism',
  dark: 'dark',
  light: 'light',
} as const;

export type DesignEngine = keyof typeof designEngines;
