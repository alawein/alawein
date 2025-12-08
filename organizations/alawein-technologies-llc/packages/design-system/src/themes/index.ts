/**
 * Theme System
 *
 * Complete theme configurations for Alawein Design System
 */

// Theme definitions - simplified for stability
export const themes = {
  quantum: { name: 'quantum', label: 'Quantum' },
  glassmorphism: { name: 'glassmorphism', label: 'Glassmorphism' },
  dark: { name: 'dark', label: 'Dark' },
  light: { name: 'light', label: 'Light' },
} as const;

export type Theme = (typeof themes)[keyof typeof themes];

// Default theme
export const defaultTheme = themes.quantum;
