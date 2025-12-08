import { render, screen, fireEvent } from '@/utils/test-utils';
import { WorkoutCard } from '../WorkoutCard';

const mockWorkout = {
  id: '1',
  name: 'Full Body Strength',
  description: 'A comprehensive full body workout',
  duration: 45,
  difficulty: 'intermediate' as const,
  exercises: [
    { id: '1', name: 'Squats', sets: 3, reps: 12 },
    { id: '2', name: 'Push-ups', sets: 3, reps: 10 },
  ],
  targetMuscleGroups: ['Legs', 'Chest', 'Arms'],
  equipment: ['Dumbbells', 'Barbell'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  createdBy: {
    id: 'coach1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  },
  completions: 25,
  rating: 4.5,
  tags: ['strength', 'full-body'],
};

describe('WorkoutCard', () => {
  it('renders workout information correctly', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    expect(screen.getByText('Full Body Strength')).toBeInTheDocument();
    expect(screen.getByText('A comprehensive full body workout')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', () => {
    const onStart = jest.fn();
    render(<WorkoutCard workout={mockWorkout} onStart={onStart} />);

    fireEvent.click(screen.getByText('Start Workout'));
    expect(onStart).toHaveBeenCalledWith('1');
  });

  it('renders compact variant correctly', () => {
    render(<WorkoutCard workout={mockWorkout} variant="compact" />);

    expect(screen.getByText('Full Body Strength')).toBeInTheDocument();
    expect(screen.getByText('45min')).toBeInTheDocument();
    expect(screen.getByText('6 sets')).toBeInTheDocument();
    expect(screen.queryByText('A comprehensive full body workout')).not.toBeInTheDocument();
  });

  it('shows author information when showAuthor is true', () => {
    render(<WorkoutCard workout={mockWorkout} showAuthor />);

    expect(screen.getByText('by John Doe')).toBeInTheDocument();
  });

  it('shows completion stats when showStats is true', () => {
    render(<WorkoutCard workout={mockWorkout} showStats />);

    expect(screen.getByText('25 completions')).toBeInTheDocument();
  });
});
