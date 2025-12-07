import { motion } from 'framer-motion';
import { User, Settings, Bell, Moon, LogOut, ChevronRight, Award, Target } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';

const menuItems = [
  { icon: User, label: 'Edit Profile', path: '/profile/edit' },
  { icon: Target, label: 'Goals', path: '/profile/goals' },
  { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
  { icon: Moon, label: 'Dark Mode', path: '/profile/theme', toggle: true },
  { icon: Settings, label: 'Settings', path: '/profile/settings' },
];

export default function Profile() {
  const { totalWorkouts, currentStreak, longestStreak } = useWorkoutStore();

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-muted-foreground">Fitness Enthusiast</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-card border"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{totalWorkouts}</p>
          <p className="text-xs text-muted-foreground">Workouts</p>
        </div>
        <div className="text-center border-x">
          <p className="text-2xl font-bold text-primary">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['🔥', '💪', '🏆', '⭐', '🎯'].map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl shrink-0"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card border overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors border-b last:border-0"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.toggle ? (
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log Out</span>
      </motion.button>
    </div>
  );
}

