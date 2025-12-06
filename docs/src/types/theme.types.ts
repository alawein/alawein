export type Theme = 'light' | 'dark' | 'system';

export type DesignEngine =
  | 'cyberpunk'
  | 'glassmorphism'
  | 'neumorphism'
  | 'brutalist'
  | 'soft-pastel';

export interface ThemeConfig {
  theme: Theme;
  designEngine: DesignEngine;
}

export interface DesignEngineConfig {
  name: DesignEngine;
  label: string;
  description: string;
  primaryColor: string;
  accentColor: string;
}

export const DESIGN_ENGINES: DesignEngineConfig[] = [
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Neon glows, dark backgrounds, futuristic UI',
    primaryColor: '#22d3ee',
    accentColor: '#ec4899',
  },
  {
    name: 'glassmorphism',
    label: 'Glassmorphism',
    description: 'Frosted glass effects with blur and transparency',
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
  },
  {
    name: 'neumorphism',
    label: 'Neumorphism',
    description: 'Soft shadows creating 3D depth effects',
    primaryColor: '#6366f1',
    accentColor: '#f43f5e',
  },
  {
    name: 'brutalist',
    label: 'Brutalist',
    description: 'Raw, bold typography and stark contrasts',
    primaryColor: '#000000',
    accentColor: '#ff0000',
  },
  {
    name: 'soft-pastel',
    label: 'Soft Pastel',
    description: 'Gentle colors and rounded, friendly shapes',
    primaryColor: '#f9a8d4',
    accentColor: '#a5f3fc',
  },
];
