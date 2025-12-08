/**
 * Provider for A/B testing experiments
 */

import React, { createContext, useContext, ReactNode } from 'react';

export interface Experiment {
  id: string;
  variant: string;
}

interface ExperimentContextValue {
  experiments: Record<string, Experiment>;
  getExperiment: (id: string) => Experiment | undefined;
}

export const ExperimentContext = createContext<ExperimentContextValue | null>(null);

interface ExperimentProviderProps {
  children: ReactNode;
  experiments?: Record<string, Experiment>;
}

export function ExperimentProvider({ children, experiments = {} }: ExperimentProviderProps): React.ReactElement {
  const value: ExperimentContextValue = {
    experiments,
    getExperiment: (id: string) => experiments[id],
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperimentContext(): ExperimentContextValue | null {
  return useContext(ExperimentContext);
}
