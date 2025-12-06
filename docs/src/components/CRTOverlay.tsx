import { motion } from 'framer-motion';

const CRTOverlay = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 1px, hsl(var(--jules-cyan) / 0.1) 1px, hsl(var(--jules-cyan) / 0.1) 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Screen flicker */}
      <motion.div
        className="absolute inset-0 bg-white/[0.01]"
        animate={{ opacity: [0, 0.02, 0, 0.01, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, hsl(var(--jules-dark) / 0.4) 100%)',
        }}
      />

      {/* Subtle RGB shift on edges */}
      <div
        className="absolute inset-0 mix-blend-screen opacity-[0.02]"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--jules-magenta) / 0.3) 0%, transparent 5%, transparent 95%, hsl(var(--jules-cyan) / 0.3) 100%)',
        }}
      />
    </div>
  );
};

export default CRTOverlay;
