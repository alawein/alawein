/**
 * Vercel Backend Service
 * Complete replacement for Supabase
 * Uses Vercel API Functions + Local Storage fallback
 */

// Vercel API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://repz.vercel.app/api'
  : '/api';

// Auth token storage
const AUTH_TOKEN_KEY = 'repz_auth_token';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'coach' | 'admin';
  createdAt: string;
}

interface Workout {
  id: string;
  clientId: string;
  coachId: string;
  name: string;
  exercises: any[];
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'skipped';
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

class VercelBackend {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(AUTH_TOKEN_KEY);
    }
  }

  // Helper method for API calls
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // ============== AUTHENTICATION ==============

  async signUp(email: string, password: string, fullName: string, role: 'client' | 'coach' = 'client'): Promise<{ user: User | null; error: string | null }> {
    try {
      const result = await this.apiCall('/auth?action=signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role }),
      });

      if (result.token) {
        this.token = result.token;
        this.currentUser = result.user;
        localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      }

      return { user: result.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      // Fallback to mock implementation for development
      if (process.env.NODE_ENV === 'development') {
        return this.mockSignUp(email, password, fullName, role);
      }
      return { user: null, error: error.message };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const result = await this.apiCall('/auth?action=login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.token) {
        this.token = result.token;
        this.currentUser = result.user;
        localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      }

      return { user: result.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock implementation for development
      if (process.env.NODE_ENV === 'development') {
        return this.mockSignIn(email, password);
      }
      return { user: null, error: error.message };
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.apiCall('/auth?action=logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.currentUser = null;
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    if (!this.token) return null;

    try {
      const result = await this.apiCall('/auth?action=verify', {
        method: 'GET',
      });

      if (result.valid) {
        this.currentUser = result.user;
        return result.user;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    return null;
  }

  // ============== WORKOUTS ==============

  async getWorkouts(userId: string): Promise<Workout[]> {
    try {
      const result = await this.apiCall(`/workouts?userId=${userId}`, {
        method: 'GET',
      });
      return result.workouts || [];
    } catch (error) {
      console.error('Get workouts error:', error);
      return this.mockGetWorkouts(userId);
    }
  }

  async createWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    try {
      const result = await this.apiCall('/workouts', {
        method: 'POST',
        body: JSON.stringify(workout),
      });
      return result.workout;
    } catch (error) {
      console.error('Create workout error:', error);
      return this.mockCreateWorkout(workout);
    }
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    try {
      const result = await this.apiCall(`/workouts?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return result.workout;
    } catch (error) {
      console.error('Update workout error:', error);
      return this.mockUpdateWorkout(id, updates);
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    try {
      await this.apiCall(`/workouts?id=${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete workout error:', error);
    }
  }

  // ============== MESSAGES ==============

  async getMessages(userId: string): Promise<Message[]> {
    try {
      const result = await this.apiCall(`/messages?userId=${userId}`, {
        method: 'GET',
      });
      return result.messages || [];
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  async sendMessage(senderId: string, recipientId: string, content: string): Promise<Message> {
    try {
      const result = await this.apiCall('/messages', {
        method: 'POST',
        body: JSON.stringify({ senderId, recipientId, content }),
      });
      return result.message;
    } catch (error) {
      console.error('Send message error:', error);
      return this.mockSendMessage(senderId, recipientId, content);
    }
  }

  // ============== MOCK IMPLEMENTATIONS FOR DEVELOPMENT ==============

  private mockSignUp(email: string, password: string, fullName: string, role: 'client' | 'coach'): { user: User | null; error: string | null } {
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    users.push(user);
    localStorage.setItem('mockUsers', JSON.stringify(users));

    this.currentUser = user;
    this.token = 'mock_token_' + user.id;
    localStorage.setItem(AUTH_TOKEN_KEY, this.token);

    return { user, error: null };
  }

  private mockSignIn(email: string, password: string): { user: User | null; error: string | null } {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return { user: null, error: 'Invalid credentials' };
    }

    this.currentUser = user;
    this.token = 'mock_token_' + user.id;
    localStorage.setItem(AUTH_TOKEN_KEY, this.token);

    return { user, error: null };
  }

  private mockGetWorkouts(userId: string): Workout[] {
    const workouts = JSON.parse(localStorage.getItem('mockWorkouts') || '[]');
    return workouts.filter((w: Workout) => w.clientId === userId || w.coachId === userId);
  }

  private mockCreateWorkout(workout: Omit<Workout, 'id'>): Workout {
    const newWorkout: Workout = {
      ...workout,
      id: `workout_${Date.now()}`,
    };

    const workouts = JSON.parse(localStorage.getItem('mockWorkouts') || '[]');
    workouts.push(newWorkout);
    localStorage.setItem('mockWorkouts', JSON.stringify(workouts));

    return newWorkout;
  }

  private mockUpdateWorkout(id: string, updates: Partial<Workout>): Workout {
    const workouts = JSON.parse(localStorage.getItem('mockWorkouts') || '[]');
    const index = workouts.findIndex((w: Workout) => w.id === id);

    if (index !== -1) {
      workouts[index] = { ...workouts[index], ...updates };
      localStorage.setItem('mockWorkouts', JSON.stringify(workouts));
      return workouts[index];
    }

    throw new Error('Workout not found');
  }

  private mockSendMessage(senderId: string, recipientId: string, content: string): Message {
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      recipientId,
      content,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const messages = JSON.parse(localStorage.getItem('mockMessages') || '[]');
    messages.push(message);
    localStorage.setItem('mockMessages', JSON.stringify(messages));

    return message;
  }

  // ============== UTILITY METHODS ==============

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearAllData(): void {
    localStorage.removeItem('mockUsers');
    localStorage.removeItem('mockWorkouts');
    localStorage.removeItem('mockMessages');
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.token = null;
    this.currentUser = null;
  }
}

// Export singleton instance
export const vercelBackend = new VercelBackend();

// Export as default for easy replacement of Supabase imports
export default vercelBackend;