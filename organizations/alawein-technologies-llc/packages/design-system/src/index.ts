/**
 * Alawein Design System
 *
 * Complete design system with Lovable-powered tokens and themes
 */

// Export all tokens
export * from './tokens';

// Export all themes (excluding ThemeName to avoid conflict)
export { themes, defaultTheme, type Theme } from './themes';

// Export theme context and hooks
export { ThemeProvider, useTheme, type ThemeName, themeNames } from './context/ThemeContext';

// Re-export a stub for useThemeColors for backward compatibility
export function useThemeColors() {
  return {
    background: '#0F0F23',
    surface: '#1A1B3D',
    surfaceAlt: '#2A1B4D',
    primary: '#A855F7',
    secondary: '#EC4899',
    tertiary: '#4CC9F0',
    text: '#FFFFFF',
    textSecondary: '#A0A0C0',
    textMuted: '#808090',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#4CC9F0',
    border: 'rgba(255, 255, 255, 0.05)',
    glass: 'rgba(255, 255, 255, 0.03)',
  };
}
