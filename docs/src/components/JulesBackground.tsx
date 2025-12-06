import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const ASCII_CHARS = [
  'λ',
  'Σ',
  '∫',
  '∂',
  '∇',
  '∞',
  'π',
  '√',
  'Δ',
  '≈',
  '⟨',
  '⟩',
  '∈',
  '∀',
  '∃',
  '⊗',
  '⊕',
  '℘',
  'ℏ',
  '∮',
];

interface FloatingChar {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface CodeRainDrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  chars: string[];
}

const NEON_COLORS = [
  'hsl(var(--jules-cyan))',
  'hsl(var(--jules-magenta))',
  'hsl(var(--jules-yellow))',
  'hsl(var(--jules-green))',
];

export const JulesBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingChars: FloatingChar[] = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 12,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    }));
  }, []);

  const codeRain: CodeRainDrop[] = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i / 15) * 100 + Math.random() * 5,
      delay: Math.random() * 3,
      duration: Math.random() * 8 + 6,
      chars: Array.from(
        { length: 8 },
        () => ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
      ),
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Code rain effect */}
      {codeRain.map((drop) => (
        <motion.div
          key={`rain-${drop.id}`}
          className="absolute font-mono text-xs flex flex-col gap-1"
          style={{ left: `${drop.x}%` }}
          initial={{ y: '-10%', opacity: 0 }}
          animate={{
            y: '110%',
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {drop.chars.map((char, idx) => (
            <span
              key={idx}
              className="text-jules-green"
              style={{
                opacity: 1 - idx * 0.1,
                textShadow: '0 0 8px hsl(var(--jules-green))',
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      ))}

      {/* Floating ASCII characters */}
      {floatingChars.map((item) => (
        <motion.span
          key={item.id}
          className="absolute font-mono select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            color: item.color,
            textShadow: `0 0 20px ${item.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.1, 0.4, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.char}
        </motion.span>
      ))}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-jules-dark via-transparent to-jules-dark opacity-60" />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  );
};

export default JulesBackground;
