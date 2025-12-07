import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
  skipDelay?: number;
}

const bootLines = [
  { text: 'INITIALIZING NEURAL INTERFACE...', delay: 0 },
  { text: 'LOADING CYBERDECK MODULES...', delay: 300 },
  { text: 'MEMORY CHECK: 2.048 EXABYTES OK', delay: 600 },
  { text: 'QUANTUM ENCRYPTION: ENABLED', delay: 900 },
  { text: 'HOLOGRAPHIC DISPLAY: CALIBRATED', delay: 1200 },
  { text: 'NETRUNNER PROTOCOLS: ACTIVE', delay: 1500 },
  { text: 'IDENTITY VERIFIED: ALAWEIN', delay: 1800 },
  { text: '>>> JACKING INTO THE MATRIX <<<', delay: 2100, highlight: true },
];

export const BootSequence = ({ onComplete, skipDelay = 1500 }: BootSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [canSkip, setCanSkip] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), skipDelay);

    bootLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
        setProgress(((index + 1) / bootLines.length) * 100);
      }, line.delay);
    });

    const completeTimer = setTimeout(onComplete, 3000);

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
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,159,0.03) 2px, rgba(0,255,159,0.03) 4px)',
          }}
        />

        {/* Glitch sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,159,0.05) 50%, transparent 100%)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
        />

        <div className="w-full max-w-2xl px-8">
          {/* ASCII Logo */}
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyber-neon text-xs md:text-sm font-mono mb-8 text-center"
            style={{ textShadow: '0 0 10px currentColor' }}
          >
{`
 ▄▄▄       ██▓    ▄▄▄       █     █░▓█████  ██▓ ███▄    █ 
▒████▄    ▓██▒   ▒████▄    ▓█░ █ ░█░▓█   ▀ ▓██▒ ██ ▀█   █ 
▒██  ▀█▄  ▒██░   ▒██  ▀█▄  ▒█░ █ ░█ ▒███   ▒██▒▓██  ▀█ ██▒
░██▄▄▄▄██ ▒██░   ░██▄▄▄▄██ ░█░ █ ░█ ▒▓█  ▄ ░██░▓██▒  ▐▌██▒
 ▓█   ▓██▒░██████▒▓█   ▓██▒░░██▒██▓ ░▒████▒░██░▒██░   ▓██░
`}
          </motion.pre>

          {/* Boot lines */}
          <div className="font-mono text-sm space-y-1 mb-6">
            {bootLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={visibleLines.includes(index) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.2 }}
                className={line.highlight ? 'text-cyber-pink font-bold' : 'text-cyber-neon/80'}
                style={line.highlight ? { textShadow: '0 0 20px currentColor' } : {}}
              >
                <span className="text-cyber-pink mr-2">&gt;</span>
                {line.text}
                {visibleLines.includes(index) && index === visibleLines[visibleLines.length - 1] && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >█</motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-cyber-darker border border-cyber-neon/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-neon via-cyber-pink to-cyber-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ boxShadow: '0 0 20px rgba(0, 255, 159, 0.5)' }}
            />
          </div>

          {canSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onComplete}
              className="mt-6 text-sm text-cyber-neon/60 hover:text-cyber-neon transition-colors mx-auto block font-mono"
            >
              [CLICK TO SKIP]
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootSequence;

