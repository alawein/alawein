// Supabase Service - Complete Integration Layer
// Centralized API service with type-safe functions
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Environment variables (set these in your .env file)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================================================
// TYPES
// ============================================================================

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: 'client' | 'coach' | 'admin';
  tier: 'foundation' | 'performance' | 'adaptive' | 'longevity';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  subscription_id?: string;
  stripe_customer_id?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientProfile = {
  id: string;
  user_id: string;
  coach_id?: string;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_level?: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  goals?: string[];
  injuries?: string[];
  medical_conditions?: string[];
  emergency_contact?: any;
  waiver_signed: boolean;
  waiver_signed_at?: string;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  client_id: string;
  coach_id?: string;
  template_id?: string;
  name: string;
  description?: string;
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  exercises: any;
  notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

export type WorkoutLog = {
  id: string;
  workout_id: string;
  client_id: string;
  exercise_id?: string;
  sets_completed: number;
  reps_completed: number;
  weight_kg: number;
  duration_seconds?: number;
  distance_meters?: number;
  notes?: string;
  rpe?: number;
  created_at: string;
};

export type Session = {
  id: string;
  client_id: string;
  coach_id: string;
  session_type: 'in_person' | 'video' | 'phone' | 'assessment';
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location?: string;
  video_url?: string;
  notes?: string;
  coach_notes?: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  read: boolean;
  read_at?: string;
  parent_id?: string;
  created_at: string;
};

export type BodyMeasurement = {
  id: string;
  client_id: string;
  date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  thigh_cm?: number;
  arm_cm?: number;
  notes?: string;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  tier: 'foundation' | 'performance' | 'adaptive' | 'longevity';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

export const authService = {
  // Sign up new user
  signUp: async (email: string, password: string, fullName: string, role: 'client' | 'coach' = 'client') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

export const profileService = {
  // Get profile by user ID
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update profile
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get client profile
  getClientProfile: async (userId: string): Promise<ClientProfile | null> => {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
    return data;
  },

  // Update client profile
  updateClientProfile: async (userId: string, updates: Partial<ClientProfile>) => {
    const { data, error } = await supabase
      .from('client_profiles')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// COACHING FUNCTIONS (For Coaches)
// ============================================================================

export const coachingService = {
  // Get all clients for a coach
  getClients: async (coachId: string) => {
    const { data, error } = await supabase
      .from('client_profiles')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name,
          avatar_url,
          tier,
          subscription_status
        )
      `)
      .eq('coach_id', coachId);
    
    if (error) throw error;
    return data;
  },

  // Get client details
  getClientDetails: async (clientId: string) => {
    const { data, error } = await supabase
      .from('client_profiles')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('user_id', clientId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create workout for client
  createWorkout: async (workout: Omit<Workout, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get workouts for coach (all clients)
  getCoachWorkouts: async (coachId: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        profiles:client_id (full_name)
      `)
      .eq('coach_id', coachId)
      .order('scheduled_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Schedule session
  createSession: async (session: Omit<Session, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get sessions for coach
  getCoachSessions: async (coachId: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        profiles:client_id (full_name)
      `)
      .eq('coach_id', coachId)
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// CLIENT FUNCTIONS (For Clients)
// ============================================================================

export const clientService = {
  // Get today's workout
  getTodayWorkout: async (clientId: string): Promise<Workout | null> => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('client_id', clientId)
      .eq('scheduled_date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get workouts for date range
  getWorkouts: async (clientId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('client_id', clientId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Log workout
  logWorkout: async (log: Omit<WorkoutLog, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get workout logs
  getWorkoutLogs: async (clientId: string, workoutId?: string) => {
    let query = supabase
      .from('workout_logs')
      .select('*')
      .eq('client_id', clientId);
    
    if (workoutId) {
      query = query.eq('workout_id', workoutId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get body measurements
  getBodyMeasurements: async (clientId: string, limit = 30) => {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Add body measurement
  addBodyMeasurement: async (measurement: Omit<BodyMeasurement, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('body_measurements')
      .insert(measurement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get upcoming sessions
  getSessions: async (clientId: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        profiles:coach_id (full_name)
      `)
      .eq('client_id', clientId)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// ============================================================================
// MESSAGING FUNCTIONS
// ============================================================================

export const messagingService = {
  // Get messages for user
  getMessages: async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (full_name),
        recipient:recipient_id (full_name)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Send message
  sendMessage: async (message: Omit<Message, 'id' | 'created_at' | 'read' | 'read_at'>) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ ...message, read: false })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return count || 0;
  }
};

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export const realtimeService = {
  // Subscribe to new messages
  subscribeToMessages: (userId: string, callback: (message: Message) => void) => {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },

  // Subscribe to workout updates
  subscribeToWorkouts: (clientId: string, callback: (workout: Workout) => void) => {
    return supabase
      .channel('workouts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => callback(payload.new as Workout)
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel: any) => {
    return supabase.removeChannel(channel);
  }
};

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

export const storageService = {
  // Upload avatar
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Upload workout video
  uploadWorkoutVideo: async (exerciseId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${exerciseId}-${Date.now()}.${fileExt}`;
    const filePath = `workout-videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('workout-videos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('workout-videos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Delete file
  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const helperService = {
  // Check if user has minimum tier
  hasMinimumTier: async (userId: string, requiredTier: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('has_minimum_tier', {
      user_id: userId,
      required_tier: requiredTier
    });

    if (error) throw error;
    return data;
  },

  // Get client's coach
  getClientCoach: async (clientUserId: string) => {
    const { data, error } = await supabase.rpc('get_client_coach', {
      client_user_id: clientUserId
    });

    if (error) throw error;
    return data;
  }
};

// Export everything
export default {
  supabase,
  auth: authService,
  profile: profileService,
  coaching: coachingService,
  client: clientService,
  messaging: messagingService,
  realtime: realtimeService,
  storage: storageService,
  helper: helperService
};
