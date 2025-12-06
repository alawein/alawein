/**
 * Color System - Quantum Spectrum
 *
 * Based on Lovable Design System Superprompt
 */

export const colors = {
  // Primary Palette (Quantum Spectrum)
  primary: {
    quantumPurple: '#A855F7',
    plasmaPink: '#EC4899',
    electronCyan: '#4CC9F0',
  },

  // Background Gradients
  backgrounds: {
    voidStart: '#0F0F23',
    voidMid: '#1A1B3D',
    voidEnd: '#2A1B4D',
  },

  // Surface Colors
  surfaces: {
    cardDark: 'rgba(255, 255, 255, 0.02)',
    cardBorder: 'rgba(255, 255, 255, 0.05)',
    glass: 'rgba(255, 255, 255, 0.03)',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0C0',
    muted: '#808090',
    accent: '#A855F7',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#4CC9F0',
  },

  // Gradients
  gradients: {
    textGradient: 'linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #4CC9F0 100%)',
    bgGradient: 'linear-gradient(135deg, #0F0F23 0%, #1A1B3D 50%, #2A1B4D 100%)',
    orbitGradient: 'linear-gradient(135deg, #4CC9F0 0%, #A855F7 100%)',
    buttonGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    cardGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    headerGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
};

export type Colors = typeof colors;
