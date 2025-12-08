export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  brand?: string;
  rating?: number;
  tags?: string[];
}

export interface ProductRecommendation {
  id: string;
  product: Product;
  score: number;
  reason: string;
  source: RecommendationSource;
  metadata?: Record<string, any>;
}

export enum RecommendationSource {
  SIMILAR_PRODUCTS = 'similar_products',
  FREQUENTLY_BOUGHT = 'frequently_bought',
  TRENDING = 'trending',
  PERSONALIZED = 'personalized'
}

export interface UserPreferences {
  userId?: string;
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  excludedProducts: string[];
  lastUpdated: Date;
}

export interface RecommendationConfig {
  source: RecommendationSource;
  limit: number;
  contextProductId?: string;
  contextCartItems?: string[];
  userPreferences?: UserPreferences;
  filters?: {
    category?: string;
    priceRange?: { min: number; max: number };
    brand?: string;
  };
}

export interface ViewHistoryItem {
  productId: string;
  timestamp: Date;
  duration?: number;
  category: string;
}

export interface RecommendationResponse {
  recommendations: ProductRecommendation[];
  totalCount: number;
  source: RecommendationSource;
  generatedAt: Date;
}
