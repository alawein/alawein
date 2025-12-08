import { render, screen, waitFor, fireEvent } from '@/utils/test-utils';
import { WorkoutList } from '../WorkoutList';
import { mockApiService } from '@/utils/test-utils';

const mockWorkouts = [
  {
    id: '1',
    name: 'Morning Cardio',
    duration: 30,
    difficulty: 'beginner',
    exercises: [],
    targetMuscleGroups: ['Cardio'],
    equipment: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: { id: '1', name: 'Coach' },
  },
  {
    id: '2',
    name: 'Strength Training',
    duration: 60,
    difficulty: 'advanced',
    exercises: [],
    targetMuscleGroups: ['Full Body'],
    equipment: ['Weights'],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: { id: '1', name: 'Coach' },
  },
];

describe('WorkoutList Integration', () => {
  beforeEach(() => {
    mockApiService.get.mockClear();
  });

  it('loads and displays workouts', async () => {
    mockApiService.get.mockResolvedValue({
      data: mockWorkouts,
      meta: { pagination: { total: 2 } },
    });

    render(<WorkoutList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Morning Cardio')).toBeInTheDocument();
      expect(screen.getByText('Strength Training')).toBeInTheDocument();
    });

    expect(mockApiService.get).toHaveBeenCalledWith('/workouts', expect.any(Object));
  });

  it('handles search functionality', async () => {
    mockApiService.get.mockResolvedValue({
      data: [mockWorkouts[0]],
      meta: { pagination: { total: 1 } },
    });

    render(<WorkoutList />);

    const searchInput = screen.getByPlaceholderText('Search workouts...');
    fireEvent.change(searchInput, { target: { value: 'cardio' } });

    await waitFor(() => {
      expect(mockApiService.get).toHaveBeenCalledWith('/workouts',
        expect.objectContaining({
          search: 'cardio',
        })
      );
    });
  });
});
