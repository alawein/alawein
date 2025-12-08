// Types
export * from './types';

// Hooks
export { useRecommendations, useProductRecommendations, useFrequentlyBoughtTogether, useTrendingProducts, usePersonalizedRecommendations } from './hooks/useRecommendations';
export { useUserPreferences } from './hooks/useUserPreferences';
export { useViewHistory } from './hooks/useViewHistory';

// Components
export { RecommendationCarousel } from './components/RecommendationCarousel';
export { FrequentlyBoughtTogether } from './components/FrequentlyBoughtTogether';
export { PersonalizedPicks } from './components/PersonalizedPicks';
export { TrendingProducts } from './components/TrendingProducts';

// Services
export { recommendationService } from './services/recommendationService';
export { analyticsService } from './services/analyticsService';
