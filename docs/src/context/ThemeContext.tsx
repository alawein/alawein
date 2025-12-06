/**
 * Theme Context & Provider
 *
 * React context for managing theme state and switching
 * Persists theme preference to localStorage
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme definitions
const themes = {
  quantum: {
    name: 'quantum',
    label: 'Quantum',
    description: 'Physics-inspired quantum spectrum theme',
  },
  glassmorphism: {
    name: 'glassmorphism',
    label: 'Glassmorphism',
    description: 'Modern glass-like design',
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    description: 'Dark mode theme',
  },
  light: {
    name: 'light',
    label: 'Light',
    description: 'Light mode theme',
  },
} as const;

/* eslint-disable react-refresh/only-export-components */
export const themeNames = ['quantum', 'glassmorphism', 'dark', 'light'] as const;
export type ThemeName = (typeof themeNames)[number];
/* eslint-enable react-refresh/only-export-components */

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeObject: (typeof themes)[ThemeName];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  defaultTheme: initialTheme = 'quantum',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alawein-theme') as ThemeName | null;
      return stored || initialTheme;
    }
    return initialTheme;
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alawein-theme', newTheme);
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeObject = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeObject }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Simple color helper for dashboards
export function useThemeColors() {
  const { theme } = useTheme();

  const colorMap: Record<
    ThemeName,
    { primary: string; secondary: string; tertiary: string; success: string; text: string }
  > = {
    quantum: {
      primary: 'hsl(280, 70%, 60%)',
      secondary: 'hsl(200, 80%, 50%)',
      tertiary: 'hsl(320, 70%, 55%)',
      success: 'hsl(142, 70%, 45%)',
      text: 'hsl(0, 0%, 100%)',
    },
    glassmorphism: {
      primary: 'hsl(220, 70%, 60%)',
      secondary: 'hsl(180, 60%, 50%)',
      tertiary: 'hsl(260, 60%, 55%)',
      success: 'hsl(142, 70%, 45%)',
      text: 'hsl(0, 0%, 100%)',
    },
    dark: {
      primary: 'hsl(240, 60%, 60%)',
      secondary: 'hsl(200, 70%, 50%)',
      tertiary: 'hsl(280, 60%, 55%)',
      success: 'hsl(142, 70%, 45%)',
      text: 'hsl(0, 0%, 100%)',
    },
    light: {
      primary: 'hsl(240, 60%, 50%)',
      secondary: 'hsl(200, 70%, 45%)',
      tertiary: 'hsl(280, 60%, 45%)',
      success: 'hsl(142, 70%, 40%)',
      text: 'hsl(0, 0%, 0%)',
    },
  };

  return colorMap[theme];
}
/* eslint-enable react-refresh/only-export-components */
