import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { StatsCard } from '@/components/ui/StatsCard';
import { useWorkoutStore } from '@/stores/workoutStore';

const weightData = [
  { week: 'W1', weight: 185 },
  { week: 'W2', weight: 190 },
  { week: 'W3', weight: 195 },
  { week: 'W4', weight: 200 },
  { week: 'W5', weight: 205 },
  { week: 'W6', weight: 210 },
];

const personalRecords = [
  { exercise: 'Bench Press', weight: 225, date: 'Dec 1, 2024' },
  { exercise: 'Squat', weight: 315, date: 'Nov 28, 2024' },
  { exercise: 'Deadlift', weight: 405, date: 'Nov 25, 2024' },
  { exercise: 'Shoulder Press', weight: 135, date: 'Nov 20, 2024' },
];

export default function Progress() {
  const { currentStreak, longestStreak, totalWorkouts } = useWorkoutStore();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-muted-foreground">Track your fitness journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Current Streak"
          value={`${currentStreak} days`}
          icon={Calendar}
          color="warning"
        />
        <StatsCard
          title="Longest Streak"
          value={`${longestStreak} days`}
          icon={Award}
          color="success"
        />
        <StatsCard
          title="Total Workouts"
          value={totalWorkouts}
          icon={Target}
          color="primary"
        />
        <StatsCard
          title="This Month"
          value="12"
          subtitle="workouts"
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Strength Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4">Bench Press Progress</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightData}>
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} lbs`, 'Weight']}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Personal Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Personal Records
        </h2>
        <div className="space-y-3">
          {personalRecords.map((pr, index) => (
            <motion.div
              key={pr.exercise}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{pr.exercise}</p>
                <p className="text-xs text-muted-foreground">{pr.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{pr.weight} lbs</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

