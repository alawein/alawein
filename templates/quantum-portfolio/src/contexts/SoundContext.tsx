import { createContext, useContext, useState, ReactNode } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SoundContextType {
  enabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playHover: () => void;
  playWhoosh: () => void;
  playSuccess: () => void;
  playGlitch: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const sounds = useSoundEffects(enabled);

  const toggleSound = () => setEnabled((prev) => !prev);

  return (
    <SoundContext.Provider value={{ enabled, toggleSound, ...sounds }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

