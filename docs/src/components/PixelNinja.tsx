import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Shuriken from './Shuriken';

type Position = {
  edge: 'left' | 'right';
  offset: number; // percentage along the edge (vertical position)
  hidden: boolean;
};

type Footprint = {
  id: number;
  edge: Position['edge'];
  offset: number;
  timestamp: number;
};

type SmokePuff = {
  id: number;
  edge: Position['edge'];
  offset: number;
  type: 'disappear' | 'appear';
};

const PixelNinja = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [currentEasterEgg, setCurrentEasterEgg] = useState<string | null>(null);
  const [typedCommand, setTypedCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [shurikens, setShurikens] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isDancing, setIsDancing] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [position, setPosition] = useState<Position>({ edge: 'right', offset: 50, hidden: false });
  const [isPeeking, setIsPeeking] = useState(true);
  const [peekRotation, setPeekRotation] = useState(0);
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [smokePuffs, setSmokePuffs] = useState<SmokePuff[]>([]);
  const [idleGesture, setIdleGesture] = useState<'none' | 'wave' | 'nod' | 'peek' | 'shrug'>(
    'none'
  );
  const ninjaRef = useRef<HTMLDivElement>(null);
  const lastClickTime = useRef(0);
  const shurikenId = useRef(0);
  const footprintId = useRef(0);
  const smokePuffId = useRef(0);

  // Roaming behavior - only left/right edges
  useEffect(() => {
    const moveNinja = () => {
      const edges: Position['edge'][] = ['left', 'right'];
      const newEdge = edges[Math.floor(Math.random() * edges.length)];
      const newOffset = 20 + Math.random() * 60;

      // Leave footprint at current position before moving
      setFootprints((prev) => [
        ...prev,
        {
          id: footprintId.current++,
          edge: position.edge,
          offset: position.offset,
          timestamp: Date.now(),
        },
      ]);

      // Add smoke puff at departure
      const departureSmoke: SmokePuff = {
        id: smokePuffId.current++,
        edge: position.edge,
        offset: position.offset,
        type: 'disappear',
      };
      setSmokePuffs((prev) => [...prev, departureSmoke]);

      // Hide first, then move, then peek
      setIsPeeking(false);
      setPosition((prev) => ({ ...prev, hidden: true }));

      setTimeout(() => {
        setPosition({ edge: newEdge, offset: newOffset, hidden: true });

        // Add smoke puff at arrival
        const arrivalSmoke: SmokePuff = {
          id: smokePuffId.current++,
          edge: newEdge,
          offset: newOffset,
          type: 'appear',
        };
        setSmokePuffs((prev) => [...prev, arrivalSmoke]);

        setTimeout(() => {
          setPosition((prev) => ({ ...prev, hidden: false }));
          setIsPeeking(true);
          // Random peek rotation (-25 to 25 degrees)
          setPeekRotation((Math.random() - 0.5) * 50);
        }, 300);
      }, 500);

      // Clean up smoke puffs after animation
      setTimeout(() => {
        setSmokePuffs((prev) => prev.filter((s) => s.id !== departureSmoke.id));
      }, 800);
    };

    const interval = setInterval(moveNinja, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [position.edge, position.offset]);

  // Idle gestures
  useEffect(() => {
    const doGesture = () => {
      if (!isPeeking || position.hidden) return;

      const gestures: ('wave' | 'nod' | 'peek' | 'shrug')[] = ['wave', 'nod', 'peek', 'shrug'];
      const gesture = gestures[Math.floor(Math.random() * gestures.length)];
      setIdleGesture(gesture);

      // Reset after animation
      setTimeout(() => setIdleGesture('none'), gesture === 'wave' ? 1500 : 800);
    };

    const interval = setInterval(
      () => {
        if (Math.random() < 0.4) doGesture();
      },
      3000 + Math.random() * 2000
    );

    return () => clearInterval(interval);
  }, [isPeeking, position.hidden]);

  // Escape on mouse hover
  const handleMouseEnter = () => {
    const edges: Position['edge'][] = ['left', 'right'];
    const newEdge =
      edges.filter((e) => e !== position.edge)[0] ||
      edges[Math.floor(Math.random() * edges.length)];
    const newOffset = 20 + Math.random() * 60;

    // Add smoke puff at departure
    const departureSmoke: SmokePuff = {
      id: smokePuffId.current++,
      edge: position.edge,
      offset: position.offset,
      type: 'disappear',
    };
    setSmokePuffs((prev) => [...prev, departureSmoke]);

    setIsPeeking(false);
    setPosition((prev) => ({ ...prev, hidden: true }));

    setTimeout(() => {
      setPosition({ edge: newEdge, offset: newOffset, hidden: true });

      const arrivalSmoke: SmokePuff = {
        id: smokePuffId.current++,
        edge: newEdge,
        offset: newOffset,
        type: 'appear',
      };
      setSmokePuffs((prev) => [...prev, arrivalSmoke]);

      setTimeout(() => {
        setPosition((prev) => ({ ...prev, hidden: false }));
        setIsPeeking(true);
        setPeekRotation((Math.random() - 0.5) * 50);
      }, 300);
    }, 200);

    setTimeout(() => {
      setSmokePuffs((prev) => prev.filter((s) => s.id !== departureSmoke.id));
    }, 600);
  };

  // Clean up arrival smoke puffs
  useEffect(() => {
    if (smokePuffs.length > 0) {
      const timer = setTimeout(() => {
        setSmokePuffs((prev) => prev.filter((s) => s.type !== 'appear'));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [smokePuffs]);

  // Clean up old footprints
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setFootprints((prev) => prev.filter((fp) => now - fp.timestamp < 8000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Get footprint position styles
  const getFootprintStyles = (fp: Footprint): React.CSSProperties => {
    switch (fp.edge) {
      case 'left':
        return { left: 8, top: `${fp.offset}%`, transform: 'translateY(-50%)' };
      case 'right':
        return { right: 8, top: `${fp.offset}%`, transform: 'translateY(-50%)' };
    }
  };

  // Get smoke puff position styles
  const getSmokePuffStyles = (smoke: SmokePuff): React.CSSProperties => {
    switch (smoke.edge) {
      case 'left':
        return { left: 16, top: `${smoke.offset}%`, transform: 'translateY(-50%)' };
      case 'right':
        return { right: 16, top: `${smoke.offset}%`, transform: 'translateY(-50%)' };
    }
  };

  // Get CSS position based on edge - sideways peeking only
  const getPositionStyles = (): React.CSSProperties => {
    const peekAmount = isPeeking ? 0 : 50;
    const hiddenAmount = position.hidden ? 80 : 0;
    const offset = peekAmount + hiddenAmount;
    const rotation = isPeeking ? peekRotation : 0;

    switch (position.edge) {
      case 'left':
        return {
          left: -offset,
          top: `${position.offset}%`,
          transform: `translateY(-50%) scaleX(-1) rotate(${rotation}deg)`, // Face right
        };
      case 'right':
        return {
          right: -offset,
          top: `${position.offset}%`,
          transform: `translateY(-50%) rotate(${rotation}deg)`, // Face left
        };
    }
  };

  const easterEggs = [
    { trigger: 5, message: '🥷 Ninja senses tingling...', effect: 'glow' },
    { trigger: 10, message: '🔓 SECRET TERMINAL UNLOCKED!', effect: 'unlock' },
  ];

  const secretCommands: Record<string, { output: string; action?: () => void }> = {
    help: { output: 'Commands: whoami, skills, hack, dance, explode, matrix, clear, exit' },
    whoami: { output: 'root@ninja ~ A shadowy developer from the void' },
    skills: { output: "['React', 'TypeScript', 'Stealth', 'Ninjutsu', 'Coffee']" },
    matrix: { output: 'Wake up, Neo... The Matrix has you...' },
    sudo: { output: "Nice try. Ninjas don't need sudo." },
    hack: {
      output: 'INITIATING HACK SEQUENCE...',
      action: () => {
        setIsHacking(true);
        setTimeout(() => setIsHacking(false), 3000);
      },
    },
    dance: {
      output: '💃 DANCE MODE ACTIVATED!',
      action: () => {
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 4000);
      },
    },
    explode: {
      output: '💥 BOOM!',
      action: () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 1000);
      },
    },
    clear: { output: 'CLEAR' },
    exit: { output: 'EXIT' },
  };

  // Ninja pixel art with katana sword
  const ninjaPixels = [
    '0000011111100000',
    '0001111111111000',
    '0011111111111100',
    '0111100110011110',
    '0111100110011110',
    '0011111111111100',
    '0001111111111000',
    '0000111111110000',
    '0001111111111000',
    '0011111111111100',
    '0111111111111110',
    '1111011111101111',
    '1110011111100111',
    '0000111111110000',
    '0001110000111000',
    '0011100000011100',
  ];

  // Katana sword - proper blade shape
  const swordPixels = [
    // Handle/hilt (wrapped in red/brown)
    { x: 16, y: 9, color: 'hsl(0 60% 40%)' },
    { x: 17, y: 9, color: 'hsl(0 60% 40%)' },
    { x: 16, y: 10, color: 'hsl(0 60% 35%)' },
    { x: 17, y: 10, color: 'hsl(0 60% 35%)' },
    // Guard (tsuba)
    { x: 15, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 16, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 17, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 18, y: 8, color: 'hsl(var(--jules-yellow))' },
    // Blade (silver/white, getting brighter toward tip)
    { x: 17, y: 7, color: 'hsl(0 0% 85%)' },
    { x: 17, y: 6, color: 'hsl(0 0% 88%)' },
    { x: 18, y: 5, color: 'hsl(0 0% 90%)' },
    { x: 18, y: 4, color: 'hsl(0 0% 92%)' },
    { x: 19, y: 3, color: 'hsl(0 0% 95%)' },
    { x: 19, y: 2, color: 'hsl(0 0% 97%)' },
    { x: 20, y: 1, color: 'hsl(0 0% 100%)' }, // tip
    // Edge highlight
    { x: 18, y: 7, color: 'hsl(180 50% 90%)' },
    { x: 18, y: 6, color: 'hsl(180 50% 92%)' },
    { x: 19, y: 5, color: 'hsl(180 60% 95%)' },
    { x: 19, y: 4, color: 'hsl(180 70% 97%)' },
    { x: 20, y: 3, color: 'hsl(var(--jules-cyan) / 0.7)' }, // energy glow near tip
    { x: 20, y: 2, color: 'hsl(var(--jules-cyan) / 0.8)' },
  ];

  const getPixelColor = (x: number, y: number) => {
    const isEye = (y === 3 || y === 4) && (x === 5 || x === 10);
    const isHeadband = y === 2 || y === 5;

    if (isEye) return 'hsl(var(--jules-magenta))';
    if (isHeadband) return 'hsl(var(--jules-magenta) / 0.8)';
    return 'hsl(var(--jules-cyan))';
  };

  const handleClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    lastClickTime.current = now;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Rapid clicking throws shurikens
    if (timeSinceLastClick < 300 && ninjaRef.current) {
      const rect = ninjaRef.current.getBoundingClientRect();
      setShurikens((prev) => [
        ...prev,
        {
          id: shurikenId.current++,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      ]);
    }

    const egg = easterEggs.find((e) => e.trigger === newCount);
    if (egg) {
      setCurrentEasterEgg(egg.message);
      if (egg.effect === 'unlock') {
        setSecretUnlocked(true);
        setIsOpen(true);
      }
      setTimeout(() => setCurrentEasterEgg(null), 2000);
    }
  };

  const removeShuriken = (id: number) => {
    setShurikens((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typedCommand.trim()) {
      const cmdKey = typedCommand.toLowerCase().trim();
      const cmd = secretCommands[cmdKey];

      if (cmd) {
        if (cmd.output === 'CLEAR') {
          setCommandHistory([]);
        } else if (cmd.output === 'EXIT') {
          setIsOpen(false);
        } else {
          setCommandHistory((prev) => [...prev, { cmd: cmdKey, output: cmd.output }]);
          cmd.action?.();
        }
      } else {
        setCommandHistory((prev) => [
          ...prev,
          { cmd: cmdKey, output: `Command not found: ${cmdKey}` },
        ]);
      }
      setTypedCommand('');
    }
  };

  const pixelSize = 4;

  return (
    <>
      {/* Footprints trail */}
      <AnimatePresence>
        {footprints.map((fp) => {
          const age = Date.now() - fp.timestamp;
          const opacity = Math.max(0, 1 - age / 8000);
          return (
            <motion.div
              key={fp.id}
              className="fixed z-40 pointer-events-none"
              style={getFootprintStyles(fp)}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: opacity * 0.4, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              {/* Pixel footprint */}
              <svg width="12" height="16" className="text-jules-cyan/30">
                <rect x="2" y="0" width="3" height="3" fill="currentColor" />
                <rect x="7" y="0" width="3" height="3" fill="currentColor" />
                <rect x="1" y="4" width="4" height="3" fill="currentColor" />
                <rect x="7" y="4" width="4" height="3" fill="currentColor" />
                <rect x="2" y="8" width="3" height="4" fill="currentColor" />
                <rect x="7" y="8" width="3" height="4" fill="currentColor" />
                <rect x="3" y="13" width="2" height="3" fill="currentColor" />
                <rect x="7" y="13" width="2" height="3" fill="currentColor" />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Smoke puffs */}
      <AnimatePresence>
        {smokePuffs.map((smoke) => (
          <motion.div
            key={smoke.id}
            className="fixed z-45 pointer-events-none"
            style={getSmokePuffStyles(smoke)}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Smoke particles */}
            <div className="relative">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 8 + Math.random() * 8,
                    height: 8 + Math.random() * 8,
                    background:
                      smoke.type === 'disappear'
                        ? 'hsl(var(--jules-cyan) / 0.4)'
                        : 'hsl(var(--jules-magenta) / 0.4)',
                    left: (i - 2) * 6,
                    top: Math.sin(i) * 4,
                  }}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{
                    scale: [0, 1.2, 0.8],
                    opacity: [0.8, 0.6, 0],
                    y: smoke.type === 'disappear' ? -20 : 0,
                    x: (i - 2) * 8,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Shurikens */}
      {shurikens.map((s) => (
        <Shuriken key={s.id} id={s.id} startX={s.x} startY={s.y} onComplete={removeShuriken} />
      ))}

      {/* Hacking overlay */}
      <AnimatePresence>
        {isHacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] pointer-events-none overflow-hidden font-mono text-xs text-jules-green/40"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute whitespace-nowrap"
                initial={{ x: Math.random() * window.innerWidth, y: -100 }}
                animate={{ y: window.innerHeight + 100 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              >
                {Array.from({ length: 50 })
                  .map(() => (Math.random() > 0.5 ? '1' : '0'))
                  .join('')}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ninjaRef}
        className="fixed z-50 cursor-pointer select-none"
        style={getPositionStyles()}
        initial={{ opacity: 0 }}
        animate={{
          opacity: position.hidden ? 0.3 : 1,
          scale: isExploding ? [1, 1.5, 0] : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <motion.div
          animate={{
            y: isDancing
              ? [0, -15, 0, -10, 0]
              : idleGesture === 'wave'
                ? [0, -8, 0, -8, 0]
                : idleGesture === 'nod'
                  ? [0, 4, 0]
                  : idleGesture === 'peek'
                    ? [0, -12, -12, 0]
                    : [0, -6, 0],
            rotate: isDancing
              ? [0, -10, 10, -10, 10, 0]
              : idleGesture === 'wave'
                ? [0, -15, 15, -15, 15, 0]
                : idleGesture === 'shrug'
                  ? [0, 5, -5, 0]
                  : 0,
            scale:
              idleGesture === 'peek'
                ? [1, 1.1, 1.1, 1]
                : idleGesture === 'shrug'
                  ? [1, 1.05, 1]
                  : 1,
          }}
          transition={{
            duration: isDancing
              ? 0.5
              : idleGesture === 'wave'
                ? 1.5
                : idleGesture === 'none'
                  ? 3
                  : 0.8,
            repeat: idleGesture === 'none' && !isDancing ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          {/* Subtle glow */}
          <div
            className="absolute inset-0 blur-lg opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(var(--jules-cyan)) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />

          {/* Pixel art ninja with katana */}
          <svg
            width={24 * pixelSize}
            height={16 * pixelSize}
            className="relative z-10"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Ninja body */}
            {ninjaPixels.map((row, y) =>
              row.split('').map((pixel, x) => {
                if (pixel === '1') {
                  return (
                    <rect
                      key={`${x}-${y}`}
                      x={x * pixelSize}
                      y={y * pixelSize}
                      width={pixelSize}
                      height={pixelSize}
                      fill={getPixelColor(x, y)}
                    />
                  );
                }
                return null;
              })
            )}
            {/* Energy katana sword */}
            {swordPixels.map((pixel, i) => (
              <motion.rect
                key={`sword-${i}`}
                x={pixel.x * pixelSize}
                y={pixel.y * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={pixel.color}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            {/* Sword glow trail */}
            <motion.line
              x1={19 * pixelSize}
              y1={5 * pixelSize}
              x2={23 * pixelSize}
              y2={1 * pixelSize}
              stroke="hsl(180 100% 70% / 0.4)"
              strokeWidth={3}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </motion.div>

        {/* Easter egg popup */}
        <AnimatePresence>
          {currentEasterEgg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-12 right-0 px-3 py-1.5 bg-jules-dark/95 border border-jules-cyan/30 rounded font-mono text-xs text-jules-cyan whitespace-nowrap"
            >
              {currentEasterEgg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        <motion.div
          className="absolute -top-6 -left-12 font-mono text-[10px] text-jules-cyan/50 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: clickCount === 0 ? [0, 0.7, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        >
          click me
        </motion.div>
      </motion.div>

      {/* Secret Terminal Modal */}
      <AnimatePresence>
        {isOpen && secretUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 bg-jules-dark border border-jules-cyan/30 rounded-lg overflow-hidden font-mono"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-jules-dark/50 border-b border-jules-cyan/20">
                <div className="w-2.5 h-2.5 rounded-full bg-jules-magenta/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-jules-yellow/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-jules-green/80" />
                <span className="ml-2 text-jules-cyan/50 text-xs">ninja@terminal</span>
              </div>

              {/* Terminal body */}
              <div className="p-4 h-72 overflow-y-auto text-sm space-y-2">
                <p className="text-jules-cyan/70 text-xs">Type 'help' for commands</p>

                {commandHistory.map((entry, i) => (
                  <div key={i}>
                    <p className="text-jules-magenta/80">$ {entry.cmd}</p>
                    <p className="text-jules-cyan/70 pl-2">{entry.output}</p>
                  </div>
                ))}

                {/* Command input */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-jules-magenta/80">$</span>
                  <input
                    type="text"
                    value={typedCommand}
                    onChange={(e) => setTypedCommand(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent border-none outline-none text-jules-cyan text-sm"
                    placeholder=""
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PixelNinja;
