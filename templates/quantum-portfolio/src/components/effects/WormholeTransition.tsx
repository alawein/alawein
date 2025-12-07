import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function WormholeTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className="relative">
      {/* Wormhole overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            {/* Wormhole rings */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.5 + i * 0.3, 2 + i * 0.5],
                  opacity: [0, 0.8, 0],
                  rotate: [0, 180 * (i % 2 === 0 ? 1 : -1)],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className="absolute rounded-full border-2"
                style={{
                  width: 100 + i * 40,
                  height: 100 + i * 40,
                  borderColor: `hsl(${271 + i * 20} 80% 60% / ${0.8 - i * 0.1})`,
                  boxShadow: `0 0 20px hsl(${271 + i * 20} 80% 60% / 0.5), inset 0 0 20px hsl(${271 + i * 20} 80% 60% / 0.3)`,
                }}
              />
            ))}

            {/* Center portal */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className="absolute w-16 h-16 rounded-full"
              style={{
                background: "radial-gradient(circle, white 0%, hsl(271 80% 60%) 30%, hsl(193 80% 50%) 60%, transparent 100%)",
                boxShadow: "0 0 60px hsl(271 80% 60%), 0 0 100px hsl(193 80% 50% / 0.5)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {displayChildren}
      </motion.div>
    </div>
  );
}

