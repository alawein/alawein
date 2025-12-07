import { motion } from 'framer-motion';

interface OrbitalParticlesProps {
  colors?: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

const defaultColors = {
  primary: 'hsl(271 91% 65%)',
  secondary: 'hsl(330 81% 60%)',
  tertiary: 'hsl(193 85% 62%)',
};

const particles = [
  { size: 4, duration: 20, delay: 0, radius: 180, colorKey: 'primary' as const },
  { size: 3, duration: 25, delay: 2, radius: 220, colorKey: 'secondary' as const },
  { size: 5, duration: 30, delay: 4, radius: 260, colorKey: 'tertiary' as const },
  { size: 3, duration: 22, delay: 6, radius: 200, colorKey: 'primary' as const },
  { size: 4, duration: 28, delay: 8, radius: 240, colorKey: 'secondary' as const },
];

export const OrbitalParticles = ({ colors = defaultColors }: OrbitalParticlesProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Center nucleus glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.primary }}
          animate={{
            boxShadow: [
              `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}4D`,
              `0 0 40px ${colors.primary}B3, 0 0 80px ${colors.primary}66`,
              `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}4D`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Orbital rings */}
      {[180, 220, 260].map((radius) => (
        <div
          key={radius}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: radius * 2, height: radius * 2 }}
        />
      ))}

      {/* Orbiting particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute top-1/2 left-1/2"
          style={{ width: 0, height: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: particle.delay,
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: colors[particle.colorKey],
              transform: `translateX(${particle.radius}px) translateY(-50%)`,
              boxShadow: `0 0 ${particle.size * 4}px ${colors[particle.colorKey]}99`,
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: particle.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Additional floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default OrbitalParticles;

