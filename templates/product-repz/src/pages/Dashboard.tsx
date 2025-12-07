import { motion } from 'framer-motion';
import { Flame, Dumbbell, Clock, Trophy, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCard } from '@/components/ui/StatsCard';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { useWorkoutStore } from '@/stores/workoutStore';
import { formatDuration } from '@/lib/utils';

/**
 * REPZ Coach Dashboard
 * AI-Powered Fitness Coaching Platform by REPZ LLC
 * Tagline: Train Smarter. Get Stronger.
 */
export default function Dashboard() {
  const { currentStreak, totalWorkouts, getRecentWorkouts, getWeeklyStats } = useWorkoutStore();
  const recentWorkouts = getRecentWorkouts(3);
  const weeklyStats = getWeeklyStats();
  const totalCalories = weeklyStats.reduce((sum, d) => sum + d.calories, 0);
  const totalDuration = recentWorkouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="p-4 space-y-6">
      {/* REPZ Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold tracking-widest text-primary">REPZ COACH</span>
          </div>
          <h1 className="text-2xl font-bold">Train Smarter. Get Stronger. 💪</h1>
          <p className="text-muted-foreground">Your AI coach is ready to push your limits</p>
        </div>
        <StreakBadge streak={currentStreak} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="This Week"
          value={`${totalCalories}`}
          subtitle="calories burned"
          icon={Flame}
          color="warning"
        />
        <StatsCard
          title="Total Workouts"
          value={totalWorkouts}
          subtitle="all time"
          icon={Dumbbell}
          color="primary"
        />
        <StatsCard
          title="Time Active"
          value={formatDuration(totalDuration)}
          subtitle="this week"
          icon={Clock}
          color="success"
        />
        <StatsCard
          title="Best Streak"
          value={`${currentStreak} days`}
          subtitle="keep it up!"
          icon={Trophy}
          color="warning"
        />
      </div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4">Weekly Activity</h2>
        <WeeklyChart data={weeklyStats} />
      </motion.div>

      {/* Recent Workouts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Workouts</h2>
          <Link to="/workouts" className="text-sm text-primary font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WorkoutCard workout={workout} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Start Workout FAB */}
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

