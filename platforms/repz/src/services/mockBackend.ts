/**
 * Mock Backend Service
 * This replaces Supabase entirely for testing and development
 * Can be easily replaced with Vercel Functions or any other backend
 */

interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'client' | 'coach';
  createdAt: Date;
}

interface Workout {
  id: string;
  clientId: string;
  coachId: string;
  name: string;
  exercises: any[];
  scheduledDate: Date;
  status: 'scheduled' | 'completed';
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

class MockBackend {
  private users: Map<string, User> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private messages: Map<string, Message> = new Map();
  private currentUser: User | null = null;

  constructor() {
    // Load from localStorage if available
    this.loadFromStorage();

    // Add some test data
    this.seedTestData();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    const storedUsers = localStorage.getItem('mockUsers');
    const storedWorkouts = localStorage.getItem('mockWorkouts');
    const storedMessages = localStorage.getItem('mockMessages');

    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      users.forEach((user: User) => this.users.set(user.id, user));
    }

    if (storedWorkouts) {
      const workouts = JSON.parse(storedWorkouts);
      workouts.forEach((workout: Workout) => this.workouts.set(workout.id, workout));
    }

    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      messages.forEach((message: Message) => this.messages.set(message.id, message));
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    localStorage.setItem('mockUsers', JSON.stringify(Array.from(this.users.values())));
    localStorage.setItem('mockWorkouts', JSON.stringify(Array.from(this.workouts.values())));
    localStorage.setItem('mockMessages', JSON.stringify(Array.from(this.messages.values())));
  }

  private seedTestData() {
    // Only seed if no users exist
    if (this.users.size > 0) return;

    // Add test coach
    const coach: User = {
      id: 'coach-1',
      email: 'coach@repz.com',
      password: 'TestPass123!',
      fullName: 'Sarah Coach',
      role: 'coach',
      createdAt: new Date()
    };
    this.users.set(coach.id, coach);

    // Add test client
    const client: User = {
      id: 'client-1',
      email: 'client@repz.com',
      password: 'TestPass123!',
      fullName: 'Mike Client',
      role: 'client',
      createdAt: new Date()
    };
    this.users.set(client.id, client);

    // Add test workout
    const workout: Workout = {
      id: 'workout-1',
      clientId: client.id,
      coachId: coach.id,
      name: 'Upper Body Strength',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 10 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Bench Press', sets: 4, reps: 10 }
      ],
      scheduledDate: new Date(),
      status: 'scheduled'
    };
    this.workouts.set(workout.id, workout);

    this.saveToStorage();
  }

  // Authentication Methods
  async signUp(email: string, password: string, fullName: string, role: 'client' | 'coach'): Promise<{ user: User | null; error: string | null }> {
    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === email);
    if (existingUser) {
      return { user: null, error: 'User already exists' };
    }

    // Create new user
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      password, // In production, this would be hashed
      fullName,
      role,
      createdAt: new Date()
    };

    this.users.set(user.id, user);
    this.currentUser = user;
    this.saveToStorage();

    // Store auth token
    localStorage.setItem('authToken', user.id);

    return { user, error: null };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const user = Array.from(this.users.values()).find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return { user: null, error: 'Invalid credentials' };
    }

    this.currentUser = user;
    localStorage.setItem('authToken', user.id);

    return { user, error: null };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    const token = localStorage.getItem('authToken');
    if (token) {
      this.currentUser = this.users.get(token) || null;
    }

    return this.currentUser;
  }

  // Workout Methods
  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      w => w.clientId === userId || w.coachId === userId
    );
  }

  async createWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}`
    };

    this.workouts.set(newWorkout.id, newWorkout);
    this.saveToStorage();

    return newWorkout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | null> {
    const workout = this.workouts.get(id);
    if (!workout) return null;

    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    this.saveToStorage();

    return updatedWorkout;
  }

  // Message Methods
  async getMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      m => m.senderId === userId || m.recipientId === userId
    );
  }

  async sendMessage(senderId: string, recipientId: string, content: string): Promise<Message> {
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      recipientId,
      content,
      createdAt: new Date(),
      isRead: false
    };

    this.messages.set(message.id, message);
    this.saveToStorage();

    // Simulate real-time update
    window.dispatchEvent(new CustomEvent('newMessage', { detail: message }));

    return message;
  }

  async markMessageAsRead(id: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.isRead = true;
      this.messages.set(id, message);
      this.saveToStorage();
    }
  }

  // Client Management (for coaches)
  async getClients(coachId: string): Promise<User[]> {
    // In a real app, this would check client-coach relationships
    return Array.from(this.users.values()).filter(u => u.role === 'client');
  }

  // Dashboard Stats
  async getDashboardStats(userId: string): Promise<any> {
    const user = this.users.get(userId);
    if (!user) return null;

    const workouts = await this.getWorkouts(userId);
    const messages = await this.getMessages(userId);

    return {
      totalWorkouts: workouts.length,
      completedWorkouts: workouts.filter(w => w.status === 'completed').length,
      unreadMessages: messages.filter(m => !m.isRead && m.recipientId === userId).length,
      currentWeight: 75, // Mock data
      weekStreak: 3,
      upcomingSessions: 2
    };
  }

  // Reset all data (for testing)
  async resetAllData(): Promise<void> {
    this.users.clear();
    this.workouts.clear();
    this.messages.clear();
    this.currentUser = null;

    localStorage.removeItem('mockUsers');
    localStorage.removeItem('mockWorkouts');
    localStorage.removeItem('mockMessages');
    localStorage.removeItem('authToken');

    this.seedTestData();
  }
}

// Export singleton instance
export const mockBackend = new MockBackend();

// Export for components to use
export default mockBackend;