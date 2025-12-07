import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CyberGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Perspective Grid Floor */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{
          background: `
            linear-gradient(to top, rgba(0, 255, 159, 0.1), transparent),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(0, 255, 159, 0.1) 60px,
              rgba(0, 255, 159, 0.1) 61px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(0, 255, 159, 0.08) 40px,
              rgba(0, 255, 159, 0.08) 41px
            )
          `,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Horizon Glow */}
      <div 
        className="absolute bottom-[40vh] left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(0, 255, 159, 0.2), transparent)',
          filter: 'blur(20px)',
        }}
      />

      {/* Floating Grid Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="cyber-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 255, 159, 0.3)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-pattern)" />
      </svg>

      {/* Scanning Line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-neon to-transparent"
        style={{ boxShadow: '0 0 20px 5px rgba(0, 255, 159, 0.3)' }}
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-cyber-neon/30" />
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-cyber-neon/30" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-cyber-neon/30" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-cyber-neon/30" />

      {/* Data Streams */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyber-pink/50 to-transparent"
          style={{
            left: `${15 + i * 20}%`,
            height: '30%',
          }}
          animate={{
            y: ['-30%', '130%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default CyberGrid;

