import { motion } from 'framer-motion';

export const VaporwaveBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e] via-[#1a0a2e] to-[#2d1b4e]" />

      {/* Sun */}
      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 w-64 h-64 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #ff71ce 0%, #ff9248 50%, #ffd700 100%)',
          boxShadow: '0 0 100px rgba(255, 113, 206, 0.5), 0 0 200px rgba(255, 146, 72, 0.3)',
        }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Sun stripes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full bg-[#0f0a1e]"
            style={{
              height: `${4 + i * 2}px`,
              bottom: `${10 + i * 15}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #2d1b4e 100%)',
          perspective: '500px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 113, 206, 0.3) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255, 113, 206, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'rotateX(60deg)',
            transformOrigin: 'center top',
          }}
        />
        {/* Grid glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(1, 205, 254, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: 'rotateX(60deg)',
            transformOrigin: 'center top',
          }}
          animate={{
            backgroundPositionY: ['0px', '50px'],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Palm silhouettes */}
      <div className="absolute bottom-[42%] left-8 w-32 h-48 opacity-80">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <path
            d="M50 150 L50 80 Q30 60 10 40 Q30 50 50 70 Q70 50 90 40 Q70 60 50 80"
            fill="black"
          />
          <path d="M50 80 Q35 55 15 50 Q35 60 50 70 Q65 60 85 50 Q65 55 50 80" fill="black" />
        </svg>
      </div>
      <div className="absolute bottom-[42%] right-12 w-24 h-40 opacity-80 scale-x-[-1]">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <path
            d="M50 150 L50 80 Q30 60 10 40 Q30 50 50 70 Q70 50 90 40 Q70 60 50 80"
            fill="black"
          />
          <path d="M50 80 Q35 55 15 50 Q35 60 50 70 Q65 60 85 50 Q65 55 50 80" fill="black" />
        </svg>
      </div>

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </div>
  );
};

export default VaporwaveBackground;
