import React from 'react';
import { 
  useTrendingProducts, 
  usePersonalizedRecommendations,
  TrendingProducts,
  PersonalizedPicks,
  analyticsService
} from '@/features/recommendations';

export const HomePage: React.FC = () => {
  const { data: trending, isLoading: loadingTrending } = useTrendingProducts(8);
  const { data: personalized, isLoading: loadingPersonalized } = usePersonalizedRecommendations(12);

  const handleProductClick = (productId: string) => {
    analyticsService.trackRecommendationClick('rec-id', productId, 'homepage');
    // Navigate to product page
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <TrendingProducts
        recommendations={trending?.recommendations || []}
        isLoading={loadingTrending}
        onProductClick={handleProductClick}
      />

      <PersonalizedPicks
        recommendations={personalized?.recommendations || []}
        isLoading={loadingPersonalized}
        onProductClick={handleProductClick}
      />
    </div>
  );
};
