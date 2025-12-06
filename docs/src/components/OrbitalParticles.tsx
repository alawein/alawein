import { motion } from 'framer-motion';

const particles = [
  { size: 4, duration: 20, delay: 0, radius: 180, color: 'quantum-purple' },
  { size: 3, duration: 25, delay: 2, radius: 220, color: 'plasma-pink' },
  { size: 5, duration: 30, delay: 4, radius: 260, color: 'electron-cyan' },
  { size: 3, duration: 22, delay: 6, radius: 200, color: 'quantum-purple' },
  { size: 4, duration: 28, delay: 8, radius: 240, color: 'plasma-pink' },
];

const OrbitalParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Center nucleus glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-3 h-3 rounded-full bg-quantum-purple"
          animate={{
            boxShadow: [
              '0 0 20px hsl(271 91% 65% / 0.5), 0 0 40px hsl(271 91% 65% / 0.3)',
              '0 0 40px hsl(271 91% 65% / 0.7), 0 0 80px hsl(271 91% 65% / 0.4)',
              '0 0 20px hsl(271 91% 65% / 0.5), 0 0 40px hsl(271 91% 65% / 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Orbital rings */}
      {[180, 220, 260].map((radius, i) => (
        <div
          key={radius}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
          style={{ width: radius * 2, height: radius * 2 }}
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
                : particle.color === 'plasma-pink'
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
                  : particle.color === 'plasma-pink'
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

      {/* Additional floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default OrbitalParticles;
