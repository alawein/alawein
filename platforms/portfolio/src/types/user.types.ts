export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
}

export interface UserPreferences {
  language: string;
  timezone: string;
}

