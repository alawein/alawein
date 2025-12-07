import { motion } from "framer-motion";

export function AuroraBorealis() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Aurora Layer 1 - Purple */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(271 80% 50% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(271 80% 50% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 80% 0%, hsl(271 80% 50% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(271 80% 50% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(271 80% 50% / 0.4) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora Layer 2 - Cyan */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(ellipse 60% 40% at 70% 10%, hsl(193 80% 50% / 0.5) 0%, transparent 50%)",
            "radial-gradient(ellipse 60% 40% at 40% 10%, hsl(193 80% 50% / 0.5) 0%, transparent 50%)",
            "radial-gradient(ellipse 60% 40% at 30% 10%, hsl(193 80% 50% / 0.5) 0%, transparent 50%)",
            "radial-gradient(ellipse 60% 40% at 60% 10%, hsl(193 80% 50% / 0.5) 0%, transparent 50%)",
            "radial-gradient(ellipse 60% 40% at 70% 10%, hsl(193 80% 50% / 0.5) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Aurora Layer 3 - Pink */}
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          background: [
            "radial-gradient(ellipse 70% 35% at 30% 5%, hsl(330 80% 60% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 35% at 60% 5%, hsl(330 80% 60% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 35% at 80% 5%, hsl(330 80% 60% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 35% at 50% 5%, hsl(330 80% 60% / 0.4) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 35% at 30% 5%, hsl(330 80% 60% / 0.4) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
        }}
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

