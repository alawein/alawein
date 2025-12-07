import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-pulse-ring" />

      {/* Badge */}
      <div
        className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex flex-col items-center justify-center text-white shadow-lg`}
      >
        <Flame className={iconSizes[size]} />
        <span className="font-bold">{streak}</span>
      </div>
    </motion.div>
  );
}

