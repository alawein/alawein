import { motion } from "framer-motion";

interface QuantumSkillBarProps {
  skill: string;
  level: number; // 0-100
  delay?: number;
}

export function QuantumSkillBar({ skill, level, delay = 0 }: QuantumSkillBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{skill}</span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5 }}
          className="text-primary"
        >
          {level}%
        </motion.span>
      </div>

      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, 
              hsl(271 80% 50%) 0%, 
              hsl(330 80% 55%) 50%, 
              hsl(193 80% 50%) 100%)`,
          }}
        />

        {/* Quantum particles inside bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5 }}
          className="absolute inset-0"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${10 + i * 18}%`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>

        {/* Glow effect at the end */}
        <motion.div
          initial={{ opacity: 0, left: 0 }}
          whileInView={{ opacity: 1, left: `${level - 2}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay }}
          className="absolute inset-y-0 w-4"
          style={{
            background: "radial-gradient(circle at center, white 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />

        {/* Scanning effect */}
        <motion.div
          className="absolute inset-y-0 w-8"
          style={{
            background: "linear-gradient(90deg, transparent, white/30, transparent)",
          }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay + 1 }}
        />
      </div>
    </div>
  );
}

