// Client Portal - Complete Implementation
// All-in-one elegant approach: 900 lines, everything in one place
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import {
  Dumbbell, TrendingUp, Calendar as CalendarIcon, MessageSquare,
  Target, Award, Clock, CheckCircle, Play, Video, Image as ImageIcon,
  Send, Plus, ChevronRight, Activity, Heart, Zap
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

type Workout = {
  id: string;
  name: string;
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  exercises: Exercise[];
  notes?: string;
  completed_at?: string;
};

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  video_url?: string;
  thumbnail_url?: string;
  instructions?: string[];
  completed_sets?: number;
};

type WorkoutLog = {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_name: string;
  sets_completed: number;
  reps_completed: number;
  weight_kg: number;
  notes?: string;
  rpe?: number;
  created_at: string;
};

type BodyMeasurement = {
  id: string;
  date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
};

type PerformanceMetric = {
  id: string;
  date: string;
  metric_name: string;
  value: number;
  unit: string;
};

type Message = {
  id: string;
  sender_name: string;
  content: string;
  created_at: string;
  read: boolean;
};

type Session = {
  id: string;
  session_type: 'in_person' | 'video' | 'phone' | 'assessment';
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  coach_name: string;
  location?: string;
  notes?: string;
};

type Goal = {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'missed';
};

// ============================================================================
// MOCK DATA & API
// ============================================================================

const mockTodayWorkout: Workout = {
  id: '1',
  name: 'Upper Body Strength',
  scheduled_date: new Date().toISOString(),
  status: 'scheduled',
  exercises: [
    {
      id: '1',
      name: 'Bench Press',
      sets: 4,
      reps: 8,
      weight: 185,
      video_url: '/videos/bench-press.mp4',
      instructions: ['Lie flat on bench', 'Grip bar slightly wider than shoulders', 'Lower to chest', 'Press up explosively'],
      completed_sets: 0
    },
    {
      id: '2',
      name: 'Pull-ups',
      sets: 3,
      reps: 10,
      instructions: ['Hang from bar with overhand grip', 'Pull chin over bar', 'Lower with control'],
      completed_sets: 0
    },
    {
      id: '3',
      name: 'Shoulder Press',
      sets: 3,
      reps: 12,
      weight: 65,
      instructions: ['Start with dumbbells at shoulder height', 'Press overhead', 'Lower with control'],
      completed_sets: 0
    }
  ]
};

const mockWeekWorkouts: Workout[] = [
  mockTodayWorkout,
  {
    id: '2',
    name: 'Lower Body Power',
    scheduled_date: addDays(new Date(), 2).toISOString(),
    status: 'scheduled',
    exercises: [
      { id: '4', name: 'Squats', sets: 4, reps: 6, weight: 225, completed_sets: 0 },
      { id: '5', name: 'Romanian Deadlifts', sets: 3, reps: 8, weight: 185, completed_sets: 0 }
    ]
  }
];

const mockProgressData = [
  { date: '2024-12-01', weight: 185, bodyFat: 18 },
  { date: '2024-12-08', weight: 183, bodyFat: 17.5 },
  { date: '2024-12-15', weight: 182, bodyFat: 17 },
  { date: '2024-12-22', weight: 180, bodyFat: 16.5 },
  { date: '2024-12-29', weight: 179, bodyFat: 16 },
  { date: '2025-01-05', weight: 178, bodyFat: 15.5 }
];

const mockPerformanceData = [
  { exercise: 'Bench Press', week1: 175, week2: 180, week3: 185, week4: 190 },
  { exercise: 'Squat', week1: 205, week2: 215, week3: 220, week4: 225 },
  { exercise: 'Deadlift', week1: 275, week2: 285, week3: 295, week4: 305 }
];

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Lose 10 lbs',
    target_value: 175,
    current_value: 178,
    unit: 'lbs',
    deadline: '2025-03-01',
    status: 'active'
  },
  {
    id: '2',
    title: 'Bench 225 lbs',
    target_value: 225,
    current_value: 190,
    unit: 'lbs',
    deadline: '2025-04-01',
    status: 'active'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender_name: 'Coach Mike',
    content: 'Great work on yesterday\'s workout! Let\'s increase the weight on bench press next week.',
    created_at: '2025-01-06T10:30:00',
    read: false
  }
];

const mockSessions: Session[] = [
  {
    id: '1',
    session_type: 'video',
    scheduled_at: '2025-01-08T10:00:00',
    duration_minutes: 60,
    status: 'scheduled',
    coach_name: 'Coach Mike',
    notes: 'Form check and program review'
  }
];

// API Functions (Mock - replace with Supabase)
const fetchTodayWorkout = async (): Promise<Workout | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTodayWorkout;
};

const fetchWeekWorkouts = async (): Promise<Workout[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWeekWorkouts;
};

const fetchProgressData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProgressData;
};

const fetchPerformanceData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPerformanceData;
};

const fetchGoals = async (): Promise<Goal[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockGoals;
};

const fetchMessages = async (): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMessages;
};

const fetchSessions = async (): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSessions;
};

const logWorkout = async (log: Partial<WorkoutLog>): Promise<WorkoutLog> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...log, id: Date.now().toString(), created_at: new Date().toISOString() } as WorkoutLog;
};

const sendMessage = async (content: string): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Date.now().toString(),
    sender_name: 'You',
    content,
    created_at: new Date().toISOString(),
    read: true
  };
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Exercise Card with Logging
const ExerciseCard = ({ exercise, onLog }: { exercise: Exercise; onLog: (sets: number, reps: number, weight: number, rpe: number) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [weight, setWeight] = useState(exercise.weight || 0);
  const [rpe, setRpe] = useState(7);

  const handleLog = () => {
    onLog(sets, reps, weight, rpe);
    toast.success(`${exercise.name} logged!`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exercise.sets} sets × {exercise.reps} reps
              {exercise.weight && ` @ ${exercise.weight} lbs`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={exercise.completed_sets === exercise.sets ? 'default' : 'secondary'}>
              {exercise.completed_sets || 0}/{exercise.sets}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {exercise.video_url && (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {exercise.instructions && (
              <div>
                <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {exercise.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Sets</label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Reps</label>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Weight</label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">RPE</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={rpe}
                  onChange={(e) => setRpe(parseInt(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>

            <Button onClick={handleLog} className="w-full" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Log Set
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Today's Workout Section
const TodayWorkout = () => {
  const { data: workout, isLoading } = useQuery({
    queryKey: ['today-workout'],
    queryFn: fetchTodayWorkout
  });

  const queryClient = useQueryClient();
  const logMutation = useMutation({
    mutationFn: logWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-workout'] });
    }
  });

  const handleLogExercise = (exerciseId: string, sets: number, reps: number, weight: number, rpe: number) => {
    if (!workout) return;
    
    logMutation.mutate({
      workout_id: workout.id,
      exercise_id: exerciseId,
      exercise_name: workout.exercises.find(e => e.id === exerciseId)?.name || '',
      sets_completed: sets,
      reps_completed: reps,
      weight_kg: weight * 0.453592, // Convert lbs to kg
      rpe
    });
  };

  if (isLoading) {
    return <Card className="h-96 animate-pulse bg-muted" />;
  }

  if (!workout) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workout scheduled today</h3>
          <p className="text-muted-foreground">Enjoy your rest day!</p>
        </CardContent>
      </Card>
    );
  }

  const completedExercises = workout.exercises.filter(e => e.completed_sets === e.sets).length;
  const progress = (completedExercises / workout.exercises.length) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{workout.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {completedExercises} of {workout.exercises.length} exercises completed
              </p>
            </div>
            <Badge variant={workout.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
              {workout.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <div className="space-y-3">
            {workout.exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onLog={(sets, reps, weight, rpe) => handleLogExercise(exercise.id, sets, reps, weight, rpe)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Week Calendar View
const WeekCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: workouts = [] } = useQuery({
    queryKey: ['week-workouts'],
    queryFn: fetchWeekWorkouts
  });

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getWorkoutForDay = (date: Date) => {
    return workouts.find(w => isSameDay(new Date(w.scheduled_date), date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const workout = getWorkoutForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 rounded-lg border text-center cursor-pointer transition-colors",
                  isToday && "border-orange-500 bg-orange-50 dark:bg-orange-950",
                  workout && "bg-muted"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className={cn("text-lg font-semibold", isToday && "text-orange-500")}>
                  {format(day, 'd')}
                </div>
                {workout && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {workout.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Dumbbell className="h-3 w-3" />}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Progress Charts
const ProgressCharts = () => {
  const { data: progressData = [] } = useQuery({
    queryKey: ['progress-data'],
    queryFn: fetchProgressData
  });

  const { data: performanceData = [] } = useQuery({
    queryKey: ['performance-data'],
    queryFn: fetchPerformanceData
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weight & Body Fat</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM d')} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#f97316" name="Weight (lbs)" />
              <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#3b82f6" name="Body Fat (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strength Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exercise" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="week1" fill="#94a3b8" name="Week 1" />
              <Bar dataKey="week2" fill="#64748b" name="Week 2" />
              <Bar dataKey="week3" fill="#475569" name="Week 3" />
              <Bar dataKey="week4" fill="#f97316" name="Week 4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Goals Section
const GoalsSection = () => {
  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.map(goal => {
        const progress = (goal.current_value / goal.target_value) * 100;
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        return (
          <Card key={goal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>
                </div>
                <Target className="h-5 w-5 text-orange-500" />
              </div>

              <Progress value={progress} className="mb-3" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{daysLeft} days left</span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Messages Section
const MessagesSection = () => {
  const [newMessage, setNewMessage] = useState('');
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages
  });

  const queryClient = useQueryClient();
  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setNewMessage('');
      toast.success('Message sent!');
    }
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMutation.mutate(newMessage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages with Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg",
                message.sender_name === 'You' ? 'bg-orange-100 dark:bg-orange-950 ml-12' : 'bg-muted mr-12'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{message.sender_name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.created_at), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={2}
          />
          <Button onClick={handleSend} disabled={sendMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Sessions Section
const SessionsSection = () => {
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  });

  const typeIcons = {
    in_person: <Activity className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    phone: <MessageSquare className="h-4 w-4" />,
    assessment: <CheckCircle className="h-4 w-4" />
  };

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <Card key={session.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {typeIcons[session.session_type]}
                  <h3 className="font-semibold capitalize">{session.session_type.replace('_', ' ')}</h3>
                </div>
                <p className="text-sm text-muted-foreground">with {session.coach_name}</p>
              </div>
              <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(session.scheduled_at), 'EEEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(session.scheduled_at), 'h:mm a')} ({session.duration_minutes} min)</span>
              </div>
            </div>

            {session.notes && (
              <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                {session.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main Client Portal
export const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Training</h1>
            <p className="text-muted-foreground">Track your progress and stay on top of your goals</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              Performance Tier
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">4/5</p>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                </div>
                <Dumbbell className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold">178</p>
                  <p className="text-xs text-green-500">-2 lbs this week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Session</p>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">
              <Activity className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="workout">
              <Dumbbell className="h-4 w-4 mr-2" />
              Today's Workout
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="h-4 w-4 mr-2" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <WeekCalendar />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Workout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{mockTodayWorkout.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {mockTodayWorkout.exercises.length} exercises
                        </p>
                      </div>
                      <Button onClick={() => setActiveTab('workout')}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <GoalsSection />
              </div>

              <div className="space-y-6">
                <MessagesSection />
                <SessionsSection />
              </div>
            </div>
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout">
            <TodayWorkout />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressCharts />
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Measurements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProgressData.slice(-3).reverse().map((data, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{format(new Date(data.date), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">Weight & Body Fat</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{data.weight} lbs</p>
                        <p className="text-sm text-muted-foreground">{data.bodyFat}% BF</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Measurement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Goals</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </div>
            <GoalsSection />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <MessagesSection />
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </div>
            <SessionsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Export as default
export default ClientPortal;
