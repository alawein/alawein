/**
 * Hook to access experiment data
 */

import { useContext } from 'react';
import { ExperimentContext } from './ExperimentProvider';

export function useExperiment(experimentId: string) {
  const context = useContext(ExperimentContext);
  return context?.getExperiment(experimentId);
}
