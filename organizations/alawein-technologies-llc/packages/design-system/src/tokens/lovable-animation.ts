/**
 * Lovable Animation System
 *
 * Durations, easing functions, and orbital animation speeds
 * Creates fluid, scientific motion throughout the interface
 *
 * @source LOVABLE_TEMPLATE_SUPERPROMPT.md
 */

export const lovableAnimation = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing Functions
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },

  // Orbital Animation Speeds (for rotating elements)
  orbital: {
    fast: '10s',
    normal: '12s',
    slow: '15s',
  },
};

export type LovableAnimation = typeof lovableAnimation;
