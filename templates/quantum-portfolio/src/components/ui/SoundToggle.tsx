import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '@/contexts/SoundContext';

export function SoundToggle() {
  const { enabled, toggleSound, playClick } = useSound();

  const handleClick = () => {
    playClick();
    toggleSound();
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-quantum-dark/80 border border-quantum-purple/50 backdrop-blur-sm hover:border-quantum-cyan transition-colors"
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5 text-quantum-cyan" />
      ) : (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      )}
      
      {/* Pulse animation when enabled */}
      {enabled && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-quantum-cyan"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
}

