import React, { memo } from 'react';
import { Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface Workout {
  id: string;
  name: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  completedAt?: Date;
  targetMuscleGroups: string[];
}

interface WorkoutCardProps {
  workout: Workout;
  onStart?: (workoutId: string) => void;
  onView?: (workoutId: string) => void;
  className?: string;
}

export const WorkoutCard = memo<WorkoutCardProps>(({
  workout,
  onStart,
  onView,
  className = ''
}) => {
  const getDifficultyColor = (difficulty: Workout['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCompleted = Boolean(workout.completedAt);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{workout.name}</span>
          <Badge className={getDifficultyColor(workout.difficulty)}>
            {workout.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{workout.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{workout.exercises.length} exercises</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {workout.targetMuscleGroups.slice(0, 3).map((muscle) => (
              <Badge key={muscle} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
            {workout.targetMuscleGroups.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{workout.targetMuscleGroups.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(workout.id)}
              className="flex-1"
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

WorkoutCard.displayName = 'WorkoutCard';
