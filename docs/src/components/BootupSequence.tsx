import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootupSequenceProps {
  onComplete: () => void;
  skipDelay?: number;
}

const bootupLines = [
  { text: 'INITIALIZING SYSTEM...', delay: 0 },
  { text: 'LOADING KERNEL MODULES...', delay: 300 },
  { text: 'CHECKING MEMORY: 128TB OK', delay: 600 },
  { text: 'ESTABLISHING NEURAL LINK...', delay: 900 },
  { text: 'QUANTUM CORE: ONLINE', delay: 1200 },
  { text: 'HOLOGRAPHIC DISPLAY: ACTIVE', delay: 1500 },
  { text: 'CYBERDECK INTERFACE: READY', delay: 1800 },
  { text: 'AUTHENTICATION: APPROVED', delay: 2100 },
  { text: '>>> WELCOME TO THE SYSTEM <<<', delay: 2400, highlight: true },
];

export const BootupSequence = ({ onComplete, skipDelay = 2000 }: BootupSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [canSkip, setCanSkip] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show skip button after delay
    const skipTimer = setTimeout(() => setCanSkip(true), skipDelay);

    // Progressive line reveal
    bootupLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
        setProgress(((index + 1) / bootupLines.length) * 100);
      }, line.delay);
    });

    // Auto-complete after all lines
    const completeTimer = setTimeout(onComplete, 3500);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, skipDelay]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-cyber-dark flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
          }}
        />

        {/* Glitch overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.03) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Terminal container */}
        <div className="w-full max-w-2xl px-8">
          {/* ASCII Logo */}
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-400 text-xs md:text-sm font-mono mb-8 text-center"
            style={{ textShadow: '0 0 10px currentColor' }}
          >
            {`
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ 
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝
`}
          </motion.pre>

          {/* Boot lines */}
          <div className="font-mono text-sm space-y-1 mb-6">
            {bootupLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={visibleLines.includes(index) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.2 }}
                className={`${line.highlight ? 'text-fuchsia-400 font-bold' : 'text-cyan-400/80'}`}
                style={line.highlight ? { textShadow: '0 0 20px currentColor' } : {}}
              >
                <span className="text-fuchsia-500 mr-2">&gt;</span>
                {line.text}
                {visibleLines.includes(index) &&
                  index === visibleLines[visibleLines.length - 1] && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-1"
                    >
                      █
                    </motion.span>
                  )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
            />
          </div>

          {/* Skip button */}
          {canSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onComplete}
              className="mt-6 text-sm text-cyan-400/60 hover:text-cyan-400 transition-colors mx-auto block"
            >
              [PRESS TO SKIP]
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootupSequence;
