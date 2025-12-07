import { motion } from 'framer-motion';

const particles = [
  { size: 4, duration: 20, delay: 0, radius: 180, color: 'quantum-purple' },
  { size: 3, duration: 25, delay: 2, radius: 220, color: 'quantum-pink' },
  { size: 5, duration: 30, delay: 4, radius: 260, color: 'quantum-cyan' },
  { size: 3, duration: 22, delay: 6, radius: 200, color: 'quantum-purple' },
  { size: 4, duration: 28, delay: 8, radius: 240, color: 'quantum-pink' },
];

export const OrbitalParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Center nucleus glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-4 h-4 rounded-full bg-quantum-purple"
          animate={{
            boxShadow: [
              '0 0 30px hsl(271 91% 65% / 0.5), 0 0 60px hsl(271 91% 65% / 0.3)',
              '0 0 50px hsl(271 91% 65% / 0.7), 0 0 100px hsl(271 91% 65% / 0.4)',
              '0 0 30px hsl(271 91% 65% / 0.5), 0 0 60px hsl(271 91% 65% / 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Orbital rings */}
      {[180, 220, 260].map((radius, i) => (
        <motion.div
          key={radius}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ 
            width: radius * 2, 
            height: radius * 2,
            borderColor: `hsl(271 91% 65% / ${0.1 - i * 0.02})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }}
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
            className={`rounded-full ${
              particle.color === 'quantum-purple'
                ? 'bg-quantum-purple'
                : particle.color === 'quantum-pink'
                  ? 'bg-quantum-pink'
                  : 'bg-quantum-cyan'
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              transform: `translateX(${particle.radius}px) translateY(-50%)`,
              boxShadow: `0 0 ${particle.size * 4}px ${
                particle.color === 'quantum-purple'
                  ? 'hsl(271 91% 65% / 0.6)'
                  : particle.color === 'quantum-pink'
                    ? 'hsl(330 81% 60% / 0.6)'
                    : 'hsl(193 85% 62% / 0.6)'
              }`,
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

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-1 h-1 rounded-full bg-quantum-purple/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default OrbitalParticles;

