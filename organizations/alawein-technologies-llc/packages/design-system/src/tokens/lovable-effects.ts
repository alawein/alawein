/**
 * Lovable Effects System
 *
 * Shadows, glows, blur effects for quantum aesthetic
 * Creates depth, hierarchy, and ambient lighting
 *
 * @source LOVABLE_TEMPLATE_SUPERPROMPT.md
 */

export const lovableEffects = {
  // Shadows (Elevation System)
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',

    // Quantum Glow Effects
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.3)',
    glowCyan: '0 0 20px rgba(76, 201, 240, 0.3)',
    glowPink: '0 0 20px rgba(236, 72, 153, 0.3)',

    // Intense Glows
    glowPurpleIntense: '0 0 30px rgba(168, 85, 247, 0.5)',
    glowCyanIntense: '0 0 30px rgba(76, 201, 240, 0.5)',
  },

  // Backdrop Blur
  blur: {
    sm: 'blur(4px)',
    default: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
    glass: 'blur(40px) saturate(180%)',
  },
};

export type LovableEffects = typeof lovableEffects;
