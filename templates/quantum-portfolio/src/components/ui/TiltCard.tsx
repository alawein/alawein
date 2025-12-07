import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
}

export function TiltCard({ children, className = "", tiltAmount = 15 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  // Glow position
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Card content */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
        {children}
      </div>

      {/* Dynamic glow that follows cursor */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, hsl(271 80% 60% / 0.4) 0%, transparent 50%)`,
        }}
      />

      {/* Edge highlight */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(
            ${useTransform(mouseX, [-0.5, 0.5], [135, 225])}deg,
            hsl(271 80% 60% / 0.3) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* Reflection/shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
        style={{ transform: "translateZ(1px)" }}
      >
        <motion.div
          className="absolute w-full h-32 -top-16 opacity-20"
          style={{
            background: "linear-gradient(180deg, white 0%, transparent 100%)",
            x: glowX,
            rotate: -15,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

