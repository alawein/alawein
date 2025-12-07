import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cyber-dark flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {/* Glitch text */}
          <h1 
            className="text-4xl font-cyber text-cyber-neon glitch-text neon-text"
            data-text="LOADING"
          >
            LOADING
          </h1>
          
          {/* Progress bar */}
          <div className="mt-8 w-64 h-1 bg-cyber-dark border border-cyber-neon/30 overflow-hidden">
            <motion.div
              className="h-full bg-cyber-neon"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          
          {/* Status text */}
          <p className="mt-4 font-mono text-sm text-cyber-neon/60 animate-flicker">
            INITIALIZING NEURAL INTERFACE...
          </p>
        </motion.div>
      </div>
    </div>
  );
}

