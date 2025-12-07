/**
 * NeonGlow Effect Component
 * Creates animated neon glow effects for cyberpunk/neon themes
 */
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonGlowProps {
  children: ReactNode;
  color?: 'pink' | 'cyan' | 'green' | 'purple' | 'orange';
  intensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  className?: string;
}

const colorMap = {
  pink: { glow: 'rgba(236, 72, 153, 0.6)', border: '#EC4899' },
  cyan: { glow: 'rgba(34, 211, 238, 0.6)', border: '#22D3EE' },
  green: { glow: 'rgba(34, 197, 94, 0.6)', border: '#22C55E' },
  purple: { glow: 'rgba(168, 85, 247, 0.6)', border: '#A855F7' },
  orange: { glow: 'rgba(249, 115, 22, 0.6)', border: '#F97316' },
};

const intensityMap = {
  low: { blur: '10px', spread: '2px' },
  medium: { blur: '20px', spread: '4px' },
  high: { blur: '30px', spread: '6px' },
};

export function NeonGlow({
  children,
  color = 'cyan',
  intensity = 'medium',
  pulse = true,
  className = '',
}: NeonGlowProps) {
  const { glow, border } = colorMap[color];
  const { blur, spread } = intensityMap[intensity];

  const boxShadow = `0 0 ${blur} ${spread} ${glow}, inset 0 0 ${blur} ${spread} ${glow}`;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        boxShadow,
        border: `1px solid ${border}`,
      }}
      animate={
        pulse
          ? {
              boxShadow: [
                boxShadow,
                `0 0 ${parseInt(blur) * 1.5}px ${parseInt(spread) * 1.5}px ${glow}, inset 0 0 ${parseInt(blur) * 1.5}px ${parseInt(spread) * 1.5}px ${glow}`,
                boxShadow,
              ],
            }
          : undefined
      }
      transition={
        pulse
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * NeonText - Glowing text effect
 */
interface NeonTextProps {
  children: ReactNode;
  color?: 'pink' | 'cyan' | 'green' | 'purple' | 'orange';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function NeonText({
  children,
  color = 'cyan',
  className = '',
  as: Component = 'span',
}: NeonTextProps) {
  const { glow, border } = colorMap[color];

  return (
    <Component
      className={className}
      style={{
        color: border,
        textShadow: `0 0 10px ${glow}, 0 0 20px ${glow}, 0 0 40px ${glow}`,
      }}
    >
      {children}
    </Component>
  );
}

/**
 * NeonLine - Animated neon line/border
 */
interface NeonLineProps {
  color?: 'pink' | 'cyan' | 'green' | 'purple' | 'orange';
  direction?: 'horizontal' | 'vertical';
  animated?: boolean;
  className?: string;
}

export function NeonLine({
  color = 'cyan',
  direction = 'horizontal',
  animated = true,
  className = '',
}: NeonLineProps) {
  const { glow, border } = colorMap[color];

  const isHorizontal = direction === 'horizontal';

  return (
    <motion.div
      className={`${isHorizontal ? 'h-px w-full' : 'w-px h-full'} ${className}`}
      style={{
        background: `linear-gradient(${isHorizontal ? '90deg' : '180deg'}, transparent, ${border}, transparent)`,
        boxShadow: `0 0 10px 2px ${glow}`,
      }}
      animate={
        animated
          ? {
              opacity: [0.5, 1, 0.5],
              scale: isHorizontal ? [1, 1.02, 1] : [1, 1, 1],
            }
          : undefined
      }
      transition={
        animated
          ? {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    />
  );
}

export default NeonGlow;

