import { useEffect } from 'react';
import { monitor } from '@/lib/monitoring';

export const usePerformance = (componentName: string) => {
  useEffect(() => {
    if (typeof performance === 'undefined') return;

    const startTime = performance.now();

    return () => {
      try {
        const duration = performance.now() - startTime;
        if (duration > 1000) {
          monitor.captureMetric('component.render.slow', duration, { component: componentName });
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    };
  }, [componentName]);
};
