// =====================================================================
// REPZ COACH - CYBERPUNK DESIGN TOKENS
// Research-driven dark theme with orange accents
//
// Design Principles (2024/2025 best practices):
// - Avoid pure black (#000) - use dark blue-grey (#0c0c12)
// - Avoid pure white - use warm off-white (#e8e6e3)
// - Desaturated accent colors for visual harmony
// - Elevation via lightness, not shadows
// =====================================================================

export const designTokens = {
  // CORE BRAND - REPZ Orange (vibrant for primary actions)
  brand: {
    primary: 'hsl(14, 87%, 54%)',       // #F15B23 - Official REPZ Orange
    neon: 'hsl(18, 95%, 58%)',          // Slightly desaturated neon
    ember: 'hsl(10, 75%, 42%)',         // Muted ember
    flame: 'hsl(22, 85%, 55%)',         // Softer flame
    cyan: 'hsl(192, 70%, 48%)',         // Desaturated cyber cyan
    void: 'hsl(235, 15%, 6%)',          // Dark blue-grey (not pure black)
    white: 'hsl(30, 10%, 90%)',         // Warm off-white (not pure white)
  },

  // TIER SYSTEM - Desaturated for harmony
  tiers: {
    core: {
      primary: 'hsl(220, 12%, 52%)',    // Muted steel
      light: 'hsl(220, 12%, 62%)',
      dark: 'hsl(220, 12%, 42%)',
      bg: 'hsl(220, 12%, 52%, 0.05)',
      border: 'hsl(220, 12%, 52%, 0.2)',
    },
    adaptive: {
      primary: 'hsl(320, 55%, 52%)',    // Softer magenta
      light: 'hsl(320, 55%, 62%)',
      dark: 'hsl(320, 55%, 42%)',
      bg: 'hsl(320, 55%, 52%, 0.05)',
      border: 'hsl(320, 55%, 52%, 0.2)',
    },
    performance: {
      primary: 'hsl(268, 50%, 48%)',    // Muted violet
      light: 'hsl(268, 50%, 58%)',
      dark: 'hsl(268, 50%, 38%)',
      bg: 'hsl(268, 50%, 48%, 0.05)',
      border: 'hsl(268, 50%, 48%, 0.2)',
    },
    longevity: {
      primary: 'hsl(42, 75%, 48%)',     // Softer gold
      light: 'hsl(42, 75%, 58%)',
      dark: 'hsl(42, 75%, 38%)',
      bg: 'hsl(42, 75%, 48%, 0.05)',
      border: 'hsl(42, 75%, 48%, 0.2)',
    },
  },

  // SURFACES - Elevation via lightness (+4% per level)
  surfaces: {
    base: 'hsl(235, 15%, 6%)',          // #0c0c12 - Base
    elevated: 'hsl(235, 12%, 10%)',     // #151520 - +4%
    overlay: 'hsl(235, 10%, 14%)',      // #1f1f2a - +4%
    top: 'hsl(235, 8%, 18%)',           // #292935 - +4%
  },

  // TEXT - Warm off-white, not pure white
  text: {
    primary: 'hsl(30, 10%, 90%)',       // #e8e6e3 - Warm off-white
    muted: 'hsl(220, 8%, 58%)',         // Muted gray
    subtle: 'hsl(220, 6%, 45%)',        // Very muted
  },

  // SEMANTIC STATUS - Slightly desaturated
  status: {
    success: 'hsl(158, 65%, 42%)',      // Muted teal-green
    warning: 'hsl(38, 80%, 52%)',       // Softer amber
    error: 'hsl(0, 65%, 52%)',          // Less aggressive red
    info: 'hsl(192, 70%, 48%)',         // Matches cyan
  },
} as const;

export const baseTheme = designTokens;
export const coachTheme = designTokens;
export type ThemeTokens = typeof designTokens;
export type DesignTokens = typeof designTokens;
