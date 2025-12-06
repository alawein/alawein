import { motion } from 'framer-motion';

interface RetroGridProps {
  color?: string;
  opacity?: number;
}

export const RetroGrid = ({
  color = 'rgba(255, 113, 206, 0.3)',
  opacity = 0.5,
}: RetroGridProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '500px' }}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, ${color} 1px, transparent 1px),
            linear-gradient(0deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) translateY(-50%)',
          transformOrigin: 'center center',
          opacity,
        }}
        animate={{
          backgroundPositionY: ['0px', '40px'],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default RetroGrid;
