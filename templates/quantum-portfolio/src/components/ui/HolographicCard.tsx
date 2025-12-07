import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
}

export function HolographicCard({ children, className = "" }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);
  const shimmerX = useTransform(mouseX, [0, 1], ["-100%", "200%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl" />

      {/* Rainbow holographic shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 20%,
            hsl(271 80% 60% / 0.3) 30%,
            hsl(330 80% 60% / 0.3) 40%,
            hsl(193 80% 60% / 0.3) 50%,
            hsl(60 80% 60% / 0.2) 60%,
            transparent 80%
          )`,
          backgroundSize: "200% 100%",
          x: shimmerX,
        }}
      />

      {/* Prismatic edge glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, hsl(271 80% 60% / 0.2) 0%, transparent 50%),
            linear-gradient(225deg, hsl(193 80% 60% / 0.2) 0%, transparent 50%),
            linear-gradient(315deg, hsl(330 80% 60% / 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
        animate={{ y: [0, 4] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

