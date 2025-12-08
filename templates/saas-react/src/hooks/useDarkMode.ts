import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } catch (error) {
      console.warn('matchMedia not supported:', error);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement?.classList.toggle('dark', isDark);
    } catch (error) {
      console.warn('Failed to toggle dark mode:', error);
    }
  }, [isDark]);

  return { isDark, setIsDark };
};
