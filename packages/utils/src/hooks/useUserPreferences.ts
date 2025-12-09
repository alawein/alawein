/**
 * User Preferences Hook
 *
 * Provides a unified interface for storing and retrieving user preferences
 * with localStorage fallback and optional Supabase sync.
 */

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  [key: string]: unknown;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
  },
};

const STORAGE_KEY = 'user-preferences';

export interface UseUserPreferencesOptions {
  /** Optional Supabase sync function */
  syncToSupabase?: (prefs: UserPreferences) => Promise<void>;
  /** Optional function to load preferences from Supabase */
  loadFromSupabase?: () => Promise<UserPreferences | null>;
  /** User ID for multi-user support */
  userId?: string;
}

export interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  error: Error | null;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
}

/**
 * Hook for managing user preferences with localStorage persistence
 *
 * @example
 * ```tsx
 * const { preferences, updatePreference } = useUserPreferences();
 *
 * // Update theme
 * updatePreference('theme', 'dark');
 *
 * // Update multiple preferences
 * updatePreferences({ theme: 'light', language: 'es' });
 * ```
 */
export function useUserPreferences(options: UseUserPreferencesOptions = {}): UseUserPreferencesReturn {
  const { syncToSupabase, loadFromSupabase, userId } = options;
  const storageKey = userId ? `${STORAGE_KEY}-${userId}` : STORAGE_KEY;

  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to load from Supabase first if available
        if (loadFromSupabase) {
          const remotePrefs = await loadFromSupabase();
          if (remotePrefs) {
            setPreferences({ ...DEFAULT_PREFERENCES, ...remotePrefs });
            localStorage.setItem(storageKey, JSON.stringify(remotePrefs));
            setIsLoading(false);
            return;
          }
        }

        // Fall back to localStorage
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<UserPreferences>;
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load preferences'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [storageKey, loadFromSupabase]);

  const savePreferences = useCallback(
    async (newPrefs: UserPreferences) => {
      localStorage.setItem(storageKey, JSON.stringify(newPrefs));

      if (syncToSupabase) {
        try {
          await syncToSupabase(newPrefs);
        } catch (err) {
          console.warn('Failed to sync preferences to Supabase:', err);
        }
      }
    },
    [storageKey, syncToSupabase]
  );

  const updatePreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => {
        const updated = { ...prev, [key]: value };
        savePreferences(updated);
        return updated;
      });
    },
    [savePreferences]
  );

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...updates };
        savePreferences(updated);
        return updated;
      });
    },
    [savePreferences]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  }, [savePreferences]);

  const exportPreferences = useCallback(() => JSON.stringify(preferences, null, 2), [preferences]);

  const importPreferences = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json) as Partial<UserPreferences>;
        const updated = { ...DEFAULT_PREFERENCES, ...parsed };
        setPreferences(updated);
        savePreferences(updated);
        return true;
      } catch {
        return false;
      }
    },
    [savePreferences]
  );

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
}

