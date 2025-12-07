/**
 * Background Effect Components
 * Animated and static background patterns
 */
import { motion } from 'framer-motion';

/**
 * GridBackground - Animated grid pattern
 */
interface GridBackgroundProps {
  color?: string;
  size?: number;
  animated?: boolean;
  perspective?: boolean;
  className?: string;
}

export function GridBackground({
  color = 'rgba(168, 85, 247, 0.1)',
  size = 50,
  animated = true,
  perspective = false,
  className = '',
}: GridBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={
        perspective
          ? {
              perspective: '500px',
              perspectiveOrigin: '50% 50%',
            }
          : undefined
      }
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px`,
          transform: perspective ? 'rotateX(60deg) translateY(-50%)' : undefined,
          transformOrigin: perspective ? 'center top' : undefined,
        }}
        animate={
          animated
            ? {
                backgroundPosition: [`0px 0px`, `${size}px ${size}px`],
              }
            : undefined
        }
        transition={
          animated
            ? {
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }
            : undefined
        }
      />
    </div>
  );
}

/**
 * WaveBackground - Animated wave pattern
 */
interface WaveBackgroundProps {
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}

const waveSpeedMap = {
  slow: 15,
  medium: 10,
  fast: 5,
};

export function WaveBackground({
  colors = ['#A855F7', '#EC4899', '#4CC9F0'],
  speed = 'medium',
  className = '',
}: WaveBackgroundProps) {
  const duration = waveSpeedMap[speed];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {colors.map((color, i) => (
        <motion.svg
          key={i}
          className="absolute w-[200%] h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            bottom: `${i * 10}%`,
            opacity: 0.3 - i * 0.08,
          }}
          animate={{
            x: [0, -720, 0],
          }}
          transition={{
            duration: duration + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <path
            fill={color}
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </motion.svg>
      ))}
    </div>
  );
}

/**
 * NoiseTexture - Subtle noise overlay
 */
interface NoiseTextureProps {
  opacity?: number;
  className?: string;
}

export function NoiseTexture({
  opacity = 0.03,
  className = '',
}: NoiseTextureProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/**
 * DotPattern - Subtle dot grid pattern
 */
interface DotPatternProps {
  color?: string;
  size?: number;
  spacing?: number;
  className?: string;
}

export function DotPattern({
  color = 'rgba(168, 85, 247, 0.2)',
  size = 2,
  spacing = 20,
  className = '',
}: DotPatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}

export default GridBackground;

