import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const GlitchImage = ({ src, alt, className = '' }: GlitchImageProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Glitch Layers */}
      {isGlitching && (
        <>
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
            style={{ filter: 'hue-rotate(90deg)' }}
            animate={{
              x: [0, -5, 5, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 0.1, repeat: 2 }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
            style={{ filter: 'hue-rotate(-90deg)' }}
            animate={{
              x: [0, 5, -5, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 0.1, repeat: 2 }}
          />
          {/* Scan Lines */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
        </>
      )}

      {/* CRT Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyber-neon" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyber-neon" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyber-neon" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyber-neon" />

      {/* Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-neon/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default GlitchImage;

