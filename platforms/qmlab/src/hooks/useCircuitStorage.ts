import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { trackQuantumEvents } from '@/lib/analytics';

export interface CircuitGate {
  id: string;
  name: string;
  qubit: number;
}

export interface SavedCircuit {
  id: string;
  name: string;
  description?: string;
  gates: CircuitGate[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'qmlab-saved-circuits';

export const useCircuitStorage = () => {
  const [savedCircuits, setSavedCircuits] = useState<SavedCircuit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved circuits on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedCircuits(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      logger.error('Failed to load saved circuits', { error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist to localStorage whenever circuits change
  const persistCircuits = useCallback((circuits: SavedCircuit[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(circuits));
    } catch (error) {
      logger.error('Failed to persist circuits', { error });
    }
  }, []);

  const saveCircuit = useCallback(
    (
      name: string,
      gates: CircuitGate[],
      difficultyLevel: SavedCircuit['difficultyLevel'],
      description?: string
    ): SavedCircuit => {
      const now = Date.now();
      const newCircuit: SavedCircuit = {
        id: `circuit-${now}`,
        name,
        description,
        gates: [...gates],
        difficultyLevel,
        createdAt: now,
        updatedAt: now,
      };

      const updated = [...savedCircuits, newCircuit];
      setSavedCircuits(updated);
      persistCircuits(updated);

      trackQuantumEvents.featureDiscovery('circuit_save', 'storage');
      logger.info('Circuit saved', { circuitId: newCircuit.id, gateCount: gates.length });

      return newCircuit;
    },
    [savedCircuits, persistCircuits]
  );

  const updateCircuit = useCallback(
    (id: string, updates: Partial<Pick<SavedCircuit, 'name' | 'description' | 'gates'>>): boolean => {
      const index = savedCircuits.findIndex((c) => c.id === id);
      if (index === -1) return false;

      const updated = [...savedCircuits];
      updated[index] = {
        ...updated[index],
        ...updates,
        updatedAt: Date.now(),
      };

      setSavedCircuits(updated);
      persistCircuits(updated);

      trackQuantumEvents.featureDiscovery('circuit_update', 'storage');
      return true;
    },
    [savedCircuits, persistCircuits]
  );

  const deleteCircuit = useCallback(
    (id: string): boolean => {
      const filtered = savedCircuits.filter((c) => c.id !== id);
      if (filtered.length === savedCircuits.length) return false;

      setSavedCircuits(filtered);
      persistCircuits(filtered);

      trackQuantumEvents.featureDiscovery('circuit_delete', 'storage');
      return true;
    },
    [savedCircuits, persistCircuits]
  );

  const loadCircuit = useCallback(
    (id: string): SavedCircuit | null => {
      const circuit = savedCircuits.find((c) => c.id === id);
      if (circuit) {
        trackQuantumEvents.featureDiscovery('circuit_load', 'storage');
      }
      return circuit || null;
    },
    [savedCircuits]
  );

  const exportCircuits = useCallback((): string => {
    return JSON.stringify(savedCircuits, null, 2);
  }, [savedCircuits]);

  const importCircuits = useCallback(
    (json: string): number => {
      try {
        const imported = JSON.parse(json);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        const validCircuits = imported.filter(
          (c: unknown): c is SavedCircuit =>
            typeof c === 'object' &&
            c !== null &&
            'id' in c &&
            'name' in c &&
            'gates' in c &&
            Array.isArray((c as SavedCircuit).gates)
        );

        const merged = [...savedCircuits, ...validCircuits];
        setSavedCircuits(merged);
        persistCircuits(merged);

        trackQuantumEvents.featureDiscovery('circuit_import', 'storage');
        return validCircuits.length;
      } catch (error) {
        logger.error('Failed to import circuits', { error });
        return 0;
      }
    },
    [savedCircuits, persistCircuits]
  );

  return {
    savedCircuits,
    isLoading,
    saveCircuit,
    updateCircuit,
    deleteCircuit,
    loadCircuit,
    exportCircuits,
    importCircuits,
  };
};

