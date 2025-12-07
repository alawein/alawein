import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-quantum-darker z-50">
      <div className="text-center">
        {/* Quantum spinner */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-transparent rounded-full"
              style={{
                borderTopColor: i === 0 ? 'hsl(271 91% 65%)' : i === 1 ? 'hsl(330 81% 60%)' : 'hsl(193 85% 62%)',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5 - i * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
        
        <motion.p
          className="font-mono text-sm text-quantum-purple"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LOADING QUANTUM STATE...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;

