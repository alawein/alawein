import { motion } from "framer-motion";
import { useState, ReactNode } from "react";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className = "" }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
            {front}
          </div>
          {/* Holographic shimmer on front */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-20"
            animate={{
              background: [
                "linear-gradient(45deg, transparent 30%, hsl(271 80% 60% / 0.3) 50%, transparent 70%)",
                "linear-gradient(45deg, transparent 30%, hsl(193 80% 60% / 0.3) 50%, transparent 70%)",
                "linear-gradient(45deg, transparent 30%, hsl(330 80% 60% / 0.3) 50%, transparent 70%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-md border border-white/10 rounded-xl">
            {back}
          </div>
          {/* Glow effect on back */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: "inset 0 0 30px hsl(271 80% 60% / 0.3), 0 0 20px hsl(271 80% 60% / 0.2)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

