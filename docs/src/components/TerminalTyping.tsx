import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const commands = [
  { prompt: '$ ', command: 'whoami', output: 'meshal_alawein' },
  { prompt: '$ ', command: 'cat research.txt', output: 'Particle Physics | ML | Optimization' },
  { prompt: '$ ', command: 'ls projects/', output: 'optilibria/ atlas-ml/ repzcoach/' },
  { prompt: '$ ', command: 'echo $STATUS', output: 'Building the future...' },
];

const TerminalTyping = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<Array<{ command: string; output: string }>>(
    []
  );

  useEffect(() => {
    const currentCommand = commands[currentLine];
    if (!currentCommand) {
      // Reset after showing all
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setShowOutput(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    if (currentChar < currentCommand.command.length) {
      // Type command
      const timeout = setTimeout(
        () => {
          setCurrentChar((prev) => prev + 1);
        },
        80 + Math.random() * 40
      );
      return () => clearTimeout(timeout);
    } else if (!showOutput) {
      // Show output after command is typed
      const timeout = setTimeout(() => {
        setShowOutput(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev,
          { command: currentCommand.command, output: currentCommand.output },
        ]);
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
        setShowOutput(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, showOutput]);

  const currentCommand = commands[currentLine];

  return (
    <motion.div
      className="w-full max-w-md mx-auto mt-8 p-4 bg-jules-dark/80 border border-jules-green/30 rounded-lg font-mono text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-jules-green/20">
        <div className="w-3 h-3 rounded-full bg-jules-magenta" />
        <div className="w-3 h-3 rounded-full bg-jules-yellow" />
        <div className="w-3 h-3 rounded-full bg-jules-green" />
        <span className="ml-2 text-xs text-muted-foreground">meshal@berkeley ~ </span>
      </div>

      {/* Previous lines */}
      <div className="space-y-1 text-xs">
        {displayedLines.map((line, idx) => (
          <div key={idx}>
            <div>
              <span className="text-jules-green">$ </span>
              <span className="text-foreground">{line.command}</span>
            </div>
            <div className="text-jules-cyan pl-2">{line.output}</div>
          </div>
        ))}

        {/* Current typing line */}
        {currentCommand && (
          <div>
            <div className="flex">
              <span className="text-jules-green">$ </span>
              <span className="text-foreground">
                {currentCommand.command.slice(0, currentChar)}
              </span>
              <motion.span
                className="inline-block w-2 h-4 bg-jules-cyan ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>
            {showOutput && (
              <motion.div
                className="text-jules-cyan pl-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentCommand.output}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalTyping;
