/**
 * Lovable Color System - Quantum Spectrum
 *
 * Physics-inspired color palette featuring quantum mechanics aesthetics
 * Base hues from quantum spectrum (purple, pink, cyan)
 *
 * @source LOVABLE_TEMPLATE_SUPERPROMPT.md
 */

export const lovableColors = {
  // Primary Palette (Quantum Spectrum)
  primary: {
    quantumPurple: '#A855F7', // Primary accent - quantum energy
    plasmaPink: '#EC4899', // Secondary accent - plasma energy
    electronCyan: '#4CC9F0', // Tertiary accent - electron shells
  },

  // Background Gradients (Void System)
  backgrounds: {
    voidStart: '#0F0F23', // Deep space black
    voidMid: '#1A1B3D', // Midnight purple
    voidEnd: '#2A1B4D', // Deep violet
  },

  // Surface Colors (Glassmorphism)
  surfaces: {
    cardDark: 'rgba(255, 255, 255, 0.02)',
    cardBorder: 'rgba(255, 255, 255, 0.05)',
    glass: 'rgba(255, 255, 255, 0.03)',
  },

  // Text Colors (Hierarchy)
  text: {
    primary: '#FFFFFF', // Main text
    secondary: '#A0A0C0', // Secondary text
    muted: '#808090', // Muted text
    accent: '#A855F7', // Accent text
  },

  // Status Colors (Semantic)
  status: {
    success: '#10B981', // Emerald - success
    warning: '#F59E0B', // Amber - warning
    error: '#EF4444', // Red - error
    info: '#4CC9F0', // Cyan - info
  },

  // Gradient Definitions
  gradients: {
    textGradient: 'linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #4CC9F0 100%)',
    bgGradient: 'linear-gradient(135deg, #0F0F23 0%, #1A1B3D 50%, #2A1B4D 100%)',
    orbitGradient: 'linear-gradient(135deg, #4CC9F0 0%, #A855F7 100%)',
    buttonGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    cardGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    headerGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
};

export type LovableColors = typeof lovableColors;
