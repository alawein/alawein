/**
 * ParticleField Effect Component
 * Creates floating particle effects for various themes
 */
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'up' | 'down' | 'random';
  className?: string;
}

const speedMap = {
  slow: { min: 15, max: 25 },
  medium: { min: 8, max: 15 },
  fast: { min: 4, max: 8 },
};

export function ParticleField({
  count = 50,
  colors = ['#A855F7', '#EC4899', '#4CC9F0'],
  minSize = 2,
  maxSize = 6,
  speed = 'medium',
  direction = 'up',
  className = '',
}: ParticleFieldProps) {
  const { min: minDuration, max: maxDuration } = speedMap[speed];

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        duration: minDuration + Math.random() * (maxDuration - minDuration),
        delay: Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    [count, colors, minSize, maxSize, minDuration, maxDuration]
  );

  const getAnimation = (particle: Particle) => {
    switch (direction) {
      case 'up':
        return { y: [0, -window.innerHeight], opacity: [0, 1, 1, 0] };
      case 'down':
        return { y: [0, window.innerHeight], opacity: [0, 1, 1, 0] };
      case 'random':
        return {
          x: [0, (Math.random() - 0.5) * 200],
          y: [0, (Math.random() - 0.5) * 200],
          opacity: [0, 1, 1, 0],
        };
      default:
        return { y: [0, -window.innerHeight], opacity: [0, 1, 1, 0] };
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: direction === 'up' ? '100%' : direction === 'down' ? '0%' : `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={getAnimation(particle)}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Sparkles - Twinkling star effect
 */
interface SparklesProps {
  count?: number;
  color?: string;
  className?: string;
}

export function Sparkles({
  count = 30,
  color = '#FACC15',
  className = '',
}: SparklesProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 1 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 24 24" fill={color}>
            <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default ParticleField;

