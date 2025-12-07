import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  hue: number;
}

export function ParticleCollision() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const particleCount = 12 + Math.floor(Math.random() * 8);
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: idCounter + i,
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.5,
          speed: 100 + Math.random() * 150,
          size: 4 + Math.random() * 8,
          hue: 271 + Math.random() * 60, // Purple to cyan range
        });
      }

      setIdCounter((prev) => prev + particleCount);
      setParticles((prev) => [...prev, ...newParticles]);

      // Clean up after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [idCounter]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * particle.speed,
              y: particle.y + Math.sin(particle.angle) * particle.speed,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              marginLeft: -particle.size / 2,
              marginTop: -particle.size / 2,
              background: `hsl(${particle.hue} 80% 60%)`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue} 80% 60% / 0.8)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Central flash on click */}
      <AnimatePresence>
        {particles.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute rounded-full"
            style={{
              left: particles[particles.length - 1]?.x - 25,
              top: particles[particles.length - 1]?.y - 25,
              width: 50,
              height: 50,
              background: "radial-gradient(circle, white 0%, hsl(271 80% 60% / 0.5) 50%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

