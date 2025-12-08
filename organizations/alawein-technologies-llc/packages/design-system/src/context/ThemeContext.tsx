/**
 * Theme Context & Provider
 *
 * React context for managing theme state and switching
 * Persists theme preference to localStorage
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme names
/* eslint-disable react-refresh/only-export-components */
export const themeNames = ['quantum', 'glassmorphism', 'dark', 'light'] as const;
export type ThemeName = (typeof themeNames)[number];
/* eslint-enable react-refresh/only-export-components */

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
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

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

/* eslint-disable react-refresh/only-export-components */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
/* eslint-enable react-refresh/only-export-components */
