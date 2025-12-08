import { QueryClient } from '@tanstack/react-query';
import { APP_CONFIG } from './constants';
import { logger } from './logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.cache.staleTime,
      gcTime: APP_CONFIG.cache.gcTime,
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: false,
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation error', error);
      },
    },
  },
});
