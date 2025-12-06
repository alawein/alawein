import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type DesignEngine = 'cyberpunk' | 'glassmorphism' | 'neumorphism' | 'brutalist' | 'soft-pastel';

interface ThemeState {
  theme: Theme;
  designEngine: DesignEngine;
  setTheme: (theme: Theme) => void;
  setDesignEngine: (engine: DesignEngine) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      designEngine: 'cyberpunk',
      setTheme: (theme) => set({ theme }),
      setDesignEngine: (designEngine) => set({ designEngine }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
