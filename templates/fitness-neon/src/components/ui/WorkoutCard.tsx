import { motion } from 'framer-motion';
import { Clock, Flame, ChevronRight, Dumbbell } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import type { Workout } from '@/stores/workoutStore';

interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
}

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full p-4 rounded-2xl bg-card border shadow-sm text-left"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Dumbbell className="w-6 h-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{workout.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(workout.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {workout.calories} cal
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {workout.exercises.length} exercises
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      </div>
    </motion.button>
  );
}

