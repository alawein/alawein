import { useCallback } from 'react';

export const useViewTransition = () => {
  const startTransition = useCallback((callback: () => void) => {
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(callback);
    } else {
      callback();
    }
  }, []);

  return { startTransition };
};
