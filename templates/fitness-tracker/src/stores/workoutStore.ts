import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  calories: number;
  completed: boolean;
}

interface WorkoutStore {
  workouts: Workout[];
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getRecentWorkouts: (count: number) => Workout[];
  getWeeklyStats: () => { day: string; workouts: number; calories: number }[];
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      workouts: [
        {
          id: '1',
          name: 'Upper Body Power',
          date: new Date().toISOString(),
          duration: 3600,
          exercises: [
            { id: '1', name: 'Bench Press', sets: 4, reps: 8, weight: 185, completed: true },
            { id: '2', name: 'Shoulder Press', sets: 3, reps: 10, weight: 95, completed: true },
            { id: '3', name: 'Pull-ups', sets: 4, reps: 12, weight: 0, completed: true },
          ],
          calories: 450,
          completed: true,
        },
        {
          id: '2',
          name: 'Leg Day',
          date: new Date(Date.now() - 86400000).toISOString(),
          duration: 4200,
          exercises: [
            { id: '1', name: 'Squats', sets: 5, reps: 5, weight: 225, completed: true },
            { id: '2', name: 'Leg Press', sets: 4, reps: 10, weight: 360, completed: true },
            { id: '3', name: 'Lunges', sets: 3, reps: 12, weight: 50, completed: true },
          ],
          calories: 520,
          completed: true,
        },
      ],
      currentStreak: 5,
      longestStreak: 12,
      totalWorkouts: 47,

      addWorkout: (workout) => {
        const newWorkout = { ...workout, id: Date.now().toString() };
        set((state) => ({
          workouts: [newWorkout, ...state.workouts],
          totalWorkouts: state.totalWorkouts + 1,
        }));
      },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      deleteWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
        }));
      },

      getRecentWorkouts: (count) => {
        return get().workouts.slice(0, count);
      },

      getWeeklyStats: () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const stats = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayWorkouts = get().workouts.filter(
            (w) => new Date(w.date).toDateString() === date.toDateString()
          );
          stats.push({
            day: days[date.getDay()],
            workouts: dayWorkouts.length,
            calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
          });
        }

        return stats;
      },
    }),
    {
      name: 'workout-storage',
    }
  )
);

