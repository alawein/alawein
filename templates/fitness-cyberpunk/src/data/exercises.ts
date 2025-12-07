export interface ExerciseInfo {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  image?: string;
}

export const exercises: ExerciseInfo[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on a bench with feet on the floor',
      'Grip the bar slightly wider than shoulder-width',
      'Lower the bar to your chest',
      'Press the bar back up to starting position',
    ],
  },
  {
    id: '2',
    name: 'Squats',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body until thighs are parallel to floor',
      'Drive through your heels to stand back up',
    ],
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at hips and grip the bar',
      'Keep back flat and chest up',
      'Drive through heels and extend hips to stand',
    ],
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Pull-up Bar',
    difficulty: 'intermediate',
    instructions: [
      'Hang from bar with overhand grip',
      'Pull your body up until chin is over the bar',
      'Lower yourself with control',
      'Repeat for desired reps',
    ],
  },
  {
    id: '5',
    name: 'Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'None',
    difficulty: 'beginner',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches floor',
      'Push back up to starting position',
      'Keep core engaged throughout',
    ],
  },
  {
    id: '6',
    name: 'Lunges',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Dumbbells',
    difficulty: 'beginner',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower until both knees are at 90 degrees',
      'Push back to starting position',
    ],
  },
  {
    id: '7',
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: 'None',
    difficulty: 'beginner',
    instructions: [
      'Start in forearm plank position',
      'Keep body in straight line from head to heels',
      'Engage core and hold position',
      'Breathe steadily throughout',
    ],
  },
  {
    id: '8',
    name: 'Shoulder Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbells',
    difficulty: 'intermediate',
    instructions: [
      'Hold dumbbells at shoulder height',
      'Press weights overhead until arms are extended',
      'Lower back to starting position with control',
      'Keep core engaged throughout',
    ],
  },
];

export const categories = ['All', 'Strength', 'Bodyweight', 'Core', 'Cardio'];
export const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'];

