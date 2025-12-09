// Coaching Portal - Complete Implementation
// All-in-one elegant approach: 800 lines, everything in one place
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { 
  Users, Plus, Search, Filter, Calendar as CalendarIcon, 
  MessageSquare, Dumbbell, TrendingUp, Clock, CheckCircle,
  XCircle, AlertCircle, Send, Video, Phone, MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type Client = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  tier: 'foundation' | 'performance' | 'adaptive' | 'longevity';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  fitness_level?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  goals?: string[];
  last_workout?: string;
  next_session?: string;
  progress_score?: number;
};

type Workout = {
  id: string;
  client_id: string;
  client_name: string;
  name: string;
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  exercises: Exercise[];
  notes?: string;
};

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
};

type Session = {
  id: string;
  client_id: string;
  client_name: string;
  session_type: 'in_person' | 'video' | 'phone' | 'assessment';
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location?: string;
  notes?: string;
};

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  recipient_name: string;
  subject?: string;
  content: string;
  read: boolean;
  created_at: string;
};

// ============================================================================
// MOCK API (Replace with real Supabase calls)
// ============================================================================

const mockClients: Client[] = [
  {
    id: '1',
    user_id: 'user1',
    full_name: 'John Doe',
    email: 'john@example.com',
    tier: 'performance',
    subscription_status: 'active',
    fitness_level: 'intermediate',
    goals: ['Build muscle', 'Lose fat'],
    last_workout: '2025-01-05',
    next_session: '2025-01-08',
    progress_score: 85
  },
  {
    id: '2',
    user_id: 'user2',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    tier: 'adaptive',
    subscription_status: 'active',
    fitness_level: 'advanced',
    goals: ['Marathon training', 'Improve endurance'],
    last_workout: '2025-01-06',
    next_session: '2025-01-09',
    progress_score: 92
  }
];

const fetchClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockClients;
};

const fetchWorkouts = async (): Promise<Workout[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      client_id: '1',
      client_name: 'John Doe',
      name: 'Upper Body Strength',
      scheduled_date: '2025-01-08',
      status: 'scheduled',
      exercises: [
        { id: '1', name: 'Bench Press', sets: 4, reps: 8, weight: 185 },
        { id: '2', name: 'Pull-ups', sets: 3, reps: 10 },
        { id: '3', name: 'Shoulder Press', sets: 3, reps: 12, weight: 65 }
      ]
    }
  ];
};

const fetchSessions = async (): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      client_id: '1',
      client_name: 'John Doe',
      session_type: 'video',
      scheduled_at: '2025-01-08T10:00:00',
      duration_minutes: 60,
      status: 'scheduled',
      notes: 'Form check and program review'
    }
  ];
};

const fetchMessages = async (): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      sender_id: 'user1',
      recipient_id: 'coach1',
      recipient_name: 'John Doe',
      subject: 'Question about workout',
      content: 'Should I increase weight on squats?',
      read: false,
      created_at: '2025-01-06T14:30:00'
    }
  ];
};

const createWorkout = async (workout: Partial<Workout>): Promise<Workout> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...workout, id: Date.now().toString() } as Workout;
};

const createSession = async (session: Partial<Session>): Promise<Session> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...session, id: Date.now().toString() } as Session;
};

const sendMessage = async (message: Partial<Message>): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...message, id: Date.now().toString(), created_at: new Date().toISOString() } as Message;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Client Card
const ClientCard = ({ client, onClick }: { client: Client; onClick: () => void }) => {
  const tierColors = {
    foundation: 'bg-gray-500',
    performance: 'bg-blue-500',
    adaptive: 'bg-purple-500',
    longevity: 'bg-orange-500'
  };

  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    cancelled: 'bg-red-500',
    past_due: 'bg-yellow-500'
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {client.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold">{client.full_name}</h3>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <Badge className={cn(tierColors[client.tier], 'text-white')}>
            {client.tier}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge className={cn(statusColors[client.subscription_status], 'text-white text-xs')}>
              {client.subscription_status}
            </Badge>
          </div>
          
          {client.fitness_level && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-medium capitalize">{client.fitness_level}</span>
            </div>
          )}

          {client.progress_score && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                    style={{ width: `${client.progress_score}%` }}
                  />
                </div>
                <span className="font-medium">{client.progress_score}%</span>
              </div>
            </div>
          )}

          {client.next_session && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 pt-3 border-t">
              <CalendarIcon className="h-4 w-4" />
              <span>Next: {format(new Date(client.next_session), 'MMM d, h:mm a')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Workout Card
const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const statusIcons = {
    scheduled: <Clock className="h-4 w-4" />,
    in_progress: <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
    skipped: <XCircle className="h-4 w-4" />
  };

  const statusColors = {
    scheduled: 'text-blue-500',
    in_progress: 'text-yellow-500',
    completed: 'text-green-500',
    skipped: 'text-red-500'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{workout.name}</h3>
            <p className="text-sm text-muted-foreground">{workout.client_name}</p>
          </div>
          <div className={cn("flex items-center gap-1", statusColors[workout.status])}>
            {statusIcons[workout.status]}
            <span className="text-sm capitalize">{workout.status}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          {format(new Date(workout.scheduled_date), 'EEEE, MMM d, yyyy')}
        </div>

        <div className="space-y-2">
          {workout.exercises.map((exercise, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <span>{exercise.name}</span>
              <span className="text-muted-foreground">
                {exercise.sets}x{exercise.reps}
                {exercise.weight && ` @ ${exercise.weight}lbs`}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Session Card
const SessionCard = ({ session }: { session: Session }) => {
  const typeIcons = {
    in_person: <MapPin className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
    assessment: <CheckCircle className="h-4 w-4" />
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{session.client_name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              {typeIcons[session.session_type]}
              <span className="capitalize">{session.session_type.replace('_', ' ')}</span>
            </div>
          </div>
          <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
            {session.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(session.scheduled_at), 'MMM d, yyyy h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{session.duration_minutes} minutes</span>
          </div>
          {session.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{session.location}</span>
            </div>
          )}
        </div>

        {session.notes && (
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
            {session.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Create Workout Dialog
const CreateWorkoutDialog = ({ clients }: { clients: Client[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout created successfully!');
      setOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setSelectedClient('');
    setWorkoutName('');
    setScheduledDate(undefined);
    setExercises([]);
  };

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: '', sets: 3, reps: 10 }]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSubmit = () => {
    if (!selectedClient || !workoutName || !scheduledDate || exercises.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    createMutation.mutate({
      client_id: selectedClient,
      client_name: client?.full_name || '',
      name: workoutName,
      scheduled_date: scheduledDate.toISOString(),
      status: 'scheduled',
      exercises
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Workout Name</label>
            <Input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Upper Body Strength"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Scheduled Date</label>
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={setScheduledDate}
              className="rounded-md border"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Exercises</label>
              <Button size="sm" variant="outline" onClick={addExercise}>
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-2">
                      <Input
                        className="col-span-5"
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        placeholder="Weight"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value))}
                      />
                      <Button
                        className="col-span-1"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Workout'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Schedule Session Dialog
const ScheduleSessionDialog = ({ clients }: { clients: Client[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [sessionType, setSessionType] = useState<Session['session_type']>('video');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session scheduled successfully!');
      setOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setSelectedClient('');
    setSessionType('video');
    setScheduledDate(undefined);
    setDuration(60);
    setLocation('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!selectedClient || !scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    createMutation.mutate({
      client_id: selectedClient,
      client_name: client?.full_name || '',
      session_type: sessionType,
      scheduled_at: scheduledDate.toISOString(),
      duration_minutes: duration,
      status: 'scheduled',
      location: sessionType === 'in_person' ? location : undefined,
      notes
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Session Type</label>
            <Select value={sessionType} onValueChange={(v) => setSessionType(v as Session['session_type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="in_person">In-Person</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={setScheduledDate}
              className="rounded-md border"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>

          {sessionType === 'in_person' && (
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Coaching Portal
export const CoachingPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages
  });

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadMessages = messages.filter(m => !m.read).length;
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').length;
  const activeClients = clients.filter(c => c.subscription_status === 'active').length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coaching Portal</h1>
            <p className="text-muted-foreground">Manage your clients and programs</p>
          </div>
          <div className="flex gap-2">
            <CreateWorkoutDialog clients={clients} />
            <ScheduleSessionDialog clients={clients} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-3xl font-bold">{activeClients}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                  <p className="text-3xl font-bold">{upcomingSessions}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-3xl font-bold">{unreadMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workouts This Week</p>
                  <p className="text-3xl font-bold">{workouts.length}</p>
                </div>
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clients">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="workouts">
              <Dumbbell className="h-4 w-4 mr-2" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
              {unreadMessages > 0 && (
                <Badge className="ml-2" variant="destructive">{unreadMessages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {clientsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-48 animate-pulse bg-muted" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={() => setSelectedClient(client)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            {workoutsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted" />
                ))}
              </div>
            ) : workouts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workouts scheduled</h3>
                  <p className="text-muted-foreground mb-4">Create your first workout to get started</p>
                  <CreateWorkoutDialog clients={clients} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            {sessionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="h-48 animate-pulse bg-muted" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
                  <p className="text-muted-foreground mb-4">Schedule your first session</p>
                  <ScheduleSessionDialog clients={clients} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {messagesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="h-24 animate-pulse bg-muted" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages</h3>
                  <p className="text-muted-foreground">Your inbox is empty</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <Card key={message.id} className={cn(!message.read && 'border-orange-500')}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{message.recipient_name}</h3>
                          {message.subject && (
                            <p className="text-sm text-muted-foreground">{message.subject}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!message.read && (
                            <Badge variant="destructive" className="text-xs">New</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Export as default
export default CoachingPortal;
