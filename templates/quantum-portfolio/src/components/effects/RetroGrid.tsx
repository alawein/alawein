import { motion } from 'framer-motion';

export const RetroGrid = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Perspective Grid Floor */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{
          background: `
            linear-gradient(to top, rgba(139, 92, 246, 0.15), transparent),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(139, 92, 246, 0.1) 80px,
              rgba(139, 92, 246, 0.1) 81px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              rgba(139, 92, 246, 0.08) 50px,
              rgba(139, 92, 246, 0.08) 51px
            )
          `,
          transform: 'perspective(500px) rotateX(65deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Horizon Glow */}
      <div 
        className="absolute bottom-[50vh] left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to top, rgba(139, 92, 246, 0.3), transparent)',
          filter: 'blur(30px)',
        }}
      />

      {/* Sun/Moon */}
      <motion.div
        className="absolute bottom-[45vh] left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'linear-gradient(180deg, hsl(330 81% 60%), hsl(271 91% 65%))',
          boxShadow: '0 0 60px hsl(330 81% 60% / 0.5), 0 0 120px hsl(271 91% 65% / 0.3)',
        }}
        animate={{
          boxShadow: [
            '0 0 60px hsl(330 81% 60% / 0.5), 0 0 120px hsl(271 91% 65% / 0.3)',
            '0 0 80px hsl(330 81% 60% / 0.7), 0 0 160px hsl(271 91% 65% / 0.5)',
            '0 0 60px hsl(330 81% 60% / 0.5), 0 0 120px hsl(271 91% 65% / 0.3)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Horizontal scan lines */}
      {[0.3, 0.5, 0.7].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-[1px]"
          style={{
            top: `${pos * 100}%`,
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Vertical data streams */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-quantum-cyan/30 to-transparent"
          style={{
            left: `${10 + i * 16}%`,
            height: '40%',
          }}
          animate={{
            y: ['-40%', '140%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'linear',
          }}
        />
      ))}

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-24 h-24 border-l-2 border-t-2 border-quantum-purple/20" />
      <div className="absolute top-6 right-6 w-24 h-24 border-r-2 border-t-2 border-quantum-purple/20" />
      <div className="absolute bottom-6 left-6 w-24 h-24 border-l-2 border-b-2 border-quantum-purple/20" />
      <div className="absolute bottom-6 right-6 w-24 h-24 border-r-2 border-b-2 border-quantum-purple/20" />
    </div>
  );
};

export default RetroGrid;

