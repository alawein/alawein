import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Moon, Dumbbell, Target, Shield, ChevronRight, Zap } from 'lucide-react';
import { useState } from 'react';

/**
 * REPZ Settings
 * AI Fitness Coaching Platform by REPZ LLC
 */
const settingsGroups = [
  {
    title: 'Profile',
    items: [
      { icon: User, label: 'Personal Information', description: 'Name, email, photo', href: '/profile' },
      { icon: Target, label: 'Fitness Goals', description: 'Weight, strength, endurance', href: '/goals' },
      { icon: Dumbbell, label: 'Equipment', description: 'Available gym equipment', href: '/equipment' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', description: 'Reminders, achievements', toggle: true, enabled: true },
      { icon: Moon, label: 'Dark Mode', description: 'Reduce eye strain', toggle: true, enabled: true },
      { icon: Zap, label: 'AI Coach', description: 'Personalized recommendations', toggle: true, enabled: true },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: Shield, label: 'Privacy', description: 'Data sharing, visibility', href: '/privacy' },
    ],
  },
];

const fitnessSettings = {
  weeklyGoal: 5,
  restDayReminders: true,
  autoProgressPhotos: false,
  unitSystem: 'imperial',
};

export default function Settings() {
  const [settings, setSettings] = useState(fitnessSettings);

  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">REPZ COACH</span>
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your training experience</p>
      </div>

      {/* Workout Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4">Weekly Workout Goal</h2>
        <div className="flex items-center gap-4">
          {[3, 4, 5, 6, 7].map((days) => (
            <button
              key={days}
              onClick={() => setSettings({ ...settings, weeklyGoal: days })}
              className={`w-12 h-12 rounded-xl font-bold transition-colors ${settings.weeklyGoal === days ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
            >
              {days}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{settings.weeklyGoal} workouts per week</p>
      </motion.div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="space-y-2"
        >
          <h2 className="text-sm font-semibold text-muted-foreground px-1">{group.title}</h2>
          <div className="rounded-2xl bg-card border overflow-hidden">
            {group.items.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-4 ${index < group.items.length - 1 ? 'border-b' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.toggle ? (
                  <button className={`w-12 h-7 rounded-full transition-colors ${item.enabled ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Unit System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <h2 className="font-semibold mb-4">Unit System</h2>
        <div className="flex gap-2">
          {['imperial', 'metric'].map((unit) => (
            <button
              key={unit}
              onClick={() => setSettings({ ...settings, unitSystem: unit })}
              className={`flex-1 py-3 rounded-xl font-medium capitalize transition-colors ${settings.unitSystem === unit ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
            >
              {unit} ({unit === 'imperial' ? 'lbs/ft' : 'kg/cm'})
            </button>
          ))}
        </div>
      </motion.div>

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>REPZ Coach v2.4.1</p>
        <p className="mt-1">© 2024 REPZ LLC. All rights reserved.</p>
      </div>
    </div>
  );
}

