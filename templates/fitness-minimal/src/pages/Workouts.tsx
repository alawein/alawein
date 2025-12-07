import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Filter } from 'lucide-react';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { useWorkoutStore } from '@/stores/workoutStore';
import { format } from 'date-fns';

export default function Workouts() {
  const { workouts } = useWorkoutStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'planned'>('all');

  const filteredWorkouts = workouts.filter((w) => {
    if (filter === 'completed') return w.completed;
    if (filter === 'planned') return !w.completed;
    return true;
  });

  // Group by date
  const groupedWorkouts = filteredWorkouts.reduce((groups, workout) => {
    const date = format(new Date(workout.date), 'EEEE, MMM d');
    if (!groups[date]) groups[date] = [];
    groups[date].push(workout);
    return groups;
  }, {} as Record<string, typeof workouts>);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-accent">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-accent">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'completed', 'planned'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className="space-y-6">
        {Object.entries(groupedWorkouts).map(([date, dateWorkouts], groupIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
            <div className="space-y-3">
              {dateWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <WorkoutCard workout={workout} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No workouts found</p>
        </div>
      )}

      {/* Add workout button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

