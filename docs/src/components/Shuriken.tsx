import { motion } from 'framer-motion';

interface ShurikenProps {
  id: number;
  startX: number;
  startY: number;
  onComplete: (id: number) => void;
}

const Shuriken = ({ id, startX, startY, onComplete }: ShurikenProps) => {
  const angle = Math.random() * 360;
  const distance = 800 + Math.random() * 400;
  const endX = startX + Math.cos((angle * Math.PI) / 180) * distance;
  const endY = startY + Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className="fixed z-[55] pointer-events-none"
      initial={{ x: startX, y: startY, scale: 0, opacity: 1 }}
      animate={{ x: endX, y: endY, scale: 1, opacity: 0, rotate: 1080 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      onAnimationComplete={() => onComplete(id)}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14 10H22L12 14L14 22L12 18L10 22L12 14L2 10H10L12 2Z"
          fill="hsl(var(--jules-cyan))"
          style={{ filter: 'drop-shadow(0 0 6px hsl(var(--jules-cyan)))' }}
        />
      </svg>
    </motion.div>
  );
};

export default Shuriken;
