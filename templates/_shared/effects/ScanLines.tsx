/**
 * ScanLines Effect Component
 * Creates retro CRT scanline effects for cyberpunk themes
 */
import { motion } from 'framer-motion';

interface ScanLinesProps {
  opacity?: number;
  speed?: 'slow' | 'medium' | 'fast';
  color?: string;
  className?: string;
}

const speedMap = {
  slow: 8,
  medium: 4,
  fast: 2,
};

export function ScanLines({
  opacity = 0.05,
  speed = 'medium',
  color = 'rgba(255, 255, 255, 0.1)',
  className = '',
}: ScanLinesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Static scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${color} 2px,
            ${color} 4px
          )`,
        }}
      />
      {/* Moving scanline */}
      <motion.div
        className="absolute left-0 right-0 h-8"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
        }}
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: speedMap[speed],
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * GlitchEffect - Random glitch distortion
 */
interface GlitchEffectProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlitchEffect({
  children,
  intensity = 'medium',
  className = '',
}: GlitchEffectProps) {
  const intensityValues = {
    low: { offset: 2, frequency: 5 },
    medium: { offset: 4, frequency: 3 },
    high: { offset: 8, frequency: 1.5 },
  };

  const { offset, frequency } = intensityValues[intensity];

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        x: [0, -offset, offset, 0],
        filter: [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(-90deg)',
          'hue-rotate(0deg)',
        ],
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: frequency,
        ease: 'steps(4)',
      }}
    >
      {/* RGB split layers */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          color: 'red',
          transform: `translateX(${offset / 2}px)`,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          color: 'cyan',
          transform: `translateX(-${offset / 2}px)`,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/**
 * TerminalCursor - Blinking terminal cursor
 */
interface TerminalCursorProps {
  color?: string;
  className?: string;
}

export function TerminalCursor({
  color = '#22C55E',
  className = '',
}: TerminalCursorProps) {
  return (
    <motion.span
      className={`inline-block w-2 h-5 ${className}`}
      style={{ backgroundColor: color }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'steps(2)',
      }}
    />
  );
}

/**
 * MatrixRain - Falling code effect
 */
interface MatrixRainProps {
  color?: string;
  density?: number;
  className?: string;
}

export function MatrixRain({
  color = '#22C55E',
  density = 20,
  className = '',
}: MatrixRainProps) {
  const columns = Array.from({ length: density }, (_, i) => ({
    x: (i / density) * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    chars: Array.from({ length: 20 }, () =>
      String.fromCharCode(0x30A0 + Math.random() * 96)
    ).join(''),
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {columns.map((col, i) => (
        <motion.div
          key={i}
          className="absolute text-xs font-mono whitespace-pre leading-tight"
          style={{
            left: `${col.x}%`,
            color,
            textShadow: `0 0 10px ${color}`,
            writingMode: 'vertical-rl',
          }}
          initial={{ top: '-100%', opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: col.duration,
            repeat: Infinity,
            delay: col.delay,
            ease: 'linear',
          }}
        >
          {col.chars}
        </motion.div>
      ))}
    </div>
  );
}

export default ScanLines;

