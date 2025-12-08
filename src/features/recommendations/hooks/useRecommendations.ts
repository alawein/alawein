import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendationService';
import { RecommendationConfig, RecommendationResponse } from '../types';

interface UseRecommendationsOptions extends Omit<UseQueryOptions<RecommendationResponse>, 'queryKey' | 'queryFn'> {
  config: RecommendationConfig;
}

export const useRecommendations = ({ config, ...options }: UseRecommendationsOptions) => {
  return useQuery({
    queryKey: ['recommendations', config.source, config.contextProductId, config.contextCartItems, config.limit],
    queryFn: () => recommendationService.getRecommendations(config),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(config.source),
    ...options,
  });
};

export const useProductRecommendations = (productId: string, limit = 6) => {
  return useRecommendations({
    config: {
      source: 'similar_products' as const,
      limit,
      contextProductId: productId,
    },
  });
};

export const useFrequentlyBoughtTogether = (productId: string, limit = 4) => {
  return useRecommendations({
    config: {
      source: 'frequently_bought' as const,
      limit,
      contextProductId: productId,
    },
  });
};

export const useTrendingProducts = (limit = 8) => {
  return useRecommendations({
    config: {
      source: 'trending' as const,
      limit,
    },
  });
};

export const usePersonalizedRecommendations = (limit = 12) => {
  return useRecommendations({
    config: {
      source: 'personalized' as const,
      limit,
    },
  });
};
