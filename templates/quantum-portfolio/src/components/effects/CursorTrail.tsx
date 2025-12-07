import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  useEffect(() => {
    let lastTime = 0;
    const throttleMs = 30;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      const newPoint: TrailPoint = {
        id: idCounter,
        x: e.clientX,
        y: e.clientY,
      };

      setIdCounter((prev) => prev + 1);
      setTrail((prev) => [...prev.slice(-15), newPoint]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [idCounter]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 0.3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              left: point.x - 8,
              top: point.y - 8,
              width: 16,
              height: 16,
              background: `radial-gradient(circle, 
                hsl(${271 + index * 5} 80% 60% / 0.8) 0%, 
                hsl(${193 + index * 3} 80% 50% / 0.4) 50%, 
                transparent 100%)`,
              boxShadow: `0 0 ${10 + index}px hsl(271 80% 60% / 0.5)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor glow */}
      {trail.length > 0 && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          animate={{
            left: trail[trail.length - 1].x - 20,
            top: trail[trail.length - 1].y - 20,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          style={{
            width: 40,
            height: 40,
            background: "radial-gradient(circle, hsl(271 80% 70% / 0.3) 0%, transparent 70%)",
            boxShadow: "0 0 30px hsl(271 80% 60% / 0.4)",
          }}
        />
      )}
    </div>
  );
}

