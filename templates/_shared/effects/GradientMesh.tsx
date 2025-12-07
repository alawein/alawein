/**
 * GradientMesh Effect Component
 * Creates animated gradient mesh backgrounds for modern themes
 */
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface GradientMeshProps {
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
  opacity?: number;
  className?: string;
}

const speedMap = {
  slow: 20,
  medium: 12,
  fast: 6,
};

export function GradientMesh({
  colors = ['#A855F7', '#EC4899', '#4CC9F0', '#22C55E'],
  speed = 'medium',
  opacity = 0.3,
  className = '',
}: GradientMeshProps) {
  const duration = speedMap[speed];

  const blobs = useMemo(
    () =>
      colors.map((color, i) => ({
        color,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 40 + Math.random() * 30,
        delay: i * 2,
      })),
    [colors]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            width: `${blob.size}%`,
            height: `${blob.size}%`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: duration + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * AuroraBackground - Northern lights effect
 */
interface AuroraBackgroundProps {
  colors?: string[];
  className?: string;
}

export function AuroraBackground({
  colors = ['#A855F7', '#4CC9F0', '#22C55E', '#EC4899'],
  className = '',
}: AuroraBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-1/2 blur-3xl opacity-30"
          style={{
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            top: `${i * 20}%`,
          }}
          animate={{
            x: ['-20%', '20%', '-20%'],
            skewX: [0, 10, -10, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

/**
 * FloatingOrbs - Floating gradient orbs
 */
interface FloatingOrbsProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function FloatingOrbs({
  count = 5,
  colors = ['#A855F7', '#EC4899', '#4CC9F0'],
  className = '',
}: FloatingOrbsProps) {
  const orbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        color: colors[i % colors.length],
        size: 100 + Math.random() * 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 10,
      })),
    [count, colors]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            background: orb.color,
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default GradientMesh;

